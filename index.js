const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// for parsing request body
app.use(express.json());

// MongoDB connection strings
const writerConnectionString = "mongodb+srv://employeeApis:jasonroy@stage-emptra-mongo.bzzir.mongodb.net/stage-user-management-apis?retryWrites=true&w=majority";
const readerConnectionString = "mongodb+srv://employeeApis:jasonroy@stage-emptra-mongo.bzzir.mongodb.net/stage-user-management-apis?retryWrites=true&w=majority";

// writing connection
const writerDB = mongoose.createConnection(writerConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// reading connection
const readerDB = mongoose.createConnection(readerConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//schema
const dataSchema = new mongoose.Schema({
    apiName: {
        type: String
    },
    services:{
        type: String
    }
});

//reading model
const DataWriter = writerDB.model('Data', dataSchema);

//writing model
const DataReader = readerDB.model('Data', dataSchema);

// reading route
app.get('/api/data', async (req, res) => {
  try {
    const data = await DataReader.find({});
    res.json(data);
  } catch (err) {
    res.status(500).send('Error fetching data from the database', err);
  }
});

//writing route
app.post('/api/data', async (req, res) => {
  const newData = new DataWriter(req.body);

  try {
    await newData.save();
    res.status(201).send('Data saved successfully');
  } catch (err) {
    res.status(500).send('Error saving data to the database', err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


