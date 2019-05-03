import fs from 'fs';

// Passport
import passport from 'passport';

// Init variables
let nodeEnv = process.env.NODE_ENV;

module.exports = {
	get: (req, res, _Template) => {
		fs.readFile(`public/config/config-${req.cookies.lang}.json`, 'utf-8', (e, data) => {
			if(e) {
				// REDIRECT
				res.redirect('/lang-select');
				return;
			}
	
			if(req.isAuthenticated()) {
				// REDIRECT
				res.redirect('/dashboard');
				return;
			}
			
			res.render('main', {
				title: JSON.parse(data)['title']['signup'],
				description: JSON.parse(data)['description']['signup'],
				lang: req.cookies.lang,
				url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
				env: nodeEnv,
				mainCSS: _Template.mainCSS,
				mainJS: _Template.mainJS,
				appJS: _Template.appJS,
				params: {
					email: req.session.email,
					username: req.session.username,
					errorTarget: req.session.errorTarget
				}
			});
		});
	},
	authenticate: passport.authenticate('local-signup', { successRedirect: '/dashboard', failureRedirect: '/signup', failureFlash: true })
}