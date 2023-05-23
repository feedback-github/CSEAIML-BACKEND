const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI);
//mongoose.connect('mongodb+srv://feedback:feedback@cluster0.ufdpq.mongodb.net/?retryWrites=true&w=majority');
const conn = mongoose.connection;

conn.on("connected", () => {
  console.log("db connected");
});

conn.on("error", () => {
  console.log("db error");
});
