import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt                        from 'bcryptjs';

// Authentication
module.exports = (passport, user) => {
    const 
        User = user;

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
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
                    req.session.errorTarget = 'username';
                    
                    return done(null, false, {
                        message: 'Username is already used'
                    });
                } else {
                    if(username.length < 6 || username.length > 45) {
                        req.session.errorTarget = 'username';
                    
                        return done(null, false, {
                            message: 'Username is too short or too long'
                        });
                    } else {
                        User.findOne({
                            where: {
                                Email_User: req.body.email
                            }
                        }).then((user) => {
                            user = user || false;
                            
                            if(user.Email_User == req.body.email) {
                                req.session.errorTarget = 'email';

                                return done(null, false, {
                                    message: 'Email is already used'
                                });
                            } else {
                                if(!/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(req.body.email)) {
                                    req.session.errorTarget = 'email';

                                    return done(null, false, {
                                        message: 'Email is not valid: is it an email?'
                                    });
                                } else {
                                    let genHash = (pw) => {
                                        return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
                                    }

                                    if(/([A-Z]{1})\w/.test(req.body.email)) {
                                        req.session.errorTarget = 'email';

                                        return done(null, false, {
                                            message: 'Email is not valid: there is at least one uppercase letter'
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
                                        .then((newUser, created) => {
                                            if(!newUser) {
                                                return done(null, false);
                                            }

                                            if(newUser) {
                                                return done(null, newUser);
                                            }
                                        })
                                        .catch((e) => {
                                            console.log(e, data)
                                        })
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }
    ));

    passport.use('local-signin', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        req.session.username = username;

        const
            isValidPassword = (password, pwGiven) => {
                return bcrypt.compareSync(password, pwGiven);
            }

        User.findOne({
            where: {
                Username_User: username
            }
        }).then((user) => {
            if(!user || user.Username_User !== username) {
                req.session.errorTarget = 'username';

                return done(null, false, {
                    message: 'This user is not used. Create your account or verify this field.'
                });
            }

            if(!isValidPassword(password, user.Password_User)) {
                req.session.errorTarget = 'password';

                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }

            const userInfo = user.get();
            return done(null, userInfo);
        }).catch((e) => {
            console.error(e);

            return done(null, false, {
                message: 'Something went wrong with your login...'
            });
        })
    }));
}