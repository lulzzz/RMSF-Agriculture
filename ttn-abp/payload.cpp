  /*Description: 
 *
 * Functions to convert sensor data to bytes in order to be sent uplink to TTN
 * Functions to convert downlink data of type data, to decimal data
*/

#include "payload.h"

/* Função que converte 3 valores, cada com 2 casas 
 * decimais para um array de bytes (0 a 255) */

/*falta remendar temperatura negativa, ver como fazem no loraserialization*/
void readingsToBytes(byte *data, float _humidity, float _temp, float moisture) {
	
	//multiplies by 100 to get ride of the decimal point
	//max range value 99.99 -> 9999
	int temp = _temp*100;
	int humidity = _humidity*100;
	int percentMoisture = toPercentage(moisture)*100;

	//clears buffer
	memset(data, 0, 6);
 
  	//exemplo: _temp1 = 8000 = 1111101000000
	data[0] = (byte)temp; //= 01000000 = 64, sacar os 1ºs 8 bits do numero
	data[1] = (byte)(temp >> 8); // = 11111 = 31 //=sacar 2ºs 8 bits dum numero
	data[2] = (byte)humidity;
	data[3] = (byte)(humidity >> 8);
	data[4] = (byte)percentMoisture;
	data[5] = (byte)(percentMoisture >> 8);
	return;
}

float toPercentage(float value){
		return 100*(value/950);
}
