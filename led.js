//declaring the necessary parameters to publish to particle
var myParticleAccessToken = "40de97ea3c34ebca640311b77e8d0b2cb5415788"
var myDeviceId =            "27002a001247363336383437"
var topic =                 "LED"

//model of the led with all the relevant variables
var led = {
  red: 255,
  blue: 255,
  green: 255,
  fadered: 0,
  fadeblue: 0,
  fadegreen: 0,
  timer: 10,
  blinkenabled: false,
  blink: 1,
  stateChangeListener: null,
  particle: null,

  //calls particle function to change the light on the photon
  changeLight: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "lighton", argument: "", auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  //calls particle function to turn the light off
  lightOff: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "lightoff", argument: "", auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  //fades the light
  fadeLight: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "fade", argument: "", auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  //fades the light all the way to off
  fadeOff: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "fadeoff", argument: "", auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  //sets the timer to change the light
  timerChange: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "timerchange", argument: String(this.timer), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  //sets the timer to fade the light (again, not used)
  timerFade: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "timerfade", argument: String(this.timer), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  //changes whether or not blinking is enabled
  setBlinkEnabled: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "setblink", argument: String(this.blinkenabled), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  //changes the speed of the blinking
  setBlinkTime: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "setBlinkTime", argument: String(this.blink), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },

  //I AM LAZY AND DON'T WANT TO WRITE SO MANY COMMENTS SO THE NEXT SIX FUNCTIONS CALL PARTICLE FUNCTIONS
  //IN ORDER TO CHANGE THE COLOR VALUES (rgb and rgb values to fade to)

  sendRed: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "setRed", argument: String(this.red), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  sendBlue: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "setBlue", argument: String(this.blue), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  sendGreen: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "setGreen", argument: String(this.green), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  sendFadeRed: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "fadered", argument: String(this.fadered), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },
  sendFadeGreen: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "fadegreen", argument: String(this.fadegreen), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },

  sendFadeBlue: function() {
    var fnPr = particle.callFunction({deviceId: myDeviceId, name: "fadeblue", argument: String(this.fadeblue), auth: myParticleAccessToken });
    fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
  },



  //observer function
  setStateChangeListener: function(listener) { //observer function
    this.stateChangeListener = listener
    this.stateChange();
  },

  stateChange: function() { //observer helper function
    var callingObject = this
    if(callingObject.stateChangeListener) {
      var state = { red: this.red,
                    blue: this.blue,
                    green: this.green,
                    fadered: this.fadered,
                    fadeblue: this.fadeblue,
                    fadegreen: this.fadegreen,
                    timer: this.timer,
                    blinkenabled: this.blinkenabled,
                    blink: 0,
                  }
    setTimeout(callingObject.stateChangeListener,100);
  }},

  setup: function() {//setup function: creates particle object and subscribes to the event stream
    // Create a particle object
    particle = new Particle();
  }}
