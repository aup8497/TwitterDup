var express=require('express');
var bodyParser=require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));


var meows=[
			'hello there please like this page',
			'and post some comments too',
			'please',
			'hello again'
			];  

app.get('/meows',function(req,res,next){
	//req contains the request object 
	//res is used to send data back using res.send
	//next is used when there is an error or something

////this next part,we cant encapsulate the variable within this fn=unction,so we make it global by declaring it outside
// var meows=[
// 			'hello there please like this page',
// 			'and post some comments too',
// 			'please',
// 			'hello again'
// 			];  

 res.send(meows);

});

app.post('/meows',function(req,res,next){
	//console.log(req.body);//this will log the object i.e { newMeow: <string entered in the text input of website> }

	meows.push(req.body.newMeow);//this will push/append the string(i.e req.body.newMeow) to the array named 'meows'
								// in the above line req.body.newMeow is the object-newMeow inside the json file
								//req.body is the entire json file
	res.send();
});

app.listen(5000, function () {
	console.log('example app listening on port 3000!');
});