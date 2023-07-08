const app = require( "express" )();
const bodyParser = require( "body-parser" );
const Datastore = require( "nedb" );
const path = require("path");
const { all } = require("./users");

app.use( bodyParser.json() );

let allCategories = [];

module.exports = app;

const categoryDBPath = path.join(__dirname, '../database/categories.db'); 
let categoryDB = new Datastore( {
    filename: categoryDBPath,
    autoload: true
} );


categoryDB.ensureIndex({ fieldName: '_id', unique: true });
app.get( "/", function ( req, res ) {
    res.send( "Category API" );
} );


  
app.get( "/all", function ( req, res ) {
    categoryDB.find( {}, function ( err, docs ) {
        allCategories = docs;
        res.send( docs );
    } );
} );

 
app.post( "/category", function ( req, res ) {
    let newCategory = req.body;
    newCategory._id = Math.floor(Date.now() / 1000); 
    categoryDB.insert( newCategory, function ( err, category) {
        if ( err ) res.status( 500 ).send( err );
        else {
            allCategories = [];
            res.sendStatus( 200 );
        } 
    } );
} );



app.delete( "/category/:categoryId", function ( req, res ) {
    categoryDB.remove( {
        _id: parseInt(req.params.categoryId)
    }, function ( err, numRemoved ) {
        if ( err ) res.status( 500 ).send( err );
        else {
            allCategories = [];
            res.sendStatus( 200 );
        } 
    } );
} );

 

 
app.put( "/category", function ( req, res ) {
    categoryDB.update( {
        _id: parseInt(req.body.id)
    }, req.body, {}, function (
        err,
        numReplaced,
        category
    ) {
        if ( err ) res.status( 500 ).send( err );
        else {
            allCategories = [];
            res.sendStatus( 200 );
        } 
    } );
});


app.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        if (allCategories.length != 0) {
            console.log('returning cached categories', allCategories);
            resolve(allCategories);
        } else {
            categoryDB.find({}, (err, docs) => {
                if (err) {
                    reject(err);
                } else {
                    allCategories = docs;
                    console.log('fetched categories from db', allCategories);
                    resolve(allCategories);
                }
            });
        }
    });
}
 