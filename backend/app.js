require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use('/home', homeRouter);

// Inserting some dummy data into the database
// require('./bootstrap/bootstrap').run();

module.exports = app;