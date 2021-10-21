/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

// Modified in October 2021 by Arash Nouri
// This sketch interfaces with temperature, humidity, & air pressure values from the Sensorkit
// The 3 values manipulate the size of the ellipses & the frequency of oscillations
// Code has been modified to help visually & audibly separate the 3 inputs
// Ellipses have been positioned roughly following a 3 column grid

let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0,
  diameter1 = 0,
  diameter2 = 0;

let osc1, osc2, osc3, fft;

function setup() {

  createCanvas(windowWidth, windowHeight);

  ///////////////////////////////////////////////////////////////////
  //Begin serialport library methods, this is using callbacks
  ///////////////////////////////////////////////////////////////////    


  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  //////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("COM3");
  /////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  // Here are the callbacks that you can register

  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  // Callback to get the raw data, as it comes in for handling yourself
  //serial.on('rawdata', gotRawData);
  // OR
  //serial.onRawData(gotRawData);


}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////

// Changed oscillator waveforms to be unique for each sensor
osc1 = new p5.TriOsc(); // set frequency and type
osc1.amp(.5);
osc2 = new p5.SawOsc(); // set frequency and type
osc2.amp(.5);
osc3 = new p5.SinOsc(); // set frequency and type
osc3.amp(.5);

fft = new p5.FFT();
osc1.start();
osc2.start();
osc3.start();

// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
  var currentString = serial.readLine(); // read the incoming string
  trim(currentString); // remove any trailing whitespace
  if (!currentString) return; // if the string is empty, do no more
  console.log("currentString  ", currentString); // println the string
  latestData = currentString; // save it for the draw method
  console.log("latestData" + latestData); //check to see if data is coming in
  splitter = split(latestData, ', '); // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  diameter0 = splitter[0]; //put the first sensor's data into a variable
  diameter1 = splitter[1];
  diameter2 = splitter[2];



}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {

  // Changed background colour to light grey to save your eyeballs
  background('#F5F5F5');
  // Gave some padding to the text so it doesn't render in the corner
  text('Temperature / Humidity / Air pressure Values: ' + latestData, 40, 60);
  // Made the text larger & more legible & swapped out the default font for a monospaced one
  textFont('Space Mono', 24);
  ellipseMode(RADIUS);
  // Colour of ellipse changed to turquoise
  fill('#0097A7');
  noStroke();
  //console.log("diameter0  "  + diameter0);
  // Changed coordinates of 1st ellipse so it's centred to the left of the canvas
  // Diameter of ellipse doubled
  ellipse(windowWidth / 4, windowHeight / 2, diameter0 * 2, diameter0 * 2);
  ellipseMode(RADIUS);
  // Colour of ellipse changed to orange
  fill('#FFA000');
  // Changed coordinates of 2nd ellipse so it's centred on the canvas
  // Diameter of ellipse quartered
  ellipse(windowWidth / 2, windowHeight / 2, diameter1 * 2, diameter1 * 2);
  ellipseMode(RADIUS);
  // Colour of ellipse changed to maroon
  fill('#AD1457');
  // Changed coordinates of 3rd ellipse so it's centred to the right of the canvas
  // Diameter of ellipse doubled
  ellipse(windowWidth / 1.33, windowHeight / 2, diameter2 * 2, diameter2 * 2);


  var freq = map(diameter0 * 4, 0, width, 40, 880);
  osc1.freq(freq);
  //console.log(freq);

  var freq2 = map(diameter1, 0, width, 40, 880);
  osc2.freq(freq2);
  //console.log(freq2);

  var freq3 = map(diameter2 * 4, 0, width, 40, 880);
  osc3.freq(freq3);
  //console.log(freq3); 
}


function mouseClicked() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("getAudioContext().state" + getAudioContext().state);
  }
};