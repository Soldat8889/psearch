// Import
import express from 'express';
import fs from 'fs';
import langRedirect from './actions/lang_redirect';
// Import spe this
import bcryptjs from 'bcryptjs';
import jwt      from 'jsonwebtoken';
import models   from './../models';

// Init variables
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
	signup: (req, res) => {
		// Params
		let email    = req.body.email,
			username = req.body.username,
			password = req.body.password,
			bio      = req.body.bio;

		if(email == null || username == null || password == null) {
			req.flash('error', 'Missing params');
			return;
		}

		// VERIFY email
		models.User.findOne({
			attributes: ['email'],
			where: { email: email }
		})
		.then((userFound) => {
		if(userFound) {
			req.flash('error', 'This email address already exist');
			return;
		} else {
			// VERIFY username
			models.User.findOne({
				attributes: ['username'],
				where: { username: username }
			})
			.then((userFound) => {
				if(userFound) {
					req.flash('error', 'This username already exist');
					return;
				} else {
					bcryptjs.hash(password, 5, (err, newPassword) => {
						let newUser = models.User.create({
							email: email,
							username: username,
							password: newPassword,
							bio: bio,
							isAdmin: 0
						})
						.then((newUser) => {
							return res.status(201).json({
								'userId': newUser.id,
								'user': newUser
							});
						})
						.catch((err) => {
							req.flash('error', 'Cannot add user');
						})
					})
				}
			})
			.catch((err) => {
				req.flash('error', 'Error detected: ' + err);
			});
		}
		})
		.catch((err) => {
			req.flash('error', 'Error detected: ' + err);
		});
	}
}