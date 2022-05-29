const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) =>{
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
    
    
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c29qf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('bd tools solution connected');


async function run(){
    try{
        await client.connect();
        const toolCollection  = client.db('toolManagement').collection('tool');
        const orderCollection = client.db('toolManagement').collection('order');
        const reviewCollection = client.db('toolManagement').collection('review');
        

        //get all tools API
        app.get('/tool', async(req, res) =>{
            const query ={};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });

        app.get('/tool/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        });

        //product post
        app.post('/tool', async(req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        //order API
        app.get('/order', async(req, res) =>{
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.post('/order', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // app.get('/order', verifyJWT,  async (req, res) => {
        //     const email = req.query.email;
        //     const decodedEmail = req.decoded.email;
        //     if(email === decodedEmail){
        //         const query = {email: email};
        //         const cursor = orderCollection.find(query);
        //         const orders = await cursor.toArray();
        //         return res.send(orders);
        //     }else{
        //         return res.status(403).send({message: 'forbidden access'});
        //     }
           
        // });

        app.get('/order/:id', verifyJWT, async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.findOne(query);
            res.send(result)
        });

        //  //order delete api
        //  app.delete('/order/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const result = await orderCollection.deleteOne(query);
        //     res.send(result);

        // });


        //review API
        app.get('/review', async(req, res) =>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/review', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });


        //admin api
        app.put('/user/:admin/:email', verifyJWT, async(req, res) => {
            const email = req.params.email;
            const requester = req.decoded.email;
            const requesterAcc = await userCollection.findOne({ email: requester });
            if(requesterAcc.role === 'admin'){
                const filter = {email: email};
            const updateDoc = {
                $set: {role: 'admin'},
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
            }else{
                res.status(403).send({message: 'forbidden'});
            }
            
        });


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