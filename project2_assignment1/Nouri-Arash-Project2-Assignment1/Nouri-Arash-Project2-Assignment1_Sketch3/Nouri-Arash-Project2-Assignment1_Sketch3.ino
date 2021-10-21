// Sourced from https://github.com/IXD-Pcomp/IOandE-Fall-Semester
// Temperature & humidity code sourced from https://sensorkit.arduino.cc/sensorkit/module/lessons/lesson/08-the-temperature-sensor
// Air pressure sensor code sourced from https://sensorkit.arduino.cc/sensorkit/module/lessons/lesson/07-the-air-pressure-sensor

// Modified in October 2021 by Arash Nouri
// This sketch uses temperature, humidity, & air pressure values from the Sensorkit to modulate generated sounds & graphics in p5js

#define button 4
#include "Arduino_SensorKit.h"

float pressure;
int sensors[3];


void setup() {
  // start serial port at 9600 bps:
  Serial.begin(9600);
  Environment.begin();
  Pressure.begin();

}

void loop() {
  // this example uses sensors with a different ranges
  //use the map() method to convert the range

  //read the number from the button sensor and put the value
  //into the first index of the Array, repeat for all indexes of the Array


  // Temperature values read from sensor & inserted into array, no need for mapping as the range will typically be above 0 and under 100
  int temp = Environment.readTemperature();
  sensors[0] = temp;

  // Humidity values read from sensor & inserted into array, no need for mapping as the range is already 0-100
  int hum = Environment.readHumidity();
  sensors[1] = hum;

  // Air pressure values read from sensor & inserted into array, divided by 2000 in order to bring range down
  int pressure = Pressure.readPressure() / 2000;
  sensors[2] = pressure;


  for (int thisSensor = 0; thisSensor < 3; thisSensor++) {

    int sensorValue = sensors[thisSensor];

    // if you're on the last sensor value, end with a println()
    // otherwise, print a comma
    //The number of sensors needs to be hard coded, in this example 3 sensors are running 0,1,2

    Serial.print(sensorValue);
    if (thisSensor == 2) {
      Serial.println();
    } else {
      Serial.print(", ");
    }
  }
  delay(100);
}
