const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");

const urlDatabase = {  
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: 'defaultUser'},
  "9sm5xK": {
    url: "http://www.google.com",
    userID: 'defaultUser'
  }
};


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

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

// GET /login
// render HTML 
app.get('/login', (req, res) => {
  // set cookie to templateVars
  let templateVars = {user: req.cookies["user"]};
  // renger login template
  res.render("login", templateVars);
})

// GET /register
// render HTML /register
app.get('/register', (req, res) => {
  // set cookie to templateVars
  let templateVars = {user: req.cookies["user"]};
  // render register template
  res.render("register", templateVars);

})

// POST /login
// obtain email & password to login, set user as cookie
// redirect to /urls
app.post('/login', (req, res) => {
  let email = req.body['email'];
  let password = req.body['password'];

  // error handling - verify inputs
  if (email === "" || password === ""){
    res.status(403).send("Please enter email and password");
  }

  // error handling - verify password
  Object.keys(users).forEach(function(user){
    if (email === users[user].email){
      if (password === users[user].password){
      res.cookie('user', user);
      res.redirect("/urls");
      } else {
      res.status(403).send("password don't match!");
      }
    }
  });

  res.status(403).send("email don't exist, please register!")
});

// POST /register
// redirect to /urls
app.post('/register', (req, res) => {
  let email = req.body['email'];
  let password = req.body['password'];

  // error handling
  if (email === "" || password === ""){
    res.status(400).send("please enter email and password");
  }

  Object.keys(users).forEach(function(user) {
    if (email === users[user].email){
    res.status(400).send("email already exists!");
    }
  })

  // generate random user ID
  let userID = generateRandomString(6);
  users[userID] = {id: userID, email: email, password: password};
  // set cookie to user ID 
  res.cookie('user', users[userID]);
  // redirect to /urls

  res.redirect("/urls");
});






// POST /logout
// clear login cookie
// redirect to /urls
app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect("/urls");

})

// GET /urls
// renders urls_index.ejs - display URL database, link shortURL to its longURL
app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase, user: req.cookies["user"]};
  res.render("urls_index", templateVars);
})

// GET /urls/new
// renders urls_new - only registered users can add new url
// 
app.get('/urls/new', (req, res) => {
  let user = req.cookies['user'];
  let templateVars = {user: user};
  if (user === undefined){
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});



// GET /urls/:id 
// renders urls_show - display requested shortURL and its longURL, link shortURL to longURL
app.get('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL].url;
  let templateVars = {shortURL: shortURL, longURL: longURL, user: req.cookies["user"]};
  res.render("urls_show", templateVars);
})

// GET /u/:id
// redirect to longURL - handle shortURL request
// render HTML
app.get('/u/:id', (req, res) => {
  let longURL = urlDatabase[req.params.id].url;
  res.redirect(longURL);

})

// POST /urls
// Add new URL key-value pair to the urlDatabse
// redirect to newly added url page - /urls/:id
app.post('/urls', (req, res) => {
  // check user login status
  let user = req.cookies['user'];
  if (user === undefined){
    res.redirect("/login");
    return;
  }  
  // generate and assign randomID to newly entered URL
  // append unique userID to the url object
  let ShortURL = generateRandomString(6);
  urlDatabase[ShortURL] = {
    url: req.body['longURL'],
    userID: user
  }
  res.redirect("/urls");
})

// POST /urls/:id
// update a URL to the urlDatabase
// redirect to /urls
app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  urlDatabase[shortURL] = req.body['longURL'];
  res.redirect("/urls");
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


// PORT
app.listen(PORT, () => {console.log('TinyApp Listening on PORT 8080!')});
