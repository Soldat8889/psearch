import express  from 'express';
import passport from 'passport';
import passportConf from './../../config/passport/passport';

// Router
let 
    apiRouter = express.Router();

apiRouter.get('/api/auth/isAuth', (req, res) => {
    return res.status(200).send(req.isAuthenticated());
});

apiRouter.get('/api/auth/dashboard', (req, res) => {
    return res.send(req.user);
});

module.exports = apiRouter;