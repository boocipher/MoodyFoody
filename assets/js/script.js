//We need to target these variables once their respective elements are added to the HTML
var locationInput = "austin"   //string, can be zip code, city, or current address
var priceRangeInput = "2" //1 = $, 2 = $$, 3 = $$$, 4 = $$$$
var distanceInput = 10000  //in meters max is 40000 meters 
var foodTypeInput = "sit-down italian"  //fastfood-sitdown-
var timeInput = '&open_now=true'    //now, breakfast,lunch,dinner //if user selects open now, then add '&open_now=true' to query string, if user selects time then add '&open_at=[time(int)]

// EXAMPLE OF WORKING URL 
// var requestedUrl = 'https://salty-mountain-68764.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=delis&location="12917 Quinn Trail, Austin, TX 78727"'

//the first half of this url is needed because of a CORS error


yelpCallAPI()
function yelpCallAPI() {
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
    console.log("\-------Yelp Call-------")
    console.log(data)
  })
}