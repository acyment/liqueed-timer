angular
  .module('agilar-timer')
  .controller('TimerController', TimerController);

function TimerController($scope, $ionicPlatform, $cordovaNativeAudio) {

  $ionicPlatform.ready(function() {
    $cordovaNativeAudio.preloadComplex('gong', 'audio/gong-burmese.mp3', 1, 1)
      .then(function(msg) {
        console.log(msg);
      }, function(error) {
        console.log(error);
      });
  });

  $scope.timerState = 'STOPPED';
  var timerStartingTime = 120;

  $scope.startingTime = timerStartingTime;
  $scope.minutesCSSClass = "mainDigit";
  $scope.secondsCSSClass = "secondaryDigit";
  $scope.screenZoom = false;
  $scope.showHelp = false;
  $scope.secondsAreVisible = ($scope.minutes===0);

  $scope.onDoubleTap = function() {
    switch ($scope.timerState) {
      case 'STOPPED':
        $scope.$broadcast('timer-start');
        $scope.timerState = 'TICKING';
        break;
      case 'TICKING':
        $scope.$broadcast('timer-stop');
        $scope.timerState = 'PAUSED';
        break;
      case 'PAUSED':
        $scope.$broadcast('timer-start');
        $scope.timerState = 'TICKING';
        break;
      case 'FLASHING':
        $scope.$broadcast('timer-reset');
        $scope.timerState = 'STOPPED';
        $scope.flashing = false;
        $cordovaNativeAudio.stop('gong');
        break;
    }
  };

  $scope.pause = function() {
    $scope.$broadcast('timer-stop');
    $scope.timerState = 'PAUSED';
  };

  $scope.onHold = function() {
    if ($scope.timerState == 'TICKING' || $scope.timerState == 'PAUSED' || $scope.timerState == 'FLASHING') {
      if ($scope.timerState == 'FLASHING') {
        $cordovaNativeAudio.stop('gong');
      }
      $scope.$broadcast('timer-reset');
      $scope.timerState = 'STOPPED';
      $scope.flashing = false;
    }
  };

  $scope.onMinutesSwipeDown = function() {
    if ($scope.timerState == 'STOPPED') {
      if ($scope.startingTime > 60) {
        $scope.$broadcast('timer-set-countdown-seconds', $scope.startingTime -= 60);
      }
    }
  };

  $scope.onMinutesSwipeUp = function() {
    if ($scope.timerState == 'STOPPED') {
      $scope.$broadcast('timer-set-countdown-seconds', $scope.startingTime += 60);
    }
  };

  $scope.onSecondsSwipeDown = function() {
    if ($scope.timerState == 'STOPPED') {
      if ($scope.startingTime > 15) {
        $scope.$broadcast('timer-set-countdown-seconds', $scope.startingTime -= 15);
      }
    }
  };

  $scope.onSecondsSwipeUp = function() {
    if ($scope.timerState == 'STOPPED') {
      $scope.$broadcast('timer-set-countdown-seconds', $scope.startingTime += 15);
    }
  };

  $scope.finished = function() {
    $scope.timerState = 'FLASHING';
    $scope.flashing = true;
    $scope.$apply();
    $cordovaNativeAudio.loop('gong');
  };

  $scope.toggleHelp = function() {
    $scope.showHelp = !$scope.showHelp;
  };
}
