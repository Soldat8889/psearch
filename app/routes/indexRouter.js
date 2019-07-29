import fs from 'fs';
import langSelect from './../actions/lang_select';

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

			console.log(data)

			res.render('main', {
				title: JSON.parse(data)['title']['index'],
				description: JSON.parse(data)['description']['index'],
				lang: req.cookies.lang,
				url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
				env: nodeEnv,
				mainCSS: _Template.mainCSS,
				mainJS: _Template.mainJS,
				appJS: _Template.appJS,
				params: {}
			});
		});
	},
	post: langSelect.post
}