
require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const app = express();
const patch = require('path');
//Base de datos

dbConnection();

//CORS  
app.use(cors());

const port = process.env.PORT || 3000;

console.log(process.env);
//Middlewares
app.use(express.static('public'));
//lectura y parseo del body
app.use(express.json());

//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('*', (req, res) => res.sendFile(patch.resolve(__dirname, 'public/index.html')));

app.listen(port, () => {
    console.log(` app listening on port ${port}`);
});
