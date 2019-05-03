import express       from 'express';
import session       from 'express-session';
import bodyParser    from 'body-parser';
import cookieParser  from 'cookie-parser';
import cors          from 'cors';
import errorHandler  from 'errorhandler';
import morgan        from 'morgan';
import ejs           from 'ejs';

// AUTH
import passport      from 'passport';
// Models
import models        from './models';

// Custom Middlewares
import flash       from './middlewares/flash';
import gzipHeaders from './middlewares/gzip_headers';

// Routes
import apiRouter from './routes/apiRouter';
// API
import authAPI    from './routes/api/authAPI';

// Initiate app
let 
	app = express(),
	nodeEnv = process.env.NODE_ENV;

// Define the HOST & PORT
process.env.PORT = process.env.ALWAYSDATA_HTTPD_PORT | 8000;
process.env.HOST = process.env.ALWAYSDATA_HTTPD_IP | 'localhost' || '127.0.0.1';

// Configure app
// View Engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(cors());
// Log requests	
if(nodeEnv == 'development') { app.use(morgan('dev')); }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
	cookieName: 'session',
	secret: 'veryVeryVerySecretSession',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
}));
app.use(cookieParser());

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport/passport.js')(passport, models.user);

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// Sync db
models.sequelize.sync().then(function() {
    console.log('\nSequelize SYNC: OK!');
}).catch((e) => {
    console.log('\nSequelize SYNC: ', e);
});

// CATCH ERROR => Console
if(nodeEnv !== 'production') { app.use(errorHandler()); }

// Cust. Middlewares
app.use(flash);
app.use(gzipHeaders);
app.use((req, res, next) => {
	if(req.method == 'POST' && req.url == '/login' ) {
		if(req.body.remember_me) {
			req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 30 DAYS
		} else {
			req.session.cookie.expires = false;
		}
	}
	next();
});

// Use STATIC files
app.use('/assets', express.static('public'));

// API
app.use(authAPI);
// Mount the routes
app.use(apiRouter);

// Mount server
app.listen(process.env.PORT, process.env.HOST, () => {
	console.log(`App has been started on PORT: ${process.env.PORT}`);
});