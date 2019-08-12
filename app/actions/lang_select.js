const langs = ["fr", "en"];

module.exports = {
    get: (req, res, json) => {
        // IF cookies.lang is valuable
        if(req.cookies.lang !== undefined) {
            // IF cookies.lang is not in langs Array
            if(langs.indexOf(req.cookies.lang) === -1) {
                // OK
                res.render("main", json);
            } else {
                // REDIRECT
                res.redirect("/");
            }
        // ELSE [URL]?lang=\lang\
        } else if(langs.indexOf(req.query.lang) !== -1) {
            let date = new Date(),
                monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                expiresDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear() + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT`;

            res.set("Set-Cookie", `lang=${req.query.lang}; Expires=${expiresDate}; Path=/;`);
            // REDIRECT
            res.redirect("/");
        } else {
            // REDIRECT
            res.render("main", json);
        }
    },
    post: (req, res) => {
        // IF no lang
		if(req.body.lang === "none") {
            req.flash("error", `Please select your language`);
            // REDIRECT
            res.redirect("/lang-select");
		} else {
            // IF lang"s valuable
			if(langs.indexOf(req.body.lang) !== -1) {
				let date = new Date(),
					monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					expiresDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear() + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT`;

                res.set("Set-Cookie", `lang=${req.body.lang}; Expires=${expiresDate}; Path=/;`);
                // REDIRECT
				res.redirect("/");
			} else {
                req.flash("error", `This value does not exist, please retry after`);
                // REDIRECT
				res.redirect("/lang-select");
			}
		}
	}
};
