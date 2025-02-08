const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@anowarulbd.cwgkj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const usersInfocollection = client.db("Digital-Networking").collection("usersInfo");
    const clientCollection = client.db("Digital-Networking").collection("clients");
    const bankInfocollection = client.db("Digital-Networking").collection("bankInfo");
    const adminPaymentCollection = client.db("Digital-Networking").collection("adminPaymentInfo");
    const salaryPaymentCollection = client.db("Digital-Networking").collection("salaryPaymentInfo");
    const adsAccountCollection = client.db("Digital-Networking").collection("adsAccountInfo");
    const BasicSalaryCollection = client.db("Digital-Networking").collection("basicSalaryInfo");
    
    const notificationcollection = client.db("Digital-Networking").collection("notificationInfo");
    const editNotificationcollection = client.db("Digital-Networking").collection("editNotificationInfo");
    const adsAccountCenterCollection = client.db("Digital-Networking").collection("adsAccountCenter");
    const monthlySpentCollection = client.db("Digital-Networking").collection("monthlySpent");
    const ContributorPaymentCollection = client.db("Digital-Networking").collection("ContributorPayment");
    const activityCollection = client.db("Digital-Networking").collection("activityInfos");
    const payoneerDataCollection = client.db("Digital-Networking").collection("payoneerDataInfo");
    const payoneerEmailCollection = client.db("Digital-Networking").collection("payoneerEmailInfo");


    ////////////////////////////////////////////////////////
    //                 ads ad account center
    ////////////////////////////////////////////////////////

  
    app.get("/basicSalary", async (req, res) => {
      const result = await BasicSalaryCollection.find().toArray();
      res.send(result);
    });

    app.post("/basicSalary", async (req, res) => {
      const { employeeEmail, month } = req.body;
    
      // Check if the document already exists
      const existingRecord = await BasicSalaryCollection.findOne({ employeeEmail, month });
    
      if (existingRecord) {
        // If it exists, update it
        const updatedRecord = await BasicSalaryCollection.updateOne(
          { employeeEmail, month },
          { $set: { payAmount: req.body.payAmount } }
        );
        return res.send({ message: "Record updated successfully", updatedRecord });
      } else {
        // If it doesn't exist, insert a new one
        const result = await BasicSalaryCollection.insertOne(req.body);
        return res.send({ message: "Record inserted successfully", result });
      }
    });
    


    ////////////////////////////////////////////////////////
    //                 ads ad account center
    ////////////////////////////////////////////////////////

    
    app.post("/payoneerData", async (req, res) => {
      const filter = req.body;
      const result = await payoneerDataCollection.insertOne(filter);
      res.send(result);
    });

    app.get("/payoneerData", async (req, res) => {
      const result = await payoneerDataCollection.find().toArray();
      res.send(result);
    });

    app.patch("/payoneerData/status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          status: body.status,
        },
      };
      const result = await payoneerDataCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.patch("/payoneerData/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      console.log(body);

      const updatenew = {
        $set: {
          dollerRate: body.dollerRate,
          date: body.date,
          payoneerEmail: body.payoneerEmail,
          amount: body.amount,
          note: body.note,
        },
      };
      const result = await payoneerDataCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.delete("/payoneerData/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await payoneerDataCollection.deleteOne(filter);
      res.send(result);
    });
    ////////////////////////////////////////////////////////
    //                 ads ad account center
    ////////////////////////////////////////////////////////

    
    app.post("/payoneerEmail", async (req, res) => {
      const filter = req.body;
      const result = await payoneerEmailCollection.insertOne(filter);
      res.send(result);
    });

    app.get("/payoneerEmail", async (req, res) => {
      const result = await payoneerEmailCollection.find().toArray();
      res.send(result);
    });

    app.delete("/payoneerEmail/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await payoneerEmailCollection.deleteOne(filter);
      res.send(result);
    });

    ///////////////////////////////////////////////////////////////////////////
    //                         user data
    ///////////////////////////////////////////////////////////////////////////

    app.get("/users", async (req, res) => {
      const result = await usersInfocollection.find().toArray();
      res.send(result);
    });

    app.get("/usersSellery/:email", async (req, res) => {
      try {
          const email = req.params.email;
          const filter = email === "all" ? { role: "employee" } : { email }; // Adjust filter for "all"
  
          const users = email === "all"
              ? await usersInfocollection
                    .find(filter, { projection: { role: 1,name:1,photo:1, email: 1, _id: 1, monthlySpent: 1 } })
                    .toArray() // Use `.toArray()` for multiple users
              : await usersInfocollection.findOne(filter, {
                    projection: { role: 1, email: 1, _id: 1, monthlySpent: 1 },
                });
  
          if (!users || (Array.isArray(users) && users.length === 0)) {
              return res.status(404).json({ message: "No users found" });
          }
  
          res.status(200).json(users); // Return the data
      } catch (error) {
          console.error("Error fetching user data:", error);
          res.status(500).json({ message: "Internal Server Error" });
      }
  });
  
    app.get("/allEmployees", async (req, res) => {
      try {
          const users = await usersInfocollection.find({}, { projection: {role:1, email: 1, _id: 1, name: 1, photo:1, contactNumber:1 } }).toArray();
          res.send(users);
      } catch (error) {
          console.error("Error fetching ads accounts:", error);
          res.status(500).send({ message: "Internal Server Error" });
      }
  });

//   app.get("/myUser/spend/:email", async (req, res) => {
//     const email = req.params.email;
//     const filter = email === "all"
//         ? { role: 'employee', monthlySpent: { $exists: true, $ne: [] } }  // Only employees with
//         : { email: email, role: 'employee', monthlySpent: { $exists: true, $ne: [] } }; 

//     try {
//         const result = await usersInfocollection.find(filter).toArray();

//         if (result.length === 0) {
//             return res.status(404).send({ message: "No data found" });
//         }

//         const modifiedResult = result.map(user => {

//             const monthlySpent = user.monthlySpent || [];

//             if (monthlySpent.length === 0) {
//                 return null; 
//             }

//             return {
//                 email: user.email,
//                 employeeName:user.employeeName,
//                 role: user.role,
//                 monthlySpent: monthlySpent.map(spent => ({
//                     totalSpentt: spent.totalSpentt,
//                     role: spent.role,
//                     date: spent.date
//                 }))
//             };
//         }).filter(user => user !== null);  

//         res.send(modifiedResult);  
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).send({ message: "Error fetching data" });
//     }
// });



app.get("/myUser/spend/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all" ? {} : { email: email };  

  try {
      const result = await usersInfocollection.find(filter).toArray();

      res.send(result);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
  }
});




app.get("/myUser/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all"
    ? { role: 'employee', monthlySpent: { $exists: true, $ne: [] } }
    : { email: email, role: 'employee', monthlySpent: { $exists: true, $ne: [] } };

  try {
    const myUser = await usersInfocollection
      .find(filter, {
        projection: {
          monthlySpent: 1,
          email: 1,
          name: 1,
          photo: 1
        }
      })
      .toArray();

    // Initialize the response object
    const aggregatedData = {
      totalSpentMeta: {},
      totalSpentPage: {},
      totalSpentGoogle: {}
    };

    // Aggregate data by month
    myUser.forEach(user => {
      (user?.monthlySpent || []).forEach(spent => {
        const monthName = new Date(spent.date).toLocaleString('default', { month: 'long' });

        if (spent.role === 'metaSpend') {
          aggregatedData.totalSpentMeta[monthName] = 
            (aggregatedData.totalSpentMeta[monthName] || 0) + spent.totalSpentt;
        }

        if (spent.role === 'googleSpend') {
          aggregatedData.totalSpentGoogle[monthName] = 
            (aggregatedData.totalSpentGoogle[monthName] || 0) + spent.totalSpentt;
        }
        if (spent.role === 'pageSpend') {
          aggregatedData.totalSpentPage[monthName] = 
            (aggregatedData.totalSpentPage[monthName] || 0) + spent.totalSpentt;
        }
      });
    });

    res.send(aggregatedData);

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ message: "Error fetching data" });
  }
});


app.get("/myUser/runningMonth/spent/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all"
    ? { role: 'employee', monthlySpent: { $exists: true, $ne: [] } }
    : { email: email, role: 'employee', monthlySpent: { $exists: true, $ne: [] } };

  // Get the current month (0-based, so 0 is January)
  const currentMonth = new Date().getMonth();

  try {
    const myUser = await usersInfocollection
      .find(filter, {
        projection: {
          monthlySpent: 1,
          email: 1,
          name: 1,
          photo: 1
        }
      })
      .toArray();

    // Initialize an array to store the results
    const results = [];

    // Aggregate data by current month for each user
    myUser.forEach(user => {
      let totalSpentMeta = 0;
      let totalSpentGoogle = 0;

      // Check if monthlySpent exists for the user
      (user?.monthlySpent || []).forEach(spent => {
        const spentMonth = new Date(spent.date).getMonth();

        // If the spent data is from the current month
        if (spentMonth === currentMonth) {
          if (spent.role === 'metaSpend') {
            totalSpentMeta += spent.totalSpentt;
          }

          if (spent.role === 'googleSpend') {
            totalSpentGoogle += spent.totalSpentt;
          }
        }
      });

      // Only add user data if there's spend data for the current month
      if (totalSpentMeta || totalSpentGoogle) {
        results.push({
          name: user.name,
          email: user.email,
          photo: user.photo,
          totalSpentMeta,
          totalSpentGoogle
        });
      }
    });

    res.send(results);

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ message: "Error fetching data" });
  }
});



app.get("/myUser/totalSpent/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all" ? {} : { email: email };

  try {
    const user = await usersInfocollection.findOne(filter);

    if (user && user.monthlySpent) {
      // Aggregate totalSpentt from monthlySpent
      const totalSpent = user.monthlySpent.reduce((sum, record) => sum + (record.totalSpentt || 0), 0);
      return res.send({ totalSpent }); // Send only the aggregated totalSpentt
    }

    res.send({ totalSpent: 0 }); // Return 0 if no data exists
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ message: "Error fetching data" });
  }
});






// const result = await usersInfocollection.find(filter).toArray();

//         const modifiedResult = result.map(user => {
//             return {
//                 _id: user._id,
//                 email: user.email,
//                 date: user.date,
//                 role: user.role,
//                 monthlySpent: user.monthlySpent.map(spent => ({
//                     totalSpentt: spent.totalSpentt,
//                     role: spent.role,
//                     date: spent.date
//                 }))
//             };
//         });

//         res.send(modifiedResult);

    app.get("/userr/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email : email };
      try {
          const result = await usersInfocollection.findOne(filter);
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
  });

    app.get("/userr2/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email : email };
      try {
          const result = await usersInfocollection.findOne(filter);
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
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
      const { accountName, date } = monthlySpent;
    
      try {
        console.log("Incoming data:", req.body);
    
        const query = { email };
        const existingUser = await usersInfocollection.findOne(query);
    
        if (existingUser) {
          console.log("Existing user found:", existingUser);
    
          const month = new Date(date).getMonth();
          const year = new Date(date).getFullYear();
    
          await usersInfocollection.updateOne(query, {
            $pull: {
              monthlySpent: {
                accountName,
                date: { $regex: `^${year}-${String(month + 1).padStart(2, "0")}` }
              }
            }
          });
    
          await usersInfocollection.updateOne(query, {
            $push: {
              monthlySpent: { $each: [monthlySpent], $position: 0 }
            }
          });
    
          res.send({ message: "User updated with new monthlySpent data successfully" });
        } else {
          console.log("No existing user. Creating a new user.");
          const newUser = { email, monthlySpent: [monthlySpent] };
          await usersInfocollection.insertOne(newUser);
          res.send({ message: "User created with monthlySpent data successfully" });
        }
      } catch (error) {
        console.error("Error in /users/update:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.post("/users/update2", async (req, res) => {
      const { email, monthlySpent2 } = req.body;
      const { accountName, date } = monthlySpent2;
    
      try {
        console.log("Incoming data:", req.body);
    
        const query = { email };
        const existingUser = await usersInfocollection.findOne(query);
    
        if (existingUser) {
          console.log("Existing user found:", existingUser);
    
          const month = new Date(date).getMonth();
          const year = new Date(date).getFullYear();
    
          await usersInfocollection.updateOne(query, {
            $pull: {
              monthlySpent2: {
                accountName,
                date: { $regex: `^${year}-${String(month + 1).padStart(2, "0")}` }
              }
            }
          });
    
          await usersInfocollection.updateOne(query, {
            $push: {
              monthlySpent2: { $each: [monthlySpent2], $position: 0 }
            }
          });
    
          res.send({ message: "User updated with new monthlySpent data successfully" });
        } else {
          console.log("No existing user. Creating a new user.");
          const newUser = { email, monthlySpent2: [monthlySpent2] };
          await usersInfocollection.insertOne(newUser);
          res.send({ message: "User created with monthlySpent data successfully" });
        }
      } catch (error) {
        console.error("Error in /users/update:", error);
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

    


    app.patch("/users-photo/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const body = req.body;
    
      const updatedDoc = {
        $set: {
          photo: body.photo || undefined,
        },
      };
    
      try {
        const result = await usersInfocollection.updateOne(filter, updatedDoc);
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
    
      const updatedDoc = {
        $set: {
          name: body.name || undefined,
          companyLogo: body.companyLogo || undefined,
          companyName: body.companyName || undefined,
          contactNumber: body.contactNumber || undefined,
          fatherName: body.fatherName || undefined,
          motherName: body.motherName || undefined,
          guardianMobile: body.guardianMobile || undefined,
          nationality: body.nationality || undefined,
          NID: body.NID || undefined,
          birthRegId: body.birthRegId || undefined,
          blood: body.blood || undefined,
          dateOfBirth: body.dateOfBirth || undefined,
          religion: body.religion || undefined,
          gender: body.gender || undefined,
          maritalStatus: body.maritalStatus || undefined,
          skill: body.skill || undefined,
          selectedDivision: body.selectedDivision || undefined,
          selectedDistrict: body.selectedDistrict || undefined,
          selectedUpazila: body.selectedUpazila || undefined,
          presentAddress: body.presentAddress || undefined,
          selectedDivision2: body.selectedDivision2 || undefined,
          selectedDistrict2: body.selectedDistrict2 || undefined,
          selectedUpazila2: body.selectedUpazila2 || undefined,
          permanentAddress: body.permanentAddress || undefined,
          facebookID: body.facebookID || undefined,
          instagramID: body.instagramID || undefined,
          linkedinID: body.linkedinID || undefined,
          twitterID: body.twitterID || undefined,
          youtubeID: body.youtubeID || undefined,
          whatsappID: body.whatsappID || undefined,
          bkashPersonal: body.bkashPersonal || undefined,
          occupation: body.occupation || undefined,
          lastEducationDegree: body.lastEducationDegree || undefined,
          lastEducationBoard: body.lastEducationBoard || undefined,
          lastEducationInstitute: body.lastEducationInstitute || undefined,
          groupName: body.groupName || undefined,
          yearOfPassing: body.yearOfPassing || undefined,
          status: body.status || undefined,
          gpaCgpa: body.gpaCgpa || undefined,
        },
      };
    
      try {
        const result = await usersInfocollection.updateOne(filter, updatedDoc);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error updating user");
      }
    });
    

    app.get("/userr3/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const projection = {
        selectedDivision: 1,
        selectedDistrict: 1,
        selectedUpazila: 1,
        presentAddress: 1,
        selectedDivision2: 1,
        selectedDistrict2: 1,
        selectedUpazila2: 1,
        permanentAddress: 1,
        facebookID: 1,
        instagramID: 1,
        linkedinID: 1,
        twitterID: 1,
        youtubeID: 1,
        whatsappID: 1,
        occupation: 1,
        lastEducationDegree: 1,
        lastEducationBoard: 1,
        lastEducationInstitute: 1,
        groupName: 1,
        yearOfPassing: 1,
        status: 1,
        gpaCgpa: 1,
        _id: 0, 
        fullName: 1,
        role:1,
        email:1,
        photo:1,
        name:1,
        companyLogo: 1,
        companyName: 1,
        contactNumber: 1,
        fatherName: 1,
        motherName: 1,
        guardianMobile: 1,
        nationality: 1,
        NID: 1,
        birthRegId: 1,
        blood: 1,
        dateOfBirth: 1,
        religion: 1,
        gender: 1,
        maritalStatus: 1,
        edu: 1,
        skill:1
      };
    
      try {
        const result = await usersInfocollection.findOne(filter, { projection });
        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ message: "Error fetching data" });
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
    //                         noti 
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
    //                         noti 
    ////////////////////////////////////////////////////////////////////
    app.post("/editNotification", async (req, res) => {
      const filter = req.body;
      const result = await editNotificationcollection.insertOne(filter);
      res.send(result);
    });

    app.get("/editNotification/:email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await editNotificationcollection.find(query).toArray();
      res.send(result);
    });

    app.get("/editNotification", async (req, res) => {
      const result = await editNotificationcollection.find().toArray();
      res.send(result);
    });

    app.patch("/editNotification/:id", async (req, res) => {
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
        const result = await editNotificationcollection.updateOne(filter, updateData);
    
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
    ///////////////////////////////////////////////////////////////////


    app.post('/bankInfo', async (req, res) => {
      try {
        const bankData = req.body;
        const result = await bankInfocollection.insertOne(bankData);
        res.status(201).send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to insert bank info', details: err });
      }
    });
    


    app.patch("/bankInfo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          account: body.account,
          bankName: body.bankName,
          bankingType: body.bankingType,
          branch: body.branch,
          card: body.card,
          district: body.district,
          imageUrl: body.imageUrl,  
          name: body.name,
          routingNumber: body.routingNumber,
          swiftCode: body.swiftCode,
        },
      };

      const result = await pageSetupCollection.updateOne(filter, updatenew);
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


    
       app.delete("/bankInfo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await bankInfocollection.deleteOne(filter);
      res.send(result);
    });
    
    ////////////////////////
    app.post("/activity", async (req, res) => {
      const filter = req.body;
      const result = await activityCollection.insertOne(filter);
      res.send(result);
    });


    app.get("/activity", async (req, res) => {
      try {
        const result = await activityCollection
          .find() // Find all documents
          .sort({ date: -1 }) // Sort by date in descending order (latest first)
          .limit(100) // Limit the result to the latest 100 entries
          .toArray(); // Convert the result to an array
    
        res.send(result); // Send the result as a response
      } catch (error) {
        console.error("Error fetching activity data:", error);
        res.status(500).send("Internal Server Error"); // Handle errors
      }
    });

    app.get("/myActivity/:email", async (req, res) => {
      const email = req.params.email;
    
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }
    
      const filter = { email: email };
    
      try {
        const result = await activityCollection.find(filter).toArray(); // Ensure collection is correct
        res.send(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ message: "Error fetching data" });
      }
    });
    
  
     ///////////////////////////////////////////////////////////////////
    //                         campaign
    ////////////////////////////////////////////////////////////////////
    app.post("/pageSetup", async (req, res) => {
      const filter = req.body;
      const result = await pageSetupCollection.insertOne(filter);
      res.send(result);
    });


    app.get("/pageSetup", async (req, res) => {
      const result = await pageSetupCollection.find().toArray();
      res.send(result);
    });

    app.get("/pageSetup/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await pageSetupCollection.findOne(filter);
      res.send(result);
    });

    app.get("/pageSetup/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { clientEmail: email };
      try {
          const result = await pageSetupCollection.find(filter).toArray();
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
  });

    app.get("/mypageSetup/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      try {
          const result = await pageSetupCollection.find(filter).toArray();
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
  });
  

    app.get("/pageSetup/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await pageSetupCollection.findOne(filter);
      res.send(result);
    });

    app.delete("/pageSetup/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await pageSetupCollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/pageSetup/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          itemName: body.itemName,
          totalBill: body.totalBill,
          totalPaid: body.totalPaid,
        },
      };

      const result = await pageSetupCollection.updateOne(filter, updatenew);
      res.send(result);
    });

    app.patch("/pageSetup/status/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          status: body.status,
        },
      };
      const result = await pageSetupCollection.updateOne(filter, updatenew);
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

    ////////////////////////////////////////////////////////
    //                 client
    ////////////////////////////////////////////////////////

    app.post("/clients", async (req, res) => {
      const filter = req.body;
      const result = await clientCollection.insertOne(filter);
      res.send(result);
    });
    
    app.get("/clients", async (req, res) => {
      const result = await clientCollection.find().toArray();
      res.send(result);
    });



    app.get("/clients/homePage", async (req, res) => {
      try {
        await client.connect();
    
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));  // Reset time to midnight for today
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());  // Start of the current week (Sunday)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);  // Start of the current month
    
        const payments = await clientCollection.aggregate([
          { $unwind: "$payments" },
          { $project: { paymentDate: { $toDate: "$payments.date" }, amount: "$payments.amount" } },
          {
            $group: {
              _id: null,
              todayTotal: {
                $sum: {
                  $cond: [{ $gte: ["$paymentDate", startOfToday] }, "$amount", 0]
                }
              },
              weeklyTotal: {
                $sum: {
                  $cond: [{ $gte: ["$paymentDate", startOfWeek] }, "$amount", 0]
                }
              },
              monthlyTotal: {
                $sum: {
                  $cond: [{ $gte: ["$paymentDate", startOfMonth] }, "$amount", 0]
                }
              }
            }
          }
        ]).toArray();
    
        // Fetch campaign spends and campaign counts
        const campaignSpends = await clientCollection.aggregate([
          { $unwind: "$campaings" },
          { $project: { campaignDate: { $toDate: "$campaings.date" }, tSpent: "$campaings.tSpent" } },
          {
            $group: {
              _id: null,
              todaySpend: {
                $sum: {
                  $cond: [{ $gte: ["$campaignDate", startOfToday] }, { $toDouble: "$tSpent" }, 0]
                }
              },
              weeklySpend: {
                $sum: {
                  $cond: [{ $gte: ["$campaignDate", startOfWeek] }, { $toDouble: "$tSpent" }, 0]
                }
              },
              monthlySpend: {
                $sum: {
                  $cond: [{ $gte: ["$campaignDate", startOfMonth] }, { $toDouble: "$tSpent" }, 0]
                }
              },
              todayCampaigns: {
                $sum: {
                  $cond: [{ $gte: ["$campaignDate", startOfToday] }, 1, 0]
                }
              },
              weeklyCampaigns: {
                $sum: {
                  $cond: [{ $gte: ["$campaignDate", startOfWeek] }, 1, 0]
                }
              },
              monthlyCampaigns: {
                $sum: {
                  $cond: [{ $gte: ["$campaignDate", startOfMonth] }, 1, 0]
                }
              }
            }
          }
        ]).toArray();
    
        // Fetch client counts by creation date
        const clientCounts = await clientCollection.aggregate([
          {
            $project: {
              createdAt: { $toDate: "$date" }  // Assuming you have a `createdAt` field
            }
          },
          {
            $group: {
              _id: null,
              todayClients: {
                $sum: {
                  $cond: [{ $gte: ["$createdAt", startOfToday] }, 1, 0]
                }
              },
              weeklyClients: {
                $sum: {
                  $cond: [{ $gte: ["$createdAt", startOfWeek] }, 1, 0]
                }
              },
              monthlyClients: {
                $sum: {
                  $cond: [{ $gte: ["$createdAt", startOfMonth] }, 1, 0]
                }
              }
            }
          }
        ]).toArray();

        const adminPayments = await adminPaymentCollection.aggregate([
          {
            $project: { paymentDate: { $toDate: "$date" }, payAmount: { $toDouble: "$payAmount" } }
          },
          {
            $group: {
              _id: null,
              todayAdminPay: {
                $sum: {
                  $cond: [{ $gte: ["$paymentDate", startOfToday] }, "$payAmount", 0]
                }
              },
              weeklyAdminPay: {
                $sum: {
                  $cond: [{ $gte: ["$paymentDate", startOfWeek] }, "$payAmount", 0]
                }
              },
              monthlyAdminPay: {
                $sum: {
                  $cond: [{ $gte: ["$paymentDate", startOfMonth] }, "$payAmount", 0]
                }
              }
            }
          }
        ]).toArray();
    
        // Merge both payment, campaign, and client results
        const result = {
          today: payments[0]?.todayTotal || 0,
          thisWeek: payments[0]?.weeklyTotal || 0,
          thisMonth: payments[0]?.monthlyTotal || 0,
          todaySpend: campaignSpends[0]?.todaySpend || 0,
          thisWeekSpend: campaignSpends[0]?.weeklySpend || 0,
          thisMonthSpend: campaignSpends[0]?.monthlySpend || 0,
          todayCampaigns: campaignSpends[0]?.todayCampaigns || 0,
          thisWeekCampaigns: campaignSpends[0]?.weeklyCampaigns || 0,
          thisMonthCampaigns: campaignSpends[0]?.monthlyCampaigns || 0,
          todayClients: clientCounts[0]?.todayClients || 0,
          thisWeekClients: clientCounts[0]?.weeklyClients || 0,
          thisMonthClients: clientCounts[0]?.monthlyClients || 0,
          todayAdminPay: adminPayments[0]?.todayAdminPay || 0,
          thisWeekAdminPay: adminPayments[0]?.weeklyAdminPay || 0,
          thisMonthAdminPay: adminPayments[0]?.monthlyAdminPay || 0
        };
    
        res.status(200).json(result);
    
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
      } finally {
        await client.close();
      }
    });
    
    
    
    

    
    
    

    app.get("/onlyClientEmail", async (req, res) => {
      
      try {
          const result = await clientCollection.find({}, { projection: { clientEmail: 1,employeeEmail: 1, _id: 0 } }).toArray();
          res.send(result);
      } catch (error) {
          res.status(500).send({ error: "Failed to fetch clients' emails" });
      }
  });


app.get("/clientEmails/:email", async (req, res) => {
  const email = req.params.email;

  // If "all" is passed, return all clients
  const filter = email === "all" ? {} : { employeeEmail: email };

  try {
      const result = await clientCollection.find(filter, { projection: {date:1, clientEmail: 1, employeeEmail: 1, _id: 0 } })
      .toArray();
      res.send(result);
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
  }
 });

  app.get("/clientsPaymentss/:email", async (req, res) => {
    const { email } = req.params; // Extract 'email' from URL params
    const filter = email === "all" ? {} : { employeeEmail: email }; 

    try {
        const users = await clientCollection
            .find(filter, { projection: { payments: 1, email: 1, date: 1 } })
            .toArray();
        res.send(users);
    } catch (error) {
        console.error("Error fetching client payments:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


app.get("/clientsCampaingss/:email", async (req, res) => {
  const { email } = req.params; // Extract 'email' from URL params
  const filter = email === "all" ? {} : { employeeEmail: email }; // Apply filter based on 'email'

  try {
      // Query for users based on filter, projecting only the `campaings` field
      const users = await clientCollection
          .find(filter, { projection: { campaings: 1, _id: 0 } })
          .toArray();

      // Combine all campaigns into a single array
      const allCampaigns = users.flatMap(user => user.campaings || []);

      if (allCampaigns.length > 0) {
          res.send(allCampaigns); // Send only the campaigns data
      } else {
          res.status(404).send({ message: "No campaigns found" }); // No data found
      }

  } catch (error) {
      console.error("Error fetching client campaigns:", error);
      res.status(500).send({ message: "Internal Server Error" });
  }
});


app.get("/clientsPageService/:role", async (req, res) => {
    const role = req.params.role;

    try {
        // Fetch all documents from the clientCollection
        const users = await clientCollection
            .find({}, { projection: { pageService: 1, _id: 0 } })
            .toArray();

        // Filter the pageService array by the given role
        const filteredPageServices = users.flatMap(user => 
            (user.pageService || []).filter(service => service.role === role)
        );

        if (filteredPageServices.length > 0) {
            res.send(filteredPageServices); // Send only the filtered pageService data
        } else {
            res.status(404).send({ message: "No page service data found for the specified role" });
        }
    } catch (error) {
        console.error("Error fetching page service data:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});






    app.delete("/clients/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await clientCollection.deleteOne(filter);
      res.send(result);
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
          clientEmail: body.clientEmail,  
        },
      };
  
      const result = await clientCollection.updateOne(filter, updateDoc);
      res.send(result);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).send({ message: "Failed to update client", error });
    }
     });



     app.get("/myclients/:email", async (req, res) => {
      const email = req.params.email;
  
      // If "all" is passed, return all clients
      const filter = email === "all" ? {} : { employeeEmail: email };
  
      try {
          const result = await clientCollection.find(filter).toArray();
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
     });


     app.get("/myclients/total/:email", async (req, res) => {
      const email = req.params.email;
      const month = req.query.month && req.query.month !== "all" ? parseInt(req.query.month) : 0;
    
      // Define filter condition for email
      const filter = email === "all" ? {} : { employeeEmail: email };
    
      // Apply month filter if provided
      if (month > 0) {
        filter.$expr = { $eq: [{ $month: { $dateFromString: { dateString: "$date" } } }, month] };
      }
    
      try {
        const clients = await clientCollection.find(filter).toArray();
    
        // Aggregating totals by payment method
        const paymentData = clients.flatMap(client => client.payments || []);
        const paymentData2 = clients.flatMap(client => client.campaings || []);
    
        const result = {
          spendTotal: paymentData2.reduce((acc, p) => acc + parseFloat(p.tSpent || 0), 0),
          spendBill: paymentData2.reduce(
            (acc, campaign) => acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
            0
          ),
          bkashMarchent: paymentData.filter(p => p.paymentMethod === 'bkashMarchent')
            .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
          bkashPersonal: paymentData.filter(p => p.paymentMethod === 'bkashPersonal')
            .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
          nagadPersonal: paymentData.filter(p => p.paymentMethod === 'nagadPersonal')
            .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
          rocketPersonal: paymentData.filter(p => p.paymentMethod === 'rocketPersonal')
            .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
          IBBLBank: paymentData.filter(p => p.paymentMethod === 'IBBLBank')
            .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
          bank: paymentData.filter(p => p.paymentMethod === 'bank')
            .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
          DBBLBank: paymentData.filter(p => p.paymentMethod === 'DBBLBank')
            .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
          total: paymentData.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0)
        };
    
        res.json(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data" });
      }
    });
    

    app.get("/myclients/total/monthly/:email", async (req, res) => {
      const email = req.params.email;
  
      // Define filter condition for email
      const filter = email === "all" ? {} : { employeeEmail: email };
  
      try {
          const clients = await clientCollection.find(filter).toArray();
  
          // Extract all payments
          const paymentData = clients.flatMap(client => client.payments || []);
  
          // Aggregate payments by month
          const paymentByMonth = paymentData.reduce((acc, payment) => {
              if (payment && payment.date) {
                  const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
                  acc[month] = (acc[month] || 0) + (parseFloat(payment.amount) || 0);
              }
              return acc;
          }, {});
  
          // Send the aggregated result
          res.json(paymentByMonth);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).json({ message: "Error fetching data" });
      }
  });
  
    
    


  //   app.get("/myclients/:email", async (req, res) => {
  //     const email = req.params.email;
  
  //     // Set the filter based on the email
  //     const filter = email === "all" ? {} : { employeeEmail: email };
  
  //     try {
  //         // Fetch users with projection
  //         const users = await clientCollection
  //             .find(filter, { projection: { ids:1, id:1, clientName: 1, _id: 1, date: 1, employeeEmail: 1,campaings:1,pageService:1, payments: 1 } })
  //             .toArray();
  
  //         const transformedUsers = users.map(user => ({
  //             _id: user._id,
  //             id: user.id,
  //             clientName: user.clientName,
  //             date: user.date,
  //             employeeEmail: user.employeeEmail,
  //             payments: user.payments?.map(payment => ({
  //                 amount: payment.amount,
  //                 id: payment.id,
  //                 ids: payment.ids,
  //                 date:payment.date
  //             })) || [],
  //             campaings: user.campaings?.map(payment => ({
  //                 tSpent: payment.tSpent,
  //                 status: payment.status,
  //                 dollerRate: payment.dollerRate,
  //                 tBudged: payment.tBudged,
  //                 date:payment.date
  //             })) || [],
  //             pageService: user.pageService?.map(payment => ({
  //                 totalBill: payment.totalBill,
  //                 status: payment.status,
  //                 date:payment.date,
  //             })) || []
  //         }));
  
  //         res.send(transformedUsers);
  //     } catch (error) {
  //         console.error("Error fetching clients:", error);
  //         res.status(500).send({ message: "Internal Server Error" });
  //     }
  // });
  
  

    app.get("/myclients/:email", async (req, res) => {
      const email = req.params.email;
  
      // If "all" is passed, set the filter to an empty object to fetch all clients
      const filter = email === "all" ? {} : { employeeEmail: email };
  
      try {
          // Fetch data from the database
          const result = await clientCollection.find(filter).toArray();
  
          // Check if results are empty and handle accordingly
          if (!result || result.length === 0) {
              return res.status(404).send({ message: "No data found" });
          }
  
          // Transform the result to include only specific fields
          const transformedResult = result.map(client => ({
              _id: client._id,
              clientName: client.clientName,
              id: client.id,
              date: client.date,
              employeeEmail: client.employeeEmail,
              campaings: client.campaings || [],
              pageService: client.pageService || [],
              payments: client.payments?.map(payment => ({
                  amount: payment.amount,
                  id: payment.id,
                  ids: payment.ids
              })) || []
          }));
  
          res.send(transformedResult);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
  });



  app.get("/myclients/total/:email", async (req, res) => {
    const email = req.params.email;
  
    // Set filter based on the email parameter
    const filter = email === "all" ? {} : { employeeEmail: email };
  
    try {
      // Fetch data from the database
      const clients = await clientCollection.find(filter).toArray();
  
      if (!clients || clients.length === 0) {
        return res.status(404).send({ message: "No data found" });
      }
  
      // Calculate total values
      const totalSpent = clients.reduce((acc, client) => {
        return acc + (client.campaings || []).reduce((sum, c) => sum + parseFloat(c?.tSpent || 0), 0);
      }, 0);
  
      const totalBill = clients.reduce((acc, client) => {
        const campaignTotal = (client.campaings || []).reduce((sum, c) => {
          const tSpent = parseFloat(c?.tSpent || 0);
          const dollerRate = parseFloat(c?.dollerRate || 0);
          return sum + tSpent * dollerRate;
        }, 0);
  
        const pageServiceTotal = (client.pageService || []).reduce((sum, service) => {
          return sum + parseFloat(service?.totalBill || 0);
        }, 0);
  
        return acc + campaignTotal + pageServiceTotal;
      }, 0);
  
      const totalPaid = clients.reduce((acc, client) => {
        return acc + (client.payments || []).reduce((sum, p) => sum + parseFloat(p?.amount || 0), 0);
      }, 0);
  
      const totalAdvanced = clients.reduce((acc, client) => {
        const clientTotalBill = (client.campaings || []).reduce((sum, c) => {
          const tSpent = parseFloat(c?.tSpent || 0);
          const dollerRate = parseFloat(c?.dollerRate || 0);
          return sum + tSpent * dollerRate;
        }, 0) + 
        (client.pageService || []).reduce((sum, service) => {
          return sum + parseFloat(service?.totalBill || 0);
        }, 0);
  
        const clientTotalPaid = (client.payments || []).reduce((sum, p) => sum + parseFloat(p?.amount || 0), 0);
  
        return acc + (clientTotalPaid > clientTotalBill ? clientTotalPaid - clientTotalBill : 0);
      }, 0);
  
      // Send only the total values
      res.send({
        totalSpent: totalSpent.toFixed(2),
        totalBill: totalBill.toFixed(2),
        totalPaid: totalPaid.toFixed(2),
        totalAdvanced: totalAdvanced.toFixed(2)
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
    }
  });
  


  // app.get("/client/:email", async (req, res) => {
  //   const email = req.params.email ;
  //   const page = parseInt(req.query.page) || 1 ;
  //   const limit = parseInt(req.query.limit) || 40 ;
  
  //   const filter = email === "all" ? {} : { employeeEmail: email };
  
  //   try {

  //     const totalItems = await clientCollection.countDocuments(filter);
  
  //     const result = await clientCollection
  //       .find(filter)
  //       .sort({ clientName: 1 }) 
  //       .skip((page - 1) * limit)
  //       .limit(limit)
  //       .toArray();
  
  //     if (!result || result.length === 0) {
  //       return res.status(404).send({ message: "No data found" });
  //     }
  
  //     // Transform the result to include only specific fields
  //     const transformedResult = result.map((client) => ({
  //       _id: client._id,
  //       clientName: client.clientName,
  //       clientPhone:client.clientPhone,
  //       id: client.id,
  //       date: client.date,
  //       employeeEmail: client.employeeEmail,
  //       campaings: client.campaings || [],
  //       pageService: client.pageService || [],
  //       payments: client.payments || []
  //     }));
  
  //     res.send({
  //       data: transformedResult,
  //       totalItems,
  //       totalPages: Math.ceil(totalItems / limit),
  //       currentPage: page,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     res.status(500).send({ message: "Error fetching data" });
  //   }
  // });




  app.get("/client/:email", async (req, res) => {
    const email = req.params.email;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
  
    const filter = email === "all" ? {} : { employeeEmail: email };
  
    try {
      const totalItems = await clientCollection.countDocuments(filter);
  
      const result = await clientCollection
        .find(filter)
        .sort({ clientName: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
  
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No data found" });
      }
  
      // Transform the result to include calculated fields
      const transformedResult = result.map((client) => {
        // Calculate total budget from campaigns
        const totalBudget = (client.campaings || []).reduce(
          (acc, { tBudged = 0 }) => acc + parseFloat(tBudged || 0),
          0
        );
  
        // Calculate total spent from campaigns
        const totalSpent = (client.campaings || []).reduce(
          (acc, { tSpent = 0}) =>
            acc + parseFloat(tSpent || 0),
          0
        );
  
        const campaignTotal = (client.campaings || []).reduce(
          (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
          0
        );
  
        // Calculate total from page service
        const pageServiceTotal = (client.pageService || []).reduce(
          (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
          0
        );
  
        // Final totalBill calculation matching frontend logic
        const totalBill = parseFloat((campaignTotal + pageServiceTotal).toFixed(2));
        
  
        // Calculate total payment received
        const paymentReceived = (client.payments || []).reduce(
          (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
          0
        );
  
        // Calculate total (totalSpent + totalBill - paymentReceived)
        const total =  totalBill - paymentReceived;
  
        return {
          _id: client._id,
          clientName: client.clientName,
          clientPhone: client.clientPhone,
          id: client.id,
          date: client.date,
          employeeEmail: client.employeeEmail,
          campaings: client.campaings || [],
          pageService: client.pageService || [],
          payments: client.payments || [],
          totalBudget,
          totalSpent,
          totalBill,
          paymentReceived,
          total,
        };
      });
  
      res.send({
        data: transformedResult,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
    }
  });


  app.get("/client/payments/:email", async (req, res) => {
    const email = req.params.email;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
  
    const filter = email === "all" ? {} : { "payments.employeeEmail": email };
    const queryFilters = [];
  
    if (month) {
      queryFilters.push({
        $expr: {
          $eq: [{ $month: { $toDate: "$payments.date" } }, month],
        },
      });
    }
  
    if (year) {
      queryFilters.push({
        $expr: {
          $eq: [{ $year: { $toDate: "$payments.date" } }, year],
        },
      });
    }
  
    try {
      const result = await clientCollection.aggregate([
        { $match: filter },
        { $unwind: "$payments" },
        { $match: { $and: queryFilters } },
        { $sort: { "payments.date": -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $project: {
            "payments.amount": 1,
            "payments.clientEmail": 1,
            "payments.clientName": 1,
            "payments.date": 1,
            "payments.employeeEmail": 1,
            "payments.id": 1,
            "payments.note": 1,
            "payments.paymentMethod": 1,
            _id: 0,
          },
        },
      ]).toArray();
  
      const formattedResult = result.map((item) => item.payments);
  
      // Count total items
      const totalItemsResult = await clientCollection.aggregate([
        { $match: filter },
        { $unwind: "$payments" },
        { $match: { $and: queryFilters } },
        { $count: "totalItems" },
      ]).toArray();
  
      const totalItems = totalItemsResult.length > 0 ? totalItemsResult[0].totalItems : 0;
  
      res.send({
        data: formattedResult,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
    }
  });
  
  




  app.get("/client/campaigns/:email", async (req, res) => {
    const email = req.params.email;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const month = parseInt(req.query.month); // Parse the month from the query params
    const year = parseInt(req.query.year); // Parse the year from the query params
    const status = req.query.status || ""; // Parse status from query params
    const role = req.query.role || ""; // Parse role from query params
  
    // Create initial filter based on email
    const filter = email === "all" ? {} : { "campaings.email": email };
  
    // Create query filters array
    const queryFilters = [];
  
    // Apply month filter if provided
    if (month) {
      queryFilters.push({
        $expr: {
          $eq: [
            { $month: { $dateFromString: { dateString: "$campaings.date" } } },
            month,
          ],
        },
      });
    }
  
    // Apply year filter if provided
    if (year) {
      queryFilters.push({
        $expr: {
          $eq: [
            { $year: { $dateFromString: { dateString: "$campaings.date" } } },
            year,
          ],
        },
      });
    }
  
    // Apply status filter if provided
    if (status && status !== "all") {
      queryFilters.push({ "campaings.status": status });
    }
  
    // Create role filter if provided
    if (role) {
      queryFilters.push({ "campaings.role": role });
    }
  
    try {
      const result = await clientCollection.aggregate([
        { $match: filter },
        { $unwind: "$campaings" },
        { $match: { $and: queryFilters } }, // Apply all filters using $and
        { $sort: { "campaings.date": -1 } }, // Sort by latest date (descending)
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $project: {
            adsAccount: "$campaings.adsAccount",
            campaignName: "$campaings.campaignName",
            clientEmail: "$campaings.clientEmail",
            clientName: "$clientName",
            date: "$campaings.date",
            dollerRate: "$campaings.dollerRate",
            email: "$campaings.email",
            id: "$id",
            ids: "$campaings.ids",
            pageName: "$campaings.pageName",
            pageUrl: "$campaings.pageUrl",
            role: "$campaings.role",
            status: "$campaings.status",
            tBudged: "$campaings.tBudged",
            tSpent: "$campaings.tSpent",
            _id: "$_id",
          },
        },
      ]).toArray();
  
      // Count total items after filtering
      const totalItems = await clientCollection.aggregate([
        { $match: filter },
        { $unwind: "$campaings" },
        { $match: { $and: queryFilters } },
        { $count: "totalItems" },
      ]).toArray();
  
      const totalCampaigns = totalItems.length > 0 ? totalItems[0].totalItems : 0;
  
      res.send({
        data: result,
        totalItems: totalCampaigns,
        totalPages: Math.ceil(totalCampaigns / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
    }
  });
  
  


  
  
  
  

     app.get("/findClients/:id", async (req, res) => {
    const id = req.params.id; // Use id from the URL parameter
    try {
        const filter = { id: id }; // Filter by `id`
        const result = await clientCollection.findOne(filter);

        if (!result) {
            return res.status(404).send({ message: "Client not found" });
        }

        res.send(result); // Send the complete result including `payments` and `campaings`
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
     });

      app.post("/clients/payments", async (req, res) => {
      const { id, payments } = req.body;
    
      try {
        // Query to find the client document
        const query = { id }; // Ensure the client `id` matches
    
        // Find the client document by its `id`
        const existingClient = await clientCollection.findOne(query);
    
        if (existingClient) {
          // Add the payment to the existing client's payments array
          const updateResult = await clientCollection.updateOne(query, {
            $push: {
              payments: {
                $each: [payments],
                $position: 0, // Add the payment at the beginning of the array
              },
            },
          });
    
          if (updateResult.modifiedCount > 0) {
            res.status(200).json({ message: "Payment added successfully" });
          } else {
            res.status(400).json({ message: "Failed to add payment" });
          }
        } else {
          // Client not found, return an error
          res.status(404).json({ message: "Client not found" });
        }
      } catch (error) {
        console.error("Error updating client payments:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
      });

      app.delete('/clientPayment/delete/:userId/:ids', async (req, res) => {
        const { userId, ids } = req.params;
      
        try {
            // Use the $pull operator to remove the specific campaign entry by `ids`
            const result = await clientCollection.updateOne(
                { id: userId }, 
                { $pull: { payments: { ids: parseInt(ids) } } } // Remove campaign with matching `ids`
            );
      
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Campaign not found or already deleted' });
            }
      
            res.status(200).json({ message: 'Campaign deleted successfully' });
        } catch (error) {
            console.error('Error deleting campaign:', error);
            res.status(500).json({ message: 'Server error' });
        }
      });

      app.post("/clients/campaings", async (req, res) => {
      const { id, campaings } = req.body;
    
      try {
        // Query to find the client document
        const query = { id }; // Match the `id` of the client
    
        // Find the client document
        const existingClient = await clientCollection.findOne(query);
    
        if (existingClient) {
          // Add the new campaign to the `campaings` array
          const updateResult = await clientCollection.updateOne(query, {
            $push: {
              campaings: {
                $each: [campaings], // Add the new campaign object
                $position: 0, // Insert at the beginning of the array
              },
            },
          });
    
          if (updateResult.modifiedCount > 0) {
            res.status(200).json({ message: "Campaign added successfully" });
          } else {
            res.status(400).json({ message: "Failed to add campaign" });
          }
        } else {
          res.status(404).json({ message: "Client not found" });
        }
      } catch (error) {
        console.error("Error updating client campaigns:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
      });

      app.put('/clientCampaings/:userId/:spentId', async (req, res) => {
      const { userId, spentId } = req.params;
      const { status } = req.body; // Extract the new status from the request body
  
      try {
          // Update the specific campaign's status using arrayFilters
          const result = await clientCollection.updateOne(
              {
                  id: userId, 
                  "campaings.ids": parseInt(spentId), 
              },
              {
                  $set: { "campaings.$.status": status }, // Update the status
              }
          );
  
          if (result.modifiedCount === 0) {
              return res.status(404).json({ message: 'User or campaign not found' });
          }
  
          res.status(200).json({ message: 'Campaign status updated successfully' });
      } catch (error) {
          console.error('Error updating campaign status:', error);
          res.status(500).json({ message: 'Server error' });
      }
      });

     app.delete('/clientCampaings/delete/:userId/:ids', async (req, res) => {
      const { userId, ids } = req.params;
  
      try {
          // Use the $pull operator to remove the specific campaign entry by `ids`
          const result = await clientCollection.updateOne(
              { id: userId }, 
              { $pull: { campaings: { ids: parseInt(ids) } } } // Remove campaign with matching `ids`
          );
  
          if (result.modifiedCount === 0) {
              return res.status(404).json({ message: 'Campaign not found or already deleted' });
          }
  
          res.status(200).json({ message: 'Campaign deleted successfully' });
      } catch (error) {
          console.error('Error deleting campaign:', error);
          res.status(500).json({ message: 'Server error' });
      }
      });

     app.patch('/clientPaymentsUp/updates/:userId/:ids', async (req, res) => {
        const { userId, ids } = req.params;
        const { note, amount, date, paymentMethod } = req.body;
    
        try {
            const result = await clientCollection.updateOne(
                { id: userId, "payments.ids": parseInt(ids) },
                {
                    $set: {
                        "payments.$.paymentMethod": paymentMethod,
                        "payments.$.amount": amount,
                        "payments.$.date": date,
                        "payments.$.note": note,
                    },
                }
            );
    
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Campaign not found or no changes made' });
            }
    
            res.status(200).json({ message: 'Campaign updated successfully' });
        } catch (error) {
            console.error('Error updating campaign:', error);
            res.status(500).json({ message: 'Server error' });
        }
      });

     app.patch('/clientCampaings/update/:userId/:ids', async (req, res) => {
        const { userId, ids } = req.params;
        const { tSpent, campaignName, dollerRate, tBudged } = req.body;
    
        try {
            const result = await clientCollection.updateOne(
                { id: userId, "campaings.ids": parseInt(ids) },
                {
                    $set: {
                        "campaings.$.tSpent": tSpent,
                        "campaings.$.campaignName": campaignName,
                        "campaings.$.dollerRate": dollerRate,
                        "campaings.$.tBudged": tBudged,
                    },
                }
            );
    
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Campaign not found or no changes made' });
            }
    
            res.status(200).json({ message: 'Campaign updated successfully' });
        } catch (error) {
            console.error('Error updating campaign:', error);
            res.status(500).json({ message: 'Server error' });
        }
      });

      app.post("/clients/pageService", async (req, res) => {
        const { id, pageService } = req.body;
      
        try {
          // Query to find the client document
          const query = { id }; // Match the `id` of the client
      
          // Find the client document
          const existingClient = await clientCollection.findOne(query);
      
          if (existingClient) {
            // Add the new campaign to the `campaings` array
            const updateResult = await clientCollection.updateOne(query, {
              $push: {
                pageService: {
                  $each: [pageService], // Add the new campaign object
                  $position: 0, // Insert at the beginning of the array
                },
              },
            });
      
            if (updateResult.modifiedCount > 0) {
              res.status(200).json({ message: "Campaign added successfully" });
            } else {
              res.status(400).json({ message: "Failed to add campaign" });
            }
          } else {
            res.status(404).json({ message: "Client not found" });
          }
        } catch (error) {
          console.error("Error updating client campaigns:", error);
          res.status(500).json({ message: "Internal server error", error: error.message });
        }
        });

     app.put('/clientPageService/:userId/:spentId', async (req, res) => {
        const { userId, spentId } = req.params;
        const { status } = req.body; // Extract the new status from the request body
    
        try {
            // Update the specific campaign's status using arrayFilters
            const result = await clientCollection.updateOne(
                {
                    id: userId, 
                    "pageService.ids": parseInt(spentId), 
                },
                {
                    $set: { "pageService.$.status": status }, // Update the status
                }
            );
    
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'User or campaign not found' });
            }
    
            res.status(200).json({ message: 'Campaign status updated successfully' });
        } catch (error) {
            console.error('Error updating campaign status:', error);
            res.status(500).json({ message: 'Server error' });
        }
      });

     app.delete('/clientPageService/delete/:userId/:ids', async (req, res) => {
      const { userId, ids } = req.params;
  
      try {
          // Use the $pull operator to remove the specific campaign entry by `ids`
          const result = await clientCollection.updateOne(
              { id: userId }, 
              { $pull: { pageService: { ids: parseInt(ids) } } } // Remove campaign with matching `ids`
          );
  
          if (result.modifiedCount === 0) {
              return res.status(404).json({ message: 'Campaign not found or already deleted' });
          }
  
          res.status(200).json({ message: 'Campaign deleted successfully' });
      } catch (error) {
          console.error('Error deleting campaign:', error);
          res.status(500).json({ message: 'Server error' });
      }
      });

     app.patch('/clientPageService/updates/:userId/:ids', async (req, res) => {
    const { userId, ids } = req.params;
    const { itemName, pageUrl, totalBill, role, pageName } = req.body; 

    try {
        // Use the $set operator to update the specific campaign by `ids`
        const result = await clientCollection.updateOne(
            { id: userId, "pageService.ids": parseInt(ids) },
            {
                $set: {
                  "pageService.$.itemName": itemName,
                 "pageService.$.pageUrl": pageUrl,
                "pageService.$.totalBill": totalBill,
                "pageService.$.role": role,
                "pageService.$.pageName": pageName,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Campaign not found or no changes made' });
        }

        res.status(200).json({ message: 'Campaign updated successfully' });
    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ message: 'Server error' });
    }
     });


  /////////////////////////////////////////////////
  // employee payment ////////////////////
  ////////////////////////////////////////////////

  app.post("/employeePayment", async (req, res) => {
    const filter = req.body;
    const result = await adminPaymentCollection.insertOne(filter);
    res.send(result);
  });
  

  app.get("/employeePayment", async (req, res) => {
    const result = await adminPaymentCollection.find().toArray();
    res.send(result);
  });

  
  app.get("/MyEmployeePayments/:email", async (req, res) => {
    const email = req.params.email;
    const filter = email === "all" ? {} : { employeeEmail: email };
    try {
        const result = await adminPaymentCollection.find(filter).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ message: "Error fetching data" });
    }
});






app.get("/adminPay/total/monthly/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all" ? {} : { employeeEmail: email };

  try {
    const result = await adminPaymentCollection.find(filter).toArray();

    // Filter and aggregate payments by month
    const paymentByMonth = result.filter(payment => payment.status === 'Approved')
      .reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount || 0);
        return acc;
      }, {});

    // Aggregate charges by month
    const paymentByMonthCharge = result.filter(payment => payment.status === 'Approved')
      .reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.charge || 0);
        return acc;
      }, {});

    // Return both aggregates as an object
    res.json({
      paymentByMonth,
      paymentByMonthCharge
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});



app.get("/adminPay/total/:email", async (req, res) => {
  const email = req.params.email;
  const paymentMethod = req.query.method;
  const status = req.query.status;
  const month = req.query.month && req.query.month !== "all" ? parseInt(req.query.month) : 0;

  // Build filters
  const filter = {};

  // Email filter
  if (email !== "all") filter.employeeEmail = email;

  // Payment method filter
  if (paymentMethod !== "all") filter.paymentMethod = paymentMethod;

  // Status filter
  if (status !== "all") filter.status = status;

  // Month filter
  if (month > 0) {
    filter.$expr = { $eq: [{ $month: { $dateFromString: { dateString: "$date" } } }, month] };
  }


  try {
    const result = await adminPaymentCollection.find(filter).toArray();

    // Define payment methods to calculate totals
    const paymentMethods = ['nagadPersonal', 'bkashPersonal', 'rocketPersonal', 'bank', 'IBBLBank', 'DBBLBank'];
    
    // Calculate totals
    const totals = paymentMethods.reduce((acc, method) => {
      // Sum 'payAmount' only for payments that match the method & are approved
      const totalForMethod = result
        .filter(payment => payment.paymentMethod === method )
        .reduce((sum, payment) => sum + parseFloat(payment.payAmount || 0), 0);

      acc[method] = totalForMethod;
      return acc;
    }, {});

    // Send back the calculated totals object
    res.send(totals);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ message: "Error fetching data" });
  }
});




app.get("/adminPay/:email", async (req, res) => {
  const email = req.params.email;
  const paymentMethod = req.query.method;
  const status = req.query.status;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const month = req.query.month && req.query.month !== "all" ? parseInt(req.query.month) : 0;

  // Build filters
  const filter = {};

  // Email filter
  if (email !== "all") filter.employeeEmail = email;

  // Payment method filter
  if (paymentMethod !== "all") filter.paymentMethod = paymentMethod;

  // Status filter
  if (status !== "all") filter.status = status;

  // Month filter
  if (month > 0) {
    filter.$expr = { $eq: [{ $month: { $dateFromString: { dateString: "$date" } } }, month] };
  }

  try {
    const totalItems = await adminPaymentCollection.countDocuments(filter);

    const result = await adminPaymentCollection
      .find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.send({
      data: result,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send({ message: "Error fetching data" });
  }
});










app.get("/MyEmployeePaymentsCharge/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all" ? { status: "Approved" } : { employeeEmail: email, status: "Approved" };  // Filter by "Approved" status

  try {
      const result = await adminPaymentCollection.find(filter).toArray();

      if (result.length === 0) {
          return res.status(404).send({ message: "No data found" });
      }

      const modifiedResult = result.map(user => {
          return {
              payAmount: user.payAmount,
              charge: user.charge,
              date: user.date,
          };
      });

      res.send(modifiedResult);  // Send the modified result without the "status"
  } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
  }
});



  app.get("/employeePayment/:email", async (req, res) => {
    const email = req.params.email;
    const filter = { employeeEmail: email };
    const result = await adminPaymentCollection.findOne(filter);
    res.send(result);
  });

  app.get("/employeePayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await adminPaymentCollection.findOne(filter);
    res.send(result);
  });

  app.delete("/employeePayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await adminPaymentCollection.deleteOne(filter);
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
        charge:body.charge,
        date: body.date,
        note: body.note,
        paymentMethod: body.paymentMethod,
      },
    };

    const result = await adminPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/employeePayments/:ids", async (req, res) => {
    const id = req.params.id;
    const filter = { ids: id };
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

    const result = await adminPaymentCollection.updateOne(filter, updatenew);
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
    const result = await adminPaymentCollection.updateOne(filter, updatenew);
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
    const result = await adminPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  /////////////////////////////////////////////////
  // employee payment ////////////////////
  ////////////////////////////////////

  app.post("/contributorPayment", async (req, res) => {
    const filter = req.body;
    const result = await ContributorPaymentCollection.insertOne(filter);
    res.send(result);
  });
  

  app.get("/contributorPayment", async (req, res) => {
    const result = await ContributorPaymentCollection.find().toArray();
    res.send(result);
  });

  app.get("/MyContributorPayments/:email", async (req, res) => {
    const email = req.params.email;
    const filter = email === "all" ? {} : { employeeEmail: email };
    try {
        const result = await ContributorPaymentCollection.find(filter).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ message: "Error fetching data" });
    }
});


  app.get("/contributorPayment/:email", async (req, res) => {
    const email = req.params.email;
    const filter = { employeeEmail: email };
    const result = await ContributorPaymentCollection.findOne(filter);
    res.send(result);
  });

  app.get("/contributorPayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await ContributorPaymentCollection.findOne(filter);
    res.send(result);
  });

  app.delete("/contributorPayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await ContributorPaymentCollection.deleteOne(filter);
    res.send(result);
  });

  app.patch("/contributorPayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        status: body.status,
        payAmount: body.payAmount,
        charge:body.charge,
        date: body.date,
        note: body.note,
        paymentMethod: body.paymentMethod,
      },
    };

    const result = await ContributorPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/contributorPayment/:ids", async (req, res) => {
    const id = req.params.id;
    const filter = { ids: id };
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

    const result = await ContributorPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/contributorPayment/status/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await ContributorPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/contributorPayment/status/pending/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await ContributorPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  /////////////////////////////////////////////////
  // salary payment ////////////////////
  ////////////////////////////////////

  app.post("/salaryPayment", async (req, res) => {
    const filter = req.body;
    const result = await salaryPaymentCollection.insertOne(filter);
    res.send(result);
  });
  

  app.get("/salaryPayment", async (req, res) => {
    const result = await salaryPaymentCollection.find().toArray();
    res.send(result);
  });

  app.get("/MySalaryPayment/:email", async (req, res) => {
    const email = req.params.email;
    const filter = email === "all" ? {} : { employeeEmail: email };
    try {
        const result = await salaryPaymentCollection.find(filter).toArray();
        res.send(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ message: "Error fetching data" });
    }
});

  app.delete("/salaryPayment/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await salaryPaymentCollection.deleteOne(filter);
    res.send(result);
  });

  app.patch("/salaryPayment/:id", async (req, res) => {
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

    const result = await salaryPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/salaryPayment/:ids", async (req, res) => {
    const id = req.params.id;
    const filter = { ids: id };
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

    const result = await salaryPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/salaryPayment/status/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await salaryPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });

  app.patch("/salaryPayment/status/pending/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const body = req.body;
    const updatenew = {
      $set: {
        
        status: body.status,
      },
    };
    const result = await salaryPaymentCollection.updateOne(filter, updatenew);
    res.send(result);
  });



    ////////////////////////////////////////////////////////
    //                 ads ad account
    ////////////////////////////////////////////////////////

    app.post("/adsAccount", async (req, res) => {
      const { accountName } = req.body;
    
      // Check if the accountName already exists
      const existingAccount = await adsAccountCollection.findOne({ accountName });
    
      if (existingAccount) {
        // Send an error response if accountName exists
        return res.status(400).send({ message: "Account name already exists" });
      }
    
      // Proceed to insert the new account if accountName doesn't exist
      const result = await adsAccountCollection.insertOne(req.body);
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

    app.get("/myAdsAccount/:email", async (req, res) => {
      const email = req.params.email;
      const filter = email === "all" ? {} : { employeeEmail: email };
      try {
          const result = await adsAccountCollection.find(filter).toArray();
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
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
          paymentDate: body.date,
          threshold: body.threshold,
          currentBallence: body.currentBallence,
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

    app.patch("/adsAccount/spend/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatenew = {
        $set: {
          totalSpent: body.totalSpent
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
