(function($) {

    var methods = {
        init : function( options ) {

            var defaults = {
                offset: 0,
                callbackCompletedSlide : null
            };

            var settings = $.extend( {}, defaults, options );

            return this.each(function() {

                var root = this;

                var $arrowPrev = $('.SG-slider-arrow-prev', root);
                var $arrowNext = $('.SG-slider-arrow-next', root);

                var $unit = $('.SG-slider-unit', root);
                var $scroll = $('.SG-slider-scroll', root);

                var blocking = true;

                var scrollSize = $unit.length * $unit.outerWidth(true);

                var numUnits = Math.floor($scroll.outerWidth(true) / $unit.outerWidth(true));
                var offsetSize = numUnits * $unit.outerWidth(true);
                var visibleArea = $scroll.outerWidth(true);

                this.update = function() {

                    scrollSize = $unit.length * $unit.outerWidth(true);
                    numUnits = Math.floor($scroll.outerWidth(true) / $unit.outerWidth(true));
                    offsetSize = numUnits * $unit.outerWidth(true);
                    visibleArea = $scroll.outerWidth(true);

                    offset = $scroll.scrollLeft();

                    if(offset > 0) {
                        $arrowPrev.addClass('active');
                    }

                    if (offset >= scrollSize - visibleArea) {
                        $arrowNext.removeClass('active');
                    } else {
                        $arrowNext.addClass('active');
                    }
                }

                $(window).on('resize', function() {
                    root.update();
                    offset = $scroll.scrollLeft();
                    if(offsetSize < scrollSize) {
                        $arrowPrev.show();
                        $arrowNext.show();
                        $(root).addClass('active');
                    } else {
                        $arrowPrev.hide();
                        $arrowNext.hide();
                        $(root).removeClass('active');
                    }
                });

                if(offsetSize < scrollSize) {
                    $arrowPrev.show();
                    $arrowNext.show();
                    $(root).addClass('active');
                }

                var offset = 0;
                if(settings.offset) {
                    $scroll.scrollLeft(settings.offset);
                    offset = settings.offset;
                    if(offset > 0) {
                        $arrowPrev.addClass('active');
                    }
                    if (offset >= scrollSize - visibleArea) {
                        $arrowNext.removeClass('active');
                    }
                }

                $arrowPrev.on('click', function() {

                    if(offset > 0) {

                        if(blocking) {
                            blocking = false;

                            $arrowNext.addClass('active');

                            if(offsetSize > offset) {
                                offset = 0;
                            } else {
                                offset -= offsetSize;
                            }

                            $scroll.animate({
                                scrollLeft : offset
                            }, 1000, function() {
                                blocking = true;
                                if(typeof settings.callbackCompletedSlide == 'function') {
                                    settings.callbackCompletedSlide(offset);
                                }
                            });

                            //log(offset, offsetSize, scrollSize, (scrollSize < offset + offsetSize), '<-');

                        }

                    }

                    //console.log(offset, scrollSize - visibleArea);

                    if(offset <= 0) {
                        $arrowPrev.removeClass('active');
                    }

                });

                $arrowNext.on('click', function() {

                    if (scrollSize > offset + visibleArea) {

                        if(blocking) {
                            blocking = false;

                            $arrowPrev.addClass('active');

                            offset += offsetSize;
                            $scroll.animate({
                                scrollLeft: offset
                            }, 1000, function() {
                                blocking = true;
                                if(typeof settings.callbackCompletedSlide == 'function') {
                                    settings.callbackCompletedSlide(offset);
                                }
                            });
                        }
                    }

                    if (offset >= scrollSize - visibleArea) {
                        $arrowNext.removeClass('active');
                    }

                });

                function log() {
                    console.log(arguments);
                }

            });

        },
        update : function() {
            return this.each(function() {
                $this = $(this);
                $this[0].update();
            });
        }
    };

	$.fn.slider = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод с именем ' +  method + ' не существует для jQuery.slider' );
        }

    };

})(jQuery);
