import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt                        from 'bcrypt';

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

            let genHash = (pw) => {
                return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
            }

            User.findOne({
                where: {
                    Username_User: username
                }
            }).then((isMatch) => {
                if(isMatch) {
                    req.session.errorTarget = 'username';
                    
                    return done(null, false, {
                        message: 'That username is already taken.'
                    });
                } else {
                    User.findOne({
                        where: {
                            Email_User: req.body.email
                        }
                    }).then((isMatch) => {
                        if(isMatch) {
                            req.session.errorTarget = 'email';

                            return done(null, false, {
                                message: 'That email is already taken.'
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

                            User.create(data).then((newUser, created) => {
                                if(!newUser) {
                                    return done(null, false);
                                }

                                if(newUser) {
                                    return done(null, newUser);
                                }
                            })
                        }
                    });
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
            isValidPassword = (pwGiven, password) => {
                return bcrypt.compareSync(password, pwGiven);
            }

        User.findOne({
            where: {
                Username_User: username
            }
        }).then((user) => {
            if(!user) {
                req.session.errorTarget = 'username';

                return done(null, false, {
                    message: 'This username does not exist'
                });
            }

            if(!isValidPassword(user.Password_User, password)) {
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