// Sourced from https://github.com/IXD-Pcomp/IOandE-Fall-Semester
// Accelerometer code sourced from https://sensorkit.arduino.cc/sensorkit/module/lessons/lesson/09-the-accelerometer-sensor

// Modified in October 2021 by Arash Nouri
// This sketch uses X, Y, & Z values from the accelerometer to modulate generated sounds & graphics in p5js

#define button 4
#include "Arduino_SensorKit.h"

int sensors[3];


void setup() {
  // start serial port at 9600 bps:
  Serial.begin(9600);
  while (!Serial);

  Accelerometer.begin();

}

void loop() {
  // this example uses sensors with a different ranges
  //use the map() method to convert the range

  //read the number from the button sensor and put the value
  //into the first index of the Array, repeat for all indexes of the Array

  // X coordinates mapped & inserted into array
  int cordX = map(Accelerometer.readX(), -1, 1, 0, 100); // map the value from min, max to 0, 100
  sensors[0] = cordX;

  // Y coordinates mapped & inserted into array
  int cordY = map(Accelerometer.readY(), -1, 1, 0, 100); // map the value from min, max to 0, 100
  sensors[1] = cordY;

  // Z coordinates mapped & inserted into array
  int cordZ = map(Accelerometer.readZ(), -1, 1, 0, 100); // map the value from min, max to 0, 100
  sensors[2] = cordZ;


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
