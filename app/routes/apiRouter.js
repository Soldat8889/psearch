import express from "express";
import fs      from "fs";

// Import routes
import index      from "./indexRouter";
import signup     from "./signupRouter";
import login      from "./loginRouter";
import dashboard  from "./dashboardRouter";
import langSelect from "./langSelectingRouter";
import testAPI    from "./api/testAPI";

// Import Actions
import Auth from "./../actions/auth";

// Router
let Template = {
    mainCSS: "",
    mainJS : "",
    appJS  : ""
};

const apiRouter = express.Router();
const nodeEnv = process.env.NODE_ENV;

apiRouter.get("/*", (req, res, next) => {
    // Get Path of files
    fs.readFile("public/dist/manifest.json", "utf-8", (e, data) => {
        if(e) {
            process.env.NODE_ENV == "development" ? console.warn("DEVELOPMENT =>" + e) : false;
        }

        if(e || process.env.NODE_ENV !== "development") {
            Template.mainCSS = JSON.parse(data)["main-css.css"];
            Template.mainJS  = JSON.parse(data)["main-js.js"];
            Template.appJS   = JSON.parse(data)["app.js"];
        } else {
            Template.mainCSS = "/assets/dist/main-css.css";
            Template.mainJS  = "http://127.0.0.1:8080/assets/dist/main-js.js";
            Template.appJS   = "/assets/dist/app.js";
        }
    });
    
    next();
});

// Homepage
apiRouter.get("/", (req, res) => {
    index.get(req, res, Template);
});
apiRouter.post("/", index.post);

// SignUp
apiRouter.get("/signup", (req, res) => {
    signup.get(req, res, Template);
});
apiRouter.post("/signup", signup.authenticate);

// LogIn
apiRouter.get("/login", (req, res) => {
    login.get(req, res, Template);
});
apiRouter.post("/login", login.authenticate);

// Dashboard
apiRouter.get("/dashboard/:componentInterface?/:tab?", (req, res) => {
    dashboard.get(req, res, Template);
});

// Logout
apiRouter.get("/logout", (req, res) => {
    Auth.logout(req, res);
});

// BRAVE REWARDS
apiRouter.get("/.well-known/brave-rewards-verification.txt", (req, res) => {
    fs.readFile(`public/.well-known/brave-rewards-verification.txt`, "utf-8", (e, data) => {
        if(e) throw e;
        res.send(data);
    });
});

// LangSelecting
apiRouter.get("/lang-select", (req, res) => {
    langSelect.get(req, res, Template);
});
apiRouter.post("/lang-select", langSelect.post);

/* DEVELOPMENT /|/ TESTING */
apiRouter.get("/api/testAPI", testAPI.get);

// /|!|\ CATCH ERROR ROUTING
apiRouter.all("*", (req, res) => {
    fs.readFile(`./public/config/config-${req.cookies.lang}.json`, "utf-8", (e, data) => {
        if(e) {
            // REDIRECT
            res.redirect("/lang-select");
            return;
        }

        res.render("main", {
            title: JSON.parse(data)["title"]["errors"]["404"],
            description: JSON.parse(data)["description"]["errors"]["404"],
            lang: req.cookies.lang,
            url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
            env: nodeEnv,
            mainCSS: Template.mainCSS,
            mainJS: Template.mainJS,
            appJS: Template.appJS,
            params: {}
        });
    });
});

module.exports = apiRouter;