const cors = require('cors')
const express = require('express');
const app = express();
var http = require('http');
const rutas = require('./rutas');

//configuraciones del servidor
app.set('port', 8000);

app.use(cors())
app.use(express.json({limit : '15mb', extended : true}));
app.use(express.urlencoded({extended: true}));

var server = http.createServer(app);

app.use(rutas);
server.listen(app.get('port'));