mytodoApp.directive('draggable', function ($http) {
  return function (scope, element) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function (e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      },
      false
    );

    el.addEventListener(
      'dragend',
      function (e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
});


mytodoApp.directive('droppable', function ($http) {
  return {
    scope: {
      drop: '&',
      todoListBin: '='
    },
    link: function (scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener(
        'dragover',
        function (e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('over');
            return false;
          }
        },
        false
      );

      el.addEventListener(
        'dragenter',
        function (e) {
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function (e) {
          this.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function (e) {
          e.preventDefault();
          // Stops some browsers from redirecting.
          if (e.stopPropagation) {
            e.stopPropagation();

          }

          this.classList.remove('over');

          var binId = this.id;
          var item = document.getElementById(e.dataTransfer.getData('Text'));

          angular.forEach(scope.$parent.cstodos.items, function (e, v) {
            if (e._id == item.id) {
              scope.$parent.cstodos.items[v].status = binId;

              // console.log(e.title, scope.$root.sessionId)
              $http({
                method: "PUT",
                url: '/todo',
                params: {
                  'sessionId': scope.$root.sessionId,
                },
                data: $.param({
                  id: e._id,
                  title: e.title,
                  description: e.description,
                  status: binId,
                }),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }).then(function success(response) {
                // console.log(response)
              }, function error(response) {
                event.preventDefault();
                event.stopPropagation();
                alert('err: ' + response);
              });
            }
          });
          this.appendChild(item);
          // call the passed drop function
          scope.$apply(function (scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {
              fn(item.id, binId);
            }
          });

          return false;
        },
        false
      );
    }
  }
});