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
    const campaignCollection = client.db("Digital-Networking").collection("campaigns");
    const userCampaignCollection = client.db("Digital-Networking").collection("usercampaigns");
    const businessTraCollection = client.db("Digital-Networking").collection("business-transactions-info");
    const allEmployeeCollection = client.db("Digital-Networking").collection("business-transactions-info");
    const adAccountCollection = client.db("Digital-Networking").collection("ads");
    const salaryCollection = client.db("Digital-Networking").collection("salary");
    const userAdCollection = client.db("Digital-Networking").collection("userad");
    const workListCollection = client.db("Digital-Networking").collection("works");
    const paymentHistoryCollection = client.db("Digital-Networking").collection("payments");

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
    
    ///////////////////////////////////////////////////////////////////
    //                         campaign
    ////////////////////////////////////////////////////////////////////
    app.post('/campaigns',async(req,res)=>{
      const filter=req.body
      const result=await campaignCollection.insertOne(filter)
      res.send(result)
  })
  app.get('/campaigns',async(req,res)=>{
      const result=await campaignCollection.find().toArray()
      res.send(result)
  })
  
  app.get('/campaign/:id',async(req,res)=>{
    const id=req.params.id
    const filter={id:id}
      const result=await campaignCollection.find(filter).toArray()
      res.send(result)
  })
  app.get('/campaign/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const result=await campaignCollection.findOne(filter)
      res.send(result)
  })

  app.patch('/campaings/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id: new ObjectId(id)}
    const body=req.body
    console.log(body)
  
    const updatenew={
        $set:{
          tBudget:body.tBudget,
          amountSpent:body.amountSpent,
          status:body.status,
          cashIn:body.cashIn,
          method:body.method,
        }
    }
    const result=await campaignCollection.updateOne(filter,updatenew)
    res.send(result) 
})
    ///////////////////////////////////////////////////////////////////
    //                         user campaign
    ////////////////////////////////////////////////////////////////////
    app.post('/usercampaigns',async(req,res)=>{
      const filter=req.body
      const result=await userCampaignCollection.insertOne(filter)
      res.send(result)
  })
  app.get('/usercampaigns',async(req,res)=>{
      const result=await userCampaignCollection.find().toArray()
      res.send(result)
  })
  
  app.get('/usercampaigns/:id',async(req,res)=>{
    const id=req.params.id
    const filter={id:id}
      const result=await userCampaignCollection.find(filter).toArray()
      res.send(result)
  })
  app.get('/usercampaigns/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const result=await userCampaignCollection.findOne(filter)
      res.send(result)
  })

  app.patch('/usercampaigns/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id: new ObjectId(id)}
    const body=req.body
    console.log(body)
  
    const updatenew={
        $set:{
          userName:body.userName,
          email:body.email,
          phonenumber:body.phonenumber,
        }
    }
    const result=await userCampaignCollection.updateOne(filter,updatenew)
    res.send(result) 
})

    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    ///////////////////////////// ad account table ////////////////////
    app.post('/ads',async(req,res)=>{
      const filter=req.body
      const result=await adAccountCollection.insertOne(filter)
      res.send(result)
  })
  app.get('/ads',async(req,res)=>{
      const result=await adAccountCollection.find().toArray()
      res.send(result)
  })
  
  app.get('/ads/:id',async(req,res)=>{
    const id=req.params.id
    const filter={id:id}
      const result=await adAccountCollection.find(filter).toArray()
      res.send(result)
  })
  app.get('/ads/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const result=await adAccountCollection.findOne(filter)
      res.send(result)
  })

  ////////////////// employee salary table ////////////////////
  app.post('/salary',async(req,res)=>{
    const filter=req.body
    const result=await salaryCollection.insertOne(filter)
    res.send(result)
})
app.get('/salary',async(req,res)=>{
    const result=await salaryCollection.find().toArray()
    res.send(result)
})

app.get('/salary/:id',async(req,res)=>{
  const id=req.params.id
  const filter={id:id}
    const result=await salaryCollection.find(filter).toArray()
    res.send(result)
})
app.get('/salary/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const result=await salaryCollection.findOne(filter)
    res.send(result)
})
  /////////// user ad account activities table ////////////////////
  app.post('/userad',async(req,res)=>{
    const filter=req.body
    const result=await userAdCollection.insertOne(filter)
    res.send(result)
})
app.get('/userad',async(req,res)=>{
    const result=await userAdCollection.find().toArray()
    res.send(result)
})

app.get('/userad/:id',async(req,res)=>{
  const id=req.params.id
  const filter={id:id}
    const result=await userAdCollection.find(filter).toArray()
    res.send(result)
})
app.get('/userad/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const result=await userAdCollection.findOne(filter)
    res.send(result)
})

app.patch('/userad/:id',async(req,res)=>{
  const id=req.params.id
  const filter={_id: new ObjectId(id)}
  const body=req.body
  console.log(body)

  const updatenew={
      $set:{
        date:body.date,
        threshold:body.threshold,
        currentBalance:body.currentBalance,
        totalSpent:body.totalSpent,
        status:body.status,
      }
  }
  const result=await userAdCollection.updateOne(filter,updatenew)
  res.send(result) 
}) 

  /////////// own work list table ////////////////////
  app.post('/works',async(req,res)=>{
    const filter=req.body
    const result=await workListCollection.insertOne(filter)
    res.send(result)
})
app.get('/works',async(req,res)=>{
    const result=await workListCollection.find().toArray()
    res.send(result)
})

app.get('/works/:id',async(req,res)=>{
  const id=req.params.id
  const filter={id:id}
    const result=await workListCollection.find(filter).toArray()
    res.send(result)
})
app.get('/works/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const result=await workListCollection.findOne(filter)
    res.send(result)
})
  /////////// payment history table ////////////////////
  app.post('/payments',async(req,res)=>{
    const filter=req.body
    const result=await paymentHistoryCollection.insertOne(filter)
    res.send(result)
})
app.get('/payments',async(req,res)=>{
    const result=await paymentHistoryCollection.find().toArray()
    res.send(result)
})

app.get('/payments/:id',async(req,res)=>{
  const id=req.params.id
  const filter={id:id}
    const result=await paymentHistoryCollection.find(filter).toArray()
    res.send(result)
})
app.get('/payments/:id',async(req,res)=>{
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const result=await paymentHistoryCollection.findOne(filter)
    res.send(result)
})

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


