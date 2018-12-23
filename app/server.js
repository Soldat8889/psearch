import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import flash from './middlewares/flash';
import gzipHeaders from './middlewares/gzip_headers';
import routes from './routes/routes';

let 
	app = express(),
	nodeEnv = process.env.NODE_ENV;

// Define Node Environment
if(nodeEnv === 'development') {
	process.env.PORT = 8000;
	process.env.HOST = 'localhost';
} else if(nodeEnv === 'production') {
	process.env.PORT = process.env.ALWAYSDATA_HTTPD_PORT;
	process.env.HOST = process.env.ALWAYSDATA_HTTPD_IP;
}

// View Engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

// Enable cookieParser
app.use(cookieParser());

// Enable bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable expressSession
app.use(session({
	secret: 'secretSession',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));

// Enable flash message
app.use(flash);

// Set gzip headers
app.use(gzipHeaders);

// Use STATIC files
app.use('/assets', express.static('public'));

// Mount the routes
app.use(routes);

// Mount server
app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`App has been started on PORT: ${process.env.PORT}`);
});