import express from 'express';
const app = module.exports = express();

// Routes
app.get('/', require('./index').get);
app.post('/', require('./index').post);

app.get('/authentication', require('./authentication').get);
app.post('/authentication', require('./authentication').post);

app.get('/lang-select', require('./lang_select').get);
app.post('/lang-select', require('./lang_select').post);

// Catch routes
app.all('*', (req, res) => {
    res.status(404).send({
        msg: 'Not found'
    })
});