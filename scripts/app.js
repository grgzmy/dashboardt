'use strict';

var app = angular.module('dashboardt', [])

app.controller('boardtCtrl', ['$scope', '$http', '$window', function($scope, $http, $window){
	$scope.loading = true;
	$scope.unit = "celsius";

	//clock
	$scope.clock = new Date();
	$scope.twelveHour = false;
	var clockTimer = setInterval(function(){
		$scope.$apply(function(){
			$scope.clock = new Date();
	});
	}, 1000);

	String.prototype.padZero = function(){
		return this.length === 2 ? this : "0"+this
	};

	$scope.getTime = function(){
		var h = $scope.clock.getHours().toString().padZero();
		var m = $scope.clock.getMinutes().toString().padZero();
		var p = h<12 ? "AM" : "PM"
		return $scope.twelveHour ? h%12 + " : " + m + " " + p : h + " : " + m 
	};
	//end: clock
	
	//weather icons
	$scope.icons = {
		"chanceflurries" : "I",
		"flurries" : "I",
		"chancerain" : "J",
		"rain" : "K",
		"chancesleet" : "L",
		"sleet" : "M",
		"snow" : "I",
		"chancesnow" : "h",
		"chancetstorms" : "x",
		"clear" : "1",
		"sunny": "1",
		"cloudy" : "3",
		"fog" : "Z",
		"hazy" : "Z",
		"mostlycloudy" : "a",
		"mostlysunny" : "2",
		"partlycloudy" : "A",
		"partlysunny"	: "A",
		"tstorms" : "Y"
	};

	//geolocation
	var wunderground = "https://api.wunderground.com/api/997c5aef417d0a61/";

	$http({
		method:'JSONP',
		url: wunderground + "geolookup/q/autoip.json?callback=JSON_CALLBACK"
	}
	).success(function(data, status, header, config){
		$scope.location = {};
		$scope.location.country = data.location.country_name;
		$scope.location.state = data.location.state;
		$scope.location.city = data.location.city;
		getWeather($scope.location);
	}).error(function(data, status, header, config){
		console.log("geolocation error")
	});

	var getWeather = function(location){		
		$http({
			method: 'JSONP',
			url: wunderground + "forecast/q/" + (location.country === "USA" ? location.state : location.country) + "/" + location.city + ".json?callback=JSON_CALLBACK" 
		}).success(function(data, status, header, config){
			$scope.weather= data.forecast.simpleforecast.forecastday;
			$scope.loading = false;
		}).error(function(){
			console.log("weather failed")
		});
	};


}]);