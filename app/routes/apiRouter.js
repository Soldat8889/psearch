import express from 'express';
import fs      from 'fs';

// Import routes
import index      from './indexRouter';
import signup     from './signupRouter';
import login      from './loginRouter';
import dashboard  from './dashboardRouter';
import langSelect from './langSelectingRouter';
import testAPI    from './testAPI';

// Router
let 
    apiRouter = express.Router(),
    Template = {
        mainCSS: '',
        mainJS : '',
        appJS  : ''
    }

apiRouter.get('/*', (req, res, next) => {
    // Get Path of files
    fs.readFile('public/dist/manifest.json', 'utf-8', (e, data) => {
        if(e) {
            process.env.NODE_ENV == 'development' ? console.warn('DEVELOPMENT =>' + e) : false;
        }

        if(e || process.env.NODE_ENV !== 'development') {
            Template.mainCSS = JSON.parse(data)['main-css.css'];
            Template.mainJS  = JSON.parse(data)['main-js.js'];
            Template.appJS   = JSON.parse(data)['app.js'];
        } else {
            Template.mainCSS = '/assets/styles/main-css.css';
            Template.mainJS  = '/assets/dist/main-js.js';
            Template.appJS   = '/assets/dist/app.js';
        }
    });
    
    next();
});

// Homepage
apiRouter.get('/', (req, res) => {
    index.get(req, res, Template);
});
apiRouter.post('/', index.post);

// SignUp
apiRouter.get('/signup', (req, res) => {
    signup.get(req, res, Template);
});
apiRouter.post('/signup', signup.authenticate);

// LogIn
apiRouter.get('/login', (req, res) => {
    login.get(req, res, Template);
});
apiRouter.post('/login', login.authenticate);

// DashBoard
apiRouter.get('/dashboard', (req, res) => {
    dashboard.get(req, res, Template);
});

// LogOut
apiRouter.get('/logout', (req, res) => {
    req.session.destroy((e) => {
        res.redirect('/');
    });
});

// BRAVE REWARDS
apiRouter.get('/.well-known/brave-rewards-verification.txt', (req, res) => {
    fs.readFile(`public/.well-known/brave-rewards-verification.txt`, 'utf-8', (e, data) => {
        if(e) throw e;
        res.send(data);
    });
});

// LangSelecting
apiRouter.get('/lang-select', (req, res) => {
    langSelect.get(req, res, Template);
});
apiRouter.post('/lang-select', langSelect.post);

/* DEVELOPMENT /|/ TESTING */
apiRouter.get('/api/testAPI', testAPI.get);

// /|!|\ CATCH ERROR ROUTING
apiRouter.all('*', (req, res) => {
    res.status(404).send({
        msg: 'Not found'
    });
});

module.exports = apiRouter;