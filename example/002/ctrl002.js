/**
 * https://github.com/fatlinesofcode/ngDraggable
 * https://github.com/freegroup/draw2d_js.app.starterkit_angularJS
 */
var Ctrl002 = ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.title = '拖拽事件';
    $scope.context = {};

    //控件数组
    $scope.components = [
        { name: '开始', code: 'start', data: {} },
        { name: '时间', code: 'time', data: {} }
    ];

    $scope.$on('draggable:move', function (evt, data) {
        //$scope.context = evt;
    });
    //拖拽方法
    $scope.onDropComplete = function (data, evt) {
        console.log(data, evt);
        $scope.context = evt;
    }
}];



Ctrl002.$injector = ['$rootScope', '$scope'];
