import angular from 'angular';
import About from './aboutComponent/';

let componentsModule = angular.module('app.components', [
  About
])
.name;

export default componentsModule;