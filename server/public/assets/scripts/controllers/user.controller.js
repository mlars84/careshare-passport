myApp.controller('UserController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  // This happens after view/controller loads -- not ideal but it works for now.
  var vm = this;

  vm.allProfiles = [];
  vm.pix = [];

  // function to use filestack to add image url to DB
  vm.showPicker = function() {
    var client = filestack.init('AJeDIunS3iZNiN6Db8FQHz');
    client.pick({}).then(function(result) {
      console.log('returned URL: ', result.filesUploaded[0].url);
      vm.pix.push({url: result.filesUploaded[0].url});
      console.log(vm.pix);
    });
  }; //end showPicker

  $scope.nameIn ={
    imageUrl: 'Profile Name'
  };

  console.log('checking user');

  // Upon load, check this user's session on the server
  $http.get('/user').then(function(response) {
      if(response.data.username) {
          // user has a curret session on the server
          vm.userName = response.data.username;
          vm.userId = response.data._id;
          console.log('User Data: ', vm.userName, vm.userId);
      } else {
          // user has no session, bounce them back to the login page
          $location.path("/home");
      }
  });

  //Passport function to logout user
  vm.logout = function() {
    $http.get('/user/logout').then(function(response) {
      console.log('logged out');
      $location.path("/home");
    });
  };

  //function to add a profile once a user is authenticated
  vm.addProfile = function() {
    console.log('clicked submit');
    //object to send to DB via user.js route from inputs on DOM
    var profileToSend = {
      imageUrl: pic,
      name: vm.nameIn,
      basicInfo: vm.basicInfoIn,
      careInfo: vm.careInfoIn,
      user: vm.userId
    };
    console.log(profileToSend);
    $http({
      method: 'POST',
      url: '/user/addProfile',
      data: profileToSend
    }).then(function(res) {
      console.log(res);
    });
    vm.getAllProfiles();
    vm.clearInputs();
  }; //end addProfile

  //function to clear the inputs after submit button is clicked
  vm.clearInputs = function() {
    vm.imageUrl = '';
    vm.nameIn = '';
    vm.basicInfoIn = '';
    vm.careInfoIn = '';
  }; //end clearInputs

  //function to get all user profiles
  vm.getAllProfiles = function() {
    console.log('display button clicked!');
    $http({
      method: 'GET',
      url: '/user/getAllProfiles'
    }).then(function(res) {
      console.log(res.data);
      vm.allProfiles = res.data;
      // vm.updateProfile
    });
  }; //end getAllProfiles
  vm.getAllProfiles();

  //function to add editable inputs and editProfile to user.html DOM
  // vm.addEditables = function() {
  //   console.log('edit button clicked!');
  //
  // }; //end addEditables

  //function to update the profile after the user as edited it
  vm.updateProfile = function(profile) {
    console.log('update button clicked!', profile);
    $http({
      method: 'PUT',
      url: '/user/updateProfile',
      data: profile
    }).then(function(res) {
      console.log(res.data);
      vm.getAllProfiles();
    });
  }; //end editProfile

  //function to share the profile with another user
  vm.shareProfile = function() {
    console.log('share button clicked!');

  }; //end shareProfile

  vm.deleteProfile = function(id) {
    console.log('delete button clicked', id);
    $http({
      method: 'DELETE',
      url: '/user/deleteProfile',
      params: { id: id }
    }).then(function(res) {
      console.log(res);
      vm.getAllProfiles();
    });
  }; //end deleteProfile
}]); //end UserController
