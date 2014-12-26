'use strict'

var POST_URL = '/apply.php',
  monitors = angular.module('monitorsConstructor', [])

monitors.directive('fileInput', [ '$parse', '$http', function($parse, $http) {
  return {
    restrict: 'A',
    link: function(scope, els, attr, ctrl) {
      els.bind('change', function () {
        var el = els[0],
          files = el.files

        if (!files || !files.length) return

        
        var data = new FormData()
        data.append('file', files[0])

        //$parse(attr.fileInput)
        //  .assign(scope, files[0])
        //scope.$apply()
        $http.post('upload.php', data, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }).success(function (msg) {
          if (!msg.url) return

          var url = msg.url.replace(document.location.origin, '').replace(/^.*?upload/, 'upload' )

          scope.steps.graphics.list.push({
            name: 'Свой рисунок',
            url: url,
            price: 0
          })
        })
      })
    }
  }
}])




monitors.controller('MonitorsList', ['$scope', '$sce', '$http', function ($scope, $sce, $http) {
 //   new Tooltip()

    $scope.steps = DEFAULTS

    ;['base', 'cover', 'chanel', 'cap', 'graphics', 'pin', 'cord'].forEach(function(el) {
         $scope.steps[el] = _.extend({
            active: {
                left: { id: 0 },
                right: { id: 0 },
                price: 0
            }
        }, CUSTOMS[el])
    })


    $scope.step = 1
    $scope.maxStepComplete = 0
    $scope.same = true

    $scope.setSame = function(val) {
        $scope.same = val
    }

    $scope.setModel = function(id) {
        var m = _.extend({id: id}, $scope.steps.model.list[id])
        $scope.steps.model.active = m

        $scope.steps.cordSelector.active = 'AA'
        $scope.aaCordSelector()
    }

    $scope.confirmModel = function (id) {
        $scope.nextStep()
        $scope.setModel(id)
    }

    $scope.prevStep = function () {
        $scope.step--
    }

    $scope.setStep = function (index) {
        if ($scope.maxStepComplete == 0) return 

        if (index == 4) setFabric()
        $scope.step = index

        $scope.maxStepComplete = Math.max($scope.maxStepComplete, $scope.step)
    }

    $scope.nextStep = function () {
        if ($scope.step == 4) $scope.savePic() 
        $scope.step++
        $scope.maxStepComplete = Math.max($scope.maxStepComplete, $scope.step)
    }

    $scope.totalPrice = function () {
        var price = parseInt($scope.steps.model.active.price)

        ;['base', 'cover', 'chanel', 'cap', 'graphics', 'pin', 'cord'].forEach(function(el) {
            var p = $scope.steps[el].active.price
            if (typeof p != 'undefined') price += parseInt(p)
        })

        var v = $scope.steps.ventilation
        if (v.active) price += v.price

        if ($scope.steps.engraving.text != '') price += $scope.steps.engraving.price

        var c = $scope.steps.cordLength
        price += c[c.active].price || 0

        var s = $scope.steps.filterSulfur
        if (s.active) price += s.price

        if ($scope.steps.model.active.custom) price += sumCustom()

        return price

        function sumCustom () {
          var sum = 0

          ;['fabricCase', 'drierCapsule', 'sulfurStick', 'namedCase'].forEach(function ( el ) {
            var s = $scope.steps[el]

            if (!s.active) return

            sum += s.price
          })

          sum += $scope.steps.cordSelector[$scope.steps.cordSelector.active].price

          return sum
        }
    }

    $scope.select = function (orient, name, id) {
        var o = ($scope.same || name == 'cord') ? ['left', 'right'] : [orient],
          selector = $scope.steps[name]

        o.forEach(function ( o ){
            selector.active[o].id = id


            if (name == 'base' && $scope.maxStepComplete == 2) {
              var pin = $scope.steps['pin']
              pin.active[o].id = id
            }
        })

        if (name == 'cap') capPrice(id)
        if (name == 'base' || name == 'chanel') chanelPrice()
        if (name == 'base' || name == 'pin') pinPrice()

        function capPrice(id) {
          if (id != 0) return $scope.steps['cap'].active.price = 20
          var active = $scope.steps['cap'].active
          if (active.left.id == active.right.id) $scope.steps['cap'].active.price = 0
        }

        function pinPrice(id) {
          checkSimilar({
            setTo: 'pin',
            compareTo: 'base',
            price: 20
          })
        }

        function chanelPrice(id) {
          checkSimilar({
            setTo: 'chanel',
            compareTo: 'base',
            price: 15
          })
        }

        function checkSimilar(cfg) {
          var setTo = cfg.setTo,
            compareTo = cfg.compareTo,
            price = cfg.price

          var c = $scope.steps[compareTo].active,
            s = $scope.steps[setTo].active

          $scope.steps[setTo].active.price = 0

          ;['left', 'right'].forEach(function ( o ){
            if (c[o].id == s[o].id) return
            $scope.steps[setTo].active.price = price
          })
        }


    }

    function onMove() {
      $scope.showRotatePic = false
      $scope.showConfirmPic = true
      var el = this.relatedTarget
      el.setCoords()
      var pad = 10,
        bound = el.getBoundingRect(),
        rightLimit = this.width - el.getBoundingRectWidth() - pad,
        bottomLimit = this.height - el.getBoundingRectHeight() - pad

      var left = el.left
      if (bound.left < pad) left = el.left - bound.left + pad
      if (bound.left > rightLimit) left = rightLimit - el.left + bound.left

      var top = el.top
      if (bound.top < pad) top = el.top - bound.top + pad
      if (bound.top > bottomLimit) top = bottomLimit - el.top + bound.top

      el.setLeft(left)
      el.setTop(top)
    }
    $scope.graphics = function (orient, name, id) {
        var o = $scope.same ? ['left', 'right'] : [orient],
          selector = $scope.steps[name],
          cLeft, cRight
        
        window['cleft'] = window['cleft'] || new fabric.Canvas('canvasleft');
        window['cright'] = window['cright'] || new fabric.Canvas('canvasright');
        
        cLeft = window['cleft'] 
        cRight = window['cright']
        
        cLeft.on ("object:moving", onMove)
        cRight.on ("object:moving", onMove)
    
        o.forEach(draw)

        function draw( o ){
          selector.active[o].id = id

          if (id != 0) {
            $scope.showRotatePic = true
            $scope.showConfirmPic = false
          }

          var url = selector.list[id].url
          var canvas = window['c' + o]
          canvas.clear().renderAll()

          fabric.Image.fromURL(url, function(img){
            var max = Math.max(img.width, img.height),
              scale = 1,
              left,
              top
            
            if (max > 150) scale = 150 / max
              
            left = canvas.width / 2 - scale * img.width / 2
            top = canvas.height / 2 - scale * img.height / 2
            img.scale(scale).set({ left: left, top: top})

            canvas.add(img) 
            //.setActiveObject(img);
          })
        }
    }

    $scope.showConfirmPic = false
    $scope.showRotatePic = false

    $scope.rotatePics = function () {
      $scope.showRotatePic = false
      $scope.showConfirmPic = true

      ;['left', 'right'].forEach(function(o) {
        var canvas = window['c' + o]
        canvas.forEachObject(function (o) {
          canvas.setActiveObject(o)
        })
      })
    }

    $scope.savePic = function () {
      $scope.showRotatePic = true
      $scope.showConfirmPic = false

      ;['left', 'right'].forEach(function(o) {
        var canvas = window['c' + o]
        canvas.deactivateAll().renderAll()
      })
      //var pic = window._canvas.toDataURL()
    } 

    $scope.aaCordSelector = function () {
      var c = $scope.steps.cordSelector.active
      if (c == 'AA') return

      $scope.steps.cordLength.active = 'small'

      if (c == 'change') return


      var o = ['left', 'right']
      o.forEach(function ( o ){
          $scope.steps['pin'].active[o].id = $scope.steps['base'].active[o].id
      })

      $scope.steps['pin'].active.price = 0
    }

    $scope.html = function(html) {
        return $sce.trustAsHtml(html)
    }

    $scope.getSelItem = function(el) {
        var sel = $scope.steps[el],
            left = sel.active.left.id,
            right = sel.active.right.id,
            chosen = sel.list[left].name

        if (left != right) chosen += '/' + sel.list[right].name

        return chosen
    }


    function getData() {
      var steps = $scope.steps,
        data = _.cloneDeep(steps)


      ;['base', 'cover', 'chanel', 'cap', 'graphics', 'pin', 'cord'].forEach(function(i) {

        var sel = data[i]

        ;['left', 'right'].forEach(function(orient) {
          var active = sel.active,
            listItem = sel.list[active[orient].id]

          active[orient] = _.extend(listItem, active[orient])
        })

        delete sel.list
      })

      delete data.model.list
      
      data.graphicsPosition = {
        left: '',
        right: ''
      }
      
      ;['left', 'right'].forEach(function(orient) {
          var active = window['c' + orient],
            base64 = active.toDataURL()

          data.graphicsPosition[orient] = base64
      })


      return data
    }


    $scope.submit = function () {

      var data = getData()
     
      $http({
          method  : 'POST',
          url     : POST_URL,
          data    : $.param(data),  // pass in data as strings
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
          console.log(data)
      })
    }

    //test
   //$scope.confirmModel(4)
   //$scope.nextStep()
   //$scope.nextStep()
   // $scope.nextStep()
   // $scope.nextStep()

}])
