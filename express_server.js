const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");

const urlDatabase = {  
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};


// generateRandomString - randomly generates a n digits alphanumerical string
function generateRandomString(num) {
  let randomID = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < num; i++){
    randomID += characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return randomID;
}

// get /
// redirects
// it always redirect
app.get('/', (req, res) => {
  res.redirect("/urls");
})

// GET /urls
// renders urls_index.ejs - display URL database, link shortURL to its longURL
app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
})

// GET /urls/new
// renders urls_new - adding new url
app.get('/urls/new', (req, res) => {
  res.render("urls_new");
})

// GET /urls/:id 
// renders urls_show - display requested shortURL and its longURL, link shortURL to longURL
app.get('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL];
  let templateVars = {shortURL: shortURL, longURL: longURL};
  res.render("urls_show", templateVars);
})

// GET /u/:id
// redirect to longURL - handle shortURL request
// render HTML
app.get('/u/:id', (req, res) => {
  let longURL = urlDatabase[req.params.id];
  res.redirect(longURL);

})

// POST /urls
// Add new URL key-value pair to the urlDatabse
// redirect to newly added url page - /urls/:id
app.post('/urls', (req, res) => {
  //generate and assign randomID to newly entered URL
  let ShortURL = generateRandomString(6);
  urlDatabase[ShortURL] = req.body['longURL'];
  res.redirect(`/urls/${ShortURL}`);
})

// POST /urls/:id
// redirect to /urls
app.post('/urls/:id', (req, res) => {

})

// POST /urls/:id/delete
// delete specifi url from urlDatabase
// redirect to /urls
app.post('/urls/:id/delete', (req, res) => {
  let shortURL = req.params.id;
  // delete the url from urlDatabase
  delete urlDatabase[shortURL];
  // redirect to index with updated database
  res.redirect('/urls');
})

// GET /login
// render HTML 
app.get('/login', (req, res) => {
  res.render("login");
})

// GET /register
// render HTML /register
app.get('/register', (req, res) => {
  res.render("register");

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
app.listen(PORT, () => {console.log('TinyApp Listening on PORT 8080!')});
