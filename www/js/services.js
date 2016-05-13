/**
 * Created by ved on 11/5/16.
 */
angular.module('starter')

  .factory('FileService', function() {
    var images;
    var IMAGE_STORAGE_KEY = 'images';

    function getImages() {
      console.log("ved:called getImages in service which gets images from window.localStorage");
      var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
      if (img) {
        images = JSON.parse(img);
      } else {
        images = [];
      }
      return images;
    };

    function addImage(img) {
      console.log("storing image",img);

      var storedImages = window.localStorage.getItem(IMAGE_STORAGE_KEY);
      if (storedImages) {
        images = JSON.parse(storedImages);
      } else {
        images = [];
      }

      images.push(img);
      window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
      console.log("stored image successfully",img);
    };

    return {
      storeImage: addImage,
      images: getImages
    }
  })

  .factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile,$cordovaFileTransfer) {

    function makeid() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    function optionsForType(type) {
      var source;
      switch (type) {
        case 0:
          source = Camera.PictureSourceType.CAMERA;
          break;
        case 1:
          source = Camera.PictureSourceType.PHOTOLIBRARY;
          break;
      }
      return {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: source,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        //popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
    }

    function saveMedia(type) {
      console.log("ved:called saveMedia in services with arg(type)",type);
      return $q(function(resolve, reject) {
        var options = optionsForType(type);
        console.log("ved:got options for camera call",JSON.stringify(options));

        $cordovaCamera.getPicture(options).then(function(imageUrl) {
          console.log("ved:imageUrl",imageUrl);
          //console.log("ved:namePath",imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1));
          //var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
          //var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);

          //The problem is: the camera plugin return URL like this content://...
          // but the file plugin seems to manage only URL like this file:///...
          //namePath = "file:///"+namePath.substr(10);
          //console.log("new path     ",namePath);
          //console.log("file name",name);

          window.FilePath.resolveNativePath(imageUrl, function(fileEntry) {
            var picData =  fileEntry;

            console.log("ved:picData",picData);
            //console.log("ved:namePath",imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1));
            //var name = picData.substr(picData.lastIndexOf('/') + 1);
            //var namePath = picData.substr(0, picData.lastIndexOf('/') + 1);
            //
            //var newName = makeid() + name;
            //$cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
            //  .then(function(info) {
            //    console.log("ved copied file successfully");
            //    FileService.storeImage(newName);
            //    resolve();
            //  }, function(e) {
            //    console.log("ved:error in copying file",JSON.stringify(e));
            //    reject();
            //  });


            //TODO:file upload
            // Destination URL
            var serverUrl = "http://192.168.1.41:8080/photoupload";

            //File for Upload
            //var targetPath = cordova.file.externalRootDirectory + "logo_radni.png";
            var filePath=picData;

            // File name only
            //var filename = targetPath.split("/").pop();
            var filename = filePath.split("/").pop;

            var options = {
              fileKey: "file",
              fileName: filename,
              chunkedMode: false,
              mimeType: "image/jpg",
              params : {'directory':'upload', 'fileName':filename} // directory represents remote directory,  fileName represents final remote file name
            };

            $cordovaFileTransfer.upload(serverUrl, filePath, options).then(function (result) {
              console.log("SUCCESS: " + JSON.stringify(result.response));
              resolve();
            }, function (err) {
              console.log("ERROR: " + JSON.stringify(err));
              reject();
            }, function (progress) {
              // PROGRESS HANDLING GOES HERE
            });

            //




          });

          //var newName = makeid() + name;
          //$cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, newName)
          //  .then(function(info) {
          //    console.log("ved copied file successfully");
          //    FileService.storeImage(newName);
          //    resolve();
          //  }, function(e) {
          //    console.log("ved:error in copying file",JSON.stringify(e));
          //    reject();
          //  });
        }, function(e) {
          console.log("ved:error in getting file from gallery",JSON.stringify(e));
        });
      })
    }
    return {
      handleMediaDialog: saveMedia
    }
  });
