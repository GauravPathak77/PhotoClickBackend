const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./myapp-7e111-9fff6bd84d73.json');
const bodyParser = require('body-parser');
const axios = require('axios');
// const functions = require('firebase-functions');
const app = express();

// Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "myapp-7e111.appspot.com",
});

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

let obj = [];

app.post('/api/data', (req, res) => {
  const receivedArray = req.body.array;
  console.log('Received Array:', receivedArray);
  obj = receivedArray;
  res.json({ success: true });
});


app.get('/api/data', async(req,res) => {
  
  try {
    let data = await Promise.all(
      obj[0].map(async (item)=>{
        console.log("item: ", item);
        const response = await axios.get(item);
        console.log(response.data);
        return response.data;
      }));
    
      data = data.map((item, index) => ({
        ...item,
        image_url: obj[1][index]
      }));
      console.log("New Data: ", data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// exports.api = functions.https.onRequest(app);