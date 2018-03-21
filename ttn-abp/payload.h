/*Description: 
 *
 * Functions to convert sensor data to bytes in order to be sent uplink to TTN
 * Functions to convert downlink data of type data, to decimal data
*/


//arduino.h needed to declare byte type
#include <Arduino.h>

#define MAX_MOISTURE 950


void readingsToBytes(byte *data, float humidty, float temp, float moisture);

float toPercentage(float value);

