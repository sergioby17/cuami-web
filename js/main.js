(function ($) {
    "use strict";
    // GLOBAL VARIABLES
    var header = $(".header"),
        wrapper = $('.wrapper');
    // PRELOADER
    preloader();
    function preloader(){
        setTimeout(function () {
            wrapper.addClass('wrapper_ready-load');
        }, 0);
    }
    // Opening the mobile menu
    navInit();
    function navInit() {
        header.find(".nav-toggle").on("click", function () {
            $(this).closest(header).toggleClass("header_menu-active");
        });
        function resizeNavMenu() {
            if ($(window).innerWidth()> 1024){
                if (header.hasClass('header_menu-active')){
                    header.removeClass('header_menu-active');
                }
            }
        }

        $(document).mouseup(function (e){
            if($(".header.header_menu-active").length) {
                var div = $(".header-nav");
                if (!div.is(e.target) && div.has(e.target).length === 0) {
                    header.removeClass('header_menu-active');
                }
            }
        });

        $(window).resize(function () {
            resizeNavMenu();
        });
    }

    // Page scroll animation
    $(window).on('load resize scroll', function () {
        if ($(window).scrollTop() >= 1) {
            header.addClass('header-scroll');
        } else {
            header.removeClass('header-scroll');
        }
    });


    // Form validation and customization
    if ($("form").length) {
        // Form validation
        formValidation();
        // Styling a Form
        jcf.setOptions('Select', {
            wrapNative: false,
            useCustomScroll: false,
            fakeDropInBody: false
        });
        jcf.replaceAll();
        // Shape mask
        $(".phone_mask").mask("+1(999) 999-99-99");
    }
    //Initialization form validation
    function formValidation() {
        let form = $("form");
        form.submit(function () {
            if ($(this).valid()) {
                return true;
            } else {
                return false;
            }
        });
        form.each(function () {
            let input  = $(this).find('input');
            $(this).validate({
                rules: {
                    name: {
                        required: true,
                        name: true
                    },
                    phone: {
                        required: true
                    }
                }
            });
            input.each(function () {
                if ($(this).prop('disabled')){
                    $(this).closest('.form-field').addClass('input-disabled');
                    if ($(this).closest('.label-wrap').hasClass('form-group')){
                        $(this).closest('.label-wrap').find('.btn').attr('disabled', true);
                    }
                }
            })

        });
    }

    // Popup initialization
    popupInit();
    function popupInit() {
        let popupName,
            body = $('body');
        // Popup call
        $(document).on('click', '.popup-init', function () {
            body.addClass("popup-visible").find(".popup").removeClass("active");
            popupName = $(this).data("popupname");
            body.find("."+ popupName + "").addClass("active");
        });
        // Close on click outside the popup
        $(document).mouseup(function (e){
            if($(".popup.active").length) {
                var div = $(".popup.active");
                if (!div.is(e.target) && div.has(e.target).length === 0) {
                    body.removeClass("popup-visible").find(".popup").removeClass("active");
                }
            }
        });
        // Cross Closure
        $(document).on('click', '.popup-remove', function () {
            body.removeClass("popup-visible").find(".popup").removeClass("active");
        });
        // Close by Esc
        document.onkeydown = function(e) {
            if(e.key === "Escape") {
                body.removeClass("popup-visible").find(".popup").removeClass("active");
            }
        };
    }


    smoothScroll();
    function smoothScroll(){
        $('a[href*="#"]:not([href="#"])').click(function (e) {
            e.preventDefault();
            let id = $(this).attr('href'),
                top = $(id).offset().top;
            $('body,html').animate({scrollTop: (top - header.outerHeight()) - 32}, 1000);
        });
    }

    postSlider();
    function postSlider() {
        let postSlider = $('.post-slider');
        if (postSlider.length){
            postSlider.each(function (id, elem) {
                let item = this.classList,

                    i;
                item.forEach(function (id, elem) {
                    if (id == 'post-slider' ){
                        i = id;
                    }
                });
                i;
                var swiper = new Swiper(`.${i} .swiper-container`, {
                    slidesPerView: 1,
                    spaceBetween: 32,
                    centeredSlides: true,
                    createElements: true,
                    touchMoveStopPropagation: true,
                    speed: 1000,
                    pagination: {
                        el: `.${i} .slider-pagination`,
                        clickable: true,
                        bulletClass: 'slider-pagination__item',
                        bulletActiveClass: 'active',
                    },
                    navigation: {
                        nextEl: `.${i} .slider-next`,
                        prevEl: `.${i} .slider-prev`,
                    },

                    slideActiveClass: 'active-slider',

                    roundLengths: true,
                    setWrapperSize: true,

                    breakpoints:{
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 32,
                        },
                    }
                });
            });
        }
    }

    reviewsSlider();
    function reviewsSlider() {
        let reviewsSlider = $('.reviews-slider');
        if (reviewsSlider.length){
            reviewsSlider.each(function (id, elem) {
                let item = this.classList,
                    i;
                item.forEach(function (id, elem) {
                    if (id == 'reviews-slider' ){
                        i = id;
                    }
                });
                i;
                var swiper = new Swiper(`.${i} .swiper-container`, {
                    slidesPerView: 1,
                    spaceBetween: 32,
                    touchMoveStopPropagation: true,
                    autoHeight: true,
                    speed: 2000,
                    pagination: {
                        el: `.${i} .slider-pagination`,
                        clickable: true,
                        bulletClass: 'slider-pagination__item',
                        bulletActiveClass: 'active',
                    },
                    navigation: {
                        nextEl: `.${i} .slider-next`,
                        prevEl: `.${i} .slider-prev`,
                        disabledClass: 'disabled-slider',
                    },

                    slideActiveClass: 'active-slider',
                    roundLengths: true,
                    setWrapperSize: true,
                    on: {
                        afterInit: function(){
                            sliderBubblesPagination(this);
                        },
                        slideChange: function () {
                            sliderBubblesPagination(this);
                            this.update();
                        },
                        slideChangeTransitionEnd: function () {
                            closeReadMore(this);
                            this.update();
                        }
                    }
                });
            });
        }
    }

    function sliderBubblesPagination({$el, imagesToLoad, activeIndex}) {
        let arrNext = [],
            arrPrev = [],
            n,
            homeSlider = $el.closest('.reviews-slider'),
            count2 = homeSlider[0].querySelector('.reviews-slider__container').getAttribute('data-count'),
            maxCount = count2,
            bubblesNext = homeSlider[0].querySelector('.bubbles-next .bubbles-list'),
            bubblesPrev = homeSlider[0].querySelector('.bubbles-prev .bubbles-list');
        bubblesNext.innerHTML = '';
        bubblesPrev.innerHTML = '';
        for (n=1; n<=maxCount; n++){
            for (let i=0; i < imagesToLoad.length; i++){
                let countNext = activeIndex+n,
                    differenceNext = countNext - imagesToLoad.length;
                if (i == differenceNext){
                    arrNext.push({'id': differenceNext, 'url': imagesToLoad[differenceNext].src})
                } else {
                    if (i == countNext){
                        arrNext.push({'id': i, 'url': imagesToLoad[i].src})
                    }
                }
            }
            for (let j = -maxCount; j <  imagesToLoad.length; j++){
                let countPrev = activeIndex - n,
                    differencePrev = imagesToLoad.length - Math.abs(countPrev);
                if (j < 0 && j == countPrev){
                    arrPrev.push({'id': differencePrev, 'url': imagesToLoad[differencePrev].src})
                } else {
                    if (j>=0 && j == countPrev){
                        arrPrev.push({'id': j, 'url': imagesToLoad[j].src})
                    }
                }
            }
        }
        for (let k = 0; k < arrNext.length; k++){
            bubblesNext.innerHTML += `<li class="bubbles-item bubbles-item-next-${k+1}"><img src="${arrNext[k].url}"></li>`;
        }
        for (let m = 0; m < arrPrev.length; m++){
            bubblesPrev.innerHTML += `<li class="bubbles-item bubbles-item-prev-${m+1}"><img src="${arrPrev[m].url}"></li>`;
        }

    }

    function closeReadMore({slides}){
        for (let i = 0; i < slides.length; i++){
            let arrayContainer = slides[i].querySelector('.readMore-container');
            if (slides[i].querySelector('.wysiwyg').classList.contains('readMore-container')){
                if (arrayContainer.classList.contains('active')){
                    let close = slides[i].querySelector('.btn-readMore').getAttribute('data-close');
                    slides[i].querySelector('.readMore-container').classList.remove('active');
                    slides[i].querySelector('.btn-readMore').classList.remove('active');
                    slides[i].querySelector('.btn-readMore').innerHTML = `${close}`;
                }
            }
        }
    }

    readMore();
    function readMore() {
        let readMoreBtn = $('.btn-readMore');
        readMoreBtn.on("click", function() {
            let open = $(this).data('open'),
                close = $(this).data('close');
            $(this).toggleClass('active');
            if ($(this).hasClass('active')){
                $(this).text(open)
            } else {
                $(this).text(close)
            }
            $(this).closest('.readMore-block').find('.readMore-container').toggleClass('active');
            if ($(this).hasClass('readMore-slider')){
                $(this).closest('.swiper-container')[0].swiper.update()
            }
            return false;
        })
    }

})(jQuery);
