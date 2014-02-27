'use strict';

/* Controllers */
var monitors = angular.module('monitorsConstructor', [])

monitors.controller('MonitorsList', ['$scope', '$sce', function ($scope, $sce) {

    $scope.steps = {
        model: {
            active: { id: null },
            list: MODELS
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
    // $('.controls.same')
    $scope.same = true

    $scope.setModel = function(id) {
        var m = _.extend({id: id}, $scope.steps.model.list[id])
        $scope.steps.model.active = m
    }

    $scope.confirmModel = function (id) {
        $scope.nextStep()
        $scope.setModel(id)
    }

    $scope.nextStep = function () {
        $scope.step++ 
        $scope.maxStepComplete = Math.max($scope.maxStepComplete, $scope.step)
    }


    $scope.select = function (orient, name, id) {
        var o = $scope.same ? ['left', 'right'] : [orient]
            
        o.forEach(function ( o ){
            $scope.steps[name].active[o].id = id
         
            if (name == 'base' || name == 'chanel') {
                if ($scope.steps['base'].active[o].id != $scope.steps['chanel'].active[o].id)
                    $scope.steps['chanel'].active.price = 150
                else
                    $scope.steps['chanel'].active.price = 0
            }


            if (name == 'base' || name == 'pin') {
                if ($scope.steps['base'].active[o].id != $scope.steps['pin'].active[o].id)
                    $scope.steps['pin'].active.price = 150
                else
                    $scope.steps['pin'].active.price = 0
            }
        })

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
    $scope.confirmModel(1)
    //$scope.nextStep()

}])

var CUSTOMS = {
    'base': {
        name: 'base',
        title: 'Цвет корпусов',
        list: [{
            url: '1-1.png',
            name: 'светло-голубой'
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
            name: 'персиковый'
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
            name: 'белый'
        }, {
            url: '1-14.png',
            name: 'прозрачный'
        }, {
            url: '1-15.png',
            name: 'прозрачный желтый'
        }, {
            url: '1-16.png',
            name: 'прозрачный морской'
        }, {
            url: '1-17.png',
            name: 'прозрачный салатовый'
        }, {
            url: '1-18.png',
            name: 'прозрачный красный'
        }, {
            url: '1-19.png',
            name: 'прозрачный персиковый'
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
            name: 'светло-голубой'
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
            name: 'персиковый'
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
            name: 'белый'
        }, {
            url: '2-14.png',
            name: 'прозрачный'
        }, {
            url: '2-15.png',
            name: 'прозрачный желтый'
        }, {
            url: '2-16.png',
            name: 'прозрачный морской'
        }, {
            url: '2-17.png',
            name: 'прозрачный салатовый'
        }, {
            url: '2-18.png',
            name: 'прозрачный красный'
        }, {
            url: '2-19.png',
            name: 'прозрачный персиковый'
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
            name: 'светло-голубой'
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
            name: 'персиковый'
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
            name: 'прозрачный'
        }, {
            url: '3-15.png',
            name: 'прозрачный желтый'
        }, {
            url: '3-16.png',
            name: 'прозрачный морской'
        }, {
            url: '3-17.png',
            name: 'прозрачный салатовый'
        }, {
            url: '3-18.png',
            name: 'прозрачный красный'
        }, {
            url: '3-19.png',
            name: 'прозрачный персиковый'
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
            name: 'красный',
            price: 0
        }, {
            url: '5-2.png',
            name: 'черный',
            price: 0
        }, {
            url: '5-3.png',
            name: 'золотой',
            price: 0
        }, {
            url: '5-4.png',
            name: 'белый',
            price: 0
        }, {
            url: '5-5.png',
            name: 'черный',
            price: 0
        }, {
            url: '5-6.png',
            name: 'черный',
            price: 0
        }, {
            url: '5-7.png',
            name: 'серый',
            price: 0
        }, {
            url: '5-8.png',
            name: 'синий',
            price: 0
        }, {
            url: '5-9.png',
            name: 'золотой',
            price: 0
        }, {
            url: '5-10.png',
            name: 'голубой камень',
            price: 0
        }, {
            url: '5-11.png',
            name: 'кожа текстура',
            price: 0
        }, {
            url: '5-12.png',
            name: 'кожа текстура',
            price: 0
        }, {
            url: '5-13.png',
            name: 'шлифованный камень',
            price: 0
        }, {
            url: '5-14.png',
            name: 'камень',
            price: 0
        }, {
            url: '5-15.png',
            name: 'карбон',
            price: 0
        }, {
            url: '5-16.png',
            name: 'светло-синий камень',
            price: 0
        }, {
            url: '5-17.png',
            name: 'светлое дерево',
            price: 0
        }]
    },
    'graphics': {
        name: 'graphics',
        title: 'Рисунки',
        list: [{
            url: '0.png',
            name: 'без рисунков',
        }, {
            url: '9-1.png',
            name: 'белый лого',
            price: 0
        }, {
            url: '9-2.png',
            name: 'белый лого',
            price: 0
        }, {
            url: '9-3.png',
            name: 'белый лого',
            price: 0
        }, {
            url: '9-4.png',
            name: 'белый лого',
            price: 0
        }, {
            url: '9-5.png',
            name: 'черный лого',
            price: 0
        }, {
            url: '9-6.png',
            name: 'черный лого',
            price: 0
        }, {
            url: '9-7.png',
            name: 'черный лого',
            price: 0
        }, {
            url: '9-8.png',
            name: 'черный лого',
            price: 0
        }]
    }, 
    'pin': {
        name: 'pin',
        title: 'Цвет штекеров',
        list: [{
            url: '4-1.png',
            name: 'светло-голубой',
            price: 0
        }, {
            url: '4-2.png',
            name: 'телесный',
            price: 0
        }, {
            url: '4-3.png',
            name: 'синий',
            price: 0
        }, {
            url: '4-4.png',
            name: 'голубой',
            price: 0
        }, {
            url: '4-5.png',
            name: 'зеленый',
            price: 0
        }, {
            url: '4-6.png',
            name: 'салатовый',
            price: 0
        }, {
            url: '4-7.png',
            name: 'красный',
            price: 0
        }, {
            url: '4-8.png',
            name: 'персиковый',
            price: 0
        }, {
            url: '4-9.png',
            name: 'коричневый',
            price: 0
        }, {
            url: '4-10.png',
            name: 'желтый',
            price: 0
        }, {
            url: '4-11.png',
            name: 'фиолетовый',
            price: 0
        }, {
            url: '4-12.png',
            name: 'черный',
            price: 0
        }, {
            url: '4-13.png',
            name: 'белый',
            price: 0
        }, {
            url: '4-14.png',
            name: 'прозрачный',
            price: 0
        }, {
            url: '4-15.png',
            name: 'прозрачный желтый',
            price: 0
        }, {
            url: '4-16.png',
            name: 'прозрачный морской',
            price: 0
        }, {
            url: '4-17.png',
            name: 'прозрачный салатовый',
            price: 0
        }, {
            url: '4-18.png',
            name: 'прозрачный красный',
            price: 0
        }, {
            url: '4-19.png',
            name: 'прозрачный персиковый',
            price: 0
        }, {
            url: '4-20.png',
            name: 'прозрачный вишневый',
            price: 0
        }, {
            url: '4-21.png',
            name: 'прозрачный синий',
            price: 0
        }, {
            url: '4-22.png',
            name: 'прозрачный голубой',
            price: 0
        }, {
            url: '4-23.png',
            name: 'прозрачный фиолетовый',
            price: 0
        }, {
            url: '4-24.png',
            name: 'прозрачный черный',
            price: 0
        }]
    },
    'cord': {
        name: 'cord',
        title: 'Цвет провода',
        list: [{
            url: '6-3.png',
            name: 'серебренный',
            price: 0
        }, {
            url: '6-2.png',
            name: 'черный',
            price: 0
        }, {
            url: '6-1.png',
            name: 'прозрачный',
            price: 0
        }]
    }
}

var MODELS = [{
    name: 'AM1',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM1',
    price: '2300',
    description: '<p>Индивидуальные custom мониторы AM1 вобрали в себя все преимущества индивидуальных наушников. А это - максимальная звукоизоляция и исключительная четкость воспроизведения музыкальных композиций. Мы создали данную модель для любителей «ровного» звука, со «слегка» приподнятой серединой, которая передает всю четкость и красоту вокала и гитары. Отличный выбор для людей, которые только начинают знакомиться с технологией in-ear мониторинга и особенностями звучания излучателей типа Balanced Armature!</p>',
    specs: [
        '2 излучателя типа Balanced Armature в ухе<br/> (1-низкие/средние, 1-высокие)',
        '2 звуковода',
        '2-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 17 кГц',
        'Чувствительность (500 Гц) — 110 дБ/мВт',
        'Импеданс (500 Гц) – 45 Ом'
    ]
},{
    name: 'AM2',
    subname: 'Vocal Edition',
    img: 'am2.png',
    title: 'Индивидуальные мониторы<br/>AM2 Vocal Edition',
    price: '3400',
    description: '<p>Индивидуальные custom мониторы AM2 Vocal Edition это миниатюрная двухполосная акустическая система в вашем ухе. С дополнительным массивным излучателем для воспроизведения низких частот и маленьким, «быстрым» излучателем для средних и высоких, мониторы AM2 Vocal Edition создают исключительно «четкий» и "плотный" низкочастотный диапазон и артикуляционный высокочастотный диапазон, которого невозможно добиться одним излучателем! AM2 Vocal Edition обладает слегка подчеркнутым речевым диапазоном, что понравиться любителям инструментальных "аналитических" музыкальных стилей. Идеально подойдут для контроля вокала (особенно женского), акустической гитары и смычковых инструментов!</p>',
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
    price: '4000',
    description: '<p>Отличительной особенностью индивидуальных custom мониторов AM3 Reference Edition есть то, что в этой моделе нет приукрашиваний в звуке. Лаборатория Ambient Acoustics создавала данную модель как максимально линейную во всем частотном диапазоне! В ней отсутствуют излишняя мониторная "сибилятивность" и музыкальная накачка баса. Это достигается за счет применения в данной моделе трех излучателей в каждом ухе! Разделение каналов осуществляется как электрическим так и акустическим кроссовером. Это позволило более точно сбалансировать и сгладить АЧХ под требования самого искушенного слушателя. Модель будет интересна в первую очередь музыкантам, звукорежиссерам, аудиофилам которым необходим мониторный, точный звук!</p>',
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
    price: '4600',
    description: '<p>Индивидуальные custom мониторы АМ4 - Music Edition обладают ярко выраженным музыкальным звучанием с доминированием глубоких НЧ в общей картине. Основной идеей при проектировании данной модели было создание ощущения  "телесности" и "объемности" при прослушивании музыки с богатыми НЧ компонентами.Однако, в АМ4 - Music Edition нет "размазанности" и "гулкости" баса! Это достигается за счет того, что приподнятость есть только в области нижнего и инфра баса. Средний бас не смазывает и не перекрывает речевые и инструментальные диапазоны, а благодаря хорошо сбалансированной работе еще двух излучателей, средне и высокочастотные диапазоны привносят ту необходимую четкость и воздушность в общую звуковую картину, что так ценится любителями качественной музыки. Воздушность мониторов достигается за счет соблюдения в результирующей частотной характеристике резонансных явлений ушных раковин и ушных каналов человека при восприятии звука в свободном звуковом поле. Звучание  будет интересно в первую очередь  бас гитаристам, барабанщикам и аудиофилам.</p>',
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
    price: '4800',
    description: '<p>Ошеломляющая глубина баса и драйва! Индивидуальные custom мониторы AM4 - Hybrid спроектированы  по гибридной схеме с применением одного динамического излучателя и трех излучателей типа "Balanced Armature". Это позволило нам добиться в них потрясающей плотности, глубины, а самое главное- натуральности воспроизведения  инфра низких и низких частот (динамический излучатель) и не потерять в детальности, четкости  и воздушности присущей "арматурным" излучателям! Мониторы AM4 - Hybrid идеально передают атмосферу  "живости"  звучания барабанов, бас гитары и других басовых музыкальных инструментов  и партий. Поэтому  данные мониторы будут интересны в первую очередь барабанщикам, бас гитаристам и просто любителям "драйвового" , "вовлекающего"  представления музыкальных композиций.</p>',
    specs: [
        '4 излучателя в ухе<br/> (1 динамический - низкие, 1 - средние/высокие  и 2 - ультравысокие BA drivers)',
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
    price: '6000',

    description: '<p>Индивидуальные custom мониторы  AM6 - HiRez (high resolution) - это топовая модель лаборатории Ambient Acoustics! В данных индивидуальных наушниках реализован весь наш многолетний опыт проектировки средств индивидуального мониторинга. Данная модель обладает шестью излучателями которые воспроизводят весь слышимый человеческим ухом диапазон от инфранизких компонент, до ультра высокочастотных! Благодаря этому, индивидуальные мониторы выдают музыкальную сцену намного шире  и глубже чем любые другие мониторы лаборатории! По достоинству оценят данную модель аудиофилы,  т.к звуковую подачу АМ6 - HiRez можно охарактеризовать как музыкальную, с максимально выраженным "телесным" эффектом присутствия!</p>',
    specs: [
        '6 излучателя типа Balanced Armature в ухе<br/> (2 - низкие, 1 - средние, 1 - высокие, 2 - ультравысокие )',
        '2 звуковода',
        '4-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 19 кГц',
        'Чувствительность (500 Гц) — 110 дБ/мВт',
        'Импеданс (500 Гц) – 25 Ом'
    ]
},{
    name: 'Кастомизация наушников',
    img: 'am2.png',
    title: 'Кастомизация наушников',
    price: '1500',
    description: '<p>Кастомизация включает в себя переделку заводского корпуса ваших in-ear наушников на индивидуальные, изготовленные по слепку ушей. За счет полного анатомического соответствия Вашему ушному каналу, достигается максимальная звукоизоляция, а также максимальная фиксация индивидуального монитора в ухе. Это снижает рабочие уровни громкости прослушиваемых музыкальных композиций и уменьшает риск возникновение акустической травмы в шумных обстановках!</p><p>Благодаря расположению излучателей ближе к барабанной перепонке, удается достичь более четкого баса и увеличить субъективную громкость наушников. Также такого рода кастомы обладают всеми преимуществами сценических индивидуальных мониторов!</p>',
    specs: [
        '2 излучателя типа Balanced Armature в ухе<br/> (1-низкие/средние, 1-высокие)',
        '2 звуковода',
        '2-полосный пассивный кроссовер',
        'Частотный диапазон — 10 Гц — 17 кГц',
        'Чувствительность (500 Гц) — 110 дБ/мВт',
        'Импеданс (500 Гц) – 45 Ом'
    ]
}]
