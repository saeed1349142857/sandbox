import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import Components from './components/';
import Services from './services/';

import scott from './test';


angular.module('app', [uiRouter, Components, Services])
.controller('MyController', ['$scope', function ($scope) {
    $scope.greetMe = 'Scott Walters';
  }]);

angular.element(function() {
    angular.bootstrap(document, ['app']);
  });