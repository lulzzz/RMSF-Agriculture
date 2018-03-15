/*

Agriculture IoT System for the Wireless Networks Course
- Reading Temperature and Humidity of soil and air and sending/receiving
data to/from a mobile device using LoRa

*/

int moistureSensor = A0;
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
unsigned long interval = 1000;

void setup() {
  // Starts the serial communication
  Serial.begin(57600);

  // the guide of the Moisture Sensor says to use 57600 baudrate
  // don't know why
}

void loop() {
  // gets new time
  currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    // save the last time you blinked the LED
    previousMillis = currentMillis;

    // reads the moisture data from the analog port
    soilOutput = analogRead(moistureSensor);

    Serial.print("Moisture Sensor Value:");
    Serial.println(soilOutput);
  }
}
