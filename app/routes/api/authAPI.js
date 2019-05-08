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
    } else if(body.callType === 'signup') {
        CNX.query('SELECT * FROM users WHERE Username_User = ?', [body.username], (e, r) => {
            if(e) throw e;

            // Username is detected, so...
            if(r.length === 1) {
                res.send({
                    errorTarget: 'username',
                    error: 'Username is already used'
                });
            } else {
                // Username conditions: min & max length
                if(body.username.length < 6 || body.username.length > 45) {
                    res.send({
                        errorTarget: 'username',
                        error: 'Username is too short or too long'
                    });
                } else {
                    CNX.query('SELECT * FROM users WHERE Email_User = ?', [body.email], (e, r) => {
                        if(e) throw e;
    
                        // Email is detected, so...
                        if(r.length === 1) {
                            res.send({
                                errorTarget: 'email',
                                error: 'Email is already used'
                            });
                        } else {
                            // Email conditions: valid email
                            if(!/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(body.email)) {
                                res.send({
                                    errorTarget: 'email',
                                    error: 'Email is not valid: is it an email?'
                                });
                            } else {
                                // Email conditions: valid lowercases
                                if(/([A-Z]{1})\w/.test(body.email)) {
                                    res.send({
                                        errorTarget: 'email',
                                        error: 'Email is not valid: there is at least one uppercase letter'
                                    });
                                } else {
                                    res.send('OK');
                                }
                            }
                        }
                    });
                }
            }
        });
    }
    
});

module.exports = apiRouter;