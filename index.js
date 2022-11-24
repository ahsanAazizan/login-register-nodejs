const mysql = require('mysql')
const express = require('express')
const session = require('express-session')
const path = require('path')



const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodelogin"
})

const app = express()
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public'))


// Login page
// http://localhost:300/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/register.html'))
})

// Login Authentication
// http://localhost:300/auth
app.post('/auth', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
            if (error){
                throw error;
            }
            
            if (results.length > 0){
                req.session.loggedin = true
                req.session.username = username
                res.redirect('/home')
            }else {
                res.send('Incorrect Username or password')
            }
            res.end()
        })
    } else {
        res.send('Please enter your username and password')
        res.end()
    }
})

// Register Auth
//http://localhost:3000/authreg
app.post('/authreg', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        connection.query('INSERT INTO accounts (id, username, password)  VALUES (NULL, ?, ?)', [username, password], (error, results, fields) => {
            if (error){
                throw error;
            }
            
            res.redirect('/home')
            res.end()
        })
    } else {
        res.send('Please enter your username and password')
        res.end()
    }
})

// Home page
// http://localhost:3000/home
app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.send('Welcome back ' + req.session.username + '!')
    } else {
        res.send('You must be logged in to view this page')
    }
    res.end()
})



app.listen(3000)