import express from 'express';
import expires from './expires';
const app = module.exports = express();

app.use(expires);

// Setting Headers
// CSS
app.get('*.css', (req, res, next) => {
    req.expires(true, 'text/css', `${new Date(Date.now() + 3600 * 24 * 7 * 1000).toUTCString()}`);
    next();
});
// JavaScript
app.get('*.js', (req, res, next) => {
    req.expires(true, 'application/javascript', `${new Date(Date.now() + 3600 * 24 * 7 * 1000).toUTCString()}`);
    next();
});
// Medias
app.get('*.(jpg|jpeg|gif|png|ico|svg|mp4|mpeg)', (req, res, next) => {
    req.expires(false, '', `${new Date(Date.now() + 3600 * 24 * 7 * 1000).toUTCString()}`);
    next();
});