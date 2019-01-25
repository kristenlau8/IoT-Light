# IoT-Light
A wifi-controlled RGB LED, implemented using Particle's Photon.

This project uses the built-in RGB LED on the Photon from Particle. From the webpage, after you create a user or log in, you can control the LED using the webpage. You can turn the light on or off, set different colors, make it fade on or off, set timers, pick a default "favorite" color, and more.


Some important files:
* index.html: the html file! the homepage! From here, you can control the light, adjust settings, and pick your favorite color.
* index.js: this JavaScript controls the features of the homepage. It updates and saves all the settings and variables.
* led.js: a JavaScript model of the led. contains the functions that call the actual functions on the hardware.
* led/src/led.ino: the actual code that controls the hardware, aka the light itself. Implements all the features.

:)
