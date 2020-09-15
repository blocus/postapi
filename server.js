const express = require("express");
const mongoose = require("mongoose")
const server = express();
const cors = require("cors");
require('dotenv').config()

const mongoUrl = process.env.MONGO_URL
const port =process.env.SERVER_PORT

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => 
  console.log("Connection to Database established successfuly")
).catch(err=> console.log(err))


const router = require('./routes')
server.use(express.json())
server.use(cors())

server.use(router)

server.listen(port, () => {
  //process.stdout.write("\033c");
  console.log(`server is running at port ${port}`);
});

