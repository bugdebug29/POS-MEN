const app = require( "express")();
const bodyParser = require( "body-parser" );
const Datastore = require( "nedb" );
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const pathName = path.join(__dirname, '../public/uploads');
const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        callback(null, pathName);
    },

    filename: function(req, file, callback){
        callback(null, Date.now() + '.jpg'); // 
    }
});

let upload = multer({storage: storage});

app.use( bodyParser.json() );

module.exports = app;

const settingsDBPath = path.join(__dirname, '../database/settings.db'); 
let settingsDB = new Datastore( {
    filename: settingsDBPath,
    autoload: true
} );



app.get( "/", function ( req, res ) {
    res.send( "Settings API" );
} );


  
app.get( "/get", function ( req, res ) {
    settingsDB.findOne( {
        _id: 1
}, function ( err, docs ) {
        res.send( docs );
    } );
} );

app.get("/all", (req, res)=>{
    settingsDB.find({}, (err, docs)=>{
      res.send(docs);
    });
});
 
app.post( "/post", upload.single('imagename'), function ( req, res ) {

    let image = '';

    if(req.body.img != "") {
        image = req.body.img;       
    }

    if(req.file) {
        image = req.file.filename;  
    }

    if(req.body.remove == 1) {
        const path = pathName +"/"+req.body.img; // path.join(pathName, req.file.filename)
        try {
          fs.unlinkSync(path)
        } catch(err) {
          console.error(err)
        }

        if(!req.file) {
            image = '';
        }
    } 
    
  
    let Settings = {  
        _id: 1,
        settings: {
            "app": req.body.app,
            "store": req.body.store,
            "address_one": req.body.address_one,
            "address_two":req.body.address_two,
            "contact": req.body.contact,
            "tax": req.body.tax,
            "symbol": req.body.symbol,
            "percentage": req.body.percentage,
            "charge_tax": req.body.charge_tax,
            "footer": req.body.footer,
            "img": image
        }       
    }

    if(req.body.id == "") { 
        settingsDB.insert( Settings, function ( err, settings ) {
            if ( err ) res.status( 500 ).send( err );
            else res.send( settings );
        });
    }
    else { 
        settingsDB.update( {
            _id: 1
        }, Settings, {}, function (
            err,
            numReplaced,
            settings
        ) {
            if ( err ) res.status( 500 ).send( err );
            else res.sendStatus( 200 );
        } );

    }

});

app.get("/delete/all", (req, res)=>{
    settingsDB.remove({}, {multi: true}, (err, numRemoved)=>{
      if(err) res.status(500).send(err);
      else res.sendStatus(200); 
    });
  });