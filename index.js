//just some variables to keep track of colors and things
var oldcolor = 0x000000;
var tempfader = 0;
var tempfadeg = 0;
var tempfadeb = 0;
var username = null;
var hastimer = false;
var hasfave = false;

//LOVE THE COLOR PICKER!!! The code is from here: https://github.com/DavidDurman/FlexiColorPicker david durman ROCKS
ColorPicker(

  document.getElementById('color-picker'),

  function(hex, hsv, rgb) {
      console.log(hsv.h, hsv.s, hsv.v);         // [0-359], [0-1], [0-1]
      console.log(rgb.r, rgb.g, rgb.b);         // [0-255], [0-255], [0-255]
      led.red = rgb.r;
      led.green = rgb.g;
      led.blue = rgb.b;
      tempfader = rgb.r;
      tempfadeg = rgb.g;
      tempfadeb = rgb.b;
      document.getElementById("newcolor").style.backgroundColor = hex;        // #HEX
      oldcolor = hex;
  });


//hash code from here: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  String.prototype.hashCode = function(){
  	var hash = 0;
  	if (this.length == 0) return hash;
  	for (i = 0; i < this.length; i++) {
  		char = this.charCodeAt(i);
  		hash = ((hash<<5)-hash)+char;
  		hash = hash & hash; // Convert to 32bit integer
  	}
  	return hash;
  }

//sets up firebase
function setUpFirebase() {
  var config = {
    apiKey: "AIzaSyBeScXnnjSXX8md0bGRyR1BwMJwa0Z1ve0",
    authDomain: "rgb-led-f92c6.firebaseapp.com",
    databaseURL: "https://rgb-led-f92c6.firebaseio.com",
    projectId: "rgb-led-f92c6",
    storageBucket: "rgb-led-f92c6.appspot.com",
    messagingSenderId: "839264461668"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
}

//navigates to home screen
function toHome(event) {
  document.getElementById("login").hidden=true;
  document.getElementById("advancedsettings").hidden=true;
  document.getElementById("home").hidden=false;
  displayFave(hasfave);
  displaytimer(hastimer);
}

//navigates to advanced screen
function toAdvancedSettings(event) {
  document.getElementById("login").hidden=true;
  document.getElementById("home").hidden=true;
  document.getElementById("advancedsettings").hidden=false;
}

//navigates to login screen
function toLogin(event) {
  document.getElementById("login").hidden=false;
  document.getElementById("advancedsettings").hidden=true;
  document.getElementById("home").hidden=true;
}

//changes the color of the light instantly
function changeColor(event) {
  led.sendRed();
  led.sendGreen();
  led.sendBlue();
  console.log("red: "+led.red+" green: "+led.green+" blue: "+led.blue);
  led.changeLight();
  document.getElementById("currentcolor").style.backgroundColor = oldcolor;
}

//turns the light off
function turnOff(event) {
  led.lightOff();
}

//fades the light to a certain color
function fadeColor(event) {
  led.fadered = tempfader;
  led.fadegreen = tempfadeg;
  led.fadeblue = tempfadeb;
  led.sendFadeRed();
  led.sendFadeGreen();
  led.sendFadeBlue();
  led.fadeLight();
  document.getElementById("currentcolor").style.backgroundColor = oldcolor;
}

//fades the light off
function fadeOff(event) {
  led.fadeOff();
}

//starts a timer to change the light
function timerChange(event) {
  led.timer = document.getElementById("timer").value;
  led.sendRed();
  led.sendGreen();
  led.sendBlue();
  led.timerChange();
  document.getElementById("currentcolor").style.backgroundColor = oldcolor;
}

//stars a timer to fade the light (didn't end up using because javascript wasn't sending the right values)
function timerFade(event) {
  led.timer = document.getElementById("timer").value;
  led.fadered = tempfader;
  led.fadegreen = tempfadeg;
  led.fadeblue = tempfadeb;
  led.sendFadeRed();
  led.sendFadeGreen();
  led.sendFadeBlue();
  led.fadeLight();
  led.timerChange();
  console.log(led.timer);
  document.getElementById("currentcolor").style.backgroundColor = oldcolor;
}

//turns on the blinking
function turnOnBlinking(event) {
  led.blinkenabled = true;
  led.setBlinkEnabled();
}

//turns off the blinking
function turnOffBlinking(event) {
  led.blinkenabled = false;
  led.setBlinkEnabled();
}

//changes the speed of the blinking
function setBlinkTime(event) {
  led.blink = document.getElementById("blinkspeed").value;
  led.setBlinkTime();
}

//user can register!!
function registerUser(event) {
  console.log("got to registerUser");
  username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  //checks firebase to see if user already registered
  firebase.database().ref().child("users").orderByChild("username").equalTo(username).once("value", function(snapshot) {
    if (snapshot.exists()) {
     alert("Username already taken");
   }else{
    firebase.database().ref('users/' + username).set({
      username: username,
      password: password.hashCode()+username.hashCode()
    });
     toHome();
   }
});
}

//user can log in
function logIn(event) {
  username = document.getElementById("username").value;
  var password = document.getElementById("password").value.hashCode()+username.hashCode();
  firebase.database().ref('users/' + username + '/password').once('value', function(snapshot) {
    if (snapshot.val()==password) {
     console.log("Success!");
     firebase.database().ref('users/' + username + '/favecolor').once('value', function(snapshot) {
       if(snapshot.exists()) {
         hasfave = true;
         displayFave(hasfave);
       };
     })
     firebase.database().ref('users/' + username + '/timer').once('value', function(snapshot) {
       if(snapshot.exists()) {
         hastimer = true;
         displaytimer(hastimer);
       };
     })
     toHome();
   }else{
    alert("Incorrect username/password.")
   }
});
}

//logs the user out and resets a whole bunch of variables
function logOut(event) {
  username = null;
  hasfave = false;
  hastimer = false;
  oldcolor = 0x000000;
  var tempfader = 0;
  var tempfadeg = 0;
  var tempfadeb = 0;
  toLogin();
}

//deletes the user's account
function deleteAccount(event) {
  var verifpass = document.getElementById("verifypassword").value.hashCode()+username.hashCode();
  firebase.database().ref('users/' + username + '/password').once('value', function(snapshot) {
    if (snapshot.val()==verifpass) {
        firebase.database().ref('users/' + username).remove();
        logOut();
    }
    else {
      alert("Incorrect password.");
    }
});
}
//changes the users password
function changePassword(event) {
  var oldpass = document.getElementById("oldpassword").value.hashCode()+username.hashCode();
  var newpass = document.getElementById("newpassword").value.hashCode()+username.hashCode();
  firebase.database().ref('users/' + username + '/password').once('value', function(snapshot) {
    if (snapshot.val()==oldpass) {
        firebase.database().ref('users/' + username+'/password').set(newpass);
      alert("Password changed.");
    }
    else {
      alert("Incorrect old password.");
    }
});
}
//selects the user's favorite color
function makeFaveColor(event) {
  firebase.database().ref('users/'+username+'/favecolor').set({
    hex: oldcolor,
    r: tempfader,
    g: tempfadeg,
    b: tempfadeb
  })
  hasfave = true;
  displayFave(true);
}
//displays the user's favorite color
function displayFave(hasfave) {
  document.getElementById("favorites").hidden = (!hasfave);
  firebase.database().ref('users/' + username + '/favecolor/hex').once('value', function(snapshot) {
    document.getElementById("favecolor").style.backgroundColor=snapshot.val();
})
}
//the next two functions make the favorite color the new color - asynchronous bc getting the firebase variables takes some time and i think this helps
async function applyFaveColor() {
  firebase.database().ref('users/' + username + '/favecolor/hex').once('value', function(snapshot) {
    document.getElementById("newcolor").style.backgroundColor=snapshot.val();
    oldcolor = snapshot.val();
  })
  firebase.database().ref('users/' + username + '/favecolor/r').once('value', function(snapshot) {
    led.red = snapshot.val();
    console.log("favered: " +snapshot.val());
    tempfader = snapshot.val();
  })
  firebase.database().ref('users/' + username + '/favecolor/g').once('value', function(snapshot) {
    led.green = snapshot.val();
    console.log("favegreen: " +snapshot.val());
    tempfadeg = snapshot.val();
  })
  firebase.database().ref('users/' + username + '/favecolor/b').once('value', function(snapshot) {
    led.blue = snapshot.val();
    console.log("faveblue: " +snapshot.val());
    tempfadeb = snapshot.val();
  })
}

async function applyHelper() {
  await applyFaveColor();
  console.log("red: "+led.red+" green: "+led.green+" blue: "+led.blue);
}

//displays the default timer setting
function displaytimer(hastimer) {
  if (hastimer) {
    firebase.database().ref('users/' + username + '/timer').once('value', function(snapshot) {
      document.getElementById("timer").value=snapshot.val();
    });
  }
}

//sets the default timer
function setDefaultTimer(event) {
  var data ={timer: document.getElementById("defaulttimer").value};
  firebase.database().ref('users/'+username+'/timer').set(document.getElementById("defaulttimer").value);
  hastimer = true;
  };

//document things
document.addEventListener("DOMContentLoaded", function(event) {
    led.setup(); //sets up the led and connects it to particle
    console.log("everything loaded");
    toLogin();

    setUpFirebase();

    //event listeners!!!
    document.getElementById("changeLight").addEventListener("click", changeColor);
    document.getElementById("fadeLight").addEventListener("click", fadeColor);
    document.getElementById("turnOff").addEventListener("click", turnOff);
    document.getElementById("fadeOff").addEventListener("click", fadeOff);
    document.getElementById("timerChange").addEventListener("click", timerChange);
    //document.getElementById("timerFade").addEventListener("click", timerFade);
    document.getElementById("blinkon").addEventListener("click", turnOnBlinking);
    document.getElementById("blinkoff").addEventListener("click", turnOffBlinking);
    document.getElementById("blinkspeed").addEventListener("click", setBlinkTime);
    document.getElementById("backbutton").addEventListener("click",toHome);
    document.getElementById("toAdvanced").addEventListener("click",toAdvancedSettings);
    document.getElementById("registerbutton").addEventListener("click",registerUser);
    document.getElementById("loginbutton").addEventListener("click",logIn);
    document.getElementById("logout").addEventListener("click",logOut);
    document.getElementById("deleteaccount").addEventListener("click",deleteAccount);
    document.getElementById("changepassword").addEventListener("click",changePassword);
    document.getElementById("changedefaulttimer").addEventListener("click",setDefaultTimer);
    document.getElementById("fave").addEventListener("click",makeFaveColor);
    document.getElementById("applyfave").addEventListener("click",applyHelper);


    //led.setStateChangeListener(stateUpdate);
})
