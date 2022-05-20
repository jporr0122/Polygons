const express = require ('express'); //import express module
const router = express.Router(); //create a router object
const User = require('../models/user'); //import User model

router.post("/register", registerPOST); //POST endpoint for CREATE

async function registerPOST(req, res){ //callback fxn for endpoint
	const {email, password} = req.body; //user fields from req body
	const newUser = new User({ email: email, password: password }); //create new user instance
	const document = await newUser.save() //schema's save() into db
	const json4 = 'Account Created' //results as json
	res.json(json4); //send json with response
}

const jwt = require('jsonwebtoken'); //import jsonwebtoken module

router.post('/login', loginPOST); //POST endpoint for LOGIN

async function loginPOST(request,response) { //callback fxn for LOGIN
	const userData = request.body; //get data from request body
	const user = await User.findOne( {email:userData.email} ).exec(); //findOne execs to DB, gets user
	const json = 'Invalid email'
	const json2 = 'Invalid password'
	const json3 = 'Login Success. Visit localhost:3000/loginHome.html to begin searching for games'
	if(!user){ //wrong email, send err message
		response.json(json)
	}
	else if (user.password !== userData.password){ //wrong pword, send err message
		response.json(json2)
	}
	else{
		const payload = {subject:user._id} //define JWT payload as user id
		const token = jwt.sign(payload,'secretKey') //hash token = payload + secret
		response.json(json3) //send token back to client
	}
}


function verifyToken( req, res, next ) { //Middleware function
	if ( !req.headers.authorization ){ //No authorization in header
		return res.status(401).json( {msg:'Unauthorized request'} ) //Send back with 401 status
	}
	const token = req.headers.authorization.split(' ')[1]; //split token from header
	if ( token === 'null' ){ //No token
		return res.status(401).json( {msg:'Unauthorized request'} ) //Send back with 401 status
	}
	const payload = jwt.verify(token,'secretKey') //Use JWT to verify Token
	if ( !payload ) { //Not valid
		return res.status(401).json( {msg:'Unauthorized request'} ) //Send back with 401 status
	}
	req.userId = payload.subject //Embed user id into request
	next() //Invoke next fxn in chain
}



module.exports = router;