import 'jquery'
import angular from 'angular'

if (IS_TEST) {
  require('angular-mocks/angular-mocks')
}

const ngModule = angular.module('app', [])

require('./directives').default(ngModule)

console.log('env', NODE_ENV)
console.log('test', IS_TEST)
