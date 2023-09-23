/*----------------------------------------------------
	L'AMORE WEDDING TEMPLATE.

	Author:			theme_div
	Type:          	JS
	Last Update:   	30.09.2018

	[Table of contents]
	1. Counter
	2. Slider
	3. Animate on Scroll
	4. Masonry gallery
	5. Mobile Menu (open/close)
	6. Navigation
	7. RSVP Form submission
	8. Functions
		8.1. Validate E-mail
		8.1. Get sections offset
		8.1. Set navbar active link
		8.1. Debouncer

----------------------------------------------------*/

(function ($) {
	"use strict";

	/*==== 1. Counter  ====*/
	var $counter = $('.js-counter');
	var $date = $counter.attr('data-date');

	$counter.countdown($date, function(event) {
		$('.js-counter-days').html(event.strftime('%D'));
		$('.js-counter-hours').html(event.strftime('%H'));
		$('.js-counter-minutes').html(event.strftime('%M'));
		$('.js-counter-seconds').html(event.strftime('%S'));
	});

	/*==== 2. Friends slider  ====*/
	var $slider = $('.js-slider').slick({
		centerMode: true,
		centerPadding: '5%',
		slidesToShow: 5,
		autoplay: true,
		prevArrow: '.js-arrow-prev',
		nextArrow: '.js-arrow-next',
		focusOnSelect: true,
		responsive: [
			{
			breakpoint: 1200,
			settings: {
				slidesToShow: 3
				}
			},
			{
			breakpoint: 480,
			settings: {
				arrows: false,
				slidesToShow: 1
				}
			}
		]
	});

	/*==== 3. Animate on Scroll ====*/
	AOS.init({
		disable: false,
		duration: 900, // values from 0 to 3000, with step 50ms
		easing: 'ease', // default easing for AOS animations
		once: true, // whether animation should happen only once - while scrolling down
	});


	/*==== 4. Masonry gallery ====*/
	var $grid = $('.grid').masonry({
		itemSelector: '.grid-item',
		//columnWidth: '.grid-sizer',
		gutter: '.gutter-sizer',
	});

	// layout Masonry after each image loads
	$grid.imagesLoaded().progress( function() {
		$grid.masonry('layout');
	});


	/*==== 5. Mobile menu (open/close) ====*/
	$(document).on('click', '.js-open-menu', function(e) {
		e.preventDefault();
		var $self = $(this);
		var $icon = $('.icon', $self);
		var iconName = $icon.attr('name');

		var iconAttr = (iconName == 'menu' ? 'close' : 'menu');
		$icon.attr('name', iconAttr);
		$('.js-menu').slideToggle('slow');
		$icon.toggleClass('icon--black');

	} );

	/*==== 6. Single page navigation ====*/
	var sectionsInfo = getSectionsOffset();
	$(window).on('resize',function() {
		sectionsInfo = getSectionsOffset();
	});

	$(document).on('click', '.js-nav-link', function(e) {
		e.preventDefault();

		var target = $(this).attr('href');

		$('html, body').animate({
			scrollTop: $(target).offset().top - 100
		}, 1000);
	});

	$(window).on( 'scroll', debounce(setActiveNavLink, 50));


	/*==== 7. RSVP Form submission ====*/
	$('.js-form').on('submit', function(e) {
		e.preventDefault();
		$('.js-loader').show();
		var $form = $(this);
		var action = $form.attr('action');

		var email = $('.js-email').val()
		var emailValidation = validateEmail(email);

		if(!emailValidation) {
			$('.js-email').addClass('error');
			$('.js-email-error').show();
			$('.js-loader').hide();
			return false;
		}

		var formData = $form.serialize();
		$('.js-email').removeClass('error');
		$('.js-email-error').hide();

		$.ajax({
			type: 'POST',
			url: action,
			data: formData
		})
		.done(function(response) {
			$('.js-loader').hide();
			$('.js-form-wrapper').hide();
			$('.js-form-confirmation').show();
		})
	} );

	/*==== 8. Functions ====*/
	// 8.1. Validate Email
	function validateEmail( email ) {
		var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test( String( email ).toLowerCase() );
	}

	//8.2. Get section offset (used for setting active link)
	function getSectionsOffset() {
		var sections = $('.js-section');
		var sectionsInfo = [];

		sections.each(function() {
			var $self = $(this);
			sectionsInfo.push({
				id: $self.attr('id'),
				offset: $self.offset().top - 100,
			});
		});

		return sectionsInfo;
	}

	// 8.3. Set active link
	function setActiveNavLink() {
		var scrollPosition = $(window).scrollTop() + 53;
		for ( var i = 0; i < sectionsInfo.length; i++) {
			if( scrollPosition >= sectionsInfo[i].offset ) {
				$( '.js-nav-link' ).removeClass('active');
				$( '.js-nav-link[href="#'+ sectionsInfo[i].id + '"]' ).addClass('active');
			}
		}
	}

	//8.4 Debouncer.
	function debounce( func, wait ) {
		var timeout;
		var later = function() {
			timeout = undefined;
			func.call();
		};

		return function() {
			if ( timeout ) {
				clearTimeout( timeout );
			}
			timeout = setTimeout( later, wait );
		};
	};

}(jQuery));
