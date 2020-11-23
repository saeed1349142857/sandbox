import angular from 'angular';
import DemoService from './demo.service';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []).
service('DemoService', DemoService)
.name;


export default servicesModule;