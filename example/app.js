angular.module('myApp', [
    'ngAnimate',
    'ui.router',
    'ngDraggable',
    'draw2d'
]).config(function ($stateProvider) {
    $stateProvider.state({
        name:'001',
        url:'/001',
        templateUrl:'example/001/001.html',
        controller:['$scope',function($scope){
            $scope.title = 'CSS3翻转动画';
            $scope.show = true;
        }]
    });

    $stateProvider.state({
        name:'002',
        url:'/002',
        templateUrl:'example/002/002.html',
        controller:Ctrl002
    });
});