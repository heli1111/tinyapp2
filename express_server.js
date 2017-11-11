const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');


app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  secret: generateRandomString(10),
  //cookie options - 24 hrs
  maxAge: 24 * 60 * 60 * 1000
}));


const PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");

// initialize url database
const urlDatabase = {};

// initialize user 
const users = {};

// function that returns the specific url list for user

function userUrl(userID){
  let urls = {};
  for (let url in urlDatabase){
    if (urlDatabase[url].userID === userID){
      urls[url] = urlDatabase[url];
    }
  }
  return urls;
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
  let templateVars = {user: req.session.user_id};
  // renger login template
  res.render("login", templateVars);
})

// GET /register
// render HTML /register
app.get('/register', (req, res) => {
  // set cookie to templateVars
  let templateVars = {user: req.session.user_id};
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
  for (let user in users) {
    if (email === users[user].email) {
      if (bcrypt.compareSync(password, users[user].password)) {
        req.session.user_id = users[user];
        res.redirect("/urls");
      } else {
        res.status(403).send("password don't match!");
      }
    }
  }

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
    return;
  }

  for (let user in users){
    if (email === users[user].email){
    res.status(400).send("email already exists!");
    return;
    }
  }
  // generate random user ID
  let userID = generateRandomString(6);
  let hashedPassword = bcrypt.hashSync(password,10);
  users[userID] = {id: userID, email: email, password: hashedPassword};
  // set session cookie to user ID 
  req.session.user_id = users[userID];
  // redirect to /urls
  res.redirect("/urls");
});


// POST /logout
// clear login cookie
// redirect to /urls
app.post('/logout', (req, res) => {
  delete req.session['user_id'];
  res.redirect("/urls");

})

// GET /urls
// renders urls_index.ejs - display URL database, link shortURL to its longURL
app.get('/urls', (req, res) => {
  let user = req.session.user_id;
  let urls = {};

  // create user specified url list
  if (user === undefined){
    res.redirect("/login");
    return;
  } else {
    urls = userUrl(user.id);
  }
  let templateVars = {urls: urls, user: user};
  res.render("urls_index", templateVars);
})

// GET /urls/new
// renders urls_new - only registered users can add new url
// 
app.get('/urls/new', (req, res) => {
  let user = req.session.user_id;
  let templateVars = {user: user};
  if (user === undefined){
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});



// GET /urls/:id 
// renders urls_show - display requested shortURL and its longURL, link shortURL to longURL
// prevent unauthorized users to view sortened URL
app.get('/urls/:id', (req, res) => {
  let user = req.session.user_id;
  let shortURL = req.params.id;
  let longURL = urlDatabase[shortURL].url;
  let templateVars = {shortURL: shortURL, longURL: longURL, user: user};
 
  // set viewing limitations to unauthorized users
  if (user && urlDatabase[shortURL].userID !== user.id){
    res.status(403).send("unauthorized");
    return;
  }
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
  let user = req.session.user_id;
  if (user === undefined){
    res.redirect("/login");
    return;
  }  
  // generate and assign randomID to newly entered URL
  // append unique userID to the url object
  let ShortURL = generateRandomString(6);
  urlDatabase[ShortURL] = {
    url: req.body['longURL'],
    userID: user.id
  }
  res.redirect("/urls");
})

// POST /urls/:id
// update a URL to the urlDatabase, only authorized user can see thier own list
// redirect to /urls
app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let user = req.session.user_id;

  if (urlDatabase[shortURL].userID !== user.id){
    res.status(403).send("unauthorized");
    return;
  }
  urlDatabase[shortURL].url = req.body['longURL'];
  res.redirect("/urls");
})

// POST /urls/:id/delete
// delete specifi url from urlDatabase
// redirect to /urls
app.post('/urls/:id/delete', (req, res) => {
  let user = req.session.user_id;
  let shortURL = req.params.id;

  if (urlDatabase[shortURL].userID !== user.id){
    res.status(403).send("unauthorized");
    return;
  }
  // delete the url from urlDatabase
  delete urlDatabase[shortURL];
  // redirect to index with updated database
  res.redirect('/urls');
})


// PORT
app.listen(PORT, () => {console.log('TinyApp Listening on PORT 8080!')});
