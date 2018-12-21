// Imports
import express from 'express';
import usersCtrl from './controlers/usersCtrl';

// Router
exports.router = (() => {
    let router = express.Router();

    // Users routes
    router.route('/authentication/#/signup').post(usersCtrl.signup);
    router.route('/authentication/#/login').post(usersCtrl.login);

    return router;
})();