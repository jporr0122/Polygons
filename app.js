const http = require("http");
const express = require ('express'); //import express module
const app = express(); //create express app
const port = 3000; //define server port
const { database } = require ('./config/database'); //import db config settings
const mongoose = require ('mongoose');


const server = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html'})
	fs.readFile('public/index.html', function(error, data){
		if(error){
			res.writeHead(404)
			res.write('Error: File Not Found')
		}else{
			res.write(data)
		}
		res.end
	})
})

const mongoose_config = {useNewUrlParser: true, useUnifiedTopology: true}; //connection configs
const connection = mongoose.connect(database, mongoose_config);

if (connection){ //log connection result
	console.log('database connected');
}
else{
	console.log('database connection error')
}

const bodyParser = require('body-parser'); //import body-parser module
const userRoutes = require('./api/user-routes'); //import user-routes module

app.use(bodyParser.json()); //use body-parser for json
app.use('/', userRoutes); //use router on root path

app.use( express.static('public') ); //use public/ for static files
app.get("/", getIndex); //GET endpoint for index.html

app.listen(port, () => console.log("server is running port ", port) ); //app listens for request

function getIndex(request, response){ //callback fxn for request
	response.sendFile('./public/index.html', { root: __dirname }); //sends index.html file
}
