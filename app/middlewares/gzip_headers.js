import express from "express";
import expires from "./expires";

const app = module.exports = express();

const nodeEnv = process.env.NODE_ENV;
let devCaching, prodCaching;

if(nodeEnv === "development") {
    devCaching = false;
    prodCaching = true;
} else {
    devCaching = true;
    prodCaching = true;
}

app.use(expires);
 
// Setting Headers

// STATIC ASSETS 1 MONTH
// CSS
app.get("*.css", (req, res, next) => {
    req.expires(true, "text/css", `${3600 * 24 * 30}`, devCaching);
    next();
});
// JavaScript
app.get("*.js", (req, res, next) => {
    req.expires(true, "application/javascript", `${3600 * 24 * 30}`, devCaching);
    next();
});
// JSON
app.get("*.json", (req, res, next) => {
    req.expires(true, "application/json", `${3600 * 24 * 30}`, devCaching);
    next();
});
// Medias
app.get("*.(jpg|jpeg|gif|png|ico|svg|mp4|mpeg|webp)", (req, res, next) => {
    req.expires(false, "", `${3600 * 24 * 30}`, prodCaching);
    next();
});

// RSS feeds (if i wanna use), roadmaps, robots 1 DAY
app.get("*.(xml|txt)", (req, res, next) => {
    req.expires(false, "", `${3600 * 24}, must-revalidate`, devCaching);
    next();
});

// DYNAMIC files (HTML) 4 HOURS
app.get("*.html", (req, res, next) => {
    req.expires(false, "text/html", `${3600 * 4}, must-revalidate`);
    next();
});