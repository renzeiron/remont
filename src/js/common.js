$(document).ready(function() {

	$('#navigation .navbar-nav li > a').click(function(e) {
		e.preventDefault(); 
		var link = $(this).attr('href');
		var pos = $(link).offset().top;
		$('body,html').animate({ scrollTop: pos }, 700);
	});

	$('#navigation .navbar-brand').click(function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		var pos = $(link).offset().top;
		$('body,html').animate({ scrollTop: pos }, 700);
	});

	$('a').click(function(e) {
		$(this).blur();
		e.preventDefault();
	});

	$('#calculate').click(function(){
		var total = 0;

		$('#calc-body tbody tr').each(function() {
			var price;
			
			$(this).find('.td-price').each(function() {
				price = parseInt($(this).html());
			});

			$(this).find('input').each(function(index, elem) {
				var val = parseInt($(elem).val());
				if (!isNaN(val)) {
					total += val * price;
				}
			});
		});

		$('#total').text('Итого: ' + total + ' грн.');
	});

	(function() {
		'use strict';	  
		window.addEventListener('load', function() {
			var form = document.getElementById('contact-form');
		  	form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
			  		event.preventDefault();
			  		event.stopPropagation();
				}

				$('#needs-validation').addClass('was-validated');
		  	}, false);
		}, false);
	})();

    sections = $('.section'),
	nav = $('.navbar-nav');

	$(window).on('scroll', function () {
    	var pos = $(this).scrollTop();
		
		if (pos >= 300) {
			$('#navbarLogo').fadeIn();
		} else {
			$('#navbarLogo').fadeOut();
		}

      	sections.each(function () {
        	var top = $(this).offset().top,
			bottom = top + $(this).outerHeight();
			
			if (pos >= top && pos <= bottom) {
				nav.children('.nav-item').find('a').removeClass('active');
				nav.children('.nav-item').find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
			} else {
				nav.children('.nav-item').find('a[href="#' + $(this).attr('id') + '"]').removeClass('active');
			}
      	});
	});
	
});
