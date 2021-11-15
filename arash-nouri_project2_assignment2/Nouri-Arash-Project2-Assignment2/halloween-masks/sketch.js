let video;
let poseNet;
let eleftX = 0;
let eleftY = 0;
let erightX = 0;
let erightY = 0;
let noseX = 0;
let noseY = 0;
let img;
let img2;
let offsetX = 640;
let offsetY = 480;

// Loads images that are overlayed on user's face

function preload() {
    img = loadImage('img/oni.png');
    img2 = loadImage('img/ghost.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    poseNet = ml5.poseNet(video, modelReady);
    video.hide();
    poseNet.on('pose', gotPoses);
}

// Find keypoints corresponding with the left eye, right eye, & nose
// 

function gotPoses(poses) {
    // console.log(poses);	
    if (poses.length > 0) {
        let neweX = poses[0].pose.keypoints[1].position.x;
        let neweY = poses[0].pose.keypoints[1].position.y;
        let newerX = poses[0].pose.keypoints[2].position.x;
        let newerY = poses[0].pose.keypoints[2].position.y;

        // Nose code, used to overlay image directly on top of face
        let posnoseX = poses[0].pose.keypoints[0].position.x;
        let posnoseY = poses[0].pose.keypoints[0].position.y;
        eleftX = lerp(eleftX, neweX, 0.5);
        eleftY = lerp(eleftY, neweY, 0.5);
        erightX = lerp(erightX, newerX, 0.5);
        erightY = lerp(erightY, newerY, 0.5);

        // Nose code, used to overlay image directly on top of face
        // noseX = lerp(noseX, posnoseX, 0.5);
        // noseY = lerp(noseY, posnoseY, 0.5);
        noseX = posnoseX;
        noseY = posnoseY;
    }
}

function modelReady() {
    console.log('model ready');
}

// Original code that draws a pair of glasses on user's face using eye coordinates

// function draw() {
//     image(video, 0, 0);
//     let d = dist(eleftX, eleftY, erightX, erightY)
//     fill(255, 255, 255, 80);
//     strokeWeight(2);
//     ellipse(eleftX, eleftY, d - 10);
//     ellipse(erightX, erightY, d - 10);
// }

// Image is overlayed & centered on face, follows nose coordinates
// Original code kept to dynamically resize image based on distance between eyes

function draw() {
    image(video, 0, 0, windowWidth, windowHeight);
    
    // Tracks distance between eyes, used to dynamically resize image based on how far away user's head is from camera
    let d = dist(eleftX, eleftY, erightX, erightY) * 8;
    
    // image(img, noseX, noseY, d * 8, d * 8);
    // image(img, noseX, noseY, 100, 100);

    // textSize(20); fill(255); noStroke();
    // text(d, 400, 400);
    // text("input-X = "+Math.round(noseX), 200, 50);
    // text("input-Y = "+Math.round(noseY), 50, 50);
    // stroke(255, 0, 0); strokeWeight(5);
    // line(0, 0, noseX *  (windowWidth / offsetX), noseY * (windowHeight / offsetY));
    
    image(img, noseX * (windowWidth / offsetX) - (d / 2), noseY * (windowHeight / offsetY) - (d / 2), d, d);
}

// Function to detect specific keypress & execute code, in this case it's supposed to swap the images using the number keys
// Doesn't work

// function keyTyped() {
//     if (key === '1') {
//         image(img, noseX * 1.3, noseY * 0.8, [d * 8], [d * 8]);
//     } else if (key === '2') {
//         image(img2, noseX * 1.3, noseY * 0.8, [d * 8], [d * 8]);
//     }
// uncomment to prevent any default behavior
// return false;
// }