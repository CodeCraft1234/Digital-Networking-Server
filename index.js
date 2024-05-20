const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
//MIADLEWERE
app.use(express.json());
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    
    const usersInfocollection = client.db("Digital-Networking").collection("usersInfo");
    const employeeCollection = client.db("Digital-Networking").collection("employeeInfo");
    const businessTraCollection = client.db("Digital-Networking").collection("business-transactions-info");

    ///////////////////////////////////////////////////////////////////////////
    //                         user data
    ///////////////////////////////////////////////////////////////////////////

    app.get('/users', async (req, res) => {
      const result = await usersInfocollection.find().toArray();
      res.send(result);
    });

    // app.get("/users/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const filter = { email: email };
    //   const result = await usersInfocollection.findOne(filter);
    //   res.send(result);
    // });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await usersInfocollection.findOne(filter);
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user?.email }
      const existingUser = await usersInfocollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }

      const result = await usersInfocollection.insertOne(user);
      res.send(result);
    });

    app.get('/users/admin/:email',  async (req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email) {
        res.send({ admin: false })
      }

      const query = { email: email }
      const user = await usersInfocollection.findOne(query);
      const result = { admin: user?.role === 'admin' }
      res.send(result);
    })

 
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await usersInfocollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const body = req.body;
      const updatedoc = {
        $set: {
          fullName: body.fullName,
          companyLogo: body.companyLogo,
          fullAddress: body.fullAddress,
          contctNumber: body.contctNumber,
          facebookID: body.facebookID,
        },
      };
      try {
        const result = await usersInfocollection.updateOne(filter, updatedoc);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user");
      }
    });
    
    // app.patch("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updatedoc = {
    //     $set: {
    //       role: 'admin'
    //     },
    //   };
    //   const result = await usersInfocollection.updateOne(filter, updatedoc);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("hello canteen");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


