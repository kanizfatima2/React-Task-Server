const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER, process.env.PASSWORD)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.q7dh4y6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//database Connection
if (uri) {
    console.log('Database Connected')
}

//Run function
async function run() {
    const AddInput = client.db('FormDataCollection').collection('AddedFormData')
    try {
        //create input
        app.post('/AddedFormData', async (req, res) => {
            const result = await AddInput.insertOne(req.body)
            if (result.insertedId) {
                res.send({
                    success: true,
                    message: 'Succesfully added your Input!!'
                })
            }
            else {
                res.send({
                    success: false,
                    error: 'Your attempt is failed!'
                })
            }
        })

        //Read all input
        app.get('/AddedFormData', async (req, res) => {
            try {
                const cursor = AddInput.find({})
                const allInput = await cursor.toArray();

                res.send({
                    success: true,
                    message: 'Successfully read all data!',
                    data: allInput
                })
            }

            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }
        })

        //Read One input
        app.get('/AddedFormData/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const input = await AddInput.findOne({ _id: ObjectId(id) })

                res.send({
                    success: true,
                    message: 'Successfully read the data!',
                    data: input
                })
            }
            catch (error) {
                console.log(error.message);
                res.send({
                    success: false,
                    error: error.message
                })
            }
        })
    }

    finally {

    }
}

run().catch(err => console.error(err.message))

app.get('/', (req, res) => {
    res.send('Form data Server is running')
})

app.listen(port, (req, res) => {
    console.log('listening to port ', port)
})