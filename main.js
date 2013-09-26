$(function() {
    
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
})
