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
    	var measuresDict = {}
    	$scope.showSearch = false;
        var APIURL = 'http://localhost:3000';
        var configName = $location.search().configName;
        $http.get(APIURL + '/mdc_retrieval')
        	.success(function (data) {
			    var pathogensList = ["Any"]
			    var hostsList = ["Any"]
			    var locationList = ["Any"]
			    var measuresList = ["Any"]
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
			    for (var i in data.measures) {
			    	measuresDict[i] = data.measures[i]
			    	measuresList.push(i)
			    }
			    $scope.pathogens = pathogensList;
        		$scope.locations = locationList;
        		$scope.hosts = hostsList;
        		$scope.measures = measuresList;
		})

	$scope.initiateDefaultSearch = function () {
		var radioValue = $("input[name='option']:checked").val();
		$scope.tableModel = [];
		$scope.showSearch = true;
		var tableModel = [];
		if (radioValue === undefined){
			$scope.tableModel = [{prefTerm:"No option selected"}];
		}
		else {
			$scope.searchHidden = true;
			var type = "option" + radioValue;
			var typeString = radioValue === 1 ? "Dataset" : "Software"
			var results = $http.get(APIURL + '/mdc_retrieval/query', {
	    	params: {
	    		type:type,
	        	pathogen: pathogensDict[$scope.pathogen],
	        	host: hostsDict[$scope.host],
	        	location: locationsDict[$scope.location],
	        	measure: measuresDict[$scope.measure]
	      	}
	      	}).success(function (data) {
			    for (var key in data) {
			    	var item = processItem(data[key][0])
			    	console.log(item)
			    	item.type = typeString
		            tableModel.push(item);
		        }
		        $scope.tableModel = tableModel
		    });


		}
	}

    $scope.initiateSearch = function () {
    	// console.log("------")
    	// console.log("pathogen: " + pathogensDict[$scope.pathogen])
    	// console.log("host: " + hostsDict[$scope.host])
    	// console.log("location: " + locationsDict[$scope.location])
    	// console.log("Measures: " + measuresDict[$scope.measure])
    	var datasets_selected = $scope.selection_datasets
        var dtm_selected = $scope.selection_DTM
        $scope.showSearch = true;
    	$scope.tableModel = [];
   		var tableModel = [];
   		var promise = [];
   		if (dtm_selected){
   			var results = $http.get(APIURL + '/mdc_retrieval/query', {
	    	params: {
	    		type:"dtm",
	        	pathogen: pathogensDict[$scope.pathogen],
	        	host: hostsDict[$scope.host],
	        	location: locationsDict[$scope.location],
	        	measure: measuresDict[$scope.measure]
	      	}
		    }).success(function (data) {
			    for (var key in data) {
			    	var item = processItem(data[key][0])
			    	item.type = "DTM"
		            tableModel.push(item);
		        }
		    });
   		}
   		if (datasets_selected){
   			var results = $http.get(APIURL + '/mdc_retrieval/query', {
	    	params: {
	    		type:"dataset",
	        	pathogen: pathogensDict[$scope.pathogen],
	        	host: hostsDict[$scope.host],
	        	location: locationsDict[$scope.location],
	        	measure: measuresDict[$scope.measure]
	      	}
		    }).success(function (data) {
			    for (var key in data) {
			    	var item = processItem(data[key][0])
			    	item.type = "Dataset";
		            tableModel.push(item);
		        }
		    });
   		}
    	
    	if(!datasets_selected && ! dtm_selected){
    		$scope.tableModel = [{prefTerm:"No type selected"}];
    	}
    	else {
    		promise.push(results);
	    	$q.all(promise).then(function () {
	    	if(tableModel.length == 0){
	    		$scope.tableModel = [{prefTerm:"No Results Found"}];
	    	}
	    	else {
	    		$scope.searchHidden = true;
	    		$scope.tableModel = tableModel;
	    	}
    	});
    	}
	   
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




