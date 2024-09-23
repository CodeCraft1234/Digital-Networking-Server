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

    const notificationcollection = client
      .db("Digital-Networking")
      .collection("notificationInfo");

    const bankInfocollection = client
      .db("Digital-Networking")
      .collection("bankInfoo");

    const campaignCollection = client
      .db("Digital-Networking")
      .collection("campaignss");

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

    const adsAccountCenterCollection = client
      .db("Digital-Networking")
      .collection("adsAccountCenter");
    const monthlySpentCollection = client
      .db("Digital-Networking")
      .collection("monthlySpent");

    const MpaymentCollection = client
      .db("Digital-Networking")
      .collection("Mpaymentt");

    const employeePaymentCollection = client
      .db("Digital-Networking")
      .collection("employeePayment");
    const adsPaymentCollection = client
      .db("Digital-Networking")
      .collection("adsPayment");

      const allLogoCollection = client.db("Digital-Networking").collection("logoInfoo");
      const allLinksCollection = client.db("Digital-Networking").collection("linkInfoo");

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


    app.post("/users/update", async (req, res) => {
      const { email, monthlySpent } = req.body;
    
      try {
        // Check if the user already exists
        const query = { email };
        const existingUser = await usersInfocollection.findOne(query);
    
        if (existingUser) {
          // Update the existing user with monthlySpent data
          await usersInfocollection.updateOne(query, {
            $push: {
              monthlySpent: {
                $each: [monthlySpent],
                $position: 0 // Optional: Adjust position in the array if needed
              }
            }
          });
          res.send({ message: "User updated with monthlySpent data successfully" });
        } else {
          // Insert new user if not exists
          const newUser = {
            email,
            monthlySpent: [monthlySpent],
            // Add other default fields as necessary
          };
          await usersInfocollection.insertOne(newUser);
          res.send({ message: "User created with monthlySpent data successfully" });
        }
      } catch (error) {
        console.error("Error updating or inserting user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });
    

    app.post("/users/updateSellery", async (req, res) => {
      const { email, selleryData } = req.body;
  
      try {
          // Check if the user already exists
          const query = { email };
          const existingUser = await usersInfocollection.findOne(query);
  
          if (existingUser) {
              // Update the existing user with sellery data
              await usersInfocollection.updateOne(query, {
                  $push: {
                      sellery: {
                          $each: [selleryData],
                          $position: 0 // Optional: Adjust position in the array if needed
                      }
                  }
              });
              res.send({ message: "User updated with sellery data successfully" });
          } else {
              // Insert new user if not exists
              const newUser = {
                  email,
                  sellery: [selleryData],
                  // Add other default fields as necessary
              };
              await usersInfocollection.insertOne(newUser);
              res.send({ message: "User created with sellery data successfully" });
          }
      } catch (error) {
          console.error("Error updating or inserting user:", error);
          res.status(500).send({ message: "Internal server error" });
      }
  });

    app.post("/users/adminPay", async (req, res) => {
      const { email, adminPay } = req.body;
  
      try {
          // Check if the user already exists
          const query = { email };
          const existingUser = await usersInfocollection.findOne(query);
  
          if (existingUser) {
              // Update the existing user with sellery data
              await usersInfocollection.updateOne(query, {
                  $push: {
                    adminPay: {
                          $each: [adminPay],
                          $position: 0 // Optional: Adjust position in the array if needed
                      }
                  }
              });
              res.send({ message: "User updated with sellery data successfully" });
          } else {
              // Insert new user if not exists
              const newUser = {
                  email,
                  sellery: [adminPay],
                  // Add other default fields as necessary
              };
              await usersInfocollection.insertOne(newUser);
              res.send({ message: "User created with sellery data successfully" });
          }
      } catch (error) {
          console.error("Error updating or inserting user:", error);
          res.status(500).send({ message: "Internal server error" });
      }
  });
  

  app.put('/updateSpent/:userId/:spentId', async (req, res) => {
    const { userId, spentId } = req.params;
    const { totalSpentt } = req.body;
  
    try {
      // Update the specific user's monthlySpent entry
      const result = await usersInfocollection.updateOne(
        { _id: new ObjectId(userId), "monthlySpent.ids": parseInt(spentId) },
        { $set: { "monthlySpent.$.totalSpentt": totalSpentt } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'User or spent entry not found' });
      }
  
      res.status(200).json({ message: 'Total spent updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/updateSpentt/:userId/:spentId', async (req, res) => {
    const { userId, spentId } = req.params;
    const { totalSpentt, dollerRate } = req.body;  // Access directly from req.body

    try {
        // Update the specific user's monthlySpent entry
        const result = await usersInfocollection.updateOne(
            { _id: new ObjectId(userId), "monthlySpent.ids": parseInt(spentId) },
            { 
                $set: { 
                    "monthlySpent.$.totalSpentt": totalSpentt,  // Update totalSpentt
                    "monthlySpent.$.dollerRate": dollerRate     // Update dollerRate
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User or spent entry not found' });
        }

        res.status(200).json({ message: 'Total spent updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



  app.delete('/users/historyDelete/:userId/:ids', async (req, res) => {
    const { userId, ids } = req.params;
  
    try {
      // Use the $pull operator to remove the entry from the monthlySpent array by ids
      const result = await usersInfocollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { monthlySpent: { ids: parseInt(ids) } } } // Assuming ids is an integer
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Entry not found or already deleted' });
      }
  
      res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
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
          number: body.number,
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

    app.put("/users/payoneer/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
    
      const updateDocument = {
        $set: {
          payoneer: body.payoneer
        },
      };
      
      try {
        const result = await usersInfocollection.updateOne(filter, updateDocument);
        res.send(result);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ error: "Failed to update user"});
      }
    });


    app.put("/users/:field/:id", async (req, res) => {
      const id = req.params.id;
      const field = req.params.field;
      const body = req.body;
    
      if (!body[field]) {
        return res.status(400).send({ error: "Field value missing in request body" });
      }
    
      const filter = { _id: new ObjectId(id) };
      const updateDocument = {
        $set: {
          [field]: body[field]
        }
      };
    
      try {
        const result = await usersInfocollection.updateOne(filter, updateDocument);
        res.send(result);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ error: "Failed to update user" });
      }
    });

    app.put("/users/role/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
    
      const filter = { _id: new ObjectId(id) };
      const updateDocument = {
        $set: {
          role: body.role
        }
      };
        const result = await usersInfocollection.updateOne(filter, updateDocument);
        res.send(result);
    });
    
    app.patch("/users/2/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
    
      const filter = { _id: new ObjectId(id) };
      const updateDocument = {
        $set: {
          name: body.name,
          contactNumber: body.contactNumber
        }
      };
        const result = await usersInfocollection.updateOne(filter, updateDocument);
        res.send(result);
    });


    app.put('/updateSellery/:userId/:spentId', async (req, res) => {
      const { userId, spentId } = req.params;
      const { totalSpentt } = req.body;
    
      try {
      
        const result = await usersInfocollection.updateOne(
          { _id: new ObjectId(userId), "sellery.id": parseInt(spentId) },
          { $set: { "sellery.$.amount": totalSpentt } }
        );
    
        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'User or spent entry not found' });
        }
    
        res.status(200).json({ message: 'Total spent updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });

    
    app.delete('/deleteSellery/:userId/:spentId', async (req, res) => {
      const { userId, spentId } = req.params;
    
      try {
        
        const result = await usersInfocollection.updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { sellery: { id: parseInt(spentId) } } } 
        );
    
        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'Payment entry not found or already deleted' });
        }
    
        res.status(200).json({ message: 'Payment entry deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    });
    
    

        ///////////////////////////////////////////////////////////////////
    //                         campaign
    ////////////////////////////////////////////////////////////////////
    app.post("/notification", async (req, res) => {
      const filter = req.body;
      const result = await notificationcollection.insertOne(filter);
      res.send(result);
    });

    app.get("/notification/:email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await notificationcollection.find(query).toArray();
      res.send(result);
    });

    app.get("/notification", async (req, res) => {
      const result = await notificationcollection.find().toArray();
      res.send(result);
    });

    app.patch("/notification/:id", async (req, res) => {
      const id = req.params.id;
    
      try {
        // Check if `id` is a valid ObjectId
        const filter = { _id: new ObjectId(id) };
        
        // Construct the update object
        const updateData = {
          $set: {
            status: req.body.status,
          },
        };
        
        // Perform the update
        const result = await notificationcollection.updateOne(filter, updateData);
    
        if (result.modifiedCount === 1) {
          res.status(200).send({ message: "Notification updated successfully" });
        } else {
          res.status(404).send({ message: "Notification not found or already updated" });
        }
      } catch (error) {
        res.status(500).send({ message: "Error updating notification", error });
      }
    });
    
        ///////////////////////////////////////////////////////////////////
    //                         campaign
    ////////////////////////////////////////////////////////////////////
    app.post("/bankInfo", async (req, res) => {
      const filter = req.body;
      const result = await bankInfocollection.insertOne(filter);
      res.send(result);
    });

    app.get("/bankInfo/:id", async (req, res) => {
      const email = req.params.id;
      const query = { _id:new ObjectId(email) };
      const result = await bankInfocollection.find(query).toArray();
      res.send(result);
    });

    app.get("/bankInfo", async (req, res) => {
      const result = await bankInfocollection.find().toArray();
      res.send(result);
    });

    app.patch('/bankInfo/:id', async (req, res) => {
      const { id } = req.params; // Get the bank info ID from URL parameters
      const updateData = req.body; // Get the data to be updated from the request body
    
      try {
        // Update the bank info document in the MongoDB collection
        const result = await bankInfocollection.updateOne(
          { _id: new ObjectId(id) }, // Convert the string ID to MongoDB ObjectId
          { $set: updateData } // Set the updated fields
        );
    
        // Check if the document was modified
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: 'Bank info updated successfully' });
        } else {
          res.status(404).send({ message: 'Bank info not found or not updated' });
        }
      } catch (error) {
        // Handle any errors that occur during the update
        res.status(500).send({ message: 'Error updating bank info', error });
      }
    });


       app.delete("/bankInfo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bankInfocollection.deleteOne(filter);
      res.send(result);
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
          campaignName: body.campaignName,
          tBudged: body.tBudged,
          status: body.status,
          tSpent: body.tSpent,
          dollerRate: body.dollerRate,
        },
      };

      const result = await campaignCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.patch("/campaings/status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          status: body.status,
        },
      };
      const result = await campaignCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.put("/campaings/totalBudged/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          tBudged: body.tBudged,
        },
      };
      const result = await campaignCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.put("/campaings/totalSpent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          tSpent: body.tSpent,
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
    app.post("/sellery", async (req, res) => {
      const filter = req.body;
      const result = await salaryCollection.insertOne(filter);
      res.send(result);
    });
    app.get("/sellery", async (req, res) => {
      const result = await salaryCollection.find().toArray();
      res.send(result);
    });

    app.get("/sellery/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { id: id };
      const result = await salaryCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/sellery/:id", async (req, res) => {
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


    ////////////////// monthlySpent ////////////////////
    app.post("/monthlySpent", async (req, res) => {
      const filter = req.body;
      const result = await monthlySpentCollection.insertOne(filter);
      res.send(result);
    });
    app.get("/monthlySpent", async (req, res) => {
      const result = await monthlySpentCollection.find().toArray();
      res.send(result);
    });


    app.get("/monthlySpent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await monthlySpentCollection.findOne(filter);
      res.send(result);
    });


    app.patch("/monthlySpent/totalSpent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      console.log(body);

      const updateDoc = {
        $set: {
          totalSpentt: body.totalSpentt,
        },
      };
  
      const result = await monthlySpentCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/monthlySpent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await monthlySpentCollection.deleteOne(filter);
      res.send(result);
    });

    ////////////////// monthlySpent sellery ////////////////////

    app.post("/selleryPay", async (req, res) => {
      const filter = req.body;
      const result = await monthlySpentCollection.insertOne(filter);
      res.send(result);
    });
    
    app.get("/selleryPay", async (req, res) => {
      const result = await monthlySpentCollection.find().toArray();
      res.send(result);
    });


    app.get("/selleryPay/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await monthlySpentCollection.findOne(filter);
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
          accountName: body.accountName,
          date: body.date,
          threshold: body.threshold,
          currentBallence: body.currentBallence,
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

    ///////////////////////////////////////////////////////////////////////////
    //                         links social data
    ///////////////////////////////////////////////////////////////////////////

    app.get("/links", async (req, res) => {
      const result = await allLinksCollection.find().toArray();
      res.send(result);
    });

    app.post("/links", async (req, res) => {
      const user = req.body;
      const result = await allLinksCollection.insertOne(user);
      res.send(result);
    });


    ///////////////////////////////////////////////////////////////////////////
    //                         logo social data
    ///////////////////////////////////////////////////////////////////////////

    app.get("/logos", async (req, res) => {
      const result = await allLogoCollection.find().toArray();
      res.send(result);
    });

    app.post("/logos", async (req, res) => {
      const user = req.body;
      const result = await allLogoCollection.insertOne(user);
      res.send(result);
    });


    ////////////////////////////////////////////////////////
    //                 client
    ////////////////////////////////////////////////////////

    app.post("/clients", async (req, res) => {
      
      const { clientEmail, clientPhone, employeeEmail } = req.body;
      // Check if client with the same email or phone number already exists, and if the employeeEmail matches
      const existingClient = await clietCollection.findOne({
        $and: [
          {
            $or: [
              { clientEmail: clientEmail },
              { clientPhone: clientPhone }
            ]
          },
          { employeeEmail: employeeEmail }
        ]
      });
    
      if (existingClient) {
        // If a client with the same email or phone exists, and matches the employeeEmail, send a response indicating duplication
        return res.status(400).send({ message: "Client with the same email or phone number already exists for this employee." });
      }
    
      // If no duplication, insert the new client data
      const result = await clietCollection.insertOne(req.body);
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
  
      const result = await clietCollection.updateOne(filter, updateDoc);
      res.send(result);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).send({ message: "Failed to update client", error });
    }
  });
  app.delete("/clients/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await clietCollection.deleteOne(filter);
    res.send(result);
  });

  app.patch("/client/update/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        clientEmail: body.clientEmail,
        clientName: body.clientName,
        clientPhone: body.clientPhone,
      },
    };

    const result = await clietCollection.updateOne(filter, updatenew);
    res.send(result);
  });
  
  /////////////////////////////////////////////////
  // employee payment ////////////////////
  ////////////////////////////////////

  app.post("/employeePayment", async (req, res) => {
    const filter = req.body;
    const result = await employeePaymentCollection.insertOne(filter);
    res.send(result);
  });
  

  app.get("/employeePayment", async (req, res) => {
    const result = await employeePaymentCollection.find().toArray();
    res.send(result);
  });

  app.get("/employeePayment", async (req, res) => {
    const email = req.query.email;
    const query = { employeeEmail: email };
    const result = await employeePaymentCollection.find(query).toArray();
    res.send(result);
  });

  app.get("/employeePayment/:email", async (req, res) => {
    const email = req.params.email;
    const filter = { employeeEmail: email };
    const result = await employeePaymentCollection.findOne(filter);
    res.send(result);
  });

  app.get("/employeePayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await employeePaymentCollection.findOne(filter);
    res.send(result);
  });

  app.delete("/employeePayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await employeePaymentCollection.deleteOne(filter);
    res.send(result);
  });

  app.patch("/employeePayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        status: body.status,
        payAmount: body.payAmount,
        date: body.date,
        note: body.note,
        paymentMethod: body.paymentMethod,
      },
    };

    const result = await employeePaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/employeePayment/status/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await employeePaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/employeePayment/status/pending/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await employeePaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  /////////////////////////////////////////////////
  // ads payment ////////////////////
  ////////////////////////////////////

  app.post("/adsPayment", async (req, res) => {
    const filter = req.body;
    const result = await adsPaymentCollection.insertOne(filter);
    res.send(result);
  });
  

  app.get("/adsPayment", async (req, res) => {
    const result = await adsPaymentCollection.find().toArray();
    res.send(result);
  });

  app.get("/adsPayment", async (req, res) => {
    const email = req.query.email;
    const query = { employeeEmail: email };
    const result = await adsPaymentCollection.find(query).toArray();
    res.send(result);
  });

  app.get("/adsPayment/:email", async (req, res) => {
    const email = req.params.email;
    const filter = { employeeEmail: email };
    const result = await adsPaymentCollection.findOne(filter);
    res.send(result);
  });

  app.get("/adsPayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await adsPaymentCollection.findOne(filter);
    res.send(result);
  });

  app.delete("/adsPayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await adsPaymentCollection.deleteOne(filter);
    res.send(result);
  });

  app.patch("/adsPayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        payAmount: body.payAmount,
        date: body.date,
        note: body.note,
        paymentMethod: body.paymentMethod,
      },
    };

    const result = await adsPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });
  
  app.patch("/adsPayment/status/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await adsPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/adsPayment/status/pending/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await adsPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

////////////////////////logo////////////////////////////
app.get("/logos", async (req, res) => {
  const result = await allLogoCollection.find().toArray();
  res.send(result);
});

app.get("/logos/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };

  const result = await allLogoCollection.findOne(filter);
  res.send(result);
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
    app.delete("/adsAccount/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await adsAccountCollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/adsAccount/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          accountName: body.accountName,
          date:body.date,
          paymentDate: body.paymentDate,
          threshold: body.threshold,
          currentBallence: body.currentBallence,
        },
      };

      const result = await adsAccountCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.put("/adsAccount/currentBalance/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          currentBallence: body.currentBallence,
        },
      };

      const result = await adsAccountCollection.updateOne(filter, updatenew);
      res.send(result);
    });
    app.put("/adsAccount/threshold/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          threshold: body.threshold,
        },
      };

      const result = await adsAccountCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.put("/adsAccount/totalSpent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          totalSpent: body.totalSpent,
        },
      };

      const result = await adsAccountCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.patch("/adsAccount/status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          status: body.status,
        },
      };

      const result = await adsAccountCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    ////////////////////////////////////////////////////////
    //                 ads ad account center
    ////////////////////////////////////////////////////////

    app.post("/adsAccountCenter", async (req, res) => {
      const filter = req.body;
      const result = await adsAccountCenterCollection.insertOne(filter);
      res.send(result);
    });

    app.get("/adsAccountCenter", async (req, res) => {
      const result = await adsAccountCenterCollection.find().toArray();
      res.send(result);
    });

    app.get("/adsAccountCenter", async (req, res) => {
      const email = req.query.email;
      const query = { employeeEmail: email };
      const result = await adsAccountCenterCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/adsAccountCenter/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { employeeEmail: email };
      const result = await adsAccountCenterCollection.findOne(filter);
      res.send(result);
    });
    app.delete("/adsAccountCenter/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await adsAccountCenterCollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/adsAccountCenter/status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          status: body.status,
        },
      };

      const result = await adsAccountCenterCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.patch("/adsAccountCenter/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          accountName: body.accountName,
          paymentDate: body.paymentDate,
          threshold: body.threshold,
          currentBallence: body.currentBallence,
          totalSpent: body.totalSpent,
          dollerRate: body.dollerRate,
          status: body.status,
        },
      };

      const result = await adsAccountCenterCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.put("/adsAccountCenter/currentBalance/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          currentBallence: body.currentBallence,
        },
      };

      const result = await adsAccountCenterCollection.updateOne(filter, updatenew);
      res.send(result);
    });
    app.put("/adsAccountCenter/threshold/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          threshold: body.threshold,
        },
      };

      const result = await adsAccountCenterCollection.updateOne(filter, updatenew);
      res.send(result);
    });
    app.put("/adsAccountCenter/totalSpent/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          totalSpent: body.totalSpent,
        },
      };

      const result = await adsAccountCenterCollection.updateOne(filter, updatenew);
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

    app.patch("/Mpayment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          amount: body.amount,
          date: body.date,
          note: body.note,
          paymentMethod: body.paymentMethod,
        },
      };

      const result = await MpaymentCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.delete("/Mpayment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await MpaymentCollection.deleteOne(filter);
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
