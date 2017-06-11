(function ($) {
    $.fn.ASPlaceholder = function () {
        var value = $(this).attr('placeholder');

        function focus(e) {
            $(e.target).attr('placeholder', '');
        }

        function blur(e) {
            var $el = $(e.target);
            if (!$el.val()) $el.attr('placeholder', value);
            refresh($el[0]);
        }

        //  Необходимо для переотрисовки значения placeholder у textarea (потребовалось в Chrome 36 MacOS X)
        function refresh(el) {
            var displayValue = el.style.display;
            el.style.display = 'none';
            el.offsetHeight;
            el.style.display = displayValue;
        }

        return $(this).on('focus', focus).on('blur', blur);
    };
})(jQuery);