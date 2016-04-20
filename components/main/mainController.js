angular.module('app')
  .controller('mainController', function ($scope, pouchDB) {
    var db = new pouchDB('database');

    $scope.tasks = [];
    $scope.newTask = {
      name: '',
      done: false
    };

    $scope.clearAllTasks = function () {
      removeAll();
      $scope.tasks.length = 0;
    };

    $scope.markAllDone = function () {
      _.each(angular.copy($scope.tasks), function (task) {
        if (task && task.done === false) {
          task.done = true;
          updateTask(task);
        }
      })
    };

    $scope.add = function () {
      $scope.tasks.push(angular.copy($scope.newTask));

      db.put({
        _id: new Date().toISOString(),
        name: $scope.newTask.name,
        done: false
      }, function (err) {
        if (err) {
          return console.log(err);
        }
      });

      getTasks();
      resetForm();
    };

    $scope.doneTask = function (task) {
      task.done = !task.done;
      updateTask(task);
    };

    $scope.del = function (index, task) {
      $scope.tasks.splice(index, 1);
      removeTask(task);
    };

    $scope.delAllDone = function () {
      removeAllDone();
      _.remove($scope.tasks, function (task) {
        return task.done === true;
      });
    };

    $scope.press = function (event) {
      if (event && event.keyCode === 13) {
        $scope.add();
      }
    };

    function resetForm() {
      $scope.newTask.name = '';
    }

    function getTasks() {
      db.allDocs({
        include_docs: true,
        attachments: true
      }).catch(function (err) {
        console.log(err);
      }).then(function (data) {
        var res = [];
        _.each(data.rows, function (row) {
          if (row && row.doc) {
            res.push(row.doc)
          }
        });

        $scope.tasks = res;
      });
    }

    $scope.$watchCollection('tasks', function (tasks) {
      $scope.tasks = tasks;
    });

    getTasks();

    function updateTask(task) {
      db.put({
          _id: task._id,
          _rev: task._rev,
          done: task.done,
          name: task.name,
          value: Date.now().toJSON
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function (resp) {
          console.log(resp);
        });

      getTasks();
    }

    function removeTask(task) {
      db.remove({
          _id: task._id,
          _rev: task._rev
        })
        .catch(function (err) {
          console.log(err);
        });

      getTasks();
    }

    function removeAllDone() {
      var tasksDone = _.filter($scope.tasks, function (task) {
        return task.done === true;
      });

      _.each(tasksDone, function (task) {
        removeTask(task);
      });
    }

    function removeAll() {
      _.each($scope.tasks, function (task) {
        removeTask(task);
      });
    }
  })
;