import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';

const 
	app = express();

let 
	mainJS,
	mainCSS,
	appJS,
	nodeEnv = process.env.NODE_ENV;

fs.readFile('public/dist/manifest.json', 'utf-8', (err, data) => {
	if(err || nodeEnv === 'development') {
		mainJS = '/assets/dist/main-js.js';
		mainCSS = '/assets/styles/main-css.css';
		appJS = '/assets/dist/app.js';
	} else {
		mainJS = JSON.parse(data)['main-js.js'];
		mainCSS = JSON.parse(data)['main-css.css'];
		appJS = JSON.parse(data)['app.js'];
	}
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const langs = ['fr', 'en'];

module.exports = {
	get: (req, res) => {
		if(req.cookies.lang !== undefined && langs.indexOf(req.cookies.lang) !== -1) {
			fs.readFile(`public/config/config-${req.cookies.lang}.json`, 'utf-8', (err, data) => {
				if(err) throw new Error('This file does not exist');
				
				res.render('main', {
					title: JSON.parse(data)['title']['index'],
					description: JSON.parse(data)['description']['index'],
					lang: req.cookies.lang,
					url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
					env: nodeEnv,
					script: `window.CONF = {
						path: {
							app: '${appJS}'
						}
					}`,
					mainJS: mainJS,
					mainCSS: mainCSS
				});
			});
		} else {
			res.clearCookie('lang');
			res.redirect('/lang-select');
		}
	},
	post: (req, res) => {
		if(req.body.lang === 'none') {
			req.flash('error', `Please select your language`);
			res.redirect('/');
		} else {
			if(langs.indexOf(req.body.lang) !== -1) {
				let date = new Date(),
					monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					expiresDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear() + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT`;

				res.set('Set-Cookie', `lang=${req.body.lang}; Expires=${expiresDate}; Path=/;`);
				res.redirect('/');
			} else {
				req.flash('error', `This value does not exist, please retry after`);
				res.redirect('/');
			}
		}
	}
}