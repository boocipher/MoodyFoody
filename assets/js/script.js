//We need to target these variables once their respective elements are added to the HTML
var locationInput = "Austin"   //string, can be zip code, city, or current address
var priceRangeInput = "2" //1 = $, 2 = $$, 3 = $$$, 4 = $$$$
var distanceInput = 10000  //in meters max is 40000 meters
var foodTypeInput = "sit-down italian"  //fastfood-sitdown-
var timeInput = '&open_now=true'    //now, breakfast,lunch,dinner //if user selects open now, then add '&open_now=true' to query string, if user selects time then add '&open_at=[time(int)]

var searchResultsArray = []   //will store all parsed data from Yelp API pull

var userLocationLatLng        //will store coordinates of locationInput

geoLocation()
function geoLocation() {  //google API call to convert address/city/zipcode/etc to coordinates
  fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+locationInput+'&key=AIzaSyC2zgWJRoeij-FPFj_I39eZ9oDHPcXlQoc')
.then(function(response) {
  return response.json();
}).then(function(data) {
  console.log("-------Google Geolocation Call-------");
  console.log(data);
  userLocationLatLng = data.results[0].geometry.location;
  console.log("Below are the coordinates of the user's location input");
  console.log(userLocationLatLng);
})
}

yelpCallAPI()
function yelpCallAPI() {
//the first half of this url is needed because of a CORS error
var yelpUrl = 'https://salty-mountain-68764.herokuapp.com/https://api.yelp.com/v3/businesses/search?price='+ priceRangeInput +'&term='+foodTypeInput+'&location=' + locationInput + timeInput
var APIKEY = 'Dm03wv4YdEsLaKufEPshYjbDKuUxpKY621FUmPuz_y172PgIO3devn-UJtkkEPc6O7WuSgsyAc9PZOsA1kySWKeAb3mZb41NPezvv9taNTuHaSeuDkWNqrUI8KfbYXYx'
var Bearer = 'Bearer ' + APIKEY   //needed for authentication header

  fetch(yelpUrl, {
    headers: {
      Authorization: Bearer
    }
  }).then(function(response) {
    return response.json()      //converts data into JSON
  }).then(function(data) {
    console.log("-------Yelp Call-------");
    console.log(data);    //displays yelp call Data
      for (var i = 0; i < 5; i++) {     //for loop iterates through data object and parses from the first 5 elements in the array
      var searchResult = {
        restaurantName: data.businesses[i].name,
        price: data.businesses[i].price,
        location: [data.businesses[i].coordinates.longitude, data.businesses[i].coordinates.latitude],
        rating: data.businesses[i].rating,
        image: data.businesses[i].image_url,
        websiteLink: data.businesses[i].url,
      }
      searchResultsArray.push(searchResult);  //pushes searchResult (parsed data object) into array before iterating to next index in data array
    }
    console.log("Below are search results that will be appended to the page")
    console.log(searchResultsArray);
    displayMap()
  })
}

//Responsible for displaying map on results.html and fav.html
function displayMap() {
let map;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" //needed for marker labels

initMap()
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocationLatLng, //determines center of map (user location)
    zoom: 10,
    }
  );
  var marker
  for (var i = 0; i<searchResultsArray.length; i++) {  //for loop to iterate through searchResultsArray
    console.log("Adding '"+labels.charAt(i)+ "' Marker to map with coordinates: ");
    console.log(searchResultsArray[i].location);
    var LatLng = {
      lat: searchResultsArray[i].location[1], //pulls latitude from searchResultsArray
      lng: searchResultsArray[i].location[0], //pulls longitude from searchResultsArray
    };
    var contentString = searchResultsArray[i].restaurantName
    console.log(contentString);

    var marker = new google.maps.Marker({  //places marker
      position: LatLng,
      label: labels.charAt(i),
      map,
      title: searchResultsArray[i].restaurantName,
    });

    //displays window that details restaurant name if marker is clicked
    //based off code from https://stackoverflow.com/questions/11106671/google-maps-api-multiple-markers-with-infowindows
    var content = searchResultsArray[i].restaurantName
    var infoWindow = new google.maps.InfoWindow()
    google.maps.event.addListener(marker,'click', (function(marker,content,infoWindow) {
      return function() {
        infoWindow.setContent(content)
        infoWindow.open(map,marker);
      };
    })(marker,content,infoWindow))
}
}
}


//SCRIPT FILE 1
//Target specific elements on our form to recieve values inputted the user
  // var locationInput 
  // var priceRangeInput
  // var distanceInput 
    //user input miles, needs to be converted to meters (There is a max look up in DOCS)
  // var foodTypeInput
  // var timeInput   
    //Pulls values when the user press submit
      //Event listenea
        //redirect the user to results.html

// Consider for later--user inputs how many search results they would like to see

//SCRIPT FILE 2
  //Input variables need to be placed into query string for Yelp API
  //Fetch and convert data to JSON from YELP API
  //Pull variables from JSON and put them into an object.
    //use for loop to iterate through 5 different businesses        <--Functional, but maybe should pull more for improved user experience.  Consider this after we get main functionality and adding option to scroll more
      //var searchResult = {
      //   title: ,
      //   price: ,
      //   location: [latitude, longitude]
      //   star-rating: ,
      //   hours: ,
      // } 
      //push 5 searchResults into an array --> var searchResultsArray

//append all our options to left column on results page using Dynamic HTML


  //using pull location in searchResult object, we need to display a pin for that location.  Each pin will be labeled with a number corresponding to that search results location.
  //all 5 pins will be on the map at the same time.
    //for loop to iterate through searchResultsArray.location to display all markers at the same time.
  
  
  //We need to convert locationInput to latitude and longitude using either Google Maps API (You will need to look up how to do this on docs) or you can use OpenWeatherMap or another API.


