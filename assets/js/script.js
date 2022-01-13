//We need to target these variables once their respective elements are added to the HTML
var locationInput = "austin"   //string, can be zip code, city, or current address
var priceRangeInput = "2" //1 = $, 2 = $$, 3 = $$$, 4 = $$$$
var distanceInput = 5  //in meters max is 40000 meters 
var foodTypeInput = "sit-down italian"  //fastfood-sitdown-
var timeInput = '&open_now=true'    //now, breakfast,lunch,dinner //if user selects open now, then add '&open_now=true' to query string, if user selects time then add '&open_at=[time(int)]
var distanceInputMeters 
var searchResultsArray = []   //will store all parsed data from Yelp API pull

function lengthConverter() {
  // distanceInput = distanceInput.val()
  distanceInputMeters = (distanceInput/0.00062137).toFixed(0).toString();
  console.log (typeof(distanceInputMeters)) //converts miles to meters from user input
}
lengthConverter()

yelpCallAPI()
function yelpCallAPI() {
//the first half of this url is needed because of a CORS error
var yelpUrl = 'https://salty-mountain-68764.herokuapp.com/https://api.yelp.com/v3/businesses/search?radius='+ distanceInputMeters +'&price='+ priceRangeInput +'&term='+foodTypeInput+'&location=' + locationInput + timeInput
console.log (yelpUrl)
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
  })
}

//Responsible for displaying map on results.html
let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 30.307613, lng: -97.7509029 },
    zoom: 10,
  }
  );

  var myLatLng = { lat: 30.3159319310134, lng: -97.7336796197883 }
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "Hello World!",
  });
}




//SCRIPT FILE 1
//Target specific elements on our form to recieve values inputted the user
  // var locationInput 
  // var priceRangeInput
  // var distanceInput 
//user input miles, needs to be converted to meters (There is a max look up in DOCS). Currently lines 10 thru 15.SD.
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
