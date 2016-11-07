/**
 * https://github.com/fatlinesofcode/ngDraggable
 * https://github.com/freegroup/draw2d_js.app.starterkit_angularJS
 */
var Ctrl002 = ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $scope.title = 'Draw2D流程设计';


        $scope.create_workflow = function () {
            //var wf = new draw2d.Canvas("workflow_content");
        }

        //$scope.create_workflow();

        $scope.fl = {
            name: '测试控件'
        };

        // var onDraggableEvent = function (evt, data) {
        //     //console.log("128", "onDraggableEvent", evt, data);
        // }
        // //$scope.$on('draggable:start', onDraggableEvent);
        // //$scope.$on('draggable:move', onDraggableEvent);
        // //$scope.$on('draggable:end', onDraggableEvent);

        // $scope.onDragComplete = function () {
        //     console.log("drag success, data:");
        // }
        // $scope.onDropComplete = function () {
        //     console.log("drop success, data:");
        // }


        $scope.centerAnchor = true;
        $scope.toggleCenterAnchor = function () {$scope.centerAnchor = !$scope.centerAnchor}
        $scope.draggableObjects = [{name:'one'}, {name:'two'}, {name:'three'}];
        $scope.droppedObjects1 = [];
        $scope.droppedObjects2= [];
        $scope.onDragComplete = function(data,evt){
            console.log(data);
            console.log(evt);
        }
        $scope.onDropComplete1=function(data,evt){
            console.log(1111);
            alert(1111);
            var index = $scope.droppedObjects1.indexOf(data);
            if (index == -1)
            $scope.droppedObjects1.push(data);
        }
        $scope.onDragSuccess1=function(data,evt){
            console.log("133","$scope","onDragSuccess1", "", evt);
            var index = $scope.droppedObjects1.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects1.splice(index, 1);
            }
        }
        $scope.onDragSuccess2=function(data,evt){
            var index = $scope.droppedObjects2.indexOf(data);
            if (index > -1) {
                $scope.droppedObjects2.splice(index, 1);
            }
        }
        $scope.onDropComplete2=function(data,evt){
            var index = $scope.droppedObjects2.indexOf(data);
            if (index == -1) {
                $scope.droppedObjects2.push(data);
            }
        }
        var inArray = function(array, obj) {
            var index = array.indexOf(obj);
        }


    }];
Ctrl002.$injector = ['$rootScope', '$scope'];