// Whitelisted langs
const langs = ["fr", "en"];

module.exports = (req, res, json) => {
	// IF lang exist OR is not valuable
	if(req.cookies.lang !== undefined && langs.indexOf(req.cookies.lang) !== -1) {
		// OK !
		res.render("main", json);
	} else {
		res.clearCookie("lang");
		// REDIRECT
		res.redirect("/lang-select");
	}
};
