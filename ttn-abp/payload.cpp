/*Description: 
 *
 * Functions to convert sensor data to bytes in order to be sent uplink to TTN
 * Functions to convert downlink data of type data, to decimal data
*/


#include "payload.h"



/* Função que converte 3 valores, cada com 2 casas 
 * decimais para um array de bytes (0 a 255) */

/*falta remendar temperatura negativa, ver como fazem no loraserialization*/
void readingsToBytes(byte *data, float humidity, float temp, float moisture) {
	
	//multiplies by 100 to get ride of the decimal point
	//max range value 99.99 -> 9999
	int _temp = temp*100;
	int percentHumidity = toPercentage(humidity, HUMIDITY)*100;
	int percentMoisture = toPercentage(moisture, MOISTURE)*100;

	//clears buffer
	memset(data, 0, 5);
 
  //exemplo: _temp1 = 8000 = 1111101000000
	data[0] = (byte)_temp; //= 01000000 = 64, sacar os 1ºs 8 bits do numero
	data[1] = (byte)(_temp >> 8); // = 11111 = 31 //=sacar 2ºs 8 bits dum numero
	data[2] = (byte)percentHumidity;
	data[3] = (byte)(percentHumidity >> 8);
	data[4] = (byte)percentMoisture;
	data[5] = (byte)(percentMoisture >> 8);
	return;
}

float toPercentage(float value, int type){
	if(type == MOISTURE)
		return 100*(value/MAX_MOISTURE);
	if(type == HUMIDITY)
		return 100*(value/MAX_HUMIDITY);
	
	//shouldn't get here
	return -1;
	
}
