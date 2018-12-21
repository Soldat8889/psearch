import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';

const 
	app = express(),
	authRouter = require('./routes/router').router;

let 
	nodeEnv = process.env.NODE_ENV;

// process.env.ALWAYSDATA_HTTPD_PORT = 8000;
// process.env.ALWAYSDATA_HTTPD_IP = 'localhost';

// Define Node Environment
if(nodeEnv === 'development') {
	process.env.PORT = 8000;
	process.env.HOST = 'localhost';
} else if(nodeEnv === 'production') {
	process.env.PORT = process.env.ALWAYSDATA_HTTPD_PORT;
	process.env.HOST = process.env.ALWAYSDATA_HTTPD_IP;
}

// View Engine => EJS
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

// Middlewares
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	secret: 'secretSession',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

app.use(require('./middlewares/expires'));
app.use(require('./middlewares/flash'));

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

// Use STATIC files
app.use('/assets', express.static('public'));

// Routes
app.get('/', require('./routes/index.js').get);
app.post('/', require('./routes/index.js').post);
app.use(authRouter);
app.get('/authentication', require('./routes/authentication').get);
app.post('/authentication', require('./routes/authentication').post);
app.get('/lang-select', require('./routes/lang_select').get);
app.post('/lang-select', require('./routes/lang_select').post);
app.get('*', require('./routes/error_404').get);

// Listener
app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`App has been started on PORT: ${process.env.PORT}`);
});