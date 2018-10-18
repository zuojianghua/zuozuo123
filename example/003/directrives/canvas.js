d2.directive("draw2dCanvas", ["$window", "$parse", "$timeout", 'ngDialog',function ($window, $parse, $timeout,ngDialog) {

    return {
        restrict: 'E,A',
        link: function (scope, element, attrs, controller) {
            //画板
            var canvas;
            //数据
            scope.task_data=[];
            scope.line_data=[];
            //私有方法 =================================================================
            var click_time = function(figure){
                //console.log(figure);
                var win = ngDialog.open({
                    template:'example/003/dialog/time.html',
                    disableAnimation:true,
                    controller:['$scope',function($scope){
                        $scope.title = '设置时间';
                        $scope.save_time = function(){
                            figure.userData.data = $scope.data;
                            ngDialog.close(win);
                        }
                    }]
                });
            }
            //控件组设置
            var figures = {
                'start': { 
                    name: '开始', 
                    class: 'start', 
                    ico: 'assets/images/start.png',
                    input: false,
                    output: true,
                    output_node:['time'],
                    data: {} 
                },
                'time': { 
                    name: '时间', 
                    class: 'time', 
                    input: true,
                    output: true,
                    output_node:['time','end'],
                    ico: 'assets/images/time.png', 
                    dbclick: click_time,
                    data: {} 
                },
                'end': {
                    name: '结束', 
                    class: 'end', 
                    ico: 'assets/images/end.png', 
                    input: true,
                    output: false,
                    output_node:[],
                    data: {}
                }

            };

            //新增节点动作
            var addNode = function (node, x, y) {
                var add_command = new draw2d.command.Command(x + 'myadd' + y);
                //创建基本图形
                var task_node = new draw2d.shape.basic.Image({
                    path: node.ico,
                    resizeable: false,
                    angle: 0,
                    //selectable: false
                    userData: JSON.parse(JSON.stringify(node))
                });
                //创建输入输出
                if(node.input)
                    task_node.createPort("input", new draw2d.layout.locator.LeftLocator());
                if(node.output)
                    task_node.createPort("output", new draw2d.layout.locator.RightLocator());
                //创建标签
                task_node.add(new draw2d.shape.basic.Label({text: node.name}), new draw2d.layout.locator.BottomLocator());
                //绑定事件
                task_node.onDoubleClick = function(figure, mouseX, mouseY, shiftKey, ctrlKey){
                    //console.log(task_node);
                    node.dbclick(task_node);
                }

                add_command.execute = function(){
                    canvas.add(task_node, x, y);
                    return task_node;
                }
                add_command.undo = function(){
                    canvas.remove(task_node);
                }
                add_command.redo = function(){
                    canvas.add(task_node, x, y);
                }
                task = canvas.getCommandStack().execute(add_command);
                task_node.userData.x = x;
                task_node.userData.y = y;
                scope.task_data.push(task_node.userData);
            };

            //删除节点动作 暂时不用
            var delNode = function(node){
                var del_command = new draw2d.command.Command('mydel'+Math.random());
                del_command.execute = function(){
                    canvas.remove(node);
                }
                del_command.undo = function(){

                }
                del_command.redo = function(){
                    canvas.remove(node);
                }
                canvas.getCommandStack().execute(del_command);
            }

            //编辑器参数设置
            scope.editor = $.extend(true, {
                canvas: {
                    width: 2000,
                    height: 2000,
                    onDrop: function (droppedDomNode, x, y, shiftKey, ctrlKey) {
                        var key = droppedDomNode[0].attributes['data-shape'].value;
                        var node = scope.editor.palette.figures[key];
                        addNode(node, x, y);
                    }
                },
                palette: {
                    figures: figures
                },
                state: {
                    dirty: false,
                    canUndo: false,
                    canRedo: false
                },
                selection: {
                    className: null,
                    figure: null,
                    attr: null
                }
            }, scope.editor);

            // =====================================================================
            //初始化画板
            canvas = new draw2d.Canvas(element.attr("id"), scope.editor.canvas.width, scope.editor.canvas.height);
            canvas.setScrollArea("#" + element.attr("id"));
            canvas.onDrop = $.proxy(scope.editor.canvas.onDrop, canvas);



            // update the scope model with the current state of the
            // CommandStack
            var stack = canvas.getCommandStack();
            stack.addEventListener(function (event) {
                $timeout(function () {
                    scope.editor.state.canUndo = stack.canUndo();
                    scope.editor.state.canRedo = stack.canRedo();
                }, 0);
            });

            // Update the selection in the model
            // and Databinding Draw2D -> Angular
            var changeCallback = function (emitter, attribute) {
                $timeout(function () {
                    if (scope.editor.selection.attr !== null) {
                        scope.editor.selection.attr[attribute] = emitter.attr(attribute);
                    }
                }, 0);
            };
            canvas.on("select", function (canvas, event) {
                var figure = event.figure;
                if (figure instanceof draw2d.Connection) {
                    return; // silently
                }

                $timeout(function () {
                    if (figure !== null) {
                        scope.editor.selection.className = figure.NAME;
                        scope.editor.selection.attr = figure.attr();
                    }
                    else {
                        scope.editor.selection.className = null;
                        scope.editor.selection.attr = null;
                    }

                    // unregister and register the attr listener to the new figure
                    //
                    if (scope.editor.selection.figure !== null) { scope.editor.selection.figure.off("change", changeCallback); }
                    scope.editor.selection.figure = figure;
                    if (scope.editor.selection.figure !== null) { scope.editor.selection.figure.on("change", changeCallback); }
                }, 0);
            });

            // Databinding: Angular UI -> Draw2D
            // it is neccessary to call the related setter of the draw2d object. "Normal" Angular 
            // Databinding didn't work for draw2d yet
            //
            scope.$watchCollection("editor.selection.attr", function (newValues, oldValues) {

                if (oldValues !== null && scope.editor.selection.figure !== null) {
                    // for performance reason we post only changed attributes to the draw2d figure
                    //
                    var changes = draw2d.util.JSON.diff(newValues, oldValues);
                    scope.editor.selection.figure.attr(changes);
                }
            });

            // push the canvas function to the scope for ng-action access
            //
            scope.editor.undo = $.proxy(stack.undo, stack);
            scope.editor.redo = $.proxy(stack.redo, stack);
            scope.editor["delete"] = $.proxy(function () {
                //var node = this.getCurrentSelection();
                //var command = new draw2d.command.CommandDelete(node);
                //this.getCommandStack().execute(command);
                //delNode(canvas.selection.all.data);
                var command = new draw2d.command.CommandDelete(this.selection.all.data[0]);
                this.getCommandStack().execute(command);
                savetask();
                saveline();
            }, canvas);

            scope.editor.load = $.proxy(function (json) {
                canvas.clear();
                var reader = new draw2d.io.json.Reader();
                reader.unmarshal(canvas, json);
            }, canvas);


            scope.editor.console = function(){
                savetask();
                saveline();
            }

            //生成保存数据方法
            //任务节点
            var savetask = function(){
                scope.task_data=[];
                canvas.getFigures().data.forEach(function(i){
                    //console.log(i);
                    scope.task_data.push(i.userData);
                });
            }
            //线段节点
            var saveline = function(){
                scope.line_data = [];
                //console.log(canvas.getLines());
                canvas.getLines().data.forEach(function(i){
                    var line = {
                        start:i.start,
                        end:i.end,
                        sourcePort:i.sourcePort.parent.userData,
                        targetPort:i.targetPort.parent.userData
                    }
                    //console.log(line);
                    scope.line_data.push(JSON.parse(JSON.stringify(line)));
                });
            }
        }
    };
}]);