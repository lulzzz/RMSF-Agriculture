// importing modules
var ttn = require('ttn');

const readline = require('readline');

const mysql = require('mysql');

// to get environment variables
const dotenv_result = require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
// NOT USED
//var Pusher = require('pusher');

// NOT USED
/*var pusher = new Pusher({
  appId: '',
  key: '',
  secret: '',
  cluster: 'eu',
  encrypted: true
});*/

// the port is 3000 by default, or defined by heroku
var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.io = io;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// throws error if the file isn't found
// if (dotenv_result.error) {
//   throw dotenv_result.error
// }

var appID = process.env.TTN_APPID
var accessKey = process.env.TTN_ACCESSKEY

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB
})

app.get('/', (req, res) => {

  res.sendFile(__dirname + '/index.html');
});

app.get('/data', (req, res) => {
  
  var request = "SELECT * FROM agricomm;"

  connection.query(request, (err, result, fields) => {

    if (err) {
      res.json(err);
      throw err;
    }

    res.json(result);
  });
});

app.get('/data/:column', (req, res) => {
  
  let column = req.params.column;
 
  if (!column) {
    return res.status(400).send({ error: true, message: 'Please provide an existent column name' });
  }

  var request = "SELECT ??, arrived_time FROM agricomm;";

  var output = connection.query(request, column, function (err, result, fields) {

    console.log(result);

    if (err) {
      return res.status(400).send({ error: true, message: 'Please provide an existent column name' });
    }

    return res.send({ error: false, data: result, message: 'Content of column.' });

  });

});


app.get('/data/:column/:since', (req, res) => {
  
  let column = req.params.column;
  let since = req.params.since;
 
  if (!since) {
    return res.status(400).send({ error: true, message: 'Please provide a valid date' });
  }
 
  if (!column) {
    return res.status(400).send({ error: true, message: 'Please provide an existent column name' });
  }

  if(since === 'last_month') {
    var request = "SELECT ??, arrived_time FROM agricomm where month(arrived_time) = month(current_date()) and  year(arrived_time) = year(current_date());";
  } else if(since === 'last_day') {
    var request = "SELECT ??, arrived_time FROM agricomm where day(arrived_time) = day(current_date()) and month(arrived_time) = month(current_date()) and  year(arrived_time) = year(current_date());";
  } else if(since === 'last_week') {
    var request = "SELECT ??, arrived_time FROM agricomm where YEARWEEK(arrived_time, 1) = YEARWEEK(current_date(), 1);";
  } else if(since === 'last_year') {
    var request = "SELECT ??, arrived_time FROM agricomm where year(arrived_time) = year(current_date());";
  } else {
    return res.status(400).send({ error: true, message: 'Please provide a valid date' });
  }

  var output = connection.query(request, column, function (err, result, fields) {

    console.log(result);

    if (err) {
      return res.status(400).send({ error: true, message: 'Please provide an existent column name' });
    }

    return res.send({ error: false, data: result, message: 'Content of column.' });
  });

});

app.get('/device/:device/data', (req, res) => {

  let device = req.params.device;

  if(!device) {
    return res.status(400).send({ error: true, message: 'Please provide a Device name' });
  }
  
  var request = "SELECT * FROM agricomm where devID='" + device + "'";

  connection.query(request, (err, result, fields) => {

    if (err) {
      res.json(err);
      throw err;
    }

    res.json(result);
  });
});


app.get('/device/:device/data/:column/:since', (req, res) => {

  let device = req.params.device;

  if(!device) {
    return res.status(400).send({ error: true, message: 'Please provide a Device name' });
  }

  let column = req.params.column;
 
  if (!column) {
    return res.status(400).send({ error: true, message: 'Please provide an existent column name' });
  }

  let since = req.params.since;
 
  if (!since) {
    return res.status(400).send({ error: true, message: 'Please provide a valid date' });
  }

  if(since === 'last_month') {
    var request = "SELECT ??, arrived_time FROM agricomm where devID='" + device + "' and month(arrived_time) = month(current_date()) and  year(arrived_time) = year(current_date());";
  } else if(since === 'last_day') {
    var request = "SELECT ??, arrived_time FROM agricomm where devID='" + device + "' and day(arrived_time) = day(current_date()) and month(arrived_time) = month(current_date()) and  year(arrived_time) = year(current_date());";
  } else if(since === 'last_week') {
    var request = "SELECT ??, arrived_time FROM agricomm where devID='" + device + "' and YEARWEEK(arrived_time, 1) = YEARWEEK(current_date(), 1);";
  } else if(since === 'last_year') {
    var request = "SELECT ??, arrived_time FROM agricomm where devID='" + device + "' and year(arrived_time) = year(current_date());";
  } else {
    return res.status(400).send({ error: true, message: 'Please provide a valid date' });
  }

  var output = connection.query(request, column, function (err, result, fields) {

    console.log(result);

    if (err) {
      return res.status(400).send({ error: true, message: 'Please provide an existent column name or dev ID or time interval.' });
    }

    return res.send({ error: false, data: result, message: 'Content of column of DevID.' });

  });
});


app.get('/device/:device/data/:column/', (req, res) => {

  let device = req.params.device;

  if(!device) {
    return res.status(400).send({ error: true, message: 'Please provide a Device name' });
  }

  let column = req.params.column;
 
  if (!column) {
    return res.status(400).send({ error: true, message: 'Please provide an existent column name' });
  }

  var request = "SELECT ??, arrived_time FROM agricomm where devID='" + device + "'";

  var output = connection.query(request, column, function (err, result, fields) {

    console.log(result);

    if (err) {
      return res.status(400).send({ error: true, message: 'Please provide an existent column name or dev ID' });
    }

    return res.send({ error: false, data: result, message: 'Content of column of Dev.' });

  });
});


connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


io.on('connection', (socket) => {
  console.log("New user connected");

  var request = "SELECT * FROM agricomm;"

  connection.query(request, (err, result, fields) => {

    if (err) {
      socket.emit("error", err);
      throw err;
    }

    for(var i = result.length - 1; i >= 0; i--) {
      var message = "Humidity = " + result[i].humidity + "-- Pump = " + result[i].pump + " -- Temperature = " + result[i].temperature + " -- Moisture = " + result[i].moisture + " -- Time: " + result[i].arrived_time;
      socket.emit('log_message', message);
    }
  
  });

});

ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
      console.log("The humidity is: " + payload.payload_fields.humidity);
      console.log("The temperature is: " + payload.payload_fields.temperature);
      console.log("The moisture is: " + payload.payload_fields.moisture);
      console.log("The pump state is: " + payload.payload_fields.pump);
      console.log(payload.metadata.time.slice(0, 19).replace('T', ' '));

      var message = "Humidity = " + payload.payload_fields.humidity + "-- Pump = " + payload.payload_fields.pump + " -- Temperature = " + payload.payload_fields.temperature + " -- Moisture = " + payload.payload_fields.moisture + " -- Time: " + payload.metadata.time.slice(0, 19).replace('T', ' ');

      io.emit('log_message', message);

      var sql = "INSERT INTO agricomm (devID, temperature, humidity, moisture, pump, arrived_time) VALUES ('" +
        payload.dev_id + "', " + payload.payload_fields.temperature + ", " + payload.payload_fields.humidity + "," +
        payload.payload_fields.moisture + ", " + payload.payload_fields.pump + ", '" + payload.metadata.time.slice(0, 19).replace('T', ' ') + "');";

      if(payload.payload_fields.humidity === 0 && payload.payload_fields.temperature === 0 && payload.payload_fields.moisture === 0 && payload.payload_fields.pump === 0){
        console.log("ACK received");
        return;
      }

      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");

        // NOT USED -- can be used if we want a real-time system
        /*pusher.trigger('my-channel', 'my-event', {
          "message": "new"
        }, () => {
          console.log("Pusher done");
        }); */

      });
    })

    client.on("event", function (devID, payload) {
      console.log("Received something from ", devID)
      console.log(payload)
    })
  })
  .catch(function (error) {
    console.error("Error", error)
    process.exit(1)
  })

rl.on('line', function (line) {
  if (line == 'exit') {
    // ends connection with database
    connection.end();

    // terminates program
    process.exit(0);
  }
})

// pinging the heroku app in order to avoid inactiviy
setInterval(function () {
  http.get("http://agricomm.herokuapp.com");
}, 300000); // every 5 minutes (300000)

server.listen(port, () => {
  console.log('listening on *:' + port);
});