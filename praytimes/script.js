// Current time
var now = new Date().getTime();

// Next prayer time and countdown time to the next prayer
var nextPrayerTime = "";
var countdownTime = 0;

// Get user's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPrayerTimes);
  } else {
    document.getElementById("prayer-time").innerHTML = "Geolocation is not supported by this browser.";
  }
}

// Get prayer times based on user's location
function getPrayerTimes(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  axios.get("https://api.pray.zone/v2/times/today.json", {
    params: {
      lat: latitude,
      lng: longitude,
      tzone: timeZone
    }
  })
  .then(function(response) {
    var prayerTimes = response.data.results.datetime[0].times;
    
    // Find the next prayer time
    for (var prayerTime in prayerTimes) {
      var prayerDateTime = new Date(prayerTimes[prayerTime] + " UTC").getTime();
      
      if (prayerDateTime > now) {
        nextPrayerTime = prayerTime;
        countdownTime = prayerDateTime - now;
        break;
      }
    }
    
    // Countdown to the next prayer
    if (nextPrayerTime !== "") {
      var countdown = formatTimeRemaining(countdownTime);
  
      document.getElementById("prayer-time").innerHTML = nextPrayerTime;
      document.getElementById("countdown").innerHTML = countdown;
  
      // Start countdown again after page reload
      setInterval(function() {
        countdownTime = countdownTime - 1000;
  
        if (countdownTime <= 0) {
          location.reload();
        } else {
          var countdown = formatTimeRemaining(countdownTime);
          document.getElementById("countdown").innerHTML = countdown;
        }
      }, 1000);
    } else {
      document.getElementById("prayer-time").innerHTML = "No prayer left for today";
      document.getElementById("countdown").innerHTML = "";
    }
  })
  .catch(function(error) {
    document.getElementById("prayer-time").innerHTML = "Unable to get prayer times.";
  });
}

function formatTimeRemaining(time) {
  var hours = Math.floor(time / (1000 * 60 * 60));
  var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((time % (1000 * 60)) / 1000);
  
  var formattedTime = '';
  
  if (hours < 10) {
    formattedTime += '0';
  }
  
  formattedTime += hours + ':';
  
  if (minutes < 10) {
    formattedTime += '0';
  }
  
  formattedTime += minutes + ':';
  
  if (seconds < 10) {
    formattedTime += '0';
  }
  
  formattedTime += seconds;
  
  return formattedTime;
}

// Get user's location on page load
getLocation();