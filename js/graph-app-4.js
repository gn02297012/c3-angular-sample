var graphApp = angular.module('graphApp', ['graphApp.services']);

graphApp.controller('GraphCtrl', function ($scope,$timeout,dataService) {
	$scope.chart = null;
	$scope.config={};

	$scope.config.data=[]

	$scope.config.type1="line";
	$scope.config.type2="line";
	$scope.config.keys={"x":"x", "value":["data1","data2"]};

	$scope.keepLoading = true;

	$scope.showGraph = function() {
		var config = {};
		config.bindto = '#chart';
		config.data = {};
		config.data.keys = $scope.config.keys;
		config.data.json = $scope.config.data;
		config.axis = {};
		config.axis.x = {"type":"timeseries","tick":{"count": 10, "format":"%S"}};
		config.axis.y = {"label":{"text":"Number of items","position":"outer-middle"}, "max": 150};
		config.data.types={"data1":$scope.config.type1,"data2":$scope.config.type2};
        config.transition = { duration: 300 };
		$scope.chart = c3.generate(config);
	}

	$scope.startLoading = function() {
		$scope.keepLoading = true;
		$scope.loadNewData();
	}

	$scope.stopLoading = function() {
		$scope.keepLoading = false;
	}

	$scope.loadNewData = function() {
		dataService.loadData(function(newData) {
			var data = {};
			data.keys = $scope.config.keys;
			data.json = newData;
			//console.log(data);
			if (newData.length > 9) {
				newData = newData.slice(newData.length - 1);
				data.json = newData;
				$scope.chart.flow(data);

			} else {
				$scope.chart.load(data);
			}		
			
			$timeout(function(){
				if ($scope.keepLoading) {
					$scope.loadNewData()				
				}
			}, 1000);			
		});
	}
});

var services = angular.module('graphApp.services', []);
services.factory('dataService', function() {
	function DataService() {
		var data = [];
		var numDataPoints = 9;
		var maxNumber = 100;

		this.loadData = function(callback) {
			if (data.length > numDataPoints) {
				data.shift();
			}
			data.push({"x":new Date(),"data1":randomNumber(),"data2":randomNumber()*0.1});
			callback(data);
		};

		function randomNumber() {
			return Math.floor((Math.random() * maxNumber) + 1);
		}
	}
	return new DataService();
});