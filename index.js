const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

app.use(express.json())

// user login API
app.post('/login', async (req, res) => {
  //step #1: req.body.username 
  if (req.body.username != null && req.body.password != null) {
    let result = await client.db("maybank").collection("testing").findOne({
      username: req.body.username
    })

    if (result) {
      //step #2: if user exist, check if password in correct
      if (bcrypt.compareSync(req.body.password, result.password) == true) {
        //pasword is correct
        var token = jwt.sign(
          { _id: result._id, username: result.name , name :result.name },
           'passwordsusahnakhack',
           { expiresIn: 180 }
          );
          res.send(token)
      } else {
        //password incorrect
        res.status(401).send('wrong password')
      } 
      
    }else {
        //step #3: if user not found
        res.status(401).send("username is not found")
      }
    } else { 
      res.status(400).send("missing username or password")
    }
  })

app.get('/inc',async (req, res)=> {
  let result = await client.db("maybank").collection("value").updateOne (
    { name: {$eq: "Nasi Lemak "}}, //filter
    {
      $inc: {price: 3}
    }
  )
  res.send (result)
})

    //new user registeration
    app.post('/user',async (req, res) => {
      //check if username already exist

      //insertOne the registiration data to mongo
      const hash = bcrypt.hashSync(req.body.password, 10);

      //console.log(req.body)
      let result = await client.db("maybank").collection("testing").insertOne(
        {
          username: req.body.username,
          password: hash,     //tukar raw password to abcd(hashing)
          name: req.body.name,
          email: req.body.email,
        }
      )
      res.send(result)
    }
  )




// get user profile
app.get('/user/:id', async (req, res) => {
    let auth = req.headers.authorization
    let authSplitted = auth.split(' ')
    let token = authSplitted[1]
    console.log(token)
    let decoded = jwt.verify(token, 'passwordsusahnakhack');
    console.log(decoded)

    if(decoded._id != req.params.id){
      res.status(401).send('Unauthorized Access')
    } else {

    let result = await client.db('maybank').collection('testing').findOne({
      _id: new ObjectId(req.params.id)
  })
  res.send(result)
  }
})

// update user account
app.patch('/user/:id', verifyToken, async  (req, res) => {
  // updateOne
  console.log('update user profile')
})

// delete user account
app.delete('/user', (req, res) => {
  // deleteOne
  console.log('delete user account')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://soo:passwordbaharu@cluster0.nehnjjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

    jwt.verify(token, "passwordsusahnakhack", (err, decoded) => {
      console.log(err)
      if (err) return res.semdStatus(403)

        req.identity = decoded
        next()
    })
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log('Connected successfully to MongoDB')
  } finally {
  }
}
run().catch(console.dir);



