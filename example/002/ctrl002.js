var Ctrl002 = ['$rootScope', '$scope',
    function ($rootScope, $scope) {
        $scope.title = 'Draw2D流程设计';


        $scope.create_workflow = function(){
            var wf = new draw2d.Canvas("workflow_content");
        }

        $scope.create_workflow();

        //$scope.fl01 = ;

    }];
Ctrl002.$injector = ['$rootScope', '$scope'];