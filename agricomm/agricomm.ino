t/*

Agriculture IoT System for the Wireless Networks Course
- Reading Temperature and Humidity of soil and air and sending/receiving
data to/from a mobile device using LoRa

*/

#include "DHT.h"

#define DHTPIN 2     // connected to digital pin 2

//Sensor type used
#define DHTTYPE DHT11   // DHT 11

//constructor
DHT dht(DHTPIN, DHTTYPE);

int moistureSensor = A6;
int soilOutput = 0;

/*
# the sensor value description
# 0  ~300     dry soil
# 300~700     humid soil
# 700~950     in water

These values correspond to the resistance of the soil
*/

/* Timer variables*/
unsigned long currentMillis = 0;
unsigned long previousMillis = 0;
unsigned long interval = 2000;

void setup() {
  // Starts the serial communication
  Serial.begin(57600);

  dht.begin();
  // the guide of the Moisture Sensor says to use 57600 baudrate
  // deu com rates diferentes, mas deve ser melhor 57600, pin A0 relacionado com o serial
  // don't know why
}

void loop() {
  // gets new time
  currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;

  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

    // reads the moisture data from the analog port
    soilOutput = analogRead(moistureSensor);
    
    Serial.print("Humidity: ");
    Serial.print(h);
    Serial.print(" %\t");
    Serial.print("Temperature: ");
    Serial.print(t);
    Serial.print(" *C ");
    Serial.print(" \t");
    Serial.print("Moisture Sensor Value:");
    Serial.println(soilOutput);
  }
}
