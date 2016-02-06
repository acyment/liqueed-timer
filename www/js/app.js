// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('agilar-timer', ['ionic', 'ngCordova', 'ngAnimate', 'timer'])


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

.controller('TimerCtrl', function($scope) {
    var timerState = 'STOPPED';
    var timerStartingTime = 2;

    $scope.startingTime = timerStartingTime;
    $scope.minutesCSSClass = "mainDigit";
    $scope.secondsCSSClass = "secondaryDigit";
    $scope.screenZoom = false;

    $scope.onDoubleTap = function () {
        switch(timerState){
            case 'STOPPED':
                $scope.$broadcast('timer-start');
                timerState = 'TICKING';
                break;
            case 'TICKING':
                $scope.$broadcast('timer-stop');
                timerState = 'PAUSED';
                break;
            case 'PAUSED':
                $scope.$broadcast('timer-start');
                timerState = 'TICKING';
                break;
            case 'FLASHING':
                $scope.$broadcast('timer-reset');
                timerState = 'STOPPED';
                $scope.flashing = false;
                break;
        }
    };

    $scope.onHold = function () {
        if(timerState=='TICKING' || timerState=='PAUSED' || timerState=='FLASHING'){
            $scope.$broadcast('timer-reset');
            timerState = 'STOPPED';
            $scope.flashing = false;
        }
    };

    $scope.onSwipeDown = function () {
        if(timerState == 'STOPPED'){
            if(timerStartingTime > 60){
                $scope.$broadcast('timer-set-countdown-seconds', timerStartingTime -= 60);
            }
        }
    }

    $scope.onSwipeUp = function () {
        if(timerState == 'STOPPED'){
            $scope.$broadcast('timer-set-countdown-seconds', timerStartingTime += 60);
        }
    }

    $scope.finished = function (){
          timerState = 'FLASHING';
          $scope.flashing = true;
          $scope.$apply();
        }
});
