import { Strategy as LocalStrategy } from "passport-local";
import config                        from "./../config/config.json";
import mysql                         from "mysql";
import bcrypt                        from "bcryptjs";

const nodeEnv = process.env.NODE_ENV;

/**
 * MYSQL Connection
 */

let CNX = mysql.createConnection({
    user    : config[nodeEnv].username,
    password: config[nodeEnv].password,
    database: config[nodeEnv].database,
    host    : config[nodeEnv].host
});

module.exports = {
    /**
     * TEST_DB_ACTIONS
     */

    testDB: () => {
        CNX.connect((e) => {
            if(e) throw e;
            console.log("\nYou are now connected on your database\n");
        });
    },

    /**
     * SIGNUP_ACTIONS
     */

    signup: (passport, user) => {
        const User = user;

        passport.use("local-signup", new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true
            },
            (req, username, password, done) => {
                req.session.email = req.body.email;
                req.session.username = username;
    
                User.findOne({
                    where: {
                        Username_User: username
                    }
                }).then((user) => {
                    user = user || false;
    
                    if(user.Username_User === username) {
                        req.session.errorTarget = "username";
                        
                        return done(null, false, {
                            message: "Username is already used"
                        });
                    } else {
                        if(username.length < 6 || username.length > 45) {
                            req.session.errorTarget = "username";
                        
                            return done(null, false, {
                                message: "Username is too short or too long"
                            });
                        } else {
                            User.findOne({
                                where: {
                                    Email_User: req.body.email
                                }
                            }).then((user) => {
                                user = user || false;
                                
                                if(user.Email_User == req.body.email) {
                                    req.session.errorTarget = "email";
    
                                    return done(null, false, {
                                        message: "Email is already used"
                                    });
                                } else {
                                    if(!/(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(req.body.email)) {
                                        req.session.errorTarget = "email";
    
                                        return done(null, false, {
                                            message: "Email is not valid: is it an email?"
                                        });
                                    } else {
                                        const genHash = (pw) => {
                                            return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
                                        };
    
                                        if(/([A-Z]{1})\w/.test(req.body.email)) {
                                            req.session.errorTarget = "email";
    
                                            return done(null, false, {
                                                message: "Email is not valid: there is at least one uppercase letter"
                                            });
                                        } else {
                                            const 
                                                passwordUser = genHash(password);
    
                                            const 
                                                data = {
                                                    Username_User: username,
                                                    Email_User: req.body.email,
                                                    Password_User: passwordUser
                                                };
    
                                            User.create(data)
                                            // eslint-disable-next-line no-unused-vars
                                            .then((newUser, created) => {
                                                if(!newUser) {
                                                    return done(null, false);
                                                }
    
                                                if(newUser) {
                                                    return done(null, newUser);
                                                }
                                            })
                                            .catch((e) => {
                                                console.log(e, data);
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        ));
    },

    /**
     * LOGIN_ACTIONS
     */

    login: (passport, user) => {
        const User = user;

        passport.use("local-signin", new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true
            },
            (req, username, password, done) => {
                req.session.username = username;
        
                const isValidPassword = (password, pwGiven) => {
                    return bcrypt.compareSync(password, pwGiven);
                };
        
                User.findOne({
                    where: {
                        Username_User: username
                    }
                }).then((user) => {
                    if(!user || user.Username_User !== username) {
                        req.session.errorTarget = "username";
        
                        return done(null, false, {
                            message: "This user is not used. Create your account or verify this field."
                        });
                    }
        
                    if(!isValidPassword(password, user.Password_User)) {
                        req.session.errorTarget = "password";
        
                        return done(null, false, {
                            message: "Incorrect password."
                        });
                    }
        
                    const userInfo = user.get();
                    return done(null, userInfo);
                }).catch((e) => {
                    console.error(e);
        
                    return done(null, false, {
                        message: "Something went wrong with your login..."
                    });
                });
            }));
    },

    /**
     * LOGOUT_ACTIONS
     */

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    },

    /**
     * GET_USERS_ACTIONS
     */

    getUser: (req, res) => {
        if(req.user !== undefined) {
            // Search in the database
            CNX.query("SELECT * FROM users WHERE Id_User = ?", [req.user.Id_User], (e, r) => {
                if(e) throw e;
                return res.send(r[0]);
            });
        } else {
            // Not connected
            return res.send(false);
        }
    },

    /**
     * VERIFY_USER_ACTIONS
     */

    verifyUser: (req, res) => {
        // Hashing is it the same password?
        const isValidPassword = (password, pwGiven) => {
            return bcrypt.compareSync(password, pwGiven);
        };
        const body = req.body;

        // Get type of callType from parameters API Calling
        if(body.callType === "login") {
            // Get if this account is in the database
            CNX.query("SELECT * FROM users WHERE Username_User = ?", [body.username], (e, r) => {
                if(e) throw e;

                // NO account is detected, so...
                if(r.length === 0) {
                    res.send({
                        errorTarget: "username",
                        error: "Inexistent username"
                    });
                } else {
                    // Are DB Password and Password given matching?
                    if(!isValidPassword(body.password, r[0].Password_User)) {
                        return res.send({
                            errorTarget: "password",
                            error: "Incorrect password"
                        });
                    } else {
                        return res.send("OK");
                    }
                }
            });
        } else if(body.callType === "signup") {
            CNX.query("SELECT * FROM users WHERE Username_User = ?", [body.username], (e, r) => {
                if(e) throw e;

                // Username is detected, so...
                if(r.length === 1) {
                    res.send({
                        errorTarget: "username",
                        error: "Username is already used"
                    });
                } else {
                    // Username conditions: min & max length
                    if(body.username.length < 6 || body.username.length > 45) {
                        res.send({
                            errorTarget: "username",
                            error: "Username is too short or too long"
                        });
                    } else {
                        CNX.query("SELECT * FROM users WHERE Email_User = ?", [body.email], (e, r) => {
                            if(e) throw e;

                            // Email is detected, so...
                            if(r.length === 1) {
                                res.send({
                                    errorTarget: "email",
                                    error: "Email is already used"
                                });
                            } else {
                                // Email conditions: valid email
                                if(!/(?!.*\.{2})^([a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&"*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(body.email)) {
                                    res.send({
                                        errorTarget: "email",
                                        error: "Email is not valid: is it an email?"
                                    });
                                } else {
                                    // Email conditions: valid lowercases
                                    if(/([A-Z]{1})\w/.test(body.email)) {
                                        res.send({
                                            errorTarget: "email",
                                            error: "Email is not valid: there is at least one uppercase letter"
                                        });
                                    } else {
                                        res.send("OK");
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    }
};
