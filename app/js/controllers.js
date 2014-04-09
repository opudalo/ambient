'use strict'

var POST_URL = '/create',
  DEFAULTS =  {
    model: {
      active: { id: null },
      list: MODELS
    },
    cordLength: {
      active: 'small',
      small: {
        name: '100см'
      },
      medium: {
        name: '130см'
      },
      large: {
        name: '160см',
        price: 5
      }
    },
    cordSelector: {
      active: 'AA',
      AA: { price: 60},
      change: { price: 30},
      old: { price: 0}
    },
    jack: {
      active: 'угловой',
      angle: "угловой",
      straight: "прямой"
    },
    engraving: {
      active: false,
      price: 10,
      text: ''
    },
    ventilation: {
      active: false,
      price: 20
    },
    filterSulfur: false,
    fabricCase: {
      active: false,
      price: 2.5
    },
    drierCapsule: {
      active: false,
      price: 2.5
    },
    sulfurStick: {
      active: false,
      price: 3
    },
    namedCase: {
      active: false,
      price: 30
    },
    customer: {
      userName: '',
      email: '',
      surname: '',
      name: '',
      secondName: '',
      address: '',
      city: '',
      country: '',
      zip: '',
      phone: '',
      misc: ''
    }
  }
var monitors = angular.module('monitorsConstructor', [])

monitors.controller('MonitorsList', ['$scope', '$sce', function ($scope, $sce) {

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

    $scope.nextStep = function () {
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
        data = _.clone(steps)
      

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

      return data
    }


    $scope.submit = function () { 

      var data = getData()
      $http({
          method  : 'POST',
          url     : POST_URL,
          data    : $.param(data),  // pass in data as strings
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .success(function(data) {
              console.log(data)

              if (!data.success) {
                  $scope.errorName = data.errors.name
                  $scope.errorSuperhero = data.errors.superheroAlias
              } else {
                  $scope.message = data.message
              }
          })
    }

    //test
    $scope.confirmModel(6)
    $scope.nextStep()
    $scope.nextStep()

}])
