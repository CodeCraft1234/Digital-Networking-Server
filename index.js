const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
//MIADLEWERE
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersInfocollection = client
      .db("Digital-Networking")
      .collection("usersInfoo");
    const campaignCollection = client
      .db("Digital-Networking")
      .collection("campaignss");
    const businessTraCollection = client
      .db("Digital-Networking")
      .collection("business-transactions-info");
    const allEmployeeCollection = client
      .db("Digital-Networking")
      .collection("business-transactions-info");
    const adAccountCollection = client
      .db("Digital-Networking")
      .collection("ads");
    const salaryCollection = client
      .db("Digital-Networking")
      .collection("salary");
    const userAdCollection = client
      .db("Digital-Networking")
      .collection("useradd");
    const workListCollection = client
      .db("Digital-Networking")
      .collection("workss");
    const OwnSelaryCollection = client
      .db("Digital-Networking")
      .collection("OwnSelaryCollection");

    const clietCollection = client
      .db("Digital-Networking")
      .collection("clienttt");
    const adsAccountCollection = client
      .db("Digital-Networking")
      .collection("adsAccountt");
    const MpaymentCollection = client
      .db("Digital-Networking")
      .collection("Mpaymentt");

    ///////////////////////////////////////////////////////////////////////////
    //                         user data
    ///////////////////////////////////////////////////////////////////////////

    app.get("/users", async (req, res) => {
      const result = await usersInfocollection.find().toArray();
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersInfocollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await usersInfocollection.findOne(filter);
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const result = await usersInfocollection.findOne(filter);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user?.email };
      const existingUser = await usersInfocollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const result = await usersInfocollection.insertOne(user);
      res.send(result);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      if (req.decoded.email !== email) {
        res.send({ admin: false });
      }
      const query = { email: email };
      const user = await usersInfocollection.findOne(query);
      const result = { admin: user?.role === "admin" };
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
          instagramID: body.instagramID,
          linkedinID: body.linkedinID,
          twitterID: body.twitterID,
          youtubeID: body.youtubeID,
          whatsappID: body.whatsappID,
          bkashPersonal: body.bkashPersonal,
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
    app.post("/campaigns", async (req, res) => {
      const filter = req.body;
      const result = await campaignCollection.insertOne(filter);
      res.send(result);
    });

    app.get("/campaings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await campaignCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/campaigns", async (req, res) => {
      const result = await campaignCollection.find().toArray();
      res.send(result);
    });

    app.get("/campaigns/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await campaignCollection.findOne(filter);
      res.send(result);
    });

    app.get("/campaign/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await campaignCollection.findOne(filter);
      res.send(result);
    });

    app.delete("/campaigns/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await campaignCollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/campaings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          status: body.status,
          tSpent: body.tSpent,
          dollerRate: body.dollerRate,
        },
      };

      const result = await campaignCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    ///////////////////////////// ad account table ////////////////////
    app.post("/ads", async (req, res) => {
      const filter = req.body;
      const result = await adAccountCollection.insertOne(filter);
      res.send(result);
    });
    app.get("/ads", async (req, res) => {
      const result = await adAccountCollection.find().toArray();
      res.send(result);
    });

    app.get("/ads/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const result = await adAccountCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/ads/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const result = await adAccountCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/ads/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await adAccountCollection.findOne(filter);
      res.send(result);
    });

    ////////////////// employee salary table ////////////////////
    app.post("/salary", async (req, res) => {
      const filter = req.body;
      const result = await salaryCollection.insertOne(filter);
      res.send(result);
    });
    app.get("/salary", async (req, res) => {
      const result = await salaryCollection.find().toArray();
      res.send(result);
    });

    app.get("/salary/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const result = await salaryCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/salary/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await salaryCollection.findOne(filter);
      res.send(result);
    });

    app.patch("/salary/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          totalWork: body.totalWork,
          paid: body.paid,
          saleryRate: body.saleryRate,
          bonus: body.bonus,
          mounth: body.mounth,
        },
      };

      const result = await salaryCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    /////////// user ad account activities table ////////////////////
    app.post("/userad", async (req, res) => {
      const filter = req.body;
      const result = await userAdCollection.insertOne(filter);
      res.send(result);
    });
    app.get("/userad", async (req, res) => {
      const result = await userAdCollection.find().toArray();
      res.send(result);
    });

    app.get("/userad/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const result = await userAdCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/userad/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await userAdCollection.findOne(filter);
      res.send(result);
    });

    app.patch("/userad/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      console.log(body);

      const updatenew = {
        $set: {
          date: body.date,
          threshold: body.threshold,
          currentBalance: body.currentBalance,
          totalSpent: body.totalSpent,
          status: body.status,
        },
      };
      const result = await userAdCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    /////////// own work list table ////////////////////
    app.post("/works", async (req, res) => {
      const filter = req.body;
      const result = await workListCollection.insertOne(filter);
      res.send(result);
    });
    app.get("/works", async (req, res) => {
      const result = await workListCollection.find().toArray();
      res.send(result);
    });

    app.get("/works/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const result = await workListCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/works/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await workListCollection.findOne(filter);
      res.send(result);
    });

    app.post("/ownSelary", async (req, res) => {
      const filter = req.body;
      const result = await OwnSelaryCollection.insertOne(filter);
      res.send(result);
    });

    app.get("/ownSelary", async (req, res) => {
      const result = await OwnSelaryCollection.find().toArray();
      res.send(result);
    });

    app.get("/ownSelary", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await OwnSelaryCollection.find(query).toArray();
      res.send(result);
    });

    ////////////////////////////////////////////////////////
    //                 client
    ////////////////////////////////////////////////////////

    app.post("/clients", async (req, res) => {
      const filter = req.body;
      const result = await clietCollection.insertOne(filter);
      res.send(result);
    });
    

    app.get("/clients", async (req, res) => {
      const result = await clietCollection.find().toArray();
      res.send(result);
    });

    app.get("/clients", async (req, res) => {
      const email = req.query.email;
      const query = { employeeEmail: email };
      const result = await clietCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/clients/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { employeeEmail: email };
      const result = await clietCollection.findOne(filter);
      res.send(result);
    });

    app.get("/clients/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await clietCollection.findOne(filter);
      res.send(result);
    });

    app.delete("/clients/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await clietCollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/clients/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { clientEmail: email };
      const body = req.body;
      
      console.log('Received email:', email);
      console.log('Received body:', body);
  
      const updatenew = {
          $set: {
              tSpent: body.tSpent,
              tPayment: body.tPayment,
              tBudged: body.tBudged,
              tBill: body.tBill,
          },
      };
  
      try {
          const result = await clietCollection.updateOne(filter, updatenew); // Ensure clientCollection is correctly initialized
          console.log('Update result:', result);
          res.send(result);
      } catch (error) {
          console.error('Error updating client:', error);
          res.status(500).send({ error: 'An error occurred while updating the client' });
      }
  });

  app.patch("/clients/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
  
      console.log('Received body:', body);
  
      const updateDoc = {
        $set: {
          clientName: body.clientName,
          clientPhone: body.clientPhone,
        },
      };
  
      const result = await clientCollection.updateOne(filter, updateDoc);
      res.send(result);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).send({ message: "Failed to update client", error });
    }
  });
  
    

    ////////////////////////////////////////////////////////
    //                 ads ad account
    ////////////////////////////////////////////////////////

    app.post("/adsAccount", async (req, res) => {
      const filter = req.body;
      const result = await adsAccountCollection.insertOne(filter);
      res.send(result);
    });

    app.get("/adsAccount", async (req, res) => {
      const result = await adsAccountCollection.find().toArray();
      res.send(result);
    });

    app.get("/adsAccount", async (req, res) => {
      const email = req.query.email;
      const query = { employeeEmail: email };
      const result = await adsAccountCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/adsAccount/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { employeeEmail: email };
      const result = await adsAccountCollection.findOne(filter);
      res.send(result);
    });

    app.patch("/adsAccount/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          currentBallence: body.currentBallence,
          threshold: body.threshold,
          totalSpent: body.totalSpent,
          status:body.status,
        },
      };

      const result = await adsAccountCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    ///////////////////////////////////////////////////////////////////
    //                       Mpayment
    ////////////////////////////////////////////////////////////////////
    app.post("/Mpayment", async (req, res) => {
      const filter = req.body;
      const result = await MpaymentCollection.insertOne(filter);
      res.send(result);
    });

    app.get("/Mpayment", async (req, res) => {
      const result = await MpaymentCollection.find().toArray();
      res.send(result);
    });

    app.get("/Mpayment/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await MpaymentCollection.findOne(filter);
      res.send(result);
    });

   
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
console.log('mongodb connected')
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("hello canteen");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
