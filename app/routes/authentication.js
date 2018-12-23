// Import
import express from 'express';
import fs from 'fs';
import langRedirect from './actions/lang_redirect';

// Init
// Init variables
let app = express();
let mainJS, mainCSS, appJS, 
	nodeEnv = process.env.NODE_ENV;

// Switch dev <-> prod mode
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

module.exports = {
	get: (req, res) => {
		fs.readFile(`public/config/config-${req.cookies.lang}.json`, 'utf-8', (err, data) => {
			if(err) {
				// REDIRECT
				res.redirect('/lang-select');
				return;
			}
			
			langRedirect(req, res, {
				title: JSON.parse(data)['title']['authentication'],
				description: JSON.parse(data)['description']['authentication'],
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
	},
	post: (req, res) => {
		return;
	}
}