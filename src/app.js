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
  position: new Vector2(0, 60),
  size: new Vector2(144, 30),
  text: "%A %d %b",
  font: 'gothic-28',
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

// Create weather text
var loadingText = new UI.Text({
  position: new Vector2(0, 110),
  size: new Vector2(144, 30),
  text: "Loading...",
  font: 'gothic-18-bold',
  color: 'black',
  textAlign: 'center'
});

// Add the TimeText
window.add(loadingText);

var URL = 'http://wsiphone.theweather.com.au/?lt=APLOC&lc=753&obs=3(closest=4)&locdet=1&format=json&u=12994-1440&k=43F01DF1E32AB99EE694D1A1EEF497EC';
var timeOut = 10; // minutes

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
      
      var temperature = data.countries[0].locations[0].conditions[2].temperature + "°";
  
      // Create weather text
      var temperatureText = new UI.Text({
        position: new Vector2(0, 100),
        size: new Vector2(144, 30),
        text: temperature,
        font: 'bitham-42-bold',
        color: 'black',
        textAlign: 'center'
      });
  
      window.remove(loadingText);
      window.add(temperatureText);
        
    },
    function(error) {
      // Failure!
      console.log('Failed fetching weather data: ' + error);
      window.add(loadingText);
    }
  );
}

getWeather();
setTimeout(function () {
  getWeather();
}, timeOut * 60 * 1000);
