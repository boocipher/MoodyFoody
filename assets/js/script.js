//We need to target these variables once their respective elements are added to the HTML
var locationInput //string, can be zip code, city, or current address
var priceRangeInput //1 = $, 2 = $$, 3 = $$$, 4 = $$$$
var distanceInput //in meters max is 40000 meters 
var foodTypeInput //fastfood-sitdown-
var timeInput  //now, breakfast,lunch,dinner //if user selects open now, then add '&open_now=true' to query string, if user selects time then add '&open_at=[time(int)]
var distanceInputMeters 
var searchResultsArray = []   //will store all parsed data from Yelp API pull

$('#searchForm').on('submit',function(event) {
  event.preventDefault();   //prevents page from refreshing
		locationInput = $('#locationInput').val();
		priceRangeInput = $('#priceRangeInput').val();
		distanceInput = $('#distanceInput').val();
    lengthConverter()   //converts miles to meters
		foodTypeInput = $('#foodTypeInput').val() + $('#type').val();
		convertTimeToUnix()
    localStorage.setItem("formSubmission", JSON.stringify([locationInput, priceRangeInput, foodTypeInput, timeInput, distanceInputMeters]))
    document.location.assign('results.html');	
  })


yelpCallAPI() 

function convertTimeToUnix() {
  var tomorrow = moment().add(1, 'days');
  var tomorrowDateUnix = moment(tomorrow.format('YYYY-MM-DD')).unix()
  if ($('#time').val() == 'right-now'){ 
    timeInput = '&open_now=true'
  } else if ($('#time').val() == 'breakfast'){ 
    var tomorrowBreakfastUnix = tomorrowDateUnix + 27000
    timeInput = '&open_at='+tomorrowBreakfastUnix
  } else if ($('#time').val() == 'lunch'){ 
    var tomorrowLunchUnix = tomorrowDateUnix + 41400
    timeInput = '&open_at='+tomorrowLunchUnix
  } else if ($('#time').val() == 'dinner'){ 
    var tomorrowDinnerUnix = tomorrowDateUnix + 61200
    timeInput = '&open_at='+tomorrowDinnerUnix
  }
}
function lengthConverter() {
  distanceInput = $('#distanceInput').val()
  distanceInputMeters = (distanceInput/0.00062137).toFixed(0).toString();
  console.log (typeof(distanceInputMeters)) //converts miles to meters from user input
}

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

function removeSpaces (locationInput) { //removeSpaces from input and returns "+" instead for google geolocation api//
  return locationInput.replace(/\s+/g, '+');
}

function yelpCallAPI() {
  if (window.location.pathname.includes('index.html')) {
    return
  }
  var formSubmission = JSON.parse(localStorage.getItem('formSubmission'));  //pulls saved form data from local storage
  console.log(formSubmission);
  locationInput = formSubmission[0];
  priceRangeInput = formSubmission[1];
  foodTypeInput = formSubmission[2];
  timeInput = formSubmission[3];
  distanceInputMeters = Number(formSubmission[4])

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
    console.log(data.businesses[0].name)
      for (var i = 0; i < data.businesses.length; i++) {     //for loop iterates through data object and parses from the first 5 elements in the array
      var searchResult = {
        restaurantName: data.businesses[i].name,
        price: data.businesses[i].price,
        location: [data.businesses[i].coordinates.longitude, data.businesses[i].coordinates.latitude],
        address: data.businesses[i].location.display_address[0],
        phone: data.businesses[i].display_phone,
        distance: data.businesses[i].distance,
        rating: data.businesses[i].rating,
        image: data.businesses[i].image_url,
        websiteLink: data.businesses[i].url,
      }
      searchResultsArray.push(searchResult);  //pushes searchResult (parsed data object) into array before iterating to next index in data array
    }
    console.log("Below are search results that will be appended to the page")
    console.log(searchResultsArray);
    displayMap()
    displayResults()
  })
}

// Responsible for displaying map on results.html and fav.html
function displayMap() {
let map;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" //needed for marker labels


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocationLatLng, //determines center of map (user location)
    zoom: 10,
    }
  );
  if (window.location.pathname.includes('results.html')) {  //displays map for fav.html
    console.log('results page for map!')
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
} else if (window.location.pathname.includes('fav.html')) {   //Displays map for favorites page
  console.log('favorites page for map!')
  var marker
  for (var i = 0; i<savedSearchResultsArray.length; i++) {  //for loop to iterate through searchResultsArray
    console.log("Adding '"+labels.charAt(i)+ "' Marker to map with coordinates: ");
    console.log(savedSearchResultsArray[i].location);
    var LatLng = {
      lat: savedSearchResultsArray[i].location[1], //pulls latitude from searchResultsArray
      lng: savedSearchResultsArray[i].location[0], //pulls longitude from searchResultsArray
    };
    var contentString = savedSearchResultsArray[i].restaurantName
    console.log(contentString);

    var marker = new google.maps.Marker({  //places marker
      position: LatLng,
      label: labels.charAt(i),
      map,
      title: savedSearchResultsArray[i].restaurantName,
    });

    //displays window that details restaurant name if marker is clicked
    //based off code from https://stackoverflow.com/questions/11106671/google-maps-api-multiple-markers-with-infowindows
    var content = savedSearchResultsArray[i].restaurantName
    var infoWindow = new google.maps.InfoWindow()
    google.maps.event.addListener(marker,'click', (function(marker,content,infoWindow) {
      return function() {
        infoWindow.setContent(content)
        infoWindow.open(map,marker);
      };
    })(marker,content,infoWindow))
  }}
}
initMap()
}

function displayResults() {
  var resultsContainer = $('#resultList');
  var count = 0

  for (var i = 0;i<searchResultsArray.length;i++) {
  var collapsibleBox = $('<li>')
    
  var heartIcon = $('<img>').attr('height','50px').attr('width','50px').attr('id','heart-icon').attr('src','assets/images/empty.png').attr('data-fill','assets/images/full.png').attr('data-empty','assets/images/empty.png').attr('data-state','empty').on('click',collapsibleBox, function(event) {
    heartElement = event.target
      if(heartElement.matches("img")) {
        var state = heartElement.getAttribute('data-state')
        if(state == "empty") {
          heartElement.setAttribute('data-state', 'fill');
          heartElement.setAttribute('src', heartElement.dataset.fill)
        } else {
        heartElement.setAttribute('data-state', 'empty')
        heartElement.setAttribute('src', heartElement.dataset.empty)
        }
    }}).on('click', function(event) {
      heartElement = event.target   //targets the heart icon that is clicked
      console.log($(heartElement).attr('data-index'))   //each heart icon data-index value matches element position in [searchResultsArray]
      savedSearchResultsArray.push(searchResultsArray[$(heartElement).attr('data-index')]);   //places searchResult object into savedSearchResultsArray
      console.log(savedSearchResultsArray)
      localStorage.setItem("savedSearches", JSON.stringify(savedSearchResultsArray));  //saves updated savedSearchResultsArray to local storage everytime a new object is added
    })

  var resultsHeader = $('<div>').addClass('collapsible-header flex-row')
      .append($('<h3>').attr('id','collapse').text(searchResultsArray[i].restaurantName), 
      heartIcon.attr('data-index',count))

      count++

  var resultsBody = $('<div>').addClass('collapsible-body row')
  .append($('<img>').attr('class','col s12 xl4').attr('id','foodImage').attr('src', searchResultsArray[i].image),
    $('<div>').addClass('class','col s8 flex-column')
      .append($('<div>')
        .append($('<h6>').text('Price: ' + searchResultsArray[i].price),
        $('<h6>').text('Phone Number: ' + searchResultsArray[i].phone),
        $('<h6>').text('Distance: ' + searchResultsArray[i].distance.toFixed(0) + " meters away"),
        $('<h6>').text('Address: ' + searchResultsArray[i].address),
        $('<div>').addClass('flex-row')
          .append($('<img>').attr('id','star-rating').attr('src','assets/images/regular_'+ searchResultsArray[i].rating.toFixed(0) +'.png'), $('<img>').attr('id','yelp-logo').attr('src','assets/images/yelp-logo.png')))))

      resultsContainer.append(collapsibleBox.append(resultsHeader,resultsBody))
    }
}

//LOCAL STORAGE COMPONENT
var savedSearchResultsArray = JSON.parse(localStorage.getItem("savedSearches")) || []

$('#favoritesButton').on('click', function(){
  window.location.assign('./fav.html')
})
console.log(window.location)
favorites()
function favorites() {
  if (window.location.pathname.includes('fav.html') ) {
    displayFavorites()
  } else {
    console.log('you are not on the favs html')
}
}

function displayFavorites() {
  var savedResultsContainer = $('#savedResultsList');
  var count = 0
  var savedSearches = JSON.parse(localStorage.getItem('savedSearches'))
  console.log(savedSearches)

  for (var i = 0;i<savedSearchResultsArray.length;i++) {
  var collapsibleBox = $('<li>')
    
  var heartIcon = $('<img>').attr('height','50px').attr('width','50px').attr('id','heart-icon').attr('src','assets/images/empty.png').attr('data-fill','assets/images/full.png').attr('data-empty','assets/images/empty.png').attr('data-state','empty').on('click',collapsibleBox, 
  
  function(event) {
    heartElement = event.target
      if(heartElement.matches("img")) {
        var state = heartElement.getAttribute('data-state')
        if(state == "empty") {
          heartElement.setAttribute('data-state', 'fill');
          heartElement.setAttribute('src', heartElement.dataset.fill)
            //add search result into storage {object from yelp}
            //localStorage.setItem("savedResult",JSON.stringify(object var name))
        } else {
        heartElement.setAttribute('data-state', 'empty')
        heartElement.setAttribute('src', heartElement.dataset.empty)
        }
    }}).on('click', function(event) {
      heartElement = event.target   //targets the heart icon that is clicked
      console.log($(heartElement).attr('data-index'))   //each heart icon data-index value matches element position in [searchResultsArray]
      savedSearchResultsArray.push(searchResultsArray[$(heartElement).attr('data-index')]);   //places searchResult object into savedSearchResultsArray
      console.log(savedSearchResultsArray)
      localStorage.setItem("savedSearches", JSON.stringify(savedSearchResultsArray));  //saves updated savedSearchResultsArray to local storage everytime a new object is added
    })

  var resultsHeader = $('<div>').addClass('collapsible-header flex-row')
      .append($('<h3>').attr('id','collapse').text(savedSearchResultsArray[i].restaurantName), 
      heartIcon.attr('data-index',count))

      count++

  var resultsBody = $('<div>').addClass('collapsible-body row')
  .append($('<img>').attr('class','col s12 xl4').attr('id','foodImage').attr('src', savedSearchResultsArray[i].image),
    $('<div>').addClass('class','col s8 flex-column')
      .append($('<div>')
        .append($('<h6>').text('Price: ' + savedSearchResultsArray[i].price),
        $('<h6>').text('Phone Number: ' + savedSearchResultsArray[i].phone),
        $('<h6>').text('Distance: ' + savedSearchResultsArray[i].distance.toFixed(0) + " meters away"),
        $('<h6>').text('Address: ' + savedSearchResultsArray[i].address),
        $('<div>').addClass('flex-row')
          .append($('<img>').attr('id','star-rating').attr('src','assets/images/regular_'+ savedSearchResultsArray[i].rating.toFixed(0) +'.png'), $('<img>').attr('id','yelp-logo').attr('src','assets/images/yelp-logo.png')))))

      savedResultsContainer.append(collapsibleBox.append(resultsHeader,resultsBody))
    }
}

$(document).ready(function(){
    $('select').formSelect();
  });

$(document).ready(function(){
    $('.collapsible').collapsible();
  });
 