import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import aboutComponent from './about.component';

let aboutModule = angular.module('about', [uiRouter])

  .config(($stateProvider:any) => {
    "ngInject";
    $stateProvider
      .state('about', {
        url: '/about',
        component: 'aboutComponent'
      });
  })
  .component('aboutComponent', aboutComponent)
  .name;


export default aboutModule;