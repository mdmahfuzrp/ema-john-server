const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Ema john server now running');
})

app.listen(port, (req, res)=>{
    console.log('ema john server running on port: ', port)
})