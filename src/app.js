var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

// Create the Window
var window = new UI.Window();

// Create a background Rect
var bgRect = new UI.Rect({
  position: new Vector2(0, 0),
  size: new Vector2(144, 60),
  backgroundColor: 'white'
});

// Add Rect to Window
window.add(bgRect);

// Create TimeText
var timeText = new UI.TimeText({
  position: new Vector2(0, 5),
  size: new Vector2(144, 30),
  text: "%H:%M",
  font: 'bitham-42-bold',
  color: 'black',
  textAlign: 'center'
});

// Add the TimeText
window.add(timeText);

// Create DateText
var dateText = new UI.TimeText({
  position: new Vector2(0, 68),
  size: new Vector2(144, 30),
  text: "%A %d %b",
  font: 'gothic-18-bold',
  color: 'white',
  textAlign: 'center'
});

// Add the DateText
window.add(dateText);

// Show the Window
window.show();

// Create a background Rect
var weatherBgRect = new UI.Rect({
  position: new Vector2(0, 101),
  size: new Vector2(144, 60),
  backgroundColor: 'white'
});

// Add Rect to Window
window.add(weatherBgRect);

var URL = 'http://wsiphone.theweather.com.au/?lt=APLOC&lc=753&obs=3(closest=4)&locdet=1&format=json&u=12994-1440&k=43F01DF1E32AB99EE694D1A1EEF497EC';
var timeOut = 10; // minutes
var debug = 0;

if (debug) {
  timeOut = timeOut * 1000;
} else {
  timeOut = timeOut * 60 * 1000;
}

// Create weather text
var temperatureText = new UI.Text({
  position: new Vector2(0, 104),
  size: new Vector2(144, 30),
  text: 'loading...',
  font: 'gothic-28-bold',
  color: 'black',
  textAlign: 'center'
});
window.add(temperatureText);

// Create weather last updated text
var lastUpdatedText = new UI.Text({
  position: new Vector2(0,138),
  size: new Vector2(140, 10),
  text: '',
  font: 'gothic-14',
  color: 'black',
  textAlign: 'right'
});
window.add(lastUpdatedText);

function formatTime(input) {
  if (input < 10)  {
    input = "0" + input;
  }
  return input;
}

function getWeather() {
  // Make the request
  ajax(
    {
      url: URL,
      type: 'json',
      cache: false
    },
    function(data) {
      // Success!
      console.log("Successfully fetched weather data!");
      
      var temperature = data.countries[0].locations[0].conditions[2].temperature + "° " + data.countries[0].locations[0].conditions[2].relative_humidity + '%';
      if (debug) {
        temperature = (Math.random()*100).toFixed(1) + "° " + (Math.random()*100).toFixed(1) + '%';
      }
  
      temperatureText.text(temperature);
      console.log(temperature);      
      lastUpdatedText.text('Src: ' + formatTime(new Date(data.countries[0].locations[0].conditions[2].local_time).getHours()) + ':' + formatTime(new Date(data.countries[0].locations[0].conditions[2].local_time).getMinutes()) + ' Refreshed: ' + formatTime(new Date().getHours()) + ':' + formatTime(new Date().getMinutes()));
      
    },
    function(error) {
      // Failure!
      console.log('Failed fetching weather data: ' + error);
      temperatureText.text('Failed');
    }
  );
}

getWeather();
setInterval(function () {
  getWeather();
}, timeOut);
