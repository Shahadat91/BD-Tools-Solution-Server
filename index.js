const express = require('express');
const cors = require('cors');
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

async function run(){
    try{

    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('BD Tools Solutions Server Running');
});

app.listen(port, () =>{
    console.log('Listening BD Tools Solutions Server Running', port)
});