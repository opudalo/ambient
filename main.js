var URL = 'i/'
var IMG = {
    "base": ['1-1.png', '1-2.png', '1-3.png', '1-4.png', '1-5.png', '1-6.png', '1-7.png', '1-8.png', '1-9.png', '1-10.png', '1-11.png', '1-12.png', '1-13.png', '1-14.png', '1-15.png', '1-16.png', '1-17.png', '1-18.png', '1-19.png', '1-20.png', '1-21.png', '1-22.png', '1-23.png', '1-24.png', ],
    "cover": ['2-1.png', '2-2.png', '2-3.png', '2-4.png', '2-5.png', '2-6.png', '2-7.png', '2-8.png', '2-9.png', '2-10.png', '2-11.png', '2-12.png', '2-13.png', '2-14.png', '2-15.png', '2-16.png', '2-17.png', '2-18.png', '2-19.png', '2-20.png', '2-21.png', '2-22.png', '2-23.png', '2-24.png', ],
    "chanel": ['3-1.png', '3-2.png', '3-3.png', '3-4.png', '3-5.png', '3-6.png', '3-7.png', '3-8.png', '3-9.png', '3-10.png', '3-11.png', '3-12.png', '3-13.png', '3-14.png', '3-15.png', '3-16.png', '3-17.png', '3-18.png', '3-19.png', '3-20.png', '3-21.png', '3-22.png', '3-23.png', '3-24.png', ],
    "cap": ['5-1.png', '5-2.png', '5-3.png', '5-4.png', '5-5.png', '5-6.png', '5-7.png', '5-8.png', '5-9.png', '5-10.png', '5-11.png', '5-12.png', '5-13.png', '5-14.png', '5-15.png', '5-16.png', '5-17.png'],
    "graphics": ['5-1.png', '5-2.png', '5-3.png', '5-4.png', '5-5.png', '5-6.png', '5-7.png', '5-8.png', '5-9.png', '5-10.png', '5-11.png', '5-12.png', '5-13.png', '5-14.png', '5-15.png', '5-16.png', '5-17.png'],
    "pin": ['4-1.png', '4-2.png', '4-3.png', '4-4.png', '4-5.png', '4-6.png', '4-7.png', '4-8.png', '4-9.png', '4-10.png', '4-11.png', '4-12.png', '4-13.png', '4-14.png', '4-15.png', '4-16.png', '4-17.png', '4-18.png', '4-19.png', '4-20.png', '4-21.png', '4-22.png', '4-23.png', '4-24.png'],
    "cord": ['6-1.png', '6-2.png', '6-3.png']
}

var currentConfig = {}

$(function() {
    var step2 = new Step2()


    

    var app = init()

    function init() {
        var nav = $('.nav'),
            construct = $('.b-construct'),
            s1 = $('.s1'), 
            s2 = $('.s2')

        s1.attr('data-active', 'm0') 

        function navNext(index) {
            var items = $('.nav-item', nav),
                el = $('.active', nav)
            
            if (el.length) el = el.next()
            if (typeof index != 'undefined') el = $(items[index])
        
            items.removeClass('active')
            el.addClass('active')
        
        }

        constructNext()
        
        function constructNext() {
            var id = s2.attr('data-active')
            if (!id) id = 'c1'
            else id = 'c' + (parseInt(id[1]) + 1)

            s2.attr('data-active', id) 
        }

        nextStep()
        
        function nextStep() {
            var id = construct.attr('data-current')
            if (!id) id = 's0'

            construct.attr('data-current', 's' + (parseInt(id[1]) + 1))
        
        }

        $('.b-models-list').click(chooseModel)
        $('.btn-select').click(confirmModel)
        $('.btn-continue').click(chooseNext)

        function chooseNext() {
            constructNext()
            navNext()
        }


        function chooseModel(e) {
            var el = e.target
            if (el.tagName == 'SPAN') el = el.parentElement
            
            var id = $(el).attr('data-id')

            $(this).children().removeClass('active')
            $(el).addClass('active')

            s1.attr('data-active', 'm' + id)

            navNext(0)
        }

        function confirmModel(e) {
            nextStep()
            navNext()
        
        }

        return {
            nav: {
                el: nav,
                next: navNext
            },
            s1: s1,
            s2: s2,
            nextStep: nextStep,
            construct: {
                el: construct,
                next: constructNext
            }
        
        }
        
    }
})


function Step2() {
    var c = $('.s2 .controls')
    var base = new Selector({
            type: 'base',
            imgs: IMG["base"],
            title: 'Цвет корпусов',
            el: $('.c1', c),
            active: 0
        })

    var cover = new Selector({
            type: 'cover',
            imgs: IMG["cover"],
            el: $('.c1', c),
            title: 'Цвет крышек'
        })

    var chanel = new Selector({
            type: 'chanel',
            imgs: IMG["chanel"],
            el: $('.c1', c),
            title: 'Цвет каналов'
        })

    var cap = new Selector({
            type: 'cap',
            imgs: IMG["cap"],
            el: $('.c2', c),
            title: 'Материал вставок'
        })

    var graphics = new Selector({
            type: 'graphics',
            imgs: IMG["cap"],
            el: $('.c3', c),
            title: 'Рисунки'
        })

    var pin = new Selector({
            type: 'pin',
            imgs: IMG["pin"],
            el: $('.c4 .pins-selector', c),
            title: 'Цвет штекеров',
            active: 0
        })

    var cord = new Selector({
            type: 'cord',
            imgs: IMG["cord"],
            el: $('.c4 .cord-col2', c),
            title: 'Цвет провода',
            active: 0
        })
}


function Selector(cfg){ 
    var type = cfg.type,
        imgs = cfg.imgs,
        title = cfg.title,
        el = cfg.el,
        active = cfg.active

    var layer = $('<div class="ear-layer ' + type + '">' +
        '            <img class="first" />' + 
        '            <img class="second" />' + 
        '        </div>'),
        selector = $('<div class="selector" data-type="' + type + '">' +
        '           <div class="selector-title">' + title + '</div>' + 
        '           <div class="selector-items"></div>' + 
        '        </div>')
        items = '',
        ears = $('.ears .ear')

    for (var i = 0; i < imgs.length; i++) {
        items += '<div class="selector-item" style="background-image: url(\''+ URL + imgs[i] +'\')" data-id="' + i + '"></div>'
    }

    selector.find('.selector-items').html(items)

    ears.append(layer)

    el.append(selector)

    selector.on('mousemove', onmousemove)
        .on('mouseout', out)
        .on('click', onclick)
    

    if (typeof active != 'undefined') setCurrent(active, true)

    var currentId
    function onmousemove(e) {
        var el = $(e.target),
            id = el.attr('data-id'),
            tag = e.target.tagName  
      //  if ((tag == 'DIV') || el.hasClass('active')) return out()

      //  if (tag != 'SPAN') return

        if (typeof id == 'undefined') return

        if (id != currentId) setCurrent(id)
    
    }
     
    function onclick(e) {
        var el = $(e.target),
            id = el.attr('data-id')

        if (typeof id == 'undefined') return
        if (el.hasClass('active')) return

 //       cur.removeClass('active')
 //       el.addClass('active')
 //       cur = el

        setCurrent(id, true)
    }

    function out() {
        var id = $('.selector-item.active', selector).attr('data-id')
        setCurrent(id)
        currentId = null
    }
    
    function setCurrent(id, force) {
        currentId = id

        var src = (typeof id != 'undefined') && (URL + imgs[id]) || '',
            img = $('.' + type + ' img', ears),
            f = img.filter('.first'),
            s = img.filter('.second')
        
        s.attr('src', src)

        if (force)
            selector.find('.selector-item').removeClass('active')
                .filter('[data-id=' + id + ']').addClass('active')

        img.toggleClass('second')
        img.toggleClass('first')
    }
}

/*$(function() {

    var ears = $('.ears'),
        right = $('.ear.right', ears),
        left = $('.ear.left', ears),
        construct = $('.construct'),
        controls = []

    init()

    function init () {
        if (controls.length) 
            controls.forEach(function (c) { c.off() })
        

        ;['.color', '.chanel-color', '.plate'].forEach(function(sel) {
            var el = $('.control' + sel + ' .control-variations')

            el.each(function (e, elem) {
                var dir
                
                elem = $(elem)
                
                if (construct.attr('data-id') == 'same') dir = ''
                else dir = elem.hasClass('left') && '.left' || '.right'
                var layer = $('.ear' + dir + ' ' + sel, ears)
                
                controls.push(createControl(elem, layer))
            })
        })
    }


    function createControl (elem, layer) {
        var currentTarget,
            img = $('img', layer),
            cur = $('span.active', elem)

        setCurrent(cur)

        elem.on('mousemove', onmousemove)
            .on('mouseout', onmouseout)
            .on('click', onclick)
        
        function onmousemove(e) {
            var el = $(e.target),
                tag = e.target.tagName  
            if ((tag == 'DIV') || el.hasClass('active')) return out()

            if (tag != 'SPAN') return

            if (!el.is(currentTarget)) setCurrent(el)
        
        }
         

        function out() {
            setCurrent(cur)

            currentTarget = null
        }
        
        function onmouseout(e) {
            if ($(e.toElement).parents('.control').length) return

            out()
        }


        function onclick(e) {
            if (e.target.tagName != 'SPAN') return
            var el = $(e.target)

            if (el.hasClass('active')) return

            cur.removeClass('active')
            el.addClass('active')
            cur = el

            setCurrent(el)
        
        }

        function setCurrent(el) {
            var url = el.data('img')
            if (!url) return

            var src = 'img/' + url,
                img = $('img', layer),
                f = img.filter('.first'),
                s = img.filter('.second')

            currentTarget = el
            
            s.attr('src', src)


            img.toggleClass('second')
            img.toggleClass('first')
        }

        function off() {
            elem.off('mousemove', onmousemove)
                .off('mouseout', onmouseout)
                .off('click', onclick)
        
        }

        return {
            off: off
        }
    }


    $('.switcher').click(function (e) {
        var el = $(e.target)
            
        
        $('span', $(this)).toggleClass('active')

        construct.attr('data-id', el.data('id'))

        init()
        
    })
})*/
