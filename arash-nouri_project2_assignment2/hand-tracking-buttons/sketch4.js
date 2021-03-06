// Original code by Mark Shufflebottom, made in Winter 2021

// Modified by Arash Nouri in October 2021

let cam;
let poseNet;
let btn1, btn2, btn3;
let controller = "Section 1";
let handL, handR;

setup = () => {
    createCanvas(windowWidth, windowHeight);
    cam = createCapture(VIDEO);
    cam.hide();
    cam.size(windowWidth, windowHeight);
    poseNet = ml5.poseNet(cam, {
        flipHorizontal: true //flips interaction
    }, modelReady);
    poseNet.on('pose', gotPoses);

    handL = createVector(width / 2, height / 2);
    handR = createVector(width / 2, height / 2);

    noStroke();
    // Positions of buttons modified to fit into thirds on the screen
    btn1 = new HButton((width / 3) - 200, height - 200, "Button 1");
    btn2 = new HButton((width / 2), height - 200, "Button 2");
    btn3 = new HButton((width / 1.5) + 200, height - 200, "Button 3");
}


// Retrieves coordinates of left and right wrists
let gotPoses = (poses) => {
    //console.log(poses);
    //only detect if there is a person
    if (poses.length > 0) {
        handL.x = lerp(poses[0].pose.keypoints[9].position.x, handL.x, 0.5);
        handL.y = lerp(poses[0].pose.keypoints[9].position.y, handL.y, 0.5);
        handR.x = lerp(poses[0].pose.keypoints[10].position.x, handR.x, 0.5);
        handR.y = lerp(poses[0].pose.keypoints[10].position.y, handR.y, 0.5);
    }
}

let modelReady = () => {
    console.log('model ready');
}

draw = () => {
    //flip the video to match interaction
    push();
    translate(windowWidth, 0);
    scale(-1.0, 1.0);
    image(cam, 0, 0, windowWidth, windowHeight);
    scale(1.0, 1.0);
    pop();

    //Fade background
    fill(250, 250, 250, 200);
    rect(0, 0, width, height);

    //draw buttons, pass in hand positions to check if over
    btn1.update(handL.x, handL.y, handR.x, handR.y);
    btn2.update(handL.x, handL.y, handR.x, handR.y);
    btn3.update(handL.x, handL.y, handR.x, handR.y);

    //draw hands
    fill(255, 87, 34, 100);
    ellipse(handL.x, handL.y, 50);
    ellipse(handR.x, handR.y, 50);

    //draw content
    fill(50);
    textAlign(CENTER);
    textSize(48);
    if (controller == "Button 1") {
        //content for maybe intro section goes here
        text("First Button", width / 2, height - 450);
    }
    if (controller == "Button 2") {
        mainDraw();
        //main interaction section - probably won't need a button
        text("Second Button", width / 2, height - 450);
    }
    if (controller == "Button 3") {
        //some kind of end section 
        text("Third Button", width / 2, height - 450);
        //reset to beginning after 5 seconds
        setTimeout(() => {
            controller = "Button 1";
        }, 5000);
    }

}


// Draws scattered colourful circles on the screen, triggered when the user hovers their hand over button 2
let mainDraw = () => {
    //this is what you want to draw in your project
    fill(random(255), random(255), random(255));
    for (i = 0; i < 20; i++) {
        let r = random(100) + 20;
        ellipse(random(width), random(height), r, r);
    }
}

class HButton {
    constructor(posX, posY, label) {
        this.x = posX;
        this.y = posY;
        this.label = label;
        this.hover = 0;
    }

    update(lx, ly, rx, ry) {
        rectMode(CENTER);
        fill(92, 107, 192, 100);
        // Defines position & size of buttons
        // Size of buttons increased to allow easier interaction
        rect(this.x, this.y, 360, 320, 10);
        

        let ld = dist(this.x, this.y, lx, ly);
        let rd = dist(this.x, this.y, rx, ry);
        if (ld < 50 || rd < 50) {
            this.hover += 2;
            if (this.hover > 120) {
                controller = this.label;
                this.hover -= 60;
            }
        } else {
            if (this.hover > 0) this.hover -= 6;
            if (this.hover < 0) this.hover = 0;
        }
        fill(63, 81, 181);
        // Hover effect that is triggered when user hovers their hand over button
        rect(this.x, this.y, this.hover, 320, 10);

        rectMode(CORNERS);
        fill(255);
        textAlign(CENTER);
        textSize(48);
        text(this.label, this.x, this.y + 9);

    }
}
