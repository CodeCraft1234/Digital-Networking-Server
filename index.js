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

async function connectToDatabase() {
  if (!client.isConnected?.()) {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  }
  return client;
}

async function run() {
  try {
    const usersInfocollection = client.db("Digital-Networking").collection("usersInfo");
    const clientCollection = client.db("Digital-Networking").collection("clients");
    const ratesCollection = client.db("Digital-Networking").collection("rates");
    const bankInfocollection = client.db("Digital-Networking").collection("bankInfo");
    const adminPaymentCollection = client.db("Digital-Networking").collection("adminPaymentInfo");
    const salaryPaymentCollection = client.db("Digital-Networking").collection("salaryPaymentInfo");
    const adsAccountCollection = client.db("Digital-Networking").collection("adsAccountInfo");
    const BasicSalaryCollection = client.db("Digital-Networking").collection("basicSalaryInfo");
    const ContributorPaymentCollection = client.db("Digital-Networking").collection("ContributorPayment");
    const activityCollection = client.db("Digital-Networking").collection("activityInfos");
    

    app.post('/rates', async (req, res) => {
      try {
        const bankData = req.body;
    
        // Delete previous rates data before inserting new one
        await ratesCollection.deleteMany({});
    
        // Insert new data
        const result = await ratesCollection.insertOne(bankData);
        res.status(201).send(result);
      } catch (err) {
        res.status(500).send({ error: 'Failed to insert bank info', details: err });
      }
    });
    
    // Get the latest rates as an object instead of an array
    app.get("/rates", async (req, res) => {
      const result = await ratesCollection.findOne({});
      res.send(result || {}); // Ensure an empty object is returned if no data exists
    });
    

    ////// basicSalary/////////
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


  
    //  user data
    
  // app.get("/usersSellery/:email", async (req, res) => {
  //     try {
  //         const email = req.params.email;
  //         const filter = email === "all" ? { role: "employee" } : { email }; // Adjust filter for "all"
  
  //         const users = email === "all"
  //             ? await usersInfocollection
  //                   .find(filter, { projection: { role: 1,name:1,photo:1, email: 1, _id: 1, monthlySpent: 1 } })
  //                   .toArray() // Use `.toArray()` for multiple users
  //             : await usersInfocollection.findOne(filter, {
  //                   projection: { role: 1, email: 1, _id: 1, monthlySpent: 1 },
  //               });
  
  //         if (!users || (Array.isArray(users) && users.length === 0)) {
  //             return res.status(404).json({ message: "No users found" });
  //         }
  
  //         res.status(200).json(users); // Return the data
  //     } catch (error) {
  //         console.error("Error fetching user data:", error);
  //         res.status(500).json({ message: "Internal Server Error" });
  //     }
  // });

//   app.get("/usersSellery/:email", async (req, res) => {
//     try {
//         const email = req.params.email;
        

//         // Fetch users based on email
//         const userFilter = email === "all" ? { role: "employee" } : { email };
//         const users = email === "all"
//             ? await usersInfocollection
//                 .find(userFilter, { projection: { role: 1, name: 1, photo: 1, email: 1, _id: 1, monthlySpent: 1 } })
//                 .toArray()
//             : await usersInfocollection.findOne(userFilter, { projection: { role: 1, name: 1, photo: 1, email: 1, _id: 1, monthlySpent: 1 } });

//         if (!users || (Array.isArray(users) && users.length === 0)) {
//             return res.status(404).json({ message: "No users found" });
//         }

//         // Fetch admin payments for users
//         const paymentFilter = email === "all" ? { status: "Approved" } : { employeeEmail: email, status: "Approved" };
//         const payments = await adminPaymentCollection.find(paymentFilter).toArray();

//         // Fetch salary payments for users
//         const salaryFilter = email === "all" ? {} : { employeeEmail: email };
//         const salaryPayments = await salaryPaymentCollection.find(salaryFilter).toArray();

//         // Fetch client data
//         const clientFilter = email === "all" ? {} : { employeeEmail: email };
//         const clientData = await clientCollection.find(clientFilter).toArray();

//         // Compute total items
//         const totalItems = await clientCollection.countDocuments(clientFilter);

//         // Merge payment data into users
//         const userMap = Array.isArray(users) ? users.map(user => {
//             const userPayments = payments.filter(payment => payment.employeeEmail === user.email);
//             const userSalaries = salaryPayments.filter(salary => salary.employeeEmail === user.email);

//             const totalAdminPay = userPayments.reduce((acc, payment) => acc + Number(payment.payAmount || 0), 0);
//             const totalCharge = userPayments.reduce((acc, payment) => acc + Number(payment.charge || 0), 0);
//             const totalSalaryPay = userSalaries.reduce((acc, salary) => acc + Number(salary.payAmount || 0), 0);

//             // Compute totalDue and totalAdvance per user
//             let totalDue = 0;
//             let totalAdvance = 0;

//             const userClientData = clientData.filter(client => client.employeeEmail === user.email);

//             userClientData.forEach(client => {
//                 const campaignTotal = (client.campaings || []).reduce(
//                     (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
//                     0
//                 );

//                 const pageServiceTotal = (client.pageService || []).reduce(
//                     (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
//                     0
//                 );

//                 const totalBill = campaignTotal + pageServiceTotal;

//                 const paymentReceived = (client.payments || []).reduce(
//                     (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
//                     0
//                 );

//                 const total = totalBill - paymentReceived;

//                 if (total > 0) {
//                     totalDue += total;
//                 } else {
//                     totalAdvance += Math.abs(total);
//                 }
//             });

//             // Calculate TikTok cost for this specific employee
//             const userTikTokData = userClientData
//                 .flatMap(client => client.pageService || [])
//                 .filter(service => service.role === "tiktokAds");

//             const tiktokCost = userTikTokData.reduce((acc, item) => acc + ((parseFloat(item.coin) || 0) * 0.012), 0);

//             return {
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 photo: user.photo,
//                 monthlySpent: user.monthlySpent || [],
//                 adminPay: totalAdminPay,
//                 totalDue: parseFloat(totalDue.toFixed(2)), // Now calculated per user
//                 totalAdvance: parseFloat(totalAdvance.toFixed(2)), // Now calculated per user
//                 charge: totalCharge,
//                 salaryPay: totalSalaryPay,
//                 tiktokCost: tiktokCost,
//             };
//         }) : {
//             _id: users._id,
//             name: users.name,
//             email: users.email,
//             photo: users.photo,
//             monthlySpent: users.monthlySpent || [],

//             // Compute totalDue and totalAdvance for a single user
//             totalDue: (() => {
//                 let totalDue = 0;
//                 clientData.forEach(client => {
//                     const campaignTotal = (client.campaings || []).reduce(
//                         (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
//                         0
//                     );

//                     const pageServiceTotal = (client.pageService || []).reduce(
//                         (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
//                         0
//                     );

//                     const totalBill = campaignTotal + pageServiceTotal;

//                     const paymentReceived = (client.payments || []).reduce(
//                         (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
//                         0
//                     );

//                     const total = totalBill - paymentReceived;
//                     if (total > 0) {
//                         totalDue += total;
//                     }
//                 });
//                 return parseFloat(totalDue.toFixed(2));
//             })(),

//             totalAdvance: (() => {
//                 let totalAdvance = 0;
//                 clientData.forEach(client => {
//                     const campaignTotal = (client.campaings || []).reduce(
//                         (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
//                         0
//                     );

//                     const pageServiceTotal = (client.pageService || []).reduce(
//                         (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
//                         0
//                     );

//                     const totalBill = campaignTotal + pageServiceTotal;

//                     const paymentReceived = (client.payments || []).reduce(
//                         (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
//                         0
//                     );

//                     const total = totalBill - paymentReceived;
//                     if (total < 0) {
//                         totalAdvance += Math.abs(total);
//                     }
//                 });
//                 return parseFloat(totalAdvance.toFixed(2));
//             })(),

//             adminPay: payments.reduce((acc, payment) => acc + Number(payment.payAmount || 0), 0),
//             charge: payments.reduce((acc, payment) => acc + Number(payment.charge || 0), 0),
//             salaryPay: salaryPayments.reduce((acc, salary) => acc + Number(salary.payAmount || 0), 0),
//             tiktokCost: clientData
//                 .flatMap(client => client.pageService || [])
//                 .filter(service => service.role === "tiktokAds" && service.employeeEmail === users.email)
//                 .reduce((acc, item) => acc + ((parseFloat(item.coin) || 0) * 0.012), 0),
//         };

//         res.status(200).json(userMap);
//     } catch (error) {
//         console.error("Error fetching user data:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

app.get("/usersSellery/:email", async (req, res) => {
  try {
      const email = req.params.email;

      const myUser = await usersInfocollection
      .find({ role: 'employee' }, { projection: { email: 1 } })
      .toArray();

    // Extract only emails from the employee list
    const employeeEmails = myUser.map(user => user.email);

      // Fetch users based on email
      const userFilter = email === "all" ? { role: "employee" } : { email };
      const users = email === "all"
          ? await usersInfocollection
              .find(userFilter, { projection: { role: 1, name: 1, photo: 1, email: 1, _id: 1, monthlySpent: 1 } })
              .toArray()
          : await usersInfocollection.findOne(userFilter, { projection: { role: 1, name: 1, photo: 1, email: 1, _id: 1, monthlySpent: 1 } });

      if (!users || (Array.isArray(users) && users.length === 0)) {
          return res.status(404).json({ message: "No users found" });
      }

      // Fetch admin payments for users
      const paymentFilter = email === "all" ? { status: "Approved" } : { employeeEmail: email, status: "Approved" };
      const payments = await adminPaymentCollection.find(paymentFilter).toArray();

      // Fetch salary payments for users
      const salaryFilter = email === "all" ? {} : { employeeEmail: email };

      const salaryPayments = await salaryPaymentCollection.find(salaryFilter).toArray();

      // Fetch client data
      const clientFilter = email === "all" ? {} : { employeeEmail: email };
      let client = await clientCollection.find(clientFilter).toArray();

      const clientData = client.filter(client => employeeEmails.includes(client.employeeEmail));
      ;

      const userMap = Array.isArray(users) ? users.map(user => {
          const userPayments = payments.filter(payment => payment.employeeEmail === user.email);
          const userSalaries = salaryPayments.filter(salary => salary.employeeEmail === user.email);

          const totalAdminPay = userPayments.reduce((acc, payment) => acc + Number(payment.payAmount || 0), 0);
          const totalCharge = userPayments.reduce((acc, payment) => acc + Number(payment.charge || 0), 0);
          const totalSalaryPay = userSalaries.reduce((acc, salary) => acc + Number(salary.payAmount || 0), 0);

          // Compute totalDue and totalAdvance per user
          let totalDue = 0;
          let totalAdvance = 0;
          let paymentReceivedd = 0;

          const userClientData = clientData.filter(client => client.employeeEmail === user.email);

          userClientData.forEach(client => {
              const campaignTotal = (client.campaings || []).reduce(
                  (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
                  0
              );

              const pageServiceTotal = (client.pageService || []).reduce(
                  (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
                  0
              );

              const totalBill = campaignTotal + pageServiceTotal;

              const paymentReceived = (client.payments || []).reduce(
                  (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
                  0
              );

              const total = totalBill - paymentReceived;
              
              paymentReceivedd += paymentReceived

              if (total > 0) {
                  totalDue += total;
              } else {
                  totalAdvance += Math.abs(total);
              }
          });

          // Calculate TikTok cost for this specific employee
          const userTikTokData = userClientData
              .flatMap(client => client.pageService || [])
              .filter(service => service.role === "tiktokAds");

          const tiktokCost = userTikTokData.reduce((acc, item) => acc + ((parseFloat(item.coin) || 0) * 0.012), 0);

          return {
              _id: user._id,
              name: user.name,
              email: user.email,
              photo: user.photo,
              monthlySpent: user.monthlySpent || [],
              adminPay: totalAdminPay,
              totalDue: parseFloat(totalDue.toFixed(2)), // Now calculated per user
              totalAdvance: parseFloat(totalAdvance.toFixed(2)), // Now calculated per user
              charge: totalCharge,
              clientPay: paymentReceivedd,
              salaryPay: totalSalaryPay,
              tiktokCost: tiktokCost,
          };
      }) : {
          _id: users._id,
          name: users.name,
          email: users.email,
          photo: users.photo,
          clientPay: (client.payments || []).reduce(
            (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
            0
        ),
          monthlySpent: users.monthlySpent || [],

          // Compute totalDue and totalAdvance for a single user
          totalDue: (() => {
              let totalDue = 0;
              clientData.forEach(client => {
                  const campaignTotal = (client.campaings || []).reduce(
                      (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
                      0
                  );

                  const pageServiceTotal = (client.pageService || []).reduce(
                      (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
                      0
                  );

                  const totalBill = campaignTotal + pageServiceTotal;

                  const paymentReceived = (client.payments || []).reduce(
                      (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
                      0
                  );

                  const total = totalBill - paymentReceived;
                  if (total > 0) {
                      totalDue += total;
                  }
              });
              return parseFloat(totalDue.toFixed(2));
          })(),

          totalAdvance: (() => {
              let totalAdvance = 0;
              clientData.forEach(client => {
                  const campaignTotal = (client.campaings || []).reduce(
                      (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
                      0
                  );

                  const pageServiceTotal = (client.pageService || []).reduce(
                      (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
                      0
                  );

                  const totalBill = campaignTotal + pageServiceTotal;

                  const paymentReceived = (client.payments || []).reduce(
                      (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
                      0
                  );

                  const total = totalBill - paymentReceived;
                  if (total < 0) {
                      totalAdvance += Math.abs(total);
                  }
              });
              return parseFloat(totalAdvance.toFixed(2));
          })(),

          adminPay: payments.reduce((acc, payment) => acc + Number(payment.payAmount || 0), 0),
          charge: payments.reduce((acc, payment) => acc + Number(payment.charge || 0), 0),
          salaryPay: salaryPayments.reduce((acc, salary) => acc + Number(salary.payAmount || 0), 0),
          tiktokCost: clientData
              .flatMap(client => client.pageService || [])
              .filter(service => service.role === "tiktokAds" && service.employeeEmail === users.email)
              .reduce((acc, item) => acc + ((parseFloat(item.coin) || 0) * 0.012), 0),
      };

      res.status(200).json(userMap);
  } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}); 


app.get("/allEmployees", async (req, res) => {
  try {
    await connectToDatabase();

    // Fetch all employees with proper projection
    const employees = await usersInfocollection.find({}, {
      projection: { role: 1, email: 1, _id: 1, name: 1, photo: 1, contactNumber: 1 }
    }).toArray();

    // Fetch all clients with only employeeEmail field
    const clients = await clientCollection.find({}, { projection: { employeeEmail: 1 } }).toArray();

    // Count clients for each employee
    const employeesWithClients = employees.map(employee => {
      const clientCount = clients.filter(client => client.employeeEmail === employee.email).length;
      return { ...employee, clients: clientCount };
    });

    // Sort employees by name (A-Z)
    employeesWithClients.sort((a, b) => a.name.localeCompare(b.name));

    res.send(employeesWithClients);
  } catch (error) {
    console.error("Error fetching employees with clients:", error);
    res.status(500).send({ message: "Internal Server Error" });
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
  app.get("/myUser/runningMonth/spent/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all"
    ? { role: 'employee', monthlySpent: { $exists: true, $ne: [] } }
    : { email: email, role: 'employee', monthlySpent: { $exists: true, $ne: [] } };

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

    const results = [];

    myUser.forEach(user => {
      let totalSpentMeta = 0;
      let totalSpentGoogle = 0;

      (user?.monthlySpent || []).forEach(spent => {
        const spentMonth = new Date(spent.date).getMonth();

        if (spentMonth === currentMonth) {
          if (spent.role === 'metaSpend') {
            totalSpentMeta += spent.totalSpentt;
          }

          if (spent.role === 'googleSpend') {
            totalSpentGoogle += spent.totalSpentt;
          }
        }
      });

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
  app.get("/userr/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email : email };
      try {
        await connectToDatabase();
          const result = await usersInfocollection.findOne(filter);
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
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
      await connectToDatabase();
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

    //   Bank Info
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
    app.get("/myActivity/:email", async (req, res) => {
      const email = req.params.email;
    
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }
    
      const filter = email === "all" ? {} : { email: email }; 
    
      try {
        const result = await activityCollection
          .find(filter)
          .sort({ date: -1 }) // Sort by date in descending order (latest first)
          .limit(40) // Fetch only the latest 40 documents
          .toArray();
    
        res.send(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ message: "Error fetching data" });
      }
    });
    
    //   client
    app.post("/clients", async (req, res) => {
      const filter = req.body;
      const result = await clientCollection.insertOne(filter);
      res.send(result);
    });
    app.get("/clients/homePage/:email", async (req, res) => {
      const email = req.params.email;
      const filter = email === "all" ? {} : { employeeEmail: email }; // Simplified filter
    
      try {
        await client.connect();
    
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
        // Filter Payments
        const payments = await clientCollection.aggregate([
          { $match: filter },
          { $unwind: "$payments" },
          { $project: { paymentDate: { $toDate: "$payments.date" }, amount: "$payments.amount" } },
          {
            $group: {
              _id: null,
              todayTotal: {
                $sum: { $cond: [{ $gte: ["$paymentDate", startOfToday] }, "$amount", 0] }
              },
              weeklyTotal: {
                $sum: { $cond: [{ $gte: ["$paymentDate", startOfWeek] }, "$amount", 0] }
              },
              monthlyTotal: {
                $sum: { $cond: [{ $gte: ["$paymentDate", startOfMonth] }, "$amount", 0] }
              }
            }
          }
        ]).toArray();
    
        // Filter Campaign Spends
        const campaignSpends = await clientCollection.aggregate([
          { $match: filter },
          { $unwind: "$campaings" },
          { $project: { campaignDate: { $toDate: "$campaings.date" }, tSpent: "$campaings.tSpent" } },
          {
            $group: {
              _id: null,
              todaySpend: {
                $sum: { $cond: [{ $gte: ["$campaignDate", startOfToday] }, { $toDouble: "$tSpent" }, 0] }
              },
              weeklySpend: {
                $sum: { $cond: [{ $gte: ["$campaignDate", startOfWeek] }, { $toDouble: "$tSpent" }, 0] }
              },
              monthlySpend: {
                $sum: { $cond: [{ $gte: ["$campaignDate", startOfMonth] }, { $toDouble: "$tSpent" }, 0] }
              },
              todayCampaigns: {
                $sum: { $cond: [{ $gte: ["$campaignDate", startOfToday] }, 1, 0] }
              },
              weeklyCampaigns: {
                $sum: { $cond: [{ $gte: ["$campaignDate", startOfWeek] }, 1, 0] }
              },
              monthlyCampaigns: {
                $sum: { $cond: [{ $gte: ["$campaignDate", startOfMonth] }, 1, 0] }
              }
            }
          }
        ]).toArray();
    
        // Filter Client Counts
        const clientCounts = await clientCollection.aggregate([
          { $match: filter },
          {
            $project: {
              createdAt: { $toDate: "$date" }
            }
          },
          {
            $group: {
              _id: null,
              todayClients: { $sum: { $cond: [{ $gte: ["$createdAt", startOfToday] }, 1, 0] } },
              weeklyClients: { $sum: { $cond: [{ $gte: ["$createdAt", startOfWeek] }, 1, 0] } },
              monthlyClients: { $sum: { $cond: [{ $gte: ["$createdAt", startOfMonth] }, 1, 0] } }
            }
          }
        ]).toArray();
    
        // Filter Admin Payments
        const adminPayments = await adminPaymentCollection.aggregate([
          { $match: filter },
          {
            $project: { paymentDate: { $toDate: "$date" }, payAmount: { $toDouble: "$payAmount" } }
          },
          {
            $group: {
              _id: null,
              todayAdminPay: {
                $sum: { $cond: [{ $gte: ["$paymentDate", startOfToday] }, "$payAmount", 0] }
              },
              weeklyAdminPay: {
                $sum: { $cond: [{ $gte: ["$paymentDate", startOfWeek] }, "$payAmount", 0] }
              },
              monthlyAdminPay: {
                $sum: { $cond: [{ $gte: ["$paymentDate", startOfMonth] }, "$payAmount", 0] }
              }
            }
          }
        ]).toArray();
    
        // Merge Results
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
              pageService: client.pageService || [],
          }));
  
          res.send(transformedResult);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).send({ message: "Error fetching data" });
      }
  });


  app.get("/myclients/total/:email", async (req, res) => {
    const email = req.params.email;
    const month = req.query.month && req.query.month !== "all" ? parseInt(req.query.month) : 0;
  
    try {
      // Fetch all employees' emails
      const myUser = await usersInfocollection
        .find({ role: 'employee' }, { projection: { email: 1 } })
        .toArray();
  
      // Extract only emails from the employee list
      const employeeEmails = myUser.map(user => user.email);
  
      // Define filter condition for email
      let filter = email === "all" ? {} : { employeeEmail: email };
  
      // Apply month filter if provided
      if (month > 0) {
        filter.$expr = { $eq: [{ $month: { $dateFromString: { dateString: "$date" } } }, month] };
      }
  
      // Fetch clients based on filter
      let clients = await clientCollection.find(filter).toArray();
  
      // Filter clients to include only those where employeeEmail exists in myUser
      clients = clients.filter(client => employeeEmails.includes(client.employeeEmail));
  
      const paymentData = clients.flatMap(client => client.payments || []);
      const tiktokCast = clients.flatMap(client => client.pageService || []).filter(f => f.role === 'tiktokAds');
      const pageService = clients.flatMap(client => client.pageService || []);
      const paymentData2 = clients.flatMap(client => client.campaings || []);
  
      const result = {
        spendTotal: paymentData2.reduce((acc, p) => acc + parseFloat(p.tSpent || 0), 0),
  
        spendBill:
          (Array.isArray(paymentData2) ? paymentData2 : []).reduce(
            (acc, campaign) => acc + parseFloat(campaign?.tSpent || 0) * parseFloat(campaign?.dollerRate || 0),
            0
          ) +
          (Array.isArray(pageService) ? pageService : []).reduce(
            (acc, { totalBill = 0 }) => acc + parseFloat(totalBill || 0),
            0
          ),
  
        bkashMarchent: paymentData
          .filter(p => p.paymentMethod === 'bkashMarchent')
          .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        bkashPersonal: paymentData
          .filter(p => p.paymentMethod === 'bkashPersonal')
          .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        nagadPersonal: paymentData
          .filter(p => p.paymentMethod === 'nagadPersonal')
          .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        rocketPersonal: paymentData
          .filter(p => p.paymentMethod === 'rocketPersonal')
          .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        IBBLBank: paymentData
          .filter(p => p.paymentMethod === 'IBBLBank')
          .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        bank: paymentData
          .filter(p => p.paymentMethod === 'bank')
          .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        DBBLBank: paymentData
          .filter(p => p.paymentMethod === 'DBBLBank')
          .reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        total: paymentData.reduce((acc, p) => acc + parseFloat(p.amount || 0), 0),
  
        tiktokCost: tiktokCast.reduce((acc, p) => acc + parseFloat(p.coin || 0) * 0.012, 0)
      };
  
      console.log("Aggregated Result:", result); // Debugging: Check the final result
      res.json(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Error fetching data" });
    }
  });
  

    // app.get("/myclients/total/monthly/:email", async (req, res) => {
    //   const email = req.params.email;
  
    //   const filter = email === "all" ? {} : { employeeEmail: email };
  
    //   try {
    //       const clients = await clientCollection.find(filter).toArray();
  
    //       const paymentData = clients.flatMap(client => client.payments || []);
  
    //       const paymentByMonth = paymentData.reduce((acc, payment) => {
    //           if (payment && payment.date) {
    //               const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
    //               acc[month] = (acc[month] || 0) + (parseFloat(payment.amount) || 0);
    //           }
    //           return acc;
    //       }, {});
  
    //       res.json(paymentByMonth);
    //   } catch (error) {
    //       console.error("Error fetching data:", error);
    //       res.status(500).json({ message: "Error fetching data" });
    //   }
    // });


    app.get("/myclients/total/monthly/:email", async (req, res) => {
      const email = req.params.email;
      const filter = email === "all" ? {} : { employeeEmail: email };
    
      try {
        // Fetch all employees' emails
        const myUser = await usersInfocollection
          .find({ role: 'employee' }, { projection: { email: 1 } })
          .toArray();
        
        // Extract only emails from the employee list
        const employeeEmails = myUser.map(user => user.email);
    
        // Fetch all clients based on filter
        let clients = await clientCollection.find(filter).toArray();
    
        // Filter clients to include only those where employeeEmail exists in myUser
        clients = clients.filter(client => employeeEmails.includes(client.employeeEmail));
    
        // Extract all payment data from clients
        const paymentData = clients.flatMap(client => client.payments || []);
    
        // Aggregate payments by month
        const paymentByMonth = paymentData.reduce((acc, payment) => {
          if (payment && payment.date) {
            const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
            acc[month] = (acc[month] || 0) + (parseFloat(payment.amount) || 0);
          }
          return acc;
        }, {});
    
        res.json(paymentByMonth);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Error fetching data" });
      }
    });
    

    app.get("/myclients/total/tiktokCost/monthly/:email", async (req, res) => {
      const email = req.params.email;
  
      const filter = email === "all" ? {} : { employeeEmail: email };
  
      try {
          const clients = await clientCollection.find(filter).toArray();
  
          const tiktokCast = clients.flatMap(client => client.pageService || [])
          .filter(f => f.role === 'tiktokAds');
  
          const tiktokCashByMonth = tiktokCast.reduce((acc, item) => {
            if (item && item.date) {
                const month = new Date(item.date).toLocaleString('default', { month: 'long' });
                acc[month] = (acc[month] || 0) + (parseFloat(item.coin) || 0) * 0.012;
            }
            return acc;
        }, {});
  
          res.json(tiktokCashByMonth);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.status(500).json({ message: "Error fetching data" });
      }
    });


  //   app.get("/clients/due/advance/:email", async (req, res) => {
  //     const email = req.params.email;
  //     const filter = email === "all" ? {} : { employeeEmail: email };
  
  //     try {
  //         const totalItems = await clientCollection.countDocuments(filter);
  //         const clients = await clientCollection.find(filter).toArray();
  
  //         if (!clients || clients.length === 0) {
  //             return res.send({ totalItems: 0, totalDue: 0, totalAdvance: 0 });
  //         }
  
  //         let totalDue = 0;
  //         let totalAdvance = 0;
  
  //         clients.forEach((client) => {
  //             const campaignTotal = (client.campaings || []).reduce(
  //                 (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
  //                 0
  //             );
  
  //             const pageServiceTotal = (client.pageService || []).reduce(
  //                 (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
  //                 0
  //             );
  
  //             const totalBill = parseFloat((campaignTotal + pageServiceTotal).toFixed(2));
  
  //             const paymentReceived = (client.payments || []).reduce(
  //                 (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
  //                 0
  //             );
  
  //             const total = totalBill - paymentReceived;
  
  //             if (total > 0) {
  //                 totalDue += total;
  //             } else {
  //                 totalAdvance += Math.abs(total);
  //             }
  //         });
  
  //         res.send({
  //             totalItems,
  //             totalDue: parseFloat(totalDue.toFixed(2)),
  //             totalAdvance: parseFloat(totalAdvance.toFixed(2)),
  //         });
  //     } catch (error) {
  //         console.error("Error fetching data:", error);
  //         res.status(500).send({ message: "Error fetching data" });
  //     }
  // });


  app.get("/clients/due/advance/:email", async (req, res) => {
    const email = req.params.email;
    const filter = email === "all" ? {} : { employeeEmail: email };
  
    try {
      // Fetch all employees' emails
      const myUser = await usersInfocollection
        .find({ role: 'employee' }, { projection: { email: 1 } })
        .toArray();
  
      // Extract only emails from the employee list
      const employeeEmails = myUser.map(user => user.email);
  
      // Fetch clients based on filter
      let clients = await clientCollection.find(filter).toArray();
  
      // Filter clients to include only those where employeeEmail exists in myUser
      clients = clients.filter(client => employeeEmails.includes(client.employeeEmail));
  
      const totalItems = clients.length;
  
      if (totalItems === 0) {
        return res.send({ totalItems: 0, totalDue: 0, totalAdvance: 0 });
      }
  
      let totalDue = 0;
      let totalAdvance = 0;
  
      clients.forEach((client) => {
        const campaignTotal = (client.campaings || []).reduce(
          (acc, { tSpent = 0, dollerRate = 0 }) => acc + parseFloat(tSpent) * parseFloat(dollerRate),
          0
        );
  
        const pageServiceTotal = (client.pageService || []).reduce(
          (acc, { totalBill = 0 }) => acc + parseFloat(totalBill),
          0
        );
  
        const totalBill = parseFloat((campaignTotal + pageServiceTotal).toFixed(2));
  
        const paymentReceived = (client.payments || []).reduce(
          (acc, { amount = 0 }) => acc + parseFloat(amount || 0),
          0
        );
  
        const total = totalBill - paymentReceived;
  
        if (total > 0) {
          totalDue += total;
        } else {
          totalAdvance += Math.abs(total);
        }
      });
  
      res.send({
        totalItems,
        totalDue: parseFloat(totalDue.toFixed(2)),
        totalAdvance: parseFloat(totalAdvance.toFixed(2)),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send({ message: "Error fetching data" });
    }
  });
  
  
    


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
          (acc, { tSpent = 0 }) => acc + parseFloat(tSpent || 0),
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
        const total = totalBill - paymentReceived;
  
        // 🔹 Check if any campaign has status 'Active'
        const hasActiveCampaign = (client.campaings || []).some(
          (campaign) => campaign.status === "Active"
        );
  
        return {
          _id: client._id,
          clientName: client.clientName,
          clientPhone: client.clientPhone,
          id: client.id,
          date: client.date,
          employeeEmail: client.employeeEmail,
          totalBudget,
          totalSpent,
          totalBill,
          paymentReceived,
          total,
          status: hasActiveCampaign, // 🔥 Returns true if any campaign is 'Active'
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
          const query = { id }; 
      
          const existingClient = await clientCollection.findOne(query);
      
          if (existingClient) {
            // Add the new campaign to the `campaings` array
            const updateResult = await clientCollection.updateOne(query, {
              $push: {
                pageService: {
                  $each: [pageService], 
                  $position: 0, 
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
    const { itemName, pageUrl,coin, totalBill, role, pageName } = req.body; 

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
    app.patch('/clientPageService/updates2/:userId/:ids', async (req, res) => {
    const { userId, ids } = req.params;
    const { itemName,coin, totalBill } = req.body; 

    try {
        // Use the $set operator to update the specific campaign by `ids`
        const result = await clientCollection.updateOne(
            { id: userId, "pageService.ids": parseInt(ids) },
            {
                $set: {
                  "pageService.$.itemName": itemName,
                 "pageService.$.coin": coin,
                "pageService.$.totalBill": totalBill,
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

  // employee payment ////////////////////
  app.post("/employeePayment", async (req, res) => {
    const filter = req.body;
    const result = await adminPaymentCollection.insertOne(filter);
    res.send(result);
  });


// app.get("/adminPay/total/monthly/:email", async (req, res) => {
//   const email = req.params.email;
//   const filter = email === "all" ? {} : { employeeEmail: email };

//   try {

//     const myUser = await usersInfocollection
//       .find(f=>f.role === 'employee', { projection: { email: 1 } }).toArray();

//     const result = await adminPaymentCollection.find(filter).toArray();

//     // Filter and aggregate payments by month
//     const paymentByMonth = result.filter(payment => payment.status === 'Approved')
//       .reduce((acc, payment) => {
//         const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
//         acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount || 0);
//         return acc;
//       }, {});

//     const paymentByMonthCharge = result.filter(payment => payment.status === 'Approved')
//       .reduce((acc, payment) => {
//         const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
//         acc[month] = (acc[month] || 0) + parseFloat(payment.charge || 0);
//         return acc;
//       }, {});

//     res.json({
//       paymentByMonth,
//       paymentByMonthCharge
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ message: "Error fetching data" });
//   }
// });

app.get("/adminPay/total/monthly/:email", async (req, res) => {
  const email = req.params.email;
  const filter = email === "all" ? {} : { employeeEmail: email };

  try {
    // Fetch all employees' emails
    const myUser = await usersInfocollection
      .find({ role: 'employee' }, { projection: { email: 1 } })
      .toArray();
    
    // Extract only emails from the employee list
    const employeeEmails = myUser.map(user => user.email);

    // Fetch all admin payments
    let result = await adminPaymentCollection.find(filter).toArray();

    // Filter admin payments to include only those where employeeEmail exists in myUser
    result = result.filter(payment => employeeEmails.includes(payment.employeeEmail));

    // Filter and aggregate payments by month
    const paymentByMonth = result
      .filter(payment => payment.status === 'Approved')
      .reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.payAmount || 0);
        return acc;
      }, {});

    const paymentByMonthCharge = result
      .filter(payment => payment.status === 'Approved')
      .reduce((acc, payment) => {
        const month = new Date(payment.date).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + parseFloat(payment.charge || 0);
        return acc;
      }, {});

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

  // contributorPayment payment ////////////////////
  app.post("/contributorPayment", async (req, res) => {
    const filter = req.body;
    const result = await ContributorPaymentCollection.insertOne(filter);
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

  // salary payment ////////////////////
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

    //  ads ad account
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

  } finally {
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
