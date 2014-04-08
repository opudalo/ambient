'use strict';

/* Controllers */
var monitors = angular.module('monitorsConstructor', [])

monitors.controller('MonitorsList', ['$scope', '$sce', function ($scope, $sce) {

    new Tooltip()

    $scope.steps = {
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
        filterAcoustic: false,
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
        aaCord: {
          active: false,
          price: 45
        },
        namedCase: {
          active: false,
          price: 30
        },
        customPin: {
          active: false,
          price: 7.5
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
        var o = ($scope.same || name == 'cord') ? ['left', 'right'] : [orient]
            
        o.forEach(function ( o ){
            $scope.steps[name].active[o].id = id
         

            if (name == 'base' && $scope.maxStepComplete == 2) {
              $scope.steps['pin'].active[o].id = id
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

    $scope.customPinCheckbox = function () {
      if ($scope.steps.customPin.active) return
      
      var o = ['left', 'right']
      o.forEach(function ( o ){
          $scope.steps['pin'].active[o].id = $scope.steps['base'].active[o].id
      })

      $scope.steps['pin'].active.price = 0
    }

    $scope.aaCordCheckbox = function () {
      if ($scope.steps.aaCord.active) return
      
      $scope.steps.cordLength.active = 'small'
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


    //test
    //$scope.confirmModel(6)
    //$scope.nextStep()
    //$scope.nextStep()

}])


var CUSTOMS = {
    'base': {
        name: 'base',
        title: 'Цвет корпусов',
        list: [{
            url: '1-1.png',
            name: 'белый'
        }, {
            url: '1-2.png',
            name: 'телесный'
        }, {
            url: '1-3.png',
            name: 'синий'
        }, {
            url: '1-4.png',
            name: 'голубой'
        }, {
            url: '1-5.png',
            name: 'зеленый'
        }, {
            url: '1-6.png',
            name: 'салатовый'
        }, {
            url: '1-7.png',
            name: 'красный'
        }, {
            url: '1-8.png',
            name: 'розовый'
        }, {
            url: '1-9.png',
            name: 'коричневый'
        }, {
            url: '1-10.png',
            name: 'желтый'
        }, {
            url: '1-11.png',
            name: 'фиолетовый'
        }, {
            url: '1-12.png',
            name: 'черный'
        }, {
            url: '1-13.png',
            name: 'прозрачный белый'
        }, {
            url: '1-14.png',
            name: 'бесцветный'
        }, {
            url: '1-15.png',
            name: 'прозрачный желтый'
        }, {
            url: '1-16.png',
            name: 'прозрачный зеленый'
        }, {
            url: '1-17.png',
            name: 'прозрачный салатовый'
        }, {
            url: '1-18.png',
            name: 'прозрачный красный'
        }, {
            url: '1-19.png',
            name: 'прозрачный розовый'
        }, {
            url: '1-20.png',
            name: 'прозрачный вишневый'
        }, {
            url: '1-21.png',
            name: 'прозрачный синий'
        }, {
            url: '1-22.png',
            name: 'прозрачный голубой'
        }, {
            url: '1-23.png',
            name: 'прозрачный фиолетовый'
        }, {
            url: '1-24.png',
            name: 'прозрачный черный'
        }]
    },
    'cover': {
        name: 'cover',
        title: 'Цвет крышек',
        list: [{
            url: '2-1.png',
            name: 'белый'
        }, {
            url: '2-2.png',
            name: 'телесный'
        }, {
            url: '2-3.png',
            name: 'синий'
        }, {
            url: '2-4.png',
            name: 'голубой'
        }, {
            url: '2-5.png',
            name: 'зеленый'
        }, {
            url: '2-6.png',
            name: 'салатовый'
        }, {
            url: '2-7.png',
            name: 'красный'
        }, {
            url: '2-8.png',
            name: 'розовый'
        }, {
            url: '2-9.png',
            name: 'коричневый'
        }, {
            url: '2-10.png',
            name: 'желтый'
        }, {
            url: '2-11.png',
            name: 'фиолетовый'
        }, {
            url: '2-12.png',
            name: 'черный'
        }, {
            url: '2-13.png',
            name: 'прозрачный белый'
        }, {
            url: '2-14.png',
            name: 'бесцветный'
        }, {
            url: '2-15.png',
            name: 'прозрачный желтый'
        }, {
            url: '2-16.png',
            name: 'прозрачный зеленый'
        }, {
            url: '2-17.png',
            name: 'прозрачный салатовый'
        }, {
            url: '2-18.png',
            name: 'прозрачный красный'
        }, {
            url: '2-19.png',
            name: 'прозрачный розовый'
        }, {
            url: '2-20.png',
            name: 'прозрачный вишневый'
        }, {
            url: '2-21.png',
            name: 'прозрачный синий'
        }, {
            url: '2-22.png',
            name: 'прозрачный голубой'
        }, {
            url: '2-23.png',
            name: 'прозрачный фиолетовый'
        }, {
            url: '2-24.png',
            name: 'прозрачный черный'
        }]
    },
    'chanel': {
        name: 'chanel',
        title: 'Цвет каналов',
        list: [{
            url: '3-1.png',
            name: 'белый'
        }, {
            url: '3-2.png',
            name: 'телесный'
        }, {
            url: '3-3.png',
            name: 'синий'
        }, {
            url: '3-4.png',
            name: 'голубой'
        }, {
            url: '3-5.png',
            name: 'зеленый'
        }, {
            url: '3-6.png',
            name: 'салатовый'
        }, {
            url: '3-7.png',
            name: 'красный'
        }, {
            url: '3-8.png',
            name: 'розовый'
        }, {
            url: '3-9.png',
            name: 'коричневый'
        }, {
            url: '3-10.png',
            name: 'желтый'
        }, {
            url: '3-11.png',
            name: 'фиолетовый'
        }, {
            url: '3-12.png',
            name: 'черный'
        }, {
            url: '3-13.png',
            name: 'белый'
        }, {
            url: '3-14.png',
            name: 'бесцветный'
        }, {
            url: '3-15.png',
            name: 'прозрачный желтый'
        }, {
            url: '3-16.png',
            name: 'прозрачный зеленый'
        }, {
            url: '3-17.png',
            name: 'прозрачный салатовый'
        }, {
            url: '3-18.png',
            name: 'прозрачный красный'
        }, {
            url: '3-19.png',
            name: 'прозрачный розовый'
        }, {
            url: '3-20.png',
            name: 'прозрачный вишневый'
        }, {
            url: '3-21.png',
            name: 'прозрачный синий'
        }, {
            url: '3-22.png',
            name: 'прозрачный голубой'
        }, {
            url: '3-23.png',
            name: 'прозрачный фиолетовый'
        }, {
            url: '3-24.png',
            name: 'прозрачный черный'
        }]
    },
    'cap': {
        name: 'cap',
        title: 'Материал вставок',
        list: [{
            url: '0.png',
            name: 'без вставок',
        }, {
            url: '5-1.png',
            name: 'красный карбон',
            price: 20
        }, {
            url: '5-2.png',
            name: 'серо-черный карбон ',
            price: 20
        }, {
            url: '5-3.png',
            name: 'золотистый 3D карбон',
            price: 20
        }, {
            url: '5-4.png',
            name: 'белый 3D карбон',
            price: 20
        }, {
            url: '5-5.png',
            name: 'черный 3D карбон',
            price: 20
        }, {
            url: '5-6.png',
            name: 'черный',
            price: 20
        }, {
            url: '5-7.png',
            name: 'серебристый 3D карбон',
            price: 20
        }, {
            url: '5-8.png',
            name: 'синий 3D карбон',
            price: 20
        }, {
            url: '5-9.png',
            name: 'зеркально-золотистый',
            price: 20
        }, {
            url: '5-10.png',
            name: 'шлифованный алюминий',
            price: 20
        }, {
            url: '5-11.png',
            name: 'черная кожа',
            price: 20
        }, {
            url: '5-12.png',
            name: 'Matrix 3D',
            price: 20
        }, {
            url: '5-13.png',
            name: 'глянцевый серый хром',
            price: 20
        }, {
            url: '5-14.png',
            name: 'шлифованный хром',
            price: 20
        }, {
            url: '5-15.png',
            name: 'битое стекло',
            price: 20
        }, {
            url: '5-16.png',
            name: 'алмазная крошка',
            price: 20
        }, {
            url: '5-17.png',
            name: 'шлифованное золото',
            price: 20
        }]
    },
    'graphics': {
        name: 'graphics',
        title: 'Рисунки',
        list: [{
            url: '0.png',
            name: 'без рисунков'
        }, {
            url: '9-1.png',
            name: 'золотой лого',
            price: 0
        }, {
            url: '9-2.png',
            name: 'серебренный лого',
            price: 0
        }, {
            url: '9-3.png',
            name: 'золотой лого',
            price: 0
        }, {
            url: '9-4.png',
            name: 'серебренный лого',
            price: 0
        }, {
            url: '9-5.png',
            name: 'золотой лого',
            price: 0
        }, {
            url: '9-6.png',
            name: 'серебренный лого',
            price: 0
        }]
    }, 
    'pin': {
        name: 'pin',
        title: 'Цвет штекеров',
        list: [{
            url: '4-1.png',
            name: 'белый',
            price: 10
        }, {
            url: '4-2.png',
            name: 'телесный',
            price: 10
        }, {
            url: '4-3.png',
            name: 'синий',
            price: 10
        }, {
            url: '4-4.png',
            name: 'голубой',
            price: 10
        }, {
            url: '4-5.png',
            name: 'зеленый',
            price: 10
        }, {
            url: '4-6.png',
            name: 'салатовый',
            price: 10
        }, {
            url: '4-7.png',
            name: 'красный',
            price: 10
        }, {
            url: '4-8.png',
            name: 'розовый',
            price: 10
        }, {
            url: '4-9.png',
            name: 'коричневый',
            price: 10
        }, {
            url: '4-10.png',
            name: 'желтый',
            price: 10
        }, {
            url: '4-11.png',
            name: 'фиолетовый',
            price: 10
        }, {
            url: '4-12.png',
            name: 'черный',
            price: 10
        }, {
            url: '4-13.png',
            name: 'прозрачный белый',
            price: 10
        }, {
            url: '4-14.png',
            name: 'бесцветный',
            price: 10
        }, {
            url: '4-15.png',
            name: 'прозрачный желтый',
            price: 10
        }, {
            url: '4-16.png',
            name: 'прозрачный зеленый',
            price: 10
        }, {
            url: '4-17.png',
            name: 'прозрачный салатовый',
            price: 10
        }, {
            url: '4-18.png',
            name: 'прозрачный красный',
            price: 10
        }, {
            url: '4-19.png',
            name: 'прозрачный розовый',
            price: 10
        }, {
            url: '4-20.png',
            name: 'прозрачный вишневый',
            price: 10
        }, {
            url: '4-21.png',
            name: 'прозрачный синий',
            price: 10
        }, {
            url: '4-22.png',
            name: 'прозрачный голубой',
            price: 10
        }, {
            url: '4-23.png',
            name: 'прозрачный фиолетовый',
            price: 10
        }, {
            url: '4-24.png',
            name: 'прозрачный черный',
            price: 10
        }]
    },
    'cord': {
        name: 'cord',
        title: 'Цвет провода',
        list: [{
            url: '6-3.png',
            name: 'серебристый',
            price: 0
        }, {
            url: '6-2.png',
            name: 'черный',
            price: 0
        }, {
            url: '6-1.png',
            name: 'светло оранж',
            price: 0
        }]
    }
}

var MODELS = [{
    name: 'AM1',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM1',
    price: 270,
    description: '<p>AM1 вобрали в себя все преимущества индивидуальных наушников. А это — максимальная звукоизоляция и исключительная четкость воспроизведения музыкальных композиций. Мы создали данную модель для любителей «ровного» нейтрального звука, со «слегка» приподнятым нижним регистром. Отличный выбор для людей, которые только начинают знакомиться с технологией in-ear мониторинга и особенностями звучания излучателей типа Balanced Armature!  </p>',
    specs: [
      '1 широкополосный излучатель типа Balanced Armature в ухе',
      '1 звуковод',
      'Частотный диапазон - 10 Гц ... 17 кГц',
      'Чувствительность (500 Гц) - 108 дБ/мВт',
      'Импеданс (500 Гц) – 16 Ом'
    ]
},{
    name: 'AM2',
    subname: 'Vocal Edition',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM2 Vocal Edition',
    price: 420,
    description: '<p>Индивидуальные custom мониторы AM2 Vocal Edition это миниатюрная двухполосная акустическая система в вашем ухе. С дополнительным массивным излучателем для воспроизведения низких частот и маленьким, «быстрым» излучателем для средних и высоких, мониторы AM2 Vocal Edition создают исключительно «четкий» и "плотный" низкочастотный диапазон и артикуляционный высокочастотный диапазон, которого невозможно добиться одним излучателем! AM2 Vocal Edition обладает слегка подчеркнутым речевым диапазоном, что понравиться любителям инструментальных "аналитических" музыкальных стилей. Идеально подойдут для контроля вокала (особенно женского), акустической гитары и смычковых инструментов!</p>',
    specs: [
        '2 излучателя типа Balanced Armature в ухе<br/> (1-низкие/средние, 1-высокие)',
        '2 звуковода',
        '2-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 17 кГц',
        'Чувствительность (500 Гц) — 110 дБ/мВт',
        'Импеданс (500 Гц) – 45 Ом'
    ]
},{
    name: 'AM3',
    subname: 'Reference Edition',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM3 Reference Edition',
    price: 495,
    description: '<p>Отличительной особенностью индивидуальных custom мониторов AM3-ReferenceEdition есть то, что в этой моделе нет приукрашиваний в звуке. Лаборатория Ambient Acoustics создавала данную модель как максимально линейную во всем частотном диапазоне! В ней отсутствуют излишняя мониторная «сибилятивность» и музыкальная накачка баса. Это достигается за счет применения в данной моделе трех излучателей в каждом ухе! Разделение каналов осуществляется как электрическим, так и акустическим кроссовером. Это позволило более точно сбалансировать и сгладить АЧХ под требования самого искушенного слушателя. Модель будет интересна в первую очередь музыкантам, звукорежиссерам, аудиофилам которым необходим мониторный, точный звук!</p>',
    specs: [
        '3 излучателя типа Balanced Armature в ухе<br/> (1-низкие, 1-средние, 1-высокие)',
        '2 звуковода',
        '3-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 17 кГц',
        'Чувствительность (500 Гц) — 112 дБ/мВт',
        'Импеданс (500 Гц) – 25 Ом'
    ]
},{
    name: 'AM4',
    subname: 'Music Edition',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM4 Music Edition',
    price: 565,
    description: '<p>Индивидуальные custom мониторы АМ4-MusicEdition обладают ярко выраженным музыкальным звучанием с доминированием глубоких НЧ в общей картине. Основной идеей при проектировании данной модели было создание ощущения »телесности» и «объемности» при прослушивании музыки с богатыми НЧ компонентами. Однако в АМ4-MusicEdition нет «размазанности» и «гулкости» баса, а благодаря хорошо сбалансированной работе еще двух излучателей, средне и высокочастотные диапазоны привносят ту необходимую четкость и воздушность в общую звуковую картину, что так ценится любителями качественной музыки. Воздушность мониторов достигается за счет соблюдения в результирующей частотной характеристике резонансных явлений ушных раковин и ушных каналов человека при восприятии звука в свободном звуковом поле</p>',
    specs: [
        '4 излучателя типа Balanced Armature в ухе<br/> (2-низкие, 1-средние, 1-высокие)',
        '2 звуковода',
        '3-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 17 кГц',
        'Чувствительность (500 Гц) — 113 дБ/мВт',
        'Импеданс (500 Гц) – 32 Ом'
    ]
},{
    name: 'AM4',
    subname: 'Hybrid',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM4 Hybrid',
    price: 590,
    description: '<p>Ошеломляющая глубина баса и драйва! Индивидуальные custom мониторы AM4-Hybrid спроектированы по гибридной схеме с применением одного динамического излучателя и трех излучателей типа «Balanced Armature». Это позволило нам добиться в них потрясающей плотности, глубины, а самое главное- натуральности воспроизведения инфра низких и низких частот (динамический излучатель) и не потерять в детальности, четкости и воздушности присущей «арматурным» излучателям! Мониторы AM4-Hybrid идеально передают атмосферу »живости» звучания барабанов, бас гитары и других басовых музыкальных инструментов и партий. Поэтому данные мониторы будут интересны в первую очередь барабанщикам, бас гитаристам и просто любителям «драйвового» , «вовлекающего» представления музыкальных композиций.</p>',
    specs: [
        '4 излучателя в ухе<br/> (1 динамический - низкие, 1 - средние/высокие  и 2 - ультравысокие BA drivers)',
        '2 звуковода',
        '3-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 19 кГц',
        'Чувствительность (500 Гц) — 106 дБ/мВт',
        'Импеданс (500 Гц) – 17 Ом'
    ]
},{
    name: 'AM6',
    subname: 'HiRez',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM6 HiRez',
    price: 735,

    description: '<p>Топовая модель лаборатории Ambient Acoustics. В данных индивидуальных наушниках реализован весь наш многолетний опыт проектировки средств индивидуального мониторинга! Индивидуальные мониторы AM6-HiRez обладают шестью излучателями, которые воспроизводят весь слышимый человеческим ухом диапазон, от инфранизких компонент до ультра высокочастотных. Благодаря этому мониторы выдают музыкальную сцену намного шире и глубже чем любые другие мониторы лаборатории. По достоинству оценят данную модель аудиофилы, т.к. звуковую подачу АМ6-HiRez можно охарактеризовать как музыкальную, с максимально выраженным «телесным» эффектом присутствия.</p>',
    specs: [
        '6 излучателя типа Balanced Armature в ухе<br/> (2 - низкие, 1 - средние, 1 - высокие, 2 - ультравысокие )',
        '2 звуковода',
        '4-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 19 кГц',
        'Чувствительность (500 Гц) — 110 дБ/мВт',
        'Импеданс (500 Гц) – 25 Ом'
    ]
},{
    custom: true,
    name: 'Кастомизация наушников',
    img: 'am2.png',
    title: 'Кастомизация наушников',
    price: 175,
    description: '<p>Кастомизация включает в себя переделку заводского корпуса ваших in-ear наушников на индивидуальные, изготовленные по слепку ушей. За счет полного анатомического соответствия Вашему ушному каналу, достигается максимальная звукоизоляция, а также максимальная фиксация индивидуального монитора в ухе. Это снижает рабочие уровни громкости прослушиваемых музыкальных композиций и уменьшает риск возникновение акустической травмы в шумных обстановках!</p><p>Благодаря расположению излучателей ближе к барабанной перепонке, удается достичь более четкого баса и увеличить субъективную громкость наушников. Также такого рода кастомы обладают всеми преимуществами сценических индивидуальных мониторов!</p>',
    specs: [
        'Что входит в базовую стоимость:',
        'Изготовление корпусов по слепкам ушей',
        'Вставка акустики внутренних компонентов старых наушников в новые корпуса',
        'Дополнительные опции:',
        'замена разъемов, установка новых разъемов другого вида, замена проводов, апгрейд(увеличение количества динамиков) , коррекция звучания, замена акустических фильтров, установка серных фильтров и т.д.',
    ]
}]
