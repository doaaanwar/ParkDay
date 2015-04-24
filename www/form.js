var app = angular.module("myapp", [
    'mobile-angular-ui',

    // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
    // it is at a very beginning stage, so please be careful if you like to use
    // in production. This is intended to provide a flexible, integrated and and
    // easy to use alternative to other 3rd party libs like hammer.js, with the
    // final pourpose to integrate gestures into default ui interactions like
    // opening sidebars, turning switches on/off ..
    'mobile-angular-ui.gestures',
    'uiGmapgoogle-maps'
])

app.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});
app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')',
                'background-size' : 'cover'
            });
        });
    };
});
app.controller("mycontroller", function ($scope, uiGmapGoogleMapApi,$http, $log) {
     $scope.kittens = [
        {w:250, h:300},
        {w:400, h:250},
        {w:200, h:200}
    ];
    angular.extend($scope, {
        init: function () {
            $scope.icon = 'https://farm4.staticflickr.com/3607/3513187252_f7091dedc4_z.jpg';
            uiGmapGoogleMapApi.then($scope.mapsReady);
            document.addEventListener('deviceready', $scope.deviceReady, false);
            $scope.setCurrentPosition();
            
        },
        deviceReady: function(){
            
        },
        mapsReady: function (maps) {
        },
        map: { center: { latitude: 45, longitude: -73 }, zoom: 12, markers:[] },
        positionReady: function(position){
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
            $scope.position.name = position.street;
            $scope.map.markers.length = 0;
            var oMarker = {id:0, data: "Park Day", coords: position.coords};
            $scope.map.markers.push(oMarker);
            $scope.$apply();
            
        },
        setCurrentPosition: function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.positionReady);
              
                
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }

        },
        setCurrentWeather: function()
        {
             var url = 'http://api.openweathermap.org/data/2.5/weather';
            var $units = 'metric';
            $http.jsonp(url, { params : {
                lat : position.coords.latitude,
                lon : position.coords.longitude,
                units : $units,
                callback: 'JSON_CALLBACK'
              }}).
             success(function(data, status, headers, config) {
                $scope.main = data.main;
                $scope.wind = data.wind;
                $scope.description = data.weather[0].description;
                $scope.icon = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
                $scope.$apply();

              }).
              error(function(data, status, headers, config) {
                // Log an error in the browser's console.
                $log.error('Could not retrieve data from ' + url);
              });
        }
        ,
        change: function() {
    // Fetch the data from the public API through JSONP.
    // See http://openweathermap.org/API#weather.
            $scope.setCurrentPosition();
    var url = 'http://api.openweathermap.org/data/2.5/forecast';
    var $units = 'metric';
    $http.jsonp(url, { params : {
        lat : $scope.map.center.latitude,
        lon : $scope.map.center.longitude,
        units : $units,
        callback: 'JSON_CALLBACK'
      }}).
      success(function(data, status, headers, config) {
        $scope.showLatLong = true;
        $scope.hideAll = false;
        $scope.main = data.list[0].main;
        $scope.wind = data.list[0].wind;
      
        $scope.description = data.list[0].weather[0].description;
         $scope.main2 = data.list[1].main;
        $scope.wind2 = data.list[1].wind;
       
        $scope.description2 = data.list[1].weather[0].description;
        $scope.icon = 'http://openweathermap.org/img/w/'+data.list[1].weather[0].icon+'.png';
        $scope.checkSuggestion(data.list[1].weather[0].main,data.list[1].wind.speed,data.list[1].weather[0].icon,data.list[1].weather[0].description);
     
         
      }).
      error(function(data, status, headers, config) {
        // Log an error in the browser's console.
        $log.error('Could not retrieve data from ' + url);
      });
  },
        checkSuggestion: function(main,speed,weatherIcon,description){
            
            if(weatherIcon.indexOf('d') != -1) {
			        		
                //define time of day as day
                timeOfDay = 'day';

            } else {

                //define time of day as night
                timeOfDay = 'night';
                $scope.result = 'It is night Time!';
            }
            
            if(main == "Thunderstorm" || main == "Atmosphere" || main == "Extreme" || main == "Snow"){
                //warning can't go to the park
                $scope.result = 'WARNING!! It is not recommended to go to the park now.';
                $scope.fontColor = 'red';
            }
            else if(main == "Clouds")
            {
               
                
                $scope.fontColor = 'orange';
                if(timeOfDay == 'night')
                {
                     $scope.result= "Take care! There is " + description + " and it is night time";
                }
                else
                {
                    $scope.result= "Take care! There is " + description;
                }
            }
            else if(main == "Clear")
            {
                $scope.fontColor = 'green';
                $scope.result = 'Yes It is is a perfect time to go to the park.';
                if(timeOfDay == 'night')
                {
                   $scope.fontColor = 'blue';
                   $scope.result = 'It is night time. You can enjoy the weather and the silence or just wait till the morning!';
                }
            }
            else if(main == "Rain")
            {
                $scope.fontColor = 'orange';
                if(timeOfDay == 'night')
                {
                     $scope.result= "Take care! There is " + description + " and it is night time";
                }
                else
                {
                    $scope.result= "Take care! There is " + description;
                }
            }
            else if(main == "Additional")
            {
                 $scope.fontColor = 'yellow';
            }
            else if(main == "Drizzle")
            {
                $scope.fontColor = 'blue';
                $scope.fontColor = 'orange';
                if(timeOfDay == 'night')
                {
                     $scope.result= "It is " + description + " and night time";
                }
                else
                {
                    $scope.result= "It is " + description;
                }
            }
            if(speed > 50)
            {
                $scope.result = 'WARNING!! The wind speed is high.';
                $scope.fontColor = 'red';
            }
          
            $scope.fontWeight = 'bold';
            $scope.fontSize = '20px';
         
        },
        changeNext: function(){
            $scope.setCurrentPosition();
    var url = 'http://api.openweathermap.org/data/2.5/forecast';
            //TODO should read rain, humidity, description and temp then decide on them if yes or no with description
    var $units = 'metric';
    $http.jsonp(url, { params : {
        lat : $scope.map.center.latitude,
        lon : $scope.map.center.longitude,
        units : $units,
        callback: 'JSON_CALLBACK'
      }}).
      success(function(data, status, headers, config) {
        $scope.hideAll = true;
        $scope.main = data.list[1].main;
        $scope.wind = data.list[1].wind;
        $scope.description = data.list[1].weather[0].description;
         $scope.main2 = data.list[2].main;
        $scope.wind2 = data.list[2].wind;
        $scope.description2 = data.list[2].weather[0].description;
        $scope.icon = 'http://openweathermap.org/img/w/'+data.list[2].weather[0].icon+'.png';
        $scope.checkSuggestion(data.list[2].weather[0].main,data.list[2].wind.speed,data.list[2].weather[0].icon,data.list[2].weather[0].description);
         
      }).
      error(function(data, status, headers, config) {
        // Log an error in the browser's console.
        $log.error('Could not retrieve data from ' + url);
      });
  }
    }).init();


});
