(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        $('.navbar-nav .nav-link').on('click', function (event) {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                return;
            }
            $('.navbar-nav .nav-link').removeClass('active');
            $(this).addClass('active');
            var menu = $('#navbarCollapse');
            var hash = this.getAttribute('href');
            var target = hash && hash.charAt(0) === '#' ? document.getElementById(hash.slice(1)) : null;
            if (target && target.classList.contains('page-section') &&
                window.innerWidth < 992 && menu.is('.show, .collapsing')) {
                event.preventDefault();
                menu.off('hidden.bs.collapse.pageNavigation').one('hidden.bs.collapse.pageNavigation', function () {
                    window.scrollTo({
                        top: Math.max(0, target.getBoundingClientRect().top + window.scrollY -
                            Math.ceil(document.querySelector('.site-nav-wrap').getBoundingClientRect().height)),
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
                    });
                    if (window.location.hash !== hash) {
                        window.history.pushState(null, '', hash);
                    }
                });
            }
            if (menu.hasClass('collapsing') && $('.navbar-toggler').attr('aria-expanded') === 'true') {
                menu.one('shown.bs.collapse', function () { menu.collapse('hide'); });
            } else {
                menu.collapse('hide');
            }
        });

        var navigation = document.querySelector('.site-nav-wrap');
        var sections = Array.from(document.querySelectorAll('.page-section[id]'));
        if (navigation && sections.length) {
            var navigationHeight = 0;
            var scrollFramePending = false;

            function updateActiveSection() {
                var marker = navigationHeight + (window.innerHeight - navigationHeight) / 3;
                var activeSection = sections[0];
                sections.forEach(function (section) {
                    if (section.getBoundingClientRect().top <= marker) {
                        activeSection = section;
                    }
                });
                $('.navbar-nav .nav-link').each(function () {
                    $(this).toggleClass('active', this.getAttribute('href') === '#' + activeSection.id);
                });
            }

            function measureNavigation() {
                navigationHeight = Math.ceil(navigation.getBoundingClientRect().height);
                var menu = document.getElementById('navbarCollapse');
                if (window.innerWidth >= 992 || !menu || !menu.matches('.show, .collapsing')) {
                    document.documentElement.style.setProperty('--site-nav-height', navigationHeight + 'px');
                }
                updateActiveSection();
            }

            measureNavigation();
            if ('ResizeObserver' in window) {
                new ResizeObserver(measureNavigation).observe(navigation);
            } else {
                $(window).on('resize', measureNavigation);
            }
            $(window).on('scroll', function () {
                if (!scrollFramePending) {
                    scrollFramePending = true;
                    window.requestAnimationFrame(function () {
                        updateActiveSection();
                        scrollFramePending = false;
                    });
                }
            });

            var pageScrollQuery = window.matchMedia('(min-width: 1200px) and (min-height: 700px)');
            var wheelAmount = 0;
            var wheelGestureActive = false;
            var wheelTransitionUntil = 0;
            var wheelIdleTimer;

            // Keep trackpad momentum within one section change per gesture.
            document.addEventListener('wheel', function (event) {
                var pageHeight = window.innerHeight - navigationHeight;
                if (!pageScrollQuery.matches || event.ctrlKey || event.metaKey || event.shiftKey ||
                    Math.abs(event.deltaX) >= Math.abs(event.deltaY) ||
                    sections.some(function (section) { return section.offsetHeight > pageHeight + 2; })) {
                    return;
                }
                for (var element = event.target; element && element !== document.body; element = element.parentElement) {
                    if (element.scrollHeight > element.clientHeight + 2 &&
                        /auto|scroll/.test(window.getComputedStyle(element).overflowY)) {
                        return;
                    }
                }

                event.preventDefault();
                window.clearTimeout(wheelIdleTimer);
                wheelIdleTimer = window.setTimeout(function () {
                    wheelGestureActive = false;
                    wheelAmount = 0;
                }, 220);
                if (wheelGestureActive || window.performance.now() < wheelTransitionUntil) {
                    return;
                }

                wheelAmount += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? pageHeight : 1);
                if (Math.abs(wheelAmount) < 18) {
                    return;
                }
                var currentIndex = 0;
                sections.forEach(function (section, index) {
                    if (Math.abs(section.getBoundingClientRect().top - navigationHeight) <
                        Math.abs(sections[currentIndex].getBoundingClientRect().top - navigationHeight)) {
                        currentIndex = index;
                    }
                });
                var direction = wheelAmount > 0 ? 1 : -1;
                var targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
                var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                wheelGestureActive = true;
                wheelTransitionUntil = window.performance.now() + (reducedMotion ? 0 : 600);
                window.scrollTo({
                    top: Math.max(0, sections[targetIndex].offsetTop - navigationHeight),
                    behavior: reducedMotion ? 'auto' : 'smooth'
                });
            }, { passive: false });
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
        return false;
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });


    // Team carousel
    $(".team-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 30,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

function ScrollMenu(menu) {
    document.getElementById(menu).scrollIntoView({
        behavior: 'smooth'
    });
}

function OpenMain() {
    window.location.href = 'https://inveshub.co/';
}
