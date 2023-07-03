const app = require( "express" )();
const Datastore = require( "nedb" );
const path = require("path");

module.exports = app;

const configDBPath = path.join(__dirname, '../database/config.db');
let configDB = new Datastore({
  filename: configDBPath,
  autoload: true
});

configDB.ensureIndex({ fieldName: '_id', unique: true });

app.get("/", function (req, res) {
  res.send("Config API");
});

app.get("/db", (req, res)=>{
  res.send("Config DB");
})

app.get("/insert", (req, res)=>{
  let data = {"name": "test", "value": "test"};
  console.log('data: ' + data);
  configDB.insert(data, (err, newDoc)=>{
    console.log('newDoc:' + newDoc);
    res.send(newDoc);
  });
})

app.get("/all", (req, res)=>{
  configDB.find({}, (err, docs)=>{
    res.send(docs);
  });
});

app.post("/new", (req, res)=>{
  let dumyData = req.body;
  configDB.insert(dumyData, (err, newDoc)=>{
    if (err) res.status(500).send(err);
    else res.status(200).send(newDoc);
  });
});

app.get("/delete/all", (req, res)=>{
  configDB.remove({}, {multi: true}, (err, numRemoved)=>{
    if(err) res.status(500).send(err);
    else res.sendStatus(200); 
  });
});




