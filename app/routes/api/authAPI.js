import express  from 'express';
import mysql    from 'mysql';
import config   from './../../config/config.json';

// Router
let 
    apiRouter = express.Router(),
    nodeEnv   = process.env.NODE_ENV;

// Mysql
const CNX = mysql.createConnection({
    user    : config[nodeEnv].username,
    password: config[nodeEnv].password,
    database: config[nodeEnv].database,
    host    : config[nodeEnv].host
});

CNX.connect((e) => {
    if(e) throw e;
    console.log('\nYou are now connected on your database\n');
});

apiRouter.get('/api/auth/user', (req, res) => {
    if(req.user !== undefined) {
        CNX.query('SELECT * FROM users WHERE Id_User = ?', [req.user.Id_User], (e, r) => {
            if(e) throw e;
            return res.send(r);
        });   
    } else {
        return res.send(false);
    }
});

module.exports = apiRouter;