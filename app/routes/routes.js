import express from 'express';
// Import routes
import index from './index';
import signup from './signup';
import login from './login';
import langSelect from './lang_select';

// Router
let apiRouter = express.Router();

// Routes
apiRouter.get('/', index.get);
apiRouter.post('/', index.post);

apiRouter.get('/signup', signup.get);
apiRouter.post('/signup', signup.post);

apiRouter.get('/login', login.get);
apiRouter.post('/login', login.post);

apiRouter.get('/lang-select', langSelect.get);
apiRouter.post('/lang-select', langSelect.post);

// Catch routes
apiRouter.all('*', (req, res) => {
    res.status(404).send({
        msg: 'Not found'
    })
});

module.exports = apiRouter;