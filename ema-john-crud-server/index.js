const express = require('express')
const {MongoClient} = require('mongodb')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000
const ObjectId = require('mongodb').ObjectId

// Middlewires
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z46cs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)
const run = async () => {
   try{
      await client.connect()
      const database = client.db('ema-john')
      const productCollection = database.collection('products')
      
      app.get('/products', async (req, res) => {
         const query = {}
         const cursor = productCollection.find(query)
         const {page, capacity} = req.query
         console.log(page, capacity)
         const count = await cursor.count()
         
         // Condintion checking with ternary operator instead of if...else condition
         let products
         page ? products = await cursor.skip(page * capacity)
         .limit(parseInt(capacity)).toArray()  : products = await cursor.toArray()

         res.send({
            count,
            products
         })
      })

   } finally{
      // await client.close()
   }
}

run().catch(console.dir)

app.get('/', (req, res) => {
   res.send('Server is running well!')
})

app.listen(port, () => {
   console.log('Server is running in port ', port)
})

