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
const { appendFile } = require('fs');
var connection = mysql.createConnection({
  host     : 'database-1.cynsbb7owd5s.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'Sowmyasonu46$',
  database : 'yelp',
  dateStrings: true
});


// const pool = mysql.createPool({
//   connectionLimit: 100,
//   host     : 'database-1.cynsbb7owd5s.us-east-1.rds.amazonaws.com',
//   user: 'admin',
//   password: 'Sowmyasonu46$',
//   database: 'yelp'
// });

// pool.getConnection((err) => {
//   if(err){
//     throw 'Error occured: ' + err;
//   }
// });
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

app.post('/customer', (req, res) => {
  var hashedPassword;
  console.log("jaffa",req.body)
  if(req.body.password && req.body.password !== "")
  {
     hashedPassword =  req.body.password ;
  }
  else{
     hashedPassword = req.body.password;
  }
  let sql = `CALL Customer_update('${req.body.user_id}', '${req.body.email_id}', '${req.body.name}','${hashedPassword}', '${req.body.address}', '${req.body.phone_number}');`;
  
  connection.query(sql, (err, result) => {
    console.log("error",err)
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Error in Data");
    }
    if (result && result.length > 0 && result[0][0].status === 'CUSTOMER_UPDATED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
    else if (result && result.length > 0 && result[0][0].status === 'NO_RECORD') {
      res.writeHead(401, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});


app.post('/ownerhome', (request, response) =>{
  console.log("OWNER HOME", request.body);
	var res_name = request.body.res_name;
  var cuisine = request.body.cuisine;
  var zip_Code = request.body.zipCode;
  var user_id = request.body.user_id;

  console.log( zip_Code, cuisine, res_name, user_id)
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
      console.log("restaurant added successfully", result.insertId);
      response.writeHead(200,{
        'Content-type': 'text/plain'
      })

    console.log('result:' ,result)
        response.end(JSON.stringify(result.insertId));
    }}
    )
}});



app.get('/pendingorders/:user_id', (req, res) => {

  let sql = `CALL Pending_Orders_get(${req.params.user_id});`;
  connection.query(sql, (err, result) => {

    //console.log(" error and result:", err,result);
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      console.log("500 error");
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

app.get('/respendingorders/:user_id', (req, res) => {

  let sql = `CALL Res_Pending_Orders_get(${req.params.user_id});`;
  connection.query(sql, (err, result) => {

    //console.log(" error and result:", err,result);
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      console.log("500 error");
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

app.post('/cancelorder', (req, res) => {
  let sql = `UPDATE customer_orders SET order_status = 'ORDER_CANCELLED' WHERE order_id = ${req.body.order_id};`;
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
      res.end("ORDER_CANCELLED");
    }
  });
});



app.get('/orderitems/:order_id', (req, res) => {

  let sql = `CALL Order_Items_get(${req.params.order_id});`;
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
    else {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("NO_RECORDS");
    }
  });
});

app.post('/createevents', (req,res)=>{

  let image1 = "https://image.shutterstock.com/image-photo/speaker-giving-talk-on-corporate-600w-481869205.jpg";

  let sql = "insert into Events (event_name,event_date, event_location, event_description, res_id, event_image) VALUES ('" + req.body.event_name + "','" +req.body.event_date +"','"+ req.body.event_location +"','"+ req.body.event_description +"','"+ req.body.res_id +"','"+ image1 +"')";
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
})

app.post('/events', (req,res)=>{

  let sql = "insert into register_event_users (event_id,user_id) VALUES ('" + req.body.event_id + "','" +req.body.user_id +"')";
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
})

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




app.get('/completedorders/:user_id', (req, res) => {

  let completedorders = `CALL Completed_Orders_get(${req.params.user_id});`;
  connection.query(completedorders, (err, result) => {

    console.log("error", err)
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0] && result[0][0].status !== "NO_COMPLETED_ORDERS") {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0]));
    }
    else {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("NO_COMPLETED_ORDERS");
    }
  });
});

app.post('/placeorder', (req, res) => {
  let sql = `CALL Orders_put(${req.body.user_id}, ${req.body.res_id}, '${req.body.order_status}',${req.body.sub_total}, ${req.body.tax}, ${req.body.delivery}, ${req.body.discount}, ${req.body.total});`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === 'ORDER_PLACED') {
      req.body.cart_items.forEach(cart_item => {
        let sqlItem = `CALL Orders_Items_put(${result[0][0].order_id}, ${cart_item.item_id}, ${cart_item.item_quantity});`;
        connection.query(sqlItem, (err, result) => {
          if (err) {
            console.log(err);
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end("Database Error");
          }
        });
      });
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0][0]));
    }
    else {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0]);
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


app.get('/getEventUsers/:id', (req,response)=>{
  var events = "select u.user_id,u.user_image,u.first_name from Users u join register_event_users reg on reg.user_id = u.user_id and reg.event_id = "+req.params.id;

  var results;

  connection.query(events, function(err, res, fields){
    if(err){
      response.writeHead(400,{
        'Content-type':'text/plain'
      })
      console.log("res query error", err);
    }
    
    else{
      console.log("result", res)
      response.writeHead(200,{
        'Content-type':'text/plain'
      })
      
      console.log("res query result: ", res);
      response.end(JSON.stringify(res));
    }
  })
})

app.get('/getRestauarantEvents/:resId',(req,response)=>{
  var events = "select * from Events where res_id = "+req.params.resId;

  var results;

  connection.query(events, function(err, res, fields){
    if(err){
      response.writeHead(400,{
        'Content-type':'text/plain'
      })
      console.log("res query error", err);
    }
    
    else{
      console.log("result", res)
      response.writeHead(200,{
        'Content-type':'text/plain'
      })
      
      console.log("res query result: ", res);
      response.end(JSON.stringify(res));
    }
  })
})


app.get('/getRegisteredEvents/:userId', (req,response)=>{
  var events = "select e.event_name, e.event_description, e.event_image,e.event_location,e.res_id,e.event_date from Events e join register_event_users reg on reg.event_id = e.event_id and reg.user_id = "+req.params.userId;

  var results;

  connection.query(events, function(err, res, fields){
    if(err){
      response.writeHead(400,{
        'Content-type':'text/plain'
      })
      console.log("res query error", err);
    }
    
    else{
      console.log("result", res)
      response.writeHead(200,{
        'Content-type':'text/plain'
      })
      
      console.log("res query result: ", res);
      response.end(JSON.stringify(res));
    }
  })

})

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

app.post('/sections', (req, res) => {
  let sql = `CALL Menu_Sections_put(NULL, ${req.body.user_id}, '${req.body.menu_section_name}');`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === 'SECTION_ADDED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0][0]));
    }
    else if (result && result.length > 0 && result[0][0].status === 'SECTION_EXISTS') {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});

app.post('/sectionsupdate', (req, res) => {
  let sql = `CALL Menu_Sections_update(NULL, ${req.body.user_id}, ${req.body.menu_section_id}, '${req.body.menu_section_name}');`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === 'SECTION_UPDATED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0][0]));
    }
    else if (result && result.length > 0 && result[0][0].status === 'SECTION_EXISTS') {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});

app.post('/sectiondelete', (req, res) => {
  let sql = `CALL Menu_Sections_del(${req.body.menu_section_id});`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === 'SECTION_DELETED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
    else if (result && result.length > 0 && result[0][0].status === 'NO_RECORD') {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});

app.get('/items/:user_id', (req, res) => {
  let sql = `CALL Menu_Items_get(NULL, ${req.params.user_id});`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      console.log("database error", err)
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

app.get('/menuitem/:item_id', (req, res) => {
  let sql = `CALL Menu_Items_Record_get(${req.params.item_id});`;
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

app.post('/items', (req, res) => {

  let image_path = "https://image.shutterstock.com/image-photo/walnut-pistachio-turkish-style-antep-600w-1222454869.jpg"
  let sql = `CALL Menu_Items_put(${req.body.user_id}, NULL, '${req.body.item_name}', '${req.body.item_description}', ${req.body.item_price}, '${image_path}', NULL, '${req.body.menu_section_name}');`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === 'ITEM_ADDED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0][0]));
    }
    else if (result && result.length > 0 && result[0][0].status === 'ITEM_EXISTS') {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});

app.post('/itemsupdate', (req, res) => {
  let sql = `CALL Menu_Items_update(${req.body.user_id}, NULL, ${req.body.item_id}, '${req.body.item_name}', '${req.body.item_description}', ${req.body.item_price}, '${req.body.item_image}', NULL, '${req.body.menu_section_name}');`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === 'ITEM_UPDATED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0][0]));
    }
    else if (result && result.length > 0 && result[0][0].status === 'ITEM_EXISTS') {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});

app.post('/itemdelete', (req, res) => {
  let sql = `CALL Menu_Items_del(${req.body.item_id});`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === 'ITEM_DELETED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
    else if (result && result.length > 0 && result[0][0].status === 'NO_RECORD') {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});

app.post('/reviews', function(request, response) {
	var review = request.body.review;
  var res_id = request.body.res_id;

  console.log("Hola !! posting a review ", review, res_id)
	if (review && res_id) {
    var sql = "INSERT INTO Reviews (review, res_id) VALUES ('" + review + "','" +res_id + "')";
    console.log("query established");
    console.log(sql);
    connection.query(sql, function(error, result, fields){
      if(error) {
      response.writeHead(400,{
        'Content-type': 'text/plain'
      })
      console.log("error", error);
      response.end("error in writing review");
      }
    else{
      console.log("Review added successfully");
      response.writeHead(200,{
        'Content-type': 'text/plain'
      })

    console.log('result:' ,result)
        response.end("Review added succesfully");
    }}
    )
}});


app.post('/login', async function(request, response) {
	var email = request.body.email;
  var password = request.body.password;
  let user_id;
  let restaurantId;
    console.log(email);
    console.log(password);
	if (email && password) {
		await connection.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password],async function(error, results, fields) {
			if (results.length > 0) {
        request.session.loggedin = true;
        response.cookie('cookie',results[0].email,{maxAge: 900000, httpOnly: false, path : '/'});
        //request.session.email = email;
        
        user_id = await results[0].user_id ;
        is_owner = await results[0].is_owner;
        console.log("user_id:",user_id);
        console.log("is_owner:", is_owner);
        console.log("after query");
				
         if(is_owner){
          connection.query("SELECT * FROM restaurants WHERE user_id = "+ user_id, async function(error, results, fields) {
            console.log("results: ", results[0])
            if (results.length > 0) {
              console.log("lengfh", results[0].res_id)
              restaurantId = await results[0].res_id ;
            }
        })
      }

      await new Promise(resolve => {
        setTimeout(resolve, 1000)
      })
      response.writeHead(200, {
        'Content-Type': 'text/plain'
      })
        var result = {user_id: user_id, is_owner:is_owner, succesfulLogin:true, restaurantId:restaurantId}
        console.log(result);
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
  console.log("is_owner: ", request.body.is_owner)
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

app.get('/customer/:user_id', (req, res) => {
  let sql = `CALL Customer_get('${req.params.user_id}', NULL);`;

  
  connection.query(sql, (err, result) => {
    console.log("error",err)
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Error in Data");
    }
    if (result && result.length > 0 && result[0][0]) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0]));
    }
  });
});

app.get('/restaurants/:user_id', (req, res) => {
  let sql = `CALL Restaurant_Owner_get('${req.params.user_id}', NULL, NULL);`;
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      console.log("error in error",err)
      res.end("Error in Data");
    }
    if (result && result.length > 0 && result[0][0]) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0]));
    }
  });
});


app.post('/restaurants', (req, res) => {
  if (req.body.password && req.body.password !== "") {
    var hashedPassword = "'" + passwordHash.generate(req.body.password) + "'";
  }
  else {
    var hashedPassword = "NULL";
  }
  let sql = `CALL Restaurant_Owner_update(NULL, '${req.body.email_id}', '${req.body.name}', '${req.body.res_name}', '${req.body.res_cuisine}', ${hashedPassword}, '${req.body.res_zip_code}', '${req.body.address}', '${req.body.phone_number}');`;
  console.log(sql);
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end("Error in Data");
    }
    if (result && result.length > 0 && result[0][0].status === 'RESTAURANT_UPDATED') {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
    else if (result && result.length > 0 && result[0][0].status === 'NO_RECORD') {
      res.writeHead(401, {
        'Content-Type': 'text/plain'
      });
      res.end(result[0][0].status);
    }
  });
});

app.get('/getevents', function(request, response) {

  var events = "select * from Events ";

  var results;

  connection.query(events, function(err, res, fields){
    if(err){
      response.writeHead(400,{
        'Content-type':'text/plain'
      })
      console.log("res query error", err);
    }
    
    else{
      console.log("result", res)
      response.writeHead(200,{
        'Content-type':'text/plain'
      })
      
      console.log("res query result: ", res);
      response.end(JSON.stringify(res));
    }

  })
  //response.end(results);
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



app.get('/getRestuarantDetails/:id', (req, res)=>{
  let sql = "select * from restaurants where res_id ="+ req.params.id
  connection.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });

      console.log("error in data ", err)
      res.end("Error in Data", err);
    }
    if (result && result.length > 0) {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result[0]));
    }
  });
})
app.get('/searchrestaurants/:search_input', (req, res) => {


  
  let sql = `CALL Search_Result_get('${req.params.search_input}');`;
  connection.query(sql, (err, result) => {
    console.log("error", err)
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

app.get('items/:res_id', (req, res) => {
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

module.exports = app;
