// Sourced from https://github.com/IXD-Pcomp/IOandE-Fall-Semester
// Sound sensor code sourced from https://sensorkit.arduino.cc/sensorkit/module/lessons/lesson/06-the-sound-sensor

// Modified in October 2021 by Arash Nouri
// This sketch uses 3 analog inputs (potentiometer, light sensor, sound sensor) to modulate generated sounds & graphics in p5js

#define button 4

int potentiometer = A0;
int light_sensor = A3;
// Added sound sensor
int sound_sensor = A2;
int sensors[3];


void setup() {
  // start serial port at 9600 bps:
  Serial.begin(9600);
  pinMode(potentiometer, INPUT);

}

void loop() {
  // this example uses sensors with a different ranges
  //use the map() method to convert the range

  //read the number from the button sensor and put the value
  //into the first index of the Array, repeat for all indexes of the Array

  // Moved light sensor to first array position
  int raw_light = analogRead(light_sensor);
  int light = map(raw_light, 0, 1023, 0, 100);

  sensors[0] = light;

  int sensor_value = analogRead(potentiometer);
  int value = map(sensor_value, 0, 1023, 0, 100);

  sensors[1] = sensor_value;

  // Added sound sensor code, functions similar to light sensor
  int raw_sound = analogRead(sound_sensor);
  int soundSensor = map(raw_sound, 0, 1023, 0, 100);

  sensors[2] = soundSensor;



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
