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
			res.render('main', {
				title: 'pSearch: 404 Error',
				description: `404 Error ! Please, try after.`,
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
		} else {
			res.clearCookie('lang');
			res.redirect('/lang-select');
		}
	}
}