const express = require('express');
const app = express();


// get /
// redirects
// it always redirect
app.get('/', (req, res) => {

})

// get /urls
// render HTML
// urls_index.ejs
app.get('/urls', (req, res) => {

})

// GET /urls/new
// renders HTML
// redirects
app.get('/urls/new', (req, res) => {

})

// GET /urls/:id 
// render HTML
app.get('/urls/:id', (req, res) => {

})

// GET /u/:id
// redirect to long URL
// render HTML
app.get('/u/:id', (req, res) => {

})

// POST /urls
// redirect to /urls/:id
app.get('/urls', (req, res) => {

})

// POST /urls/:id
// redirect to /urls
app.post('/urls/:id', (req, res) => {

})

// POST /urls/:id/delete
// redirect to /urls
app.post('/urls/:id/delete', (req, res) => {

})

// GET /login
// render HTML 
app.get('/login', (req, res) => {

})

// GET /register
// render HTML /register
app.get('/register', (req, res) => {

})

// POST /login
// redirect to /urls
app.post('/login', (req, res) => {

})

// POST /register
// redirect to /urls
app.post('/register', (req, res) => {

})

// POST /logout
// redirect to /urls
app.post('/logout', (req, res) => {

})

// PORT
app.listen(8080, () => console.log('TinyApp Listening on PORT 8080!'))
