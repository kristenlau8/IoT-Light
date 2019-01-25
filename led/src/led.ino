/*
 * Project led
 * Description:
 * Author:
 * Date:
 */
//citation: I followed some of the code from here: https://www.hackster.io/brandonsatrom/using-nativescript-to-build-particle-powered-mobile-apps-ea6e99
LEDStatus blinkLED;

int red = 255;
int green = 255;
int blue = 255;

int fadered = 0;
int fadegreen = 0;
int fadeblue = 0;
bool blinkEnabled = false;
int blink = 0;

//timers for when to turn on and off the light
Timer timerChange(1000, timerChangeHelp, TRUE);
Timer timerFade(1000, timerFadeHelp, TRUE);

void setup() {
  // Put initialization like pinMode and begin functions here.
  Serial.begin(9600);
  blinkLED.setActive(true);
  blinkLED.off();
  //all my particle functions!!
  Particle.function("lighton", lightOn);
  Particle.function("lightoff", lightOff);
  Particle.function("setred", setRed);
  Particle.function("setgreen", setGreen);
  Particle.function("setblue", setBlue);
  Particle.function("fadered", setFadeRed);
  Particle.function("fadegreen", setFadeGreen);
  Particle.function("fadeblue", setFadeBlue);
  Particle.function("fade", fade);
  Particle.function("fadeoff", fadeOff);
  Particle.function("timerchange", timerChangeFunc);
  Particle.function("timerfade", timerFadeFunc);
  Particle.function("setblink", setBlink);
  Particle.function("setBlinkTime",setBlinkTime);
}

// loop() runs over and over again, as quickly as it can execute.
void loop() {
  // The core of your code will likely live here.
}

//turns the light on to a specific color
int lightOn(String arg) {
 // Set to false in case we're switching between modes
 //RGB.control(false);
 // Convert the R, G, B values to hex with some fancy bit shifting
 long RGBHex = (red << 16) | (green << 8) | blue;
 // Set the color, pattern and speed and activate our LED
 blinkLED.on();
 blinkLED.setColor(RGBHex);
 if (blinkEnabled) {
   blinkLED.setPattern(LED_PATTERN_BLINK);
   if(blink==0) {
     blinkLED.setSpeed(LED_SPEED_SLOW);
   }
   else if (blink==1) {
     blinkLED.setSpeed(LED_SPEED_NORMAL);
   }
   else if (blink==2) {
     blinkLED.setSpeed(LED_SPEED_FAST);
   }
 }
 else {
   blinkLED.setPattern(LED_PATTERN_SOLID);
 }
 return 1;
}

//turns the light off
int lightOff(String arg) {
  blinkLED.off();
  return 1;
}

//sets the red value
int setRed(String arg) {
  red = atoi(arg);
  return 1;
}
//sets the blue value
int setBlue(String arg) {
  blue = atoi(arg);
  return 1;
}
//sets the green value
int setGreen(String arg) {
  green = atoi(arg);
  return 1;
}
//sets the red value to fade to
int setFadeRed(String arg) {
  fadered = atoi(arg);
  return 1;
}
//sets the blue value to fade to
int setFadeBlue(String arg) {
  fadeblue = atoi(arg);
  return 1;
}
//sets the green value to fade to
int setFadeGreen(String arg) {
  fadegreen = atoi(arg);
  return 1;
}

//fades the light! Basically it gets as close as it can but because of ints may never get to the exact number from before.
int fade(String arg) {
  int redDelta = (fadered-red)/50.0;
  int goalRed = red + (redDelta*50);
  int greenDelta = (fadegreen-green)/50.0;
  int goalGreen = green + (greenDelta*50);
  int blueDelta = (fadeblue-blue)/50.0;
  int goalBlue = blue+(blueDelta*50);
  while(red!=goalRed | blue!=goalBlue | green!=goalGreen) {
    red = red+redDelta;
    green = green+greenDelta;
    blue = blue+blueDelta;
    lightOn("");
    Serial.println("r: "+String(red)+" g: "+String(green)+" b: "+String(blue));
    delay(100);
  }
  if(red==0&&blue==0&&green==0) {
    red = 255;
    blue = 255;
    green = 255;
  }
  return 1;
}

//fades the light off - this one will go 100% of the way off no matter what (always exactly reaches goal, which makes it different from the normal fade)
int fadeOff(String arg) {
  float redDelta = (0-red)/50.0;
  float greenDelta = (0-green)/50.0;
  float blueDelta = (0-blue)/50.0;
  while(red!=0 | blue!=0 | green!=0) {
    if (red+redDelta<=0) {
      red = 0;
    }
    else {
      red = red+redDelta;
    }
    if (green +greenDelta<=0) {
      green = 0;
    }
    else {
      green = green+greenDelta;
    }
    if(blue+blueDelta<=0) {
      blue=0;
    }
    else {
      blue = blue+blueDelta;
    }
    lightOn("");
    Serial.println("r: "+String(red)+" g: "+String(green)+" b: "+String(blue));
    delay(100);
  }
    red = 255;
    blue = 255;
    green = 255;
  return 1;

}

//starts the timer to change the light
int timerChangeFunc(String arg) {
  int interval = atoi(arg);
  timerChange.changePeriod(interval*1000);
}

//helper function that is called from the change light timer
void timerChangeHelp() {
  lightOn("");
}

//starts the timer to fade the light
int timerFadeFunc(String arg) {
  int interval = atoi(arg);
  timerFade.changePeriod(interval*1000);
}

//helper function called from fade light timer
void timerFadeHelp() {
  fade("");
}

//enables and disables blinking
int setBlink(String arg) {
  if (arg=="true") {
    blinkEnabled = true;
    lightOn("");
  }
  else {
    blinkEnabled = false;
    lightOn("");
  }
}
//sets the speed of the blinking
int setBlinkTime(String arg) {
  blink = atoi(arg);
  lightOn("");
}
