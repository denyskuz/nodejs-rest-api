const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const s = require('chalk');

require('dotenv').config();


const contactsRouter = require('./routes/api/contacts')
const authRouter = require("./routes/api/users");

const app = express()

const formatsLogger = process.env.NODE_ENV === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
require('./config/config-passport')

app.use("/api/users", authRouter);
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(400).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    res.status(400).json({
      message: err.message,
    });
  }
   if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
   }
  
 return res.status(500).json({
    message: "Internal server error",
 });

})

module.exports = app
