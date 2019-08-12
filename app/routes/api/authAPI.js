import express from "express";

// Actions files
import Auth from "./../../actions/auth";

// Router
let apiRouter = express.Router();

/**
 * Get User
 */

apiRouter.get("/api/auth/user", (req, res) => {
    Auth.getUser(req, res);
});

apiRouter.post("/api/auth/user", (req, res) => {
    Auth.verifyUser(req, res);
});

module.exports = apiRouter;