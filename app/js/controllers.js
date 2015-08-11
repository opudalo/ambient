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
            price: 30
          })
        })
      })
    }
  }
}])




monitors.controller('MonitorsList', ['$scope', '$sce', '$http', function ($scope, $sce, $http) {
    new Tooltip()

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
          cLeft = window['cleft'],
          cRight = window['cright'],
          isNew = !cLeft || !cRight

        if (isNew) {
          window['cleft'] = new fabric.Canvas('canvasleft');
          window['cright'] = new fabric.Canvas('canvasright');
          cLeft = window['cleft']
          cRight = window['cright']

          cLeft.controlsAboveOverlay = true;
          cRight.controlsAboveOverlay = true;

          cLeft.clipTo = function (ctx) {
            var path = new fabric.Path("m 12.5,77.719346 c 0,0 21.785714,-36.785714 51.785714,-58.214285 30,-21.4285717 46.428576,-9.285715 46.428576,-9.285715 0,0 8.57142,7.857143 5.71428,16.428572 -2.85714,8.571429 12.85714,24.285714 12.85714,24.285714 0,0 8.57143,15.714286 5,47.857143 -6.7836,21.241775 -13.07231,28.536435 7.14286,64.285715 0,0 4.213,27.57852 -22.14285,26.42857 C 99.491076,188.64139 64.285715,165.21935 64.285715,165.21935 14.324964,146.69826 12.857143,133.07649 12.857143,133.07649 c 0,0 -14.6428572,-27.5 -0.357143,-55.357144 z")

            path.fill = 'transparent'
            path.set({
              top: -16,
              left: 95
            })
            path.render(ctx)

          }

          cRight.clipTo = function (ctx) {
            var path = new fabric.Path("m 100.51018,28.067523 c 32.78321,31.056311 39.67158,53.950383 39.39595,64.144687 -0.64278,23.77414 -2.83833,29.38185 -10.10153,39.90102 -6.8981,9.99042 -18.93215,14.7579 -30.304579,18.18275 -14.563175,4.38574 -41.863404,23.08562 -56.568538,29.29443 -10.694066,4.51525 -18.291037,3.31068 -24.748737,2.52538 C 12.497953,181.42447 8.2647505,177.78966 6.0609153,174.53964 1.9444191,168.469 2.7233632,158.51546 3.535534,151.81121 c 1.1077011,-9.14377 6.1119079,-15.79022 10.101525,-26.26396 5.91439,-15.52675 0.391847,-16.88787 -2.020305,-46.467023 -1.100187,-13.491115 0.351116,-22.271806 3.030458,-30.809653 2.282421,-7.273041 6.463849,-8.372619 12.121831,-20.708127 0,0 -0.74111,-13.99079 3.030457,-19.6979752 C 33.571067,2.1572864 37.894077,-0.57091553 51.51778,0.28832818 67.899993,1.3215504 89.685312,17.812871 100.51018,28.067523 Z")

            path.fill = 'transparent'
            path.set({
              top: -18,
              left: 18
            })
            path.render(ctx)
          }

        }
        cLeft.on ("object:moving", onMove)
        cRight.on ("object:moving", onMove)

        selector.active.price = selector.list[id].price
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
        if (!canvas || !canvas.deactivateAll) return
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
            base64 = active && active.toDataURL() || ''

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
   // $scope.confirmModel(4)
   // $scope.nextStep()
   // $scope.nextStep()
   // $scope.nextStep()
   // $scope.nextStep()

}])
