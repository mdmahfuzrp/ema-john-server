const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config()

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB all Process

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jlpngjm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Middle operation of backend
        // ---- mongodb collection create
        const productCollection = client.db('emaJohnDB').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = page * limit;
            const result = await productCollection.find().skip(skip).limit(limit).toArray();
            res.send(result);
        })
        app.get('/totalProducts', async (req, res) => {
            const result = await productCollection.estimatedDocumentCount();
            res.send({ totalProducts: result });
        })

        app.post('/productsByIds', async(req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => new ObjectId(id));
            const query = { _id: { $in: objectIds } };
            const result = await productCollection.find(query).toArray();
            res.send(result);
          })

        // ---------------------------------

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// --------------------------------



app.get('/', (req, res) => {
    res.send('Ema john server now running');
})

app.listen(port, (req, res) => {
    console.log('ema john server running on port: ', port)
})