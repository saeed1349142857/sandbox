import template from './about.html';
import controller from './about.controller';

console.log('here123');

let aboutComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller
};

export default aboutComponent;