import fs       from 'fs';
import passport from 'passport';

// Init variables
let nodeEnv = process.env.NODE_ENV;

module.exports = {
	get: (req, res, _Template) => {
		fs.readFile(`./public/config/config-${req.cookies.lang}.json`, 'utf-8', (e, data) => {
			if(e && e.code !== 'ENOENT') {
				// REDIRECT
				res.redirect('/lang-select');
				return;
			}

			if(e) return console.log(e);
	
			if(req.isAuthenticated()) {
				// REDIRECT
				res.redirect('/dashboard');
				return;
			}

			res.render('main', {
				title: JSON.parse(data)['title']['login'],
				description: JSON.parse(data)['description']['login'],
				lang: req.cookies.lang,
				url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
				env: nodeEnv,
				mainCSS: _Template.mainCSS,
				mainJS: _Template.mainJS,
				appJS: _Template.appJS,
				params: {
					username: req.session.username,
					errorTarget: req.session.errorTarget
				}
			});
		});
	},
	authenticate: passport.authenticate('local-signin', { successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true })
}