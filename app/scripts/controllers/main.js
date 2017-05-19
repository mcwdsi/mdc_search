'use strict';



/**
 * @ngdoc function
 * @name obc-grants.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the obc-grants
 */
angular.module('mdcSearch') 
    .controller('MainCtrl', function ($scope, $location, $http,$q, $modal) {
    	var pathogensDict = {}
    	var hostsDict = {}
    	var locationsDict = {}
        var APIURL = 'http://devapi.onbc.io';
        var configName = $location.search().configName;
        $http.get(APIURL + '/mdc_retrieval')
        	.success(function (data) {
			    var pathogensList = ["Any"]
			    var hostsList = ["Any"]
			    var locationList = ["Any"]
			    for (var i in data.pathogens) {
			    	pathogensDict[i] = data.pathogens[i]
			    	pathogensList.push(i)
			    }
			    for (var i in data.hosts) {
			    	hostsDict[i] = data.hosts[i]
			    	hostsList.push(i)
			    }
			    for (var i in data.location) {
			    	locationsDict[i] = data.location[i]
			    	locationList.push(i)
			    }
			    $scope.pathogens = pathogensList;
        		$scope.locations = locationList;
        		$scope.hosts = hostsList;
		})

    $scope.initiateSearch = function () {
    	// console.log("------")
    	// console.log($scope.pathogen)
    	// console.log("pathogen: " + pathogensDict[$scope.pathogen])
    	// console.log($scope.host)
    	// console.log("host: " + hostsDict[$scope.host])
    	// console.log($scope.location)
    	// console.log("location: " + locationsDict[$scope.location])
    	$scope.tableModel = [];
   		var tableModel = [];
   		var promise = [];
    	var results = $http.get(APIURL + '/mdc_retrieval/query', {
	    	params: {
	        	pathogen: pathogensDict[$scope.pathogen],
	        	host: hostsDict[$scope.host],
	        	location: locationsDict[$scope.location]

	      	}
	    }).success(function (data) {
		    for (var key in data) {
		    	var item = processItem(data[key][0])
	            tableModel.push(item);
	        }
	    });
	    promise.push(results);
	    $q.all(promise).then(function () {
	    	if(tableModel.length == 0){
	    		$scope.tableModel = [{title:"No Results Found"}];
	    	}
	    	else {
	    		$scope.tableModel = tableModel;
	    	}
    	});
    }

    function processItem(data){
    	var item = {}
    	for (var key in data){
    		var value = "";
    		for (var x in data[key]){
    			value = data[key][x]  + ", " + value;
    		}
    		item[key] = value.slice(0, -2);
    	}
    	return item;
    }

      $scope.getItemDetails = function (item) {
	    $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'views/modals/detail-modal.html',
	      controller: 'DetailModalInstanceController',
	      size: 'lg',
	      resolve: {
	        item: function () {
	          return item;
	        },
	        isNewItem: function () {
	          return false;
	        },
	        indexingTerms: function () {
	          return $scope.indexingTerms;
	        },
	        indexingTermsIndex: function () {
	          return $scope.indexingTermsIndex;
	        }
	      }
	    });
  };
       


})




