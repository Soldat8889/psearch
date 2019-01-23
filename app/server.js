import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from 'errorhandler';
import ejs from 'ejs';

// Custom Middlewares
import flash from './middlewares/flash';
import gzipHeaders from './middlewares/gzip_headers';
import routes from './routes/routes';

// Initiate app
let 
	app = express(),
	nodeEnv = process.env.NODE_ENV;

// Define the HOST & PORT
if(nodeEnv === 'development') {
	process.env.PORT = 8000;
	process.env.HOST = 'localhost';
} else if(nodeEnv === 'production') {
	// When the server is in Alwaysdata
	// process.env.PORT = process.env.ALWAYSDATA_HTTPD_PORT;
	// process.env.HOST = process.env.ALWAYSDATA_HTTPD_IP;
	
	process.env.PORT = 1337;
	process.env.HOST = 'localhost';
}

// Configure app
// View Engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	secret: 'secretSession',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(cookieParser());

app.use(flash);
app.use(gzipHeaders);
// Use STATIC files
app.use('/assets', express.static('public'));
// Mount the routes
app.use(routes);

if(nodeEnv !== 'production') {
	app.use(errorHandler());
}

// Mount server
app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`App has been started on PORT: ${process.env.PORT}`);
});
