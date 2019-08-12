import langSelect from "./../actions/lang_select";

// Init variables
let nodeEnv = process.env.NODE_ENV;

module.exports = {
	get: (req, res, _Template) => {
		langSelect.get(req, res, {
			title: "pSearch: Select your language",
			description: "Select the default language beetween the french and the english.",
			lang: "en",
			url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
			env: nodeEnv,
			mainCSS: _Template.mainCSS,
			mainJS: _Template.mainJS,
			appJS: _Template.appJS,
			params: {}
		});
	},
	post: langSelect.post
};
