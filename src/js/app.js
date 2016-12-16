var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Accel = require('ui/accel');

// Create the Window
var window = new UI.Window({
    fullscreen: true
});

// Create a background Rect
var bgRect = new UI.Rect({
    position: new Vector2(0, 0),
    size: new Vector2(144, 60),
    backgroundColor: 'black'
});

// Add Rect to Window
window.add(bgRect);

// Create TimeText
var timeText = new UI.TimeText({
    position: new Vector2(0, 0),
    size: new Vector2(144, 30),
    text: "%H:%M",
    font: 'roboto-bold-subset-49',
    color: 'white',
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
    backgroundColor: 'white',
});

// Add Rect to Window
window.add(weatherBgRect);

var URL = 'https://duye6s9eck35u.cloudfront.net/';
var timeOut = 9; // minutes
var debug = 0;

if (debug) {
    timeOut = timeOut * 1000;
} else {
    timeOut = timeOut * 60 * 1000;
}

// Create weather text
var outside_temperatureText = new UI.Text({
    position: new Vector2(0, 104),
    size: new Vector2(50, 30),
    text: '...',
    font: 'gothic-28-bold',
    color: 'black',
    textAlign: 'center'
});
window.add(outside_temperatureText);

var humidityText = new UI.Text({
    position: new Vector2(51, 104),
    size: new Vector2(45, 30),
    text: '...',
    font: 'gothic-24-bold',
    color: 'black',
    textAlign: 'center'
});
window.add(humidityText);

var inside_temperatureText = new UI.Text({
    position: new Vector2(96, 104),
    size: new Vector2(45, 30),
    text: '...',
    font: 'gothic-24-bold',
    color: 'black',
    textAlign: 'center'
});
window.add(inside_temperatureText);


// Create weather last updated text
var lastUpdatedText = new UI.Text({
    position: new Vector2(0, 145),
    size: new Vector2(144, 10),
    text: '',
    font: 'gothic-14',
    color: 'black',
    textAlign: 'center'
});
window.add(lastUpdatedText);

function formatTime(input) {
    if (input < 10) {
        input = "0" + input;
    }
    return input;
}
var lastUpdated;

function getWeather() {
    lastUpdatedText.text('Loading...');
    lastUpdated = new Date().getTime();
    // Make the request
    ajax({
            url: URL,
            type: 'json',
            cache: false
        },
        function(data) {
            // Success!
            console.log("Successfully fetched weather data!");

            var outside_temperature = data['outside:temperature'];
            var inside_temperature = parseFloat(data['downstairs:temperature']).toFixed(1);
            var humidity = data['outside:humidity'].slice(0, 2);
            if (debug) {
                outside_temperature = (Math.random() * 100).toFixed(1) + "° " + (Math.random() * 100).toFixed(1) + '%';
            }

            outside_temperatureText.text(outside_temperature + "°");
            inside_temperatureText.text(inside_temperature + "°");
            humidityText.text(humidity + "%");
            console.log(outside_temperature + '° ' + inside_temperature + '° ' + humidity + "%");
            var lastUpdatedTime = data.datetime.slice(11, 16);
            lastUpdatedText.text('Src: ' + lastUpdatedTime + ' Ref: ' + formatTime(new Date().getHours()) + ':' + formatTime(new Date().getMinutes()));

            //       // Graph of humidity
            //       var humidityRectBlack = new UI.Rect({
            //         position: new Vector2(0, 140),
            //         size: new Vector2(Math.round((humidity/100)*144), 4),
            //         backgroundColor: 'black',
            //       });

            //       var humidityRectWhite = new UI.Rect({
            //         position: new Vector2(Math.round((humidity/100)*144) + 1, 140),
            //         size: new Vector2(144-Math.round((humidity/100)*144), 4),
            //         backgroundColor: 'white',
            //       });

            //       // Add Rect to Window
            //       window.add(humidityRectBlack);
            //       window.add(humidityRectWhite);

        },
        function(error) {
            // Failure!
            console.log('Failed fetching weather data: ' + error);
            outside_temperatureText.text('XXX');
            inside_temperatureText.text('XXX');
            humidityText.text('XXX');
        }
    );
}

Accel.init();
Accel.on('tap', function(e) {
    console.log('Tap event on axis: ' + e.axis + ' and direction: ' + e.direction);
    if ((new Date().getTime() - lastUpdated) > 300000) {
        getWeather();
    } else {
        console.log('Too soon: ' + Math.round((new Date().getTime() - lastUpdated) / 1000) + ' seconds');
    }
});

getWeather();
setInterval(function() {
    getWeather();
}, timeOut);