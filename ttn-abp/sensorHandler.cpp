
/*Description: 
 *
 * Functions to handle and get sensor data
*/

#include "sensorHandler.h"

int moistureSensor = A6;

void getSensorValues(DHT *dht, float *humidity, float *temp, float *moisture) {
	
   float h = dht->readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht->readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
	// reads the moisture data from the analog port
	(*moisture) = analogRead(moistureSensor);
	//stores values read
	(*humidity) = h;
	(*temp) = t;
  
	return;
}

