


angular.module('mdcSearch').controller('DetailModalInstanceController', function ($scope, $location, $http, $modal, item, $modalInstance) {
  var parsedItem = {}
  for (var key in item) {
      parsedItem[key] = item[key]
  }
  $scope.item = parsedItem;
     $scope.closeModal = function () {
       $modalInstance.close();
   };
  });

