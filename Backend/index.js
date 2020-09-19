//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'database-1.cynsbb7owd5s.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'Sowmyasonu46$',
  database : 'yelp',
  dateStrings: true
});

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/login', function(request, response) {
	var email = request.body.email;
    var password = request.body.password;
    console.log(email);
    console.log(password);
	if (email && password) {
		connection.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
        request.session.loggedin = true;
        response.cookie('cookie',results[0].email,{maxAge: 900000, httpOnly: false, path : '/'});
        request.session.email = email;
        console.log("after query");
				response.writeHead(200, {
					'Content-Type': 'text/plain'
				})
				response.end("successful Login");
			} 
			else
			response.send("error")
		});
	} 
});

app.post('/register', function(request, response) {
	var email = request.body.email;
  var password = request.body.password;
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var ZIP_Code = request.body.ZIP_Code;
  var Birthday = request.body.Birthday;
   console.log("inside register");
   console.log("email: " ,lastName)
   console.log("pass: " ,Birthday)
	if (email && password) {
    console.log("establishing connection for register");
    var sql = "INSERT INTO Users (email, password, first_name, last_name, ZIP_Code, Birthday) VALUES ('" + email + "','" +password +"','"+ firstName +"','"+ lastName +"','"+ ZIP_Code +"','"+ Birthday + "')";
    console.log("query established");
    console.log(sql);
    connection.query(sql, function(error, result, fields){
      if(error) {
      response.writeHead(400,{
        'Content-type': 'text/plain'
      })
      console.log("error", error);
      response.end("error in registering");
      }
    else{
      console.log("user added successfully");
      response.writeHead(200,{
        'Content-type': 'text/plain'
      })

    console.log('result:' ,result)
        response.end("user added succesfully");
    }}
    )
}});




app.listen(3001, ()=> console.log(`app listening on port 3001`));