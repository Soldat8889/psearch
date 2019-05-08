import express  from 'express';
import mysql    from 'mysql';
import config   from './../../config/config.json';
import bcrypt   from 'bcryptjs';

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
    // Get the user cookie
    if(req.user !== undefined) {
        // Get data from cookie
        CNX.query('SELECT * FROM users WHERE Id_User = ?', [req.user.Id_User], (e, r) => {
            if(e) throw e;
            return res.send(r);
        });
    } else {
        // Seems not connected
        return res.send(false);
    }
});

apiRouter.post('/api/auth/user', (req, res) => {
    // Hashing (db) is it the same password?
    const 
        isValidPassword = (password, pwGiven) => {
            return bcrypt.compareSync(password, pwGiven);
        }

    const
        body = req.body;
    
    // Get type of callType from parameters API Calling
    if(body.callType === 'login') {
        // Get if this account is in the database
        CNX.query('SELECT * FROM users WHERE Username_User = ?', [body.username], (e, r) => {
            if(e) throw e;

            // NO account is detected, so...
            if(r.length === 0) {
                res.send({
                    errorTarget: 'username',
                    error: 'Inexistent username'
                });
            } else {
                // Are DB Password and Password given matching?
                if(!isValidPassword(body.password, r[0].Password_User)) {
                    return res.send({
                        errorTarget: 'password',
                        error: 'Incorrect password'
                    });
                } else {
                    return res.send('OK');
                }
            }
        });
    }
    
});

module.exports = apiRouter;