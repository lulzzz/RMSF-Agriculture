/*Description: 
 *
 * Functions to convert sensor data to bytes in order to be sent uplink to TTN
 * Functions to convert downlink data of type data, to decimal data
*/


//arduino.h needed to declare byte type
#include <Arduino.h>

#define MAX_MOISTURE 500
#define MAX_HUMIDITY 500

//to distinguish MAX_xxx when converting to percentage
#define MOISTURE 1
#define HUMIDITY 2

void readingsToBytes(byte *data, float humidty, float temp, float moisture);

float toPercentage(float value, int type);

