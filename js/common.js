(function($) {
    $(document).ready(function() {

        var hash = '#mf';
        //if(window.location.hash == hash) window.location.href = window.location.href.split('#')[0];

        if(typeof gameSettings != 'undefined' && typeof gameSettings.id != 'undefined') {

            if(!gameSettings.isMobile) {

                var fullscreen = false;
                var gameLaunch = false;

                // ----------------------------------------
                // game launch
                // ----------------------------------------

                $('.js-game-launch').on('click', function () {

                    var gameSize = fullscreen ? getGameSizeFullscreen() : getGameSizeDefault();

                    if(gameSettings.type == 1) {

                        var swfGame = $('<embed>', {
                            'type' : 'application/x-shockwave-flash',
                            'id' : 'sg-game',
                            'src' : $(this).attr('data-game-src'),
                            'width' : gameSize.width,
                            'height' : gameSize.height,
                            'name' : 'game',
                            'quality' : 'high',
                            'wmode' : 'opaque'
                        });

                        $('#sg-game').replaceWith(swfGame);

                    } else {

                        var frameGame = $('<iframe>', {
                            'id' : 'sg-game',
                            'frameborder' : 0,
                            'scrolling' : 'no',
                            'src' : $(this).attr('data-game-src'),
                            'width' : gameSize.width,
                            'height' : gameSize.height,
                            'allowfullscreen' : true
                        });

                        $('#sg-game').replaceWith(frameGame);
                    }

                    gameLaunch = true;

                    playedGame();
                    setGameLoader();

                });

                //var windowWidth = $(window).width();
                //var windowHeight = $(window).height();

                // ----------------------------------------
                // set size game
                // ----------------------------------------

                var gameSizeDefault = getGameSizeDefault();
                $('#sg-game').height(gameSizeDefault.height); // width(gameSizeDefault.width).
                $('.js-game-block').addClass('active');

                //console.log(gameSettings.size, gameSizeDefault.width, gameSizeDefault.height, windowWidth, windowHeight);

                // ----------------------------------------
                // set game fullscreen
                // ----------------------------------------

                $('.js-fullscreen').on('click', setGameSizeFullscreen);

                function setGameSizeFullscreen() {
                    var gameSize = getGameSizeFullscreen();
                    $('.js-game-block').addClass('fullscreen');
                    if(gameLaunch) $('#sg-game').width(gameSize.width);
                    $('#sg-game').height(gameSize.height);
                    $('body').css('overflow', 'hidden');
                    fullscreen = true;
                    $('#sg-game').focus();
                }

                function getGameSizeFullscreen() {

                    if (typeof gameSettings != 'undefined') {

                        var ww, wh, kw, kh, width, height;

                        ww = $(window).width();
                        wh = $(window).height();
                        kw = gameSettings.size.width / gameSettings.size.height;
                        kh = gameSettings.size.height / gameSettings.size.width;

                        if (ww > wh) {
                            if (gameSettings.size.typeScaling) {
                                width = ww;
                            } else {
                                width = wh * kw;
                            }
                            height = wh;
                        } else {
                            width = ww;
                            height = wh * kh;
                        }

                        return {width: width, height: height};

                    }

                    return null;
                }

                $('.js-minimize').on('click', setGameSizeDefault);

                function setGameSizeDefault() {
                    //var gameSizeDefault = getGameSizeDefault();
                    $('.js-game-block').removeClass('fullscreen');
                    if(gameLaunch) $('#sg-game').width(gameSizeDefault.width);
                    $('#sg-game').height(gameSizeDefault.height);
                    $('body').css('overflow', 'auto');
                    fullscreen = false;
                    $('#sg-game').focus();
                }

                function getGameSizeDefault() {

                    if (typeof gameSettings != 'undefined') {

                        var windowHeight = $(window).height();
                        var gameWidth = $('.js-game').width();
                        var gameHeight = gameSettings.size.height / gameSettings.size.width * gameWidth;

                        /*
                        if (gameSettings.size.width >= gameSettings.size.height) {
                            var gameHeight = gameSettings.size.height / gameSettings.size.width * gameWidth;
                        } else {
                            var gameHeight = gameWidth * 0.625; // 0.5625
                            gameWidth = gameSettings.size.width / gameSettings.size.height * gameHeight;
                        }
                        */

                        var maxHeightGame = windowHeight * 0.67; // 0.6

                        if(maxHeightGame < 450) maxHeightGame = 450;

                        if (gameHeight > maxHeightGame) {
                            gameHeight = maxHeightGame;
                            if (!gameSettings.size.typeScaling) {
                                gameWidth = gameSettings.size.width / gameSettings.size.height * gameHeight;
                            }
                        }

                        //if(gameHeight * 0.75)

                        //console.log('set game size default');

                        gameHeight = Math.round(gameHeight);
                        gameWidth = Math.round(gameWidth);

                        //console.log(windowHeight, maxHeightGame, gameHeight);

                        return {width: gameWidth, height: gameHeight};
                    }

                    return null;
                }

                // ----------------------------------------
                // size video
                // ----------------------------------------

                setSizeVideo();

                //$(window).on('resize', setSizeVideo);

                function setSizeVideo() {

                    var windowHeight = $(window).height();
                    var maxHeightVideo = windowHeight * 0.6;
                    var videoContainerWidth = $('.js-video-container').width();

                    var video = $('.js-video');
                    var videoWidth = videoContainerWidth;
                    var k = video.height() / video.width();

                    var videoHeight = videoContainerWidth * k;

                    if (maxHeightVideo < videoHeight) {
                        videoHeight = maxHeightVideo;
                        videoWidth = video.width() / video.height() * videoHeight;
                    }

                    video.width(Math.round(videoWidth));
                    video.height(Math.round(videoHeight));

                }

                // ----------------------------------------
                // window resize
                // ----------------------------------------
                var checkResize = false;

                $(window).on('resize', function () {

                    if(!checkResize) {

                        var idInt = setTimeout(function () {
                            //fillEmptySpace();
                            clearTimeout(idInt);
                            checkResize = false;
                        }, 1000);
                    }

                    checkResize = true;
                    setSizeVideo();
                    if (fullscreen) {
                        var gameSizeFullscreen = getGameSizeFullscreen();
                        if(gameLaunch) $('#sg-game').width(gameSizeFullscreen.width);
                        $('#sg-game').height(gameSizeFullscreen.height);
                    } else {
                        var gameSizeDefault = getGameSizeDefault();
                        if(gameLaunch) $('#sg-game').width(gameSizeDefault.width);
                        $('#sg-game').height(gameSizeDefault.height);
                    }

                });

                // ----------------------------------------
                // go to video
                // ----------------------------------------

                $('.js-go-to').on('click', function () {

                    var id = $(this).attr('href');

                    $('html, body').animate({
                        scrollTop : $(id).offset().top - 65
                    }, 500);

                    //console.log($(id).offset().top);

                    return false;
                });

                // ----------------------------------------
                // not work game
                // ----------------------------------------

                var isSetNotWorkMessage = false;
                $('.js-not-work').on('click', function () {
                    if(!isSetNotWorkMessage) {
                        $('.js-not-work-game-message').html(notWorkGameMessages.notWorkGame);
                        $('.js-not-work-game-send-message').html(notWorkGameMessages.notWorkGameSend);
                        /*$.getJSON( "/themes/sg4/js/messages.json", function(data) {
                            $('.js-not-work-game-message').html(data.notWorkGame);
                            $('.js-not-work-game-send-message').html(data.notWorkGameSend);
                        });*/
                        isSetNotWorkMessage = true;
                    }
                    $('#not-work-modal').modal('show');
                });

                $('#not-work-form').on('submit', function() {

                    var data = $(this).serializeArray();

                    if(typeof window.navigator !== 'undefined' && typeof window.navigator.userAgent !== 'undefined')
                    data.push({ name : 'user_agent', value : window.navigator.userAgent });

                    $.ajax({
                        url : '/ajax/not-work-game',
                        method : 'POST',
                        data : data
                    }).done(function (data) {
                        //console.log(data);

                        if(!data.error) {
                            $('#not-work-modal').modal('hide');
                            $('#not-work-send-modal').modal('show');
                        }

                    }).error(function () {
                        alert('Упс! Произошла ошибка!');
                    });

                    return false;

                });

            } else {

                //$('.js-banner').adsenseLoader();

                $('.js-game-mobile-launch').on('click', openGameFullscreen);

                $(window).on('popstate', function () {
                    if(window.location.hash != hash) {
                        $('.js-game-mobile-wrap').removeClass('active');
                        //$('body').css('overflow', 'auto');
                        $('.SG-template-mobile').removeClass('SG-view-fullscreen');
                        closeFullscreen();

                        $('.js-game-mobile').html('');
                    } else {
                        openGameFullscreen();
                    }
                });

                /*$(window).on('resize', function() {
                    $('#sg-game').width($(window).width()).height($(window).height());
                    $('.js-game-loader-block').width($(window).width()).height($(window).height());
                });*/

            }
        }

        function openFullscreen() {
            var elem = $('.js-game-mobile-wrap')[0];
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }

        function closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }


        function openGameFullscreen() {
            window.location.hash = hash;
            $('.js-game-mobile-wrap').addClass('active');
            //$('body').css('overflow', 'hidden');
            $('.SG-template-mobile').addClass('SG-view-fullscreen');

            var frameGame = $('<iframe>', {
                'id' : 'sg-game',
                'frameborder' : 0,
                'scrolling' : 'no',
                'allowfullscreen' : true,
                'allow' : 'autoplay;',
                'src' : $('.js-game-mobile-launch').attr('data-game-src'),
                'width' : '100%',
                'height' : '100%'
            });

            $('.js-game-mobile').html(frameGame);

            playedGame();
            setGameLoader();
            openFullscreen();

            /*var maxIterations = 50;
            var idIntervalCheckSize = setInterval(function () {
                if(window.outerHeight > window.innerHeight) {
                    clearInterval(idIntervalCheckSize);
                    window.scrollTo(0,0);
                    $('#sg-game').width(window.innerWidth).height(window.innerHeight);
                    $('.js-game-loader-block').width(window.innerWidth).height(window.innerHeight);
                }
                if(!maxIterations) {
                    clearInterval(idIntervalCheckSize);
                }
                maxIterations--;
            }, 500);*/


        }

        // ----------------------------------------
        // game load
        // ----------------------------------------

        function setGameLoader() {

            $('.js-game-loader-block').addClass('active');

            $('.js-game-loader-skip').on('click', function() {
                $('.js-game-loader-block').remove();
                $('#sg-game').focus();
                clearInterval(idInterval);
            });

            var secondsToSkip = 10;
            var secondsToClose = secondsToSkip + 20;

            var idInterval = setInterval(function () {

                if(secondsToSkip <= 1) {
                    //$('.js-game-loader-block').removeClass('active');
                    $('.js-game-loader-control').addClass('SG-view-button');
                } else {
                    $('.js-game-loader-counter').text(--secondsToSkip);
                }

                secondsToClose--;

                if(secondsToClose <= 1) {
                    $('.js-game-loader-block').remove();
                    $('#sg-game').focus();
                    clearInterval(idInterval);
                }

                //console.log(secondsToClose);

            }, 1000);

        }

        // ----------------------------------------
        // played game
        // ----------------------------------------

        function playedGame() {

            var idTimeout = setTimeout(function() {

                $.ajax({
                    url : '/ajax/statistics',
                    method : 'POST',
                    data : {
                        game_id : gameSettings.id,
                        event : 1
                    }
                }).done(function (data) {});

                clearTimeout(idTimeout);
            }, 60000);
        }

        /*if(typeof gameSettings != 'undefined' && !gameSettings.dev) {
            $('.js-banner').adsenseLoader({
                onLoad: function (ad) {
                    //console.log(ad);
                    ad.addClass('loaded');
                }
            });
        } else {
            $('.js-banner').addClass('loaded');
        }*/

        // ----------------------------------------
        // top slider
        // ----------------------------------------

        var sliderPosition = +localStorage.getItem('SG_slider_position');
        if(sliderPosition == null) sliderPosition = 0;
        if(!isMobile.any) {
            $('.js-slider-genres').slider({offset : sliderPosition});
            $('.js-slider-screenshots').slider();
        } else {
            if(sliderPosition) $('.js-slider-scroll').scrollLeft(sliderPosition);
        }
        var idTimeoutSliderScroll;
        $('.js-slider-scroll').on('scroll', function () {
            clearTimeout(idTimeoutSliderScroll);
            idTimeoutSliderScroll = setTimeout(function () {
                localStorage.setItem('SG_slider_position', $('.js-slider-scroll').scrollLeft());
            }, 200);
        });

        // ----------------------------------------

        $('.js-lazyload').lazyLoadXT({
            scrollContainer : '.js-lazyload-wrapper'
        });

        $('.js-social-buttons span').on('click', function() {
            window.open($(this).attr('data-href'), '_blank');
        });

        if($('.js-fixed-block').length) {
            var fixedBlockOffsetTop = $('.js-fixed-block').offset().top;
            checkFixedBlock();
            $(window).on('scroll', checkFixedBlock);
            function checkFixedBlock() {
                if($(window).scrollTop() + 55 >= fixedBlockOffsetTop) {
                    $('.js-fixed-block').addClass('fixed');
                } else {
                    $('.js-fixed-block').removeClass('fixed');
                }
            }
        }

        // ----------------------------------------
        // search
        // ----------------------------------------

        var containerSearch = $('.js-search'), inputSearch = $('#search');

        if($('.js-search').hasClass('active')) {
            inputSearch.focus();
            inputSearch[0].selectionStart = inputSearch[0].value.length;
        }

        inputSearch.on('focus', function() {
            containerSearch.addClass('active');
        });

        inputSearch.on('blur', function() {
            containerSearch.removeClass('active');
        });

        if(isMobile.any) {

           /* $('body').on('click', function (e) {
                console.log($('.js-search-icon')[0], e.target);
                if($('.js-search-icon')[0] == e.target) {
                    containerSearch.addClass('open');
                    inputSearch.focus();
                } else {
                    if(!$(e.target).parents('.js-search').length && containerSearch.hasClass('open')) {
                        containerSearch.removeClass('open');
                    }
                }
                // stop surfacing
                //e.stopPropagation();
            });*/

            $('.js-search-icon').on('click', function (e) {
                containerSearch.addClass('open');
                inputSearch.focus();
            });

            inputSearch.on('blur', function () {
                setTimeout(function () {
                    containerSearch.removeClass('open');
                }, 50);

            });

            $('.SG-search-button').on('click', function () {
                $('#sg-search').submit();
            });
        }

        $('#sg-search').on('submit', function() {
            var data = $(this).serializeArray();
            $.ajax({
                url : '/ajax/search-query-stat',
                method : 'POST',
                data : data
            }).done(function (data) {
            });
        });

        // ----------------------------------------
        // main menu
        // ----------------------------------------

        var idTimeoutSrollMainMenu, scrollMenuPosition = localStorage.getItem('SG_menu_scroll_position');
        if(scrollMenuPosition == null) scrollMenuPosition = 0;

        // ----------------------------------------
        // set position scroll main menu
        // ----------------------------------------

        $('.js-menu-scroll').on('scroll', function () {
            clearTimeout(idTimeoutSrollMainMenu);
            idTimeoutSrollMainMenu = setTimeout(function () {
                localStorage.setItem('SG_menu_scroll_position', $('.js-menu-scroll').scrollTop());
            }, 200);
        });

        if(scrollMenuPosition) {
            $('.js-menu-scroll').scrollTop(scrollMenuPosition);
        } else {
            if($('.js-item-menu .active').length) {
                scrollMenuPosition = $('.js-item-menu .active').offset().top - 55;
                $('.js-menu-scroll').scrollTop(scrollMenuPosition);
            }
        }

        // ----------------------------------------
        // change display main menu
        // ----------------------------------------

        if(Cookies.get('SG_menu_display') == 1 && !isMobile.any) {

            $('.js-main').addClass('open');
            Cookies.set('SG_menu_display', 1, { expires: 365, path: '/' });
            $('.js-menu-scroll').scrollTop(scrollMenuPosition);

            if(typeof setSizeVideo != 'undefined') setSizeVideo();
            if(typeof getGameSizeDefault != 'undefined') {
                gameSizeDefault = getGameSizeDefault();
                if(gameLaunch) $('#sg-game').width(gameSizeDefault.width);
                $('#sg-game').height(gameSizeDefault.height);
                //console.log(gameSizeDefault);
            }

            if(!isMobile.any) $('.js-slider-genres').slider('update');

            // crutch
            $('.js-slider-scroll').trigger('scroll');
        }

        $('.js-icon-menu').on('click', function () {
            if($('.js-main').hasClass('open')) {
                scrollMenuPosition = localStorage.getItem('SG_menu_scroll_position');
                $('.js-menu-scroll').scrollTop(0);
                $('.js-main').removeClass('open');
                Cookies.set('SG_menu_display', 0, { expires: 365, path: '/' });
            } else {
                $('.js-main').addClass('open');
                Cookies.set('SG_menu_display', 1, { expires: 365, path: '/' });
                $('.js-menu-scroll').scrollTop(scrollMenuPosition);
            }
            if(typeof setSizeVideo != 'undefined') setSizeVideo();
            if(typeof getGameSizeDefault != 'undefined') {
                gameSizeDefault = getGameSizeDefault();
                if(gameLaunch) $('#sg-game').width(gameSizeDefault.width);
                $('#sg-game').height(gameSizeDefault.height);
                //console.log(gameSizeDefault);
            }

            if(!isMobile.any) $('.js-slider-genres').slider('update');

            // crutch
            $('.js-slider-scroll').trigger('scroll');
        });

        // ----------------------------------------
        // freeze scroll main menu
        // ----------------------------------------

        var scrollEvents = ['wheel', 'mousewheel']

        function freezeScroll(){
            for (var i = 0; i < arguments.length; i++) {
                elem = arguments[i];
                let func = preventScrollEventFunc(elem);
                let options = {passive: false};
                $(elem).on('mouseenter', function(){
                    onWheel(window, func, options);
                }).on('mouseleave', function(){
                    removeOnWheel(window, func);
                });
            }
        }

        // Отменить скролл страницы, если элемент selector прокручен до упора
        function preventScrollEventFunc(selector){
            let elem = $(selector);
            function preventScroll(e){
                let offset = e.wheel || e.wheelDelta;
                let crossingUpper = elem.scrollTop() == 0 && offset > 0;
                let crossingDown = (elem[0].scrollHeight - elem.scrollTop() ==
                    elem[0].clientHeight && offset < 0);
                if (crossingUpper || crossingDown){
                    e.preventDefault()
                }
            }
            return preventScroll;
        }

        // Повесить обработчик func для событий wheel и mousewheel у elem
        function onWheel(elem, func, options){
            options = options || {};
            scrollEvents.forEach(function(item, i, arr){
                elem.addEventListener(item, func, options);
            });
        }

        // Убрать обработчик func для событий wheel и mousewheel у elem
        function removeOnWheel(elem, func, options){
            options = options || {};
            scrollEvents.forEach(function(item, i, arr){
                elem.removeEventListener(item, func, options);
            });
        }

        freezeScroll('.js-menu-scroll');


        // ----------------------------------------
        // More similar games
        // ----------------------------------------

        if(typeof similarGamesHidden != 'undefined') {

            var moreSimilarGames = {
                count: 0,
                max: 40,
                totalNum: similarGamesHidden.length
            };

            $('.js-more-similar-games-num').text(moreSimilarGames.totalNum < moreSimilarGames.max ? moreSimilarGames.totalNum : moreSimilarGames.max);

            $('.js-more-similar-games').on('click', function() {

                var buffer = '';

                for(var i = 0; moreSimilarGames.max > i; i++) {
                    if(moreSimilarGames.count >= moreSimilarGames.totalNum) break;
                    buffer += similarGamesHidden[moreSimilarGames.count];
                    moreSimilarGames.count++;
                }

                $(buffer).insertBefore(this);
                $(window).lazyLoadXT();

                var left = moreSimilarGames.totalNum - moreSimilarGames.count;

                if(left <= 0) {
                    $('.js-more-similar-games').remove();
                } else {
                    if(left - moreSimilarGames.max < 2) {
                        moreSimilarGames.max = left;
                    }
                    $('.js-more-similar-games-num').text(moreSimilarGames.max);
                }

            });

        }


        // ----------------------------------------
        // Subtags
        // ----------------------------------------

        function setSubtags() {

            var line = 1;
            var widthSubtagsMore = $('.JS-subtags-more').outerWidth(true);
            var widthSubtags = $('.JS-subtags').outerWidth(true) * line - widthSubtagsMore * line;
            var widthAllVisibleSubtags = 0;

            $('.JS-subtag').each(function(i, el) {
                widthAllVisibleSubtags += $(el).outerWidth(true);
                if($(el).hasClass('SG-subtag-dynamic')) {
                    if(widthAllVisibleSubtags < widthSubtags) {
                        $(el).addClass('SG-subtag-show');
                    } else {
                        $(el).removeClass('SG-subtag-show');
                        //return false;
                    }
                }
            });

            if(widthAllVisibleSubtags > widthSubtags) {
                $('.JS-subtags-more').addClass('SG-subtag-show');
            }
        }

        setSubtags();

        $(window).on('resize', function() {
            setSubtags();
        });

        $('.JS-subtags-more').on('click', function () {
            $('.SG-subtag-dynamic').addClass('SG-subtag-show');
            $(this).removeClass('SG-subtag-show');
            if(typeof fixedBlockOffsetTop == 'number') {
                fixedBlockOffsetTop = $('.js-fixed-block').offset().top;
            }
        });

        //console.log(widthSubtags, widthAllVisibleSubtags);

    });

})(jQuery);

// ----------------------------------------
// iframe
// ----------------------------------------

var isFramed = false;
try {
    isFramed = window != window.top || document != top.document || self.location != top.location;
} catch (e) {
    isFramed = true;
}

/*console.log(isFramed);

if(isFramed) { // window.parent.frames.length > 0
    window.location = 'https://games2.startgamer.ru/includes/sitelock/iframe.php?url=' + window.location.href;
}*/
