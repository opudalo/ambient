var Tooltip = function(cfg) {
    var $body = $('body'),
        cfg = cfg || {},
        $tooltip = $('<span />', {
            'class': ["tooltip", (cfg.class || '')].join(' '),
            'data-content': ""
        }),
        elementWithTooltip = '[data-tooltip]'

    $body
        .append($tooltip)
        .on('mousemove', elementWithTooltip, showTooltip)
        .on('mouseout', elementWithTooltip, hideTooltip)

    function bindTooltipEvents() {
        $body
            .on('click', elementWithTooltip, hideTooltip)
            .on('scroll', hideTooltip, true)
    }

    function unBindTooltipEvents() {
        $body
            .off('click', elementWithTooltip, hideTooltip)
            .off('scroll', hideTooltip, true)
    }

    function showTooltip(e) {
        var $target = $(e.target),
            $elWithTooltip,
            coordinate,
            position,
            leftCoordinate,
            tooltipValue

        if (isUndoCard($target)) return
        $elWithTooltip = getElementWithTooltip($target)
        tooltipValue = $elWithTooltip.data('tooltip')

        coordinate = calculateCoordinate($elWithTooltip)
        //Get correct container coordinate
        leftCoordinate = parseInt(coordinate.left - ($tooltip.width() - $elWithTooltip[0].getBoundingClientRect().width) / 2)
        position = $elWithTooltip.data('tooltip-position') || 'bottom'

        $tooltip.attr('data-content', tooltipValue)
        $tooltip.addClass('active ' + position)
        $tooltip.css({
            top: coordinate.top,
            left: leftCoordinate
        })
        $body.css('overflow-x', 'hidden')
        bindTooltipEvents()
    }

    function getElementWithTooltip($element) {
        var $parentWithTooltip = $element.parents(elementWithTooltip),
            $elWithTooltip

        $elWithTooltip = $parentWithTooltip.length ? $parentWithTooltip : $element
        return $elWithTooltip
    }

    function isUndoCard($tooltipWrapper) {
        return $tooltipWrapper.parents('.undo').length
    }

    function calculateCoordinate($tooltipWrapper) {
        var coordinate = $tooltipWrapper.offset(),
            position = $tooltipWrapper.data('tooltip-position') || 'bottom',
            topCoordinate

        if (position === 'bottom') topCoordinate = parseInt(coordinate.top + $tooltipWrapper.outerHeight())
        if (position === 'top') topCoordinate = parseInt(Math.round(coordinate.top) - $tooltip.height() - 10)
        return {
            top: topCoordinate,
            left: coordinate.left
        }
    }

    function hideTooltip() {
        $tooltip.removeClass('active top bottom')
        $tooltip.css('top', -9999)
        $body.css('overflow-x', 'initial')
        unBindTooltipEvents()
    }

};

