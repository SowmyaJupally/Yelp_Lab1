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
const { connect } = require('http2');
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

app.post('/createRestuarant', (req,res)=>{

  console.log("createRestuarant", req.body)
  res.writeHead(200,{
    'Content-type': 'text/plain'
  })
  res.end("OK")
})


app.post('/ownerhome', (request, response) =>{
  console.log("OWNER HOME", request.body);
	var res_name = request.body.res_name;
  var cuisine = request.body.cuisine;
  var zip_Code = request.body.zipCode;
  var user_id = request.body.user_id;

  console.log("jaffa", zip_Code, cuisine, res_name, user_id)
    if (res_name && cuisine && zip_Code) {
    console.log("establishing connection for ownerhome");
    var sql = "INSERT INTO restaurants (res_name, res_cuisine, res_zip_code,user_id) VALUES ('" + res_name + "','" +cuisine +"','"+ zip_Code +"','"+ user_id+ "')";
    console.log("query established");
    console.log(sql);
    connection.query(sql, function(error, result, fields){
      if(error) {
      response.writeHead(400,{
        'Content-type': 'text/plain'
      })
      console.log("error", error);
      response.end("error in ownerhome");
      }
    else{
      console.log("restaurant added successfully");
      response.writeHead(200,{
        'Content-type': 'text/plain'
      })

    console.log('result:' ,result)
        response.end("restaurant added succesfully");
    }}
    )
}});

app.get('/pendingorders/:user_id', (req, res) => {

  let sql = `CALL Pending_Orders_get(${req.params.user_id});`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0] && result[0][0].status !== 'NO_PENDING_ORDERS') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0]));
    }
    else {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("NO_PENDING_ORDERS");
    }
  });
});

app.post('/orderstatus', (req, res) => {
  let sql = `UPDATE customer_orders SET order_status = '${req.body.order_status}' WHERE order_id = ${req.body.order_id};`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end("STATUS_UPDATED");
    }
  });
});


app.post('/login', function(request, response) {
	var email = request.body.email;
  var password = request.body.password;
  let user_id;
    
    console.log(email);
    console.log(password);
	if (email && password) {
		connection.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
        request.session.loggedin = true;
        response.cookie('cookie',results[0].email,{maxAge: 900000, httpOnly: false, path : '/'});
        //request.session.email = email;

        user_id = results[0].user_id ;
        is_owner = results[0].is_owner;
        console.log("user_id:",user_id);
        console.log("is_owner:", is_owner);
        console.log("after query");
				response.writeHead(200, {
					'Content-Type': 'text/plain'
        })
        

        var result = {user_id: user_id, is_owner:is_owner, succesfulLogin:true}
				response.end( JSON.stringify(result));
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
  var is_owner = request.body.is_owner;
  var is_owner_Value
  
  if (is_owner == "Customer"){
    is_owner_Value = 0
  }
  else if(is_owner == "Owner")
  {is_owner_Value = 1}

  console.log("is_owner_value", is_owner_Value);
   console.log("inside register");
   console.log("email: " ,lastName)
   console.log("pass: " ,Birthday)
	if (email && password) {
    console.log("establishing connection for register");
    var sql = "INSERT INTO Users (email, password, first_name, last_name, ZIP_Code, Birthday, is_owner) VALUES ('" + email + "','" +password +"','"+ firstName +"','"+ lastName +"','"+ ZIP_Code +"','"+ Birthday +"','"+ is_owner_Value + "')";
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

app.post('/home', function(request, response) {

  var res_name = request.query.res_name;
  var address = request.query.res_address;
  var cuisine = request.query.res_cuisine;
  var timings = request.query.res_timings;

  var resQuery = "SELECT (res_name,res_address,res_cuisine,res_timings) FROM Restaurants VALUES ('" + res_name + "','" +address +"','"+ cuisine +"','"+ timings + "')";

  connection.query(resQuery, function(err, res, fields){
    if(error){
      response.writeHead(400,{
        'Content-type':'text/plain'
      })
      console.log("res query error", err);
    }
    else{
      response.writeHead(200,{
        'Content-type':'text/plain'
      })
      console.log("res query result: ", res);
      response.end("data succesfull");
    }
  })
})

app.get('/getevents', function(request, response) {

  var events = "select * from Events where Events.Event_ID ='"+ request.params.id+"'";

  connection.query(events, function(err, res, fields){
    if(err){
      response.writeHead(400,{
        'Content-type':'text/plain'
      })
      console.log("res query error", err);
    }
    else{
      response.writeHead(200,{
        'Content-type':'text/plain'
      })
      console.log("res query result: ", res);
      response.end("data succesfull");
    }

  })
  response.send(events);
});


app.get('/:user_id', (req, res) => {
  const sql = `CALL get_customer_details('${req.params.user_id}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log("inside error");
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Some error has occured');
    }
    if (result && result.length > 0 && result[0][0]) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(JSON.stringify(result[0][0]));
    }
  });
});

app.post('/:user_id', (req, res) => {
  const sql = `CALL update_user_basicdetails('${req.params.user_id}','${
    req.body.first_name
  }','${req.body.last_name}','${req.body.nickname}','${req.body.headline}','${
    req.body.Birthday
  }','${req.body.city}','${req.body.state}','${req.body.country}',${
    req.body.ZIP_Code === '' ? 'NULL' : req.body.ZIP_Code
  })`;

  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Some error has occured');
    }
    if (result && result.length > 0 && result[0][0].status) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(result[0][0].status);
    }
  });
});

app.post('/:user_id/aboutme/', (req, res) => {
  const sql = `CALL update_user_aboutme(${req.params.user_id},'${req.body.ilove}','${req.body.findmein}','${req.body.blog}','${req.body.not_yelping}'
  )`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Some error has occured');
    }
    if (result && result.length > 0 && result[0][0].status) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(result[0][0].status);
    }
  });
});

app.post('/:user_id/contactInfo/', (req, res) => {
  const sql = `CALL update_user_contact(${req.params.user_id},'${req.body.email}','${req.body.phonenum}')`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Some error has occured');
    }
    if (result && result.length > 0 && result[0][0].status) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(result[0][0].status);
    }
  });
});

app.get('/restaurants/:search_input', (req, res) => {

  let sql = `CALL Search_Result_get('${req.params.search_input}');`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });

      console.log("error in data ", err)
      res.end("Error in Data", err);
    }
    if (result && result.length > 0 && result[0][0]) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0]));
    }
  });
});

app.get('/items/:res_id', (req, res) => {
  let sql = `CALL Menu_Items_get(${req.params.res_id}, NULL);`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0]) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0]));
    }
  });
});

app.get('/sections/:user_id', (req, res) => {
  let sql = `CALL Menu_Sections_get(NULL, ${req.params.user_id});`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      console.log(err);
      res.end("Database Error", err);
    }
    if (result && result.length > 0 && result[0][0]) {
      console.log(err);
      res.writeHead(200, {
        'Content-Type': 'text/plain'
        
      });
      res.end(JSON.stringify(result[0]));
    }
  });
});

app.get('/sectionitem/:menu_section_id', (req, res) => {
  let sql = `CALL Menu_Sections_Record_get(${req.params.menu_section_id});`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0]) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0][0]));
    }
  });
});







app.listen(3001, ()=> console.log(`app listening on port 3001`));