const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var port = 3000;
const recordRoutes = require('./routes/records');

app.get('/', function(req, res){
    res.json('I am receiving you.')
});

app.use('/api/records', recordRoutes);

app.listen(3000, function() {
    console.log("APP IS LISTENING ON PORT " + port)
})

