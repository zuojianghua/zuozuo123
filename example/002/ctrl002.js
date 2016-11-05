var Ctrl002 = ['$rootScope', '$scope', 'draw2d',
    function ($rootScope, $scope, draw2d) {
        $scope.title = 'Draw2D流程设计';


        $scope.create_workflow = function(){
            var wf = new draw2d.Canvas("workflow_content");
        }

        //$scope.create_workflow();


    }];
Ctrl002.$injector = ['$rootScope', '$scope', 'draw2d'];