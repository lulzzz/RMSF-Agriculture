/*Description: 
 *
 * Functions to convert sensor data to bytes in order to be sent uplink to TTN
 * Functions to convert downlink data of type data, to decimal data
*/

#ifndef PAYLOAD
#define PAYLOAD

//arduino.h needed to declare byte type
#include <Arduino.h>

void readingsToBytes(byte *data, float humidty, float temp, float moisture, bool pump);

float toPercentage(float value);

#endif
