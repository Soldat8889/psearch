import express       from 'express';
import favicon       from 'serve-favicon';
import session       from 'express-session';
import cors          from 'cors';
import errorHandler  from 'errorhandler';
import morgan        from 'morgan';
import bodyParser    from 'body-parser';
import cookieParser  from 'cookie-parser';
import ejs           from 'ejs';
import socketIo      from 'socket.io';

// AUTH
import passport      from 'passport';
// Models
import models        from './models';

// Custom Middlewares
import flash       from './middlewares/flash';
import gzipHeaders from './middlewares/gzip_headers';
import chat        from './middlewares/chat';

// Routes
import apiRouter from './routes/apiRouter';
// API
import authAPI    from './routes/api/authAPI';

// Initiate app
let 
	app = express(),
	nodeEnv = process.env.NODE_ENV;

// Define the HOST & PORT
process.env.PORT = 8000;
process.env.HOST = 'localhost';

if(nodeEnv === 'production') {
	process.env.PORT = process.env.ALWAYSDATA_HTTPD_PORT;
	process.env.HOST = process.env.ALWAYSDATA_HTTPD_IP;
}

// Configure app
// View Engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');

app.use(cors());
// Log requests	
if(nodeEnv == 'development') { app.use(morgan('dev')); }
// CATCH ERROR => Console
if(nodeEnv == 'development') { app.use(errorHandler()); }

// Serve favicon
app.use(favicon(`${__dirname}/../public/images/favicon.png`));

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
app.use(chat);

// Use STATIC files
app.use('/assets', express.static('public'));

// API
app.use(authAPI);
// Mount the routes
app.use(apiRouter);

// Socket io
let 
	server = app.listen('8000'),
	io = socketIo.listen(server, {'transports': ['websocket', 'polling'], 'origins': '*:*' });

io.on('connection', (socket) => {
	// Get status (test)
	socket.emit('status', true);

	// Channel01
	let dt = new Date;
		
	socket.emit('channel01', {
		'username': '[Server Channel01]',
		'message': 'You are connected!'
	});
	socket.broadcast.emit('channel01', {
		'username': '[Server Channel01]',
		'message': 'A user has been connected!'
	});

	socket.on('channel01', (data) => {
		// Log messages from channel01
		dt = new Date;
		console.log(`[Channel01] ${dt.getFullYear()} ${dt.getMonth()}/${dt.getDay()} ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()} => ${JSON.stringify(data)}`)
	});
});

// Mount server
if(nodeEnv === 'development') {
	app.listen(process.env.PORT, process.env.HOST, () => {
		console.log(`App has been started on PORT: ${process.env.PORT}`);
	});
} else {
	app.listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, () => {
		console.log('App has been started')
	});
}