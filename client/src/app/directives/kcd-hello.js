export default ngModule => {
  if (IS_TEST) {
    require('./kcd-hello.test').default(ngModule)
  }

  ngModule.directive('kcdHello', () => {
    require('./kcd-hello.scss')

    return {
      restrict: 'E',
      scope: {},
      template: require('./kcd-hello.html'),
      controllerAs: 'vm',
      controller: function () {
        const vm = this
        vm.hello = 'Hello, Angular!'
        vm.image = require('../../images/angularjs-2.png')
      }
    }
  })
}

// module.exports = function (ngModule) {
//     ngModule.directive('kcdHello', function () {
//         return {
//             restrict: 'E',
//             scope: {},
//             templateUrl: 'directives/kcd-hello.html',
//             controllerAs: 'vm',
//             controller: function () {
//                 var vm = this;
//                 vm.hello =  "Hello, Angular!";
//             }
//         }
//     });
// }
