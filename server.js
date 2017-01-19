//here we are implememting how to delete an element in the db using its id
//lines changed are 8,92-112


//initializing the express method
var express=require('express');
//the first one here is the name of the variable,you can have anything you want
//,but for the requirement inside the brackets you have to have a specified name(spelled properly)
var MongoClient=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;//you need this to remove the selected item by id

var bodyParser=require('body-parser');
var bcrypt = require('bcryptjs');
//we require this to store the user login credentials in the browser in the form of a cookie
var jwt=require('jwt-simple');
var JWT_SECRET = 'catmeow';//this cat meow is the secret key of the admin on the server side

//calling the express method
var app = express();

var db=null;

//connect to mongodb right after you create the app
//see examples of how to connect to the db from https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
// Connect to the db
MongoClient.connect("mongodb://localhost:27017/mittens", function(err, dbconnection) {
  if(!err) {
    console.log("We are connected");
    db=dbconnection;
  }//here err is the call back function
});
//how to write this
//as we are hosting it locally we use localhost:27017 is the default port
//as our dbname is mittens which we initialized earlier
//err is the call back function
//console.log logs the string in the terminal



app.use(bodyParser.json());   

//this static methid allows user to access from a static folder called "public" --> by this we can keep our index.html in the public folder
// all the front end stuff goes into the static folder

app.use(express.static('public'));

// var meows=[
// 			'hello there please like this page',
// 			'and post some comments too',
// 			'please',
// 			'hello again'
// 		];  
/*
as we are storing this string array in the database,we dont need to store it explicitly here
We are going use that using database from now on
*/

// app.get('/', function (req, res) {
//   res.render('index', {});
// });

app.get('/meows',function(req,res,next){
	//req contains the request object 
	//res is used to send data back using res.send
	//next is used when there is an error or something

////this next part,we cant encapsulate the variable within this function,so we make it global by declaring it outside
// var meows=[
// 			'hello there please like this page',
// 			'and post some comments too',
// 			'please',
// 			'hello again'
// 			];  

	 db.collection('meows', function(err, meowsCollection) {
	 		meowsCollection.find().toArray( function(err,meows){
				console.log(meows);

				return res.json(meows);
	 		});
	 });
	 //
});

app.post('/meows',function(req,res,next){
	console.log(req.body);//this will log the object i.e { newMeow: <string entered in the text input of website> }
	//meows.push(req.body.newMeow);// this is not required as we are taking input from the database
	 

	//TO insert elements to the db we use this syntax(read the documentation)
	 db.collection('meows', function(err, meowsCollection) {

			var newMeow={text:req.body.newMeow};

	 		meowsCollection.insert(newMeow, {w:1} ,function(err,meows){
//the second arguement is options which always remains {w:1}

				console.log(meows);

				return res.send();
	 		});
	 });

});

//see the diference between put and post on the internet
app.put('/meows/remove',function(req,res,next){
	console.log(req.body);//this will log the object i.e { newMeow: <string entered in the text input of website> }
	//meows.push(req.body.newMeow);// this is not required as we are taking input from the database
	 

	//TO insert elements to the db we use this syntax(read the documentation)
	 db.collection('meows', function(err, meowsCollection) {

			var meowId= req.body.meow._id;

	 		meowsCollection.remove({_id:ObjectId(meowId) }/*this is the id   everything has an underscore`_id: `*/, {w:1} ,function(err,meows){
//the second arguement is options which always remains {w:1}

				console.log(meows);    

				return res.send();
	 		});
	 });

});


app.post('/users',function(req,res,next){
console.log(req.body);
	 db.collection('users', function(err, usersCollection) { //this sentence is for gettting users
	 		
	 	bcrypt.genSalt(10, function(err, salt) {
		    bcrypt.hash(req.body.password, salt, function(err, hash) {
		        // Store hash in your password DB.
		        // hash is the hashed password

				 		var newUser = {
				 			username : req.body.username,
				 			password : hash
				 		};
				 		usersCollection.insert(newUser, {w:1} ,function(err ){

							return res.send();
				 		});
				 });


		    });
		});


});


//to recap real quick:refer 10_13_encrypt passwords with bcrypt and make a login route video :15th minute
app.put('/users/signin',function(req,res,next){
console.log(req.body);
	 db.collection('users', function(err, usersCollection) {  //this sentence is for getting users

		 	usersCollection.findOne({username:req.body.username},function(err,user){
		 		
		 		bcrypt.compare(req.body.password,user.password,function(err,result){ //this function returns result in the parameter which is boolean value.
		 			//result is true if they are equal or else false
		 			if(result){
		 				var token = jwt.encode( req.body , JWT_SECRET); // the first arguement is the 
		 				//payload(which is the object or user which has to be stored as a cookie) and the second arguement is our secret key
		 				return res.json( { token: token } );
		 			}else{
		 				return res.status(400);
		 			}
		 		});

		 	});	

		});

});



app.listen(5000, function () {
	console.log('example app listening on port 3000!');
});