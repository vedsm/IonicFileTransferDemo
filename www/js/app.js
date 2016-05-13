// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

  .controller('ImageController', function($scope, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService) {

    $ionicPlatform.ready(function() {
      //$scope.images = FileService.images();
      //console.log("number of images",$scope.images.length);
      //$scope.$apply();
    });

    $scope.printPhotos = function(){
      $scope.images = FileService.images();
      console.log("ved:printing photos",JSON.stringify($scope.images));
      console.log("number of images",$scope.images.length);
      //$scope.$apply();

    };

    $scope.urlForImage = function(imageName) {
      var trueOrigin = cordova.file.dataDirectory + imageName;
      console.log("ved:image name while fetching image via urlForImage",imageName);
      return trueOrigin;q
    }

    $scope.addMedia = function() {
      $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Take photo' },
          { text: 'Photo from library' }
        ],
        titleText: 'Add images',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $scope.addImage(index);
        }
      });
    }

    $scope.addImage = function(type) {
      console.log("ved:called addImage with args",type);
      $scope.hideSheet();
      ImageService.handleMediaDialog(type).then(function() {
        //$scope.$apply();
      });
    }

    /*$scope.sendEmail = function() {
     if ($scope.images != null && $scope.images.length > 0) {
     var mailImages = [];
     var savedImages = $scope.images;
     if ($cordovaDevice.getPlatform() == 'Android') {
     // Currently only working for one image..
     var imageUrl = $scope.urlForImage(savedImages[0]);
     var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
     var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
     $cordovaFile.copyFile(namePath, name, cordova.file.externalRootDirectory, name)
     .then(function(info) {
     mailImages.push('' + cordova.file.externalRootDirectory + name);
     $scope.openMailComposer(mailImages);
     }, function(e) {
     reject();
     });
     } else {
     for (var i = 0; i < savedImages.length; i++) {
     mailImages.push('' + $scope.urlForImage(savedImages[i]));
     }
     $scope.openMailComposer(mailImages);
     }
     }
     }*/
    $scope.sendEmail = function() {
      console.log("clicked on send email, which is commented out");
    }

    $scope.openMailComposer = function(attachments) {
      var bodyText = '<html><h2>My Images</h2></html>';
      var email = {
        to: 'some@email.com',
        attachments: attachments,
        subject: 'Devdactic Images',
        body: bodyText,
        isHtml: true
      };

      $cordovaEmailComposer.open(email).then(null, function() {
        for (var i = 0; i < attachments.length; i++) {
          var name = attachments[i].substr(attachments[i].lastIndexOf('/') + 1);
          $cordovaFile.removeFile(cordova.file.externalRootDirectory, name);
        }
      });
    }
  });
