const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const dbconnection = require('./db/connection');

var port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());

app.use('/admin/auth', require('./routes/auth'));
app.use('/admin/postApi', require('./routes/postApi'));
app.use('/admin/getApi', require('./routes/getApi'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
})

