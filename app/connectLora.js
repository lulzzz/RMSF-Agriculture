// importing modules
var ttn = require('ttn');
const readline = require('readline');
const mysql = require('mysql');
// to get environment variables
const dotenv_result = require('dotenv').config();

// throws error if the file isn't found
if (dotenv_result.error) {
  throw dotenv_result.error
}

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

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
      console.log("The humidity is: " + payload.payload_fields.humidity)
      console.log("The temperature is: " + payload.payload_fields.temperature)
      console.log("The moisture is: " + payload.payload_fields.moisture)
      console.log(payload.metadata.time.slice(0, 19).replace('T', ' '));

      var sql = "INSERT INTO agricomm (devID, temperature, humidity, moisture, pump, arrived_time) VALUES ('"
      + payload.dev_id + "', " + payload.payload_fields.temperature + ", " + payload.payload_fields.humidity + ","
        + payload.payload_fields.moisture + ", false ,'" + payload.metadata.time.slice(0, 19).replace('T', ' ') + "');";

      connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
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

