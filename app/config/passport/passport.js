import Auth from "./../../actions/auth";

// Authentication
module.exports = (passport, user) => {
    /**
     * SIGNUP
     */

    Auth.signup(passport, user);

    /**
     * LOGIN
     */

    Auth.login(passport, user);
};
