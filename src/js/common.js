var fileStorage = [],
	totalSize = 0;

$(document).ready(function() {

	$('[data-fancybox]').fancybox({
		buttons : [ 'close' ]
	});

	$('#navigation .navbar-nav li > a').click(function(e) {
		$('.navbar-collapse').collapse('hide');
		e.preventDefault(); 
		var link = $(this).attr('href');
		var pos = $(link).offset().top;
		//var pos = $(link).offset().top + $('#navbarLogo').outerHeight();
		//$('body, html').animate({ scrollTop: pos - $('.navbar-collapse').outerHeight() + $('#navbarLogo').outerHeight() }, 700);
		if (document.documentElement.clientWidth <= 992) {
			pos = pos + $('#navbarLogo').outerHeight() - $('.navbar-collapse').outerHeight() - 10
			$('body, html').animate({ scrollTop: pos }, 700);
		} else {
			$('body, html').animate({ scrollTop: pos }, 700);
		}
	});

	$('#navigation .navbar-brand').click(function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		var pos = $(link).offset().top;
		$('body, html').animate({ scrollTop: pos }, 700);
	});

	$('#services a').click(function(e) {
		e.preventDefault();
		var link = $(this).attr('href');
		$(link).addClass('show');
		var pos = $(link).offset().top;
		$('body, html').animate({ scrollTop: pos - $('#navigation').outerHeight() }, 700);
	});

	$('a').click(function(e) {
		$(this).blur();
		//e.preventDefault();
	});

	$('#calculate').click(function() {
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

    sections = $('.section'),
	nav = $('.navbar-nav');

	$(window).on('scroll', function () {
    	var pos = $(this).scrollTop() + $('#navigation').outerHeight();
		
		if (pos >= $('#top').outerHeight()) {
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

	function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1048576) {
            return (bytes / 1048576).toFixed(2) + ' Мб';
        }

        return (bytes / 1024).toFixed(2) + ' Кб';
	}	
	
	function fileAlreadyLoaded(fileName) {
		var loaded = false;

		if (fileStorage.length > 0) {
			for (var j = 0; j < fileStorage.length; j++) {
				if (fileStorage[j].name === fileName)
					loaded = true;	
			}	
		}

		return loaded;
	}

	$('.custom-file-input').each(function() {
		var input = $(this),
			label = input.next('label'),
			labelText = label.html(),
			validExtensions = ['jpg', 'png', 'gif', 'doc', 'xls', 'docx', 'xlsx', 'pdf', 'zip', 'rar', '7z'],
			ul = $('#contact-form ul'),
			message = $('#upload-message');

		input.on('click', function() {
			message.html('Макс. допустимый общий размер файлов - 25 Мб.');
		});

		input.on('change', function() {
			if (this.files.length > 0) {
				for (var i = 0; i < this.files.length; i++) {
					var tpl = $('<li><p></p><p class="file-name"></p><span class="file-remove"><i class="fa fa-times"></i></span></li>');

					if (totalSize + this.files[i].size > 26214400) {
						message.html('Превышен макс. допустимый размер файлов!');
						break;
					} else if ($.inArray(this.files[i].name.substr(this.files[i].name.lastIndexOf('.') + 1), validExtensions) == -1) {
						message.html('Выбранный формат не поддерживается!');
						continue;
					} else if (fileAlreadyLoaded(this.files[i].name)) {
						message.html('Вы пытаетесь загрузить файл дважды!');
						continue;
					} else {
						$('#attachments-list').css('display', 'block');
						fileStorage.push(this.files[i]);
						totalSize += this.files[i].size;
						tpl.find('.file-name').text(this.files[i].name);
						tpl.find('p').first().text(this.files[i].name).append(' <i>(' + formatFileSize(this.files[i].size) + ')</i>');
						tpl.appendTo(ul).hide().fadeIn('normal');
					}
				}

				$(this).wrap('<form></form>').closest('form').get(0).reset();
				$(this).unwrap();
				$(this).val('');
			}
		});
	});

	$('#attachments-list').on('click', '.file-remove', function() {
		var fileName = $(this).parent().find('.file-name').text(),
			fileList = $(this).closest('div');


		for (var i = 0; i < fileStorage.length; i++) {
			if (fileStorage[i].name == fileName) {
				totalSize -= fileStorage[i].size;
				fileStorage.splice(fileStorage.indexOf(fileStorage[i]), 1);
			}		
		}

		$(this).parent().fadeOut('normal', function() { 
			$(this).remove();
			if (fileList.find('ul li').length == 0)
			fileList.css('display', 'none');
		});
	});

	$('#privacy-link').on('click', function() {
		$('#privacy-policy').modal('show');
	});

	// $('#req-link').on('click', function() {
	// 	$('#requisites').modal('show');
	// });
});

function addEvent(node, type, callback) {
	if (node.addEventListener) {
		node.addEventListener(
			type,
			function(e) {
				  callback(e, e.target);
			},
			false
		);
	} else if (node.attachEvent) {
		node.attachEvent('on' + type, function(e) {
			callback(e, e.srcElement);
		});
	}
}

function shouldBeValidated(field) {
	return (
		!(field.getAttribute('readonly') || field.readonly) &&
		  !(field.getAttribute('disabled') || field.disabled) &&
		  (field.getAttribute('pattern') || field.getAttribute('required'))
	);
}

function instantValidation(field) {
	if (shouldBeValidated(field)) {
		//the field is invalid if:
		  //it's required but the value is empty
		  //it has a pattern but the (non-empty) value doesn't pass
		var invalid =
			(field.getAttribute('required') && !field.value) ||
			(field.getAttribute('pattern') &&
			field.value &&
			!new RegExp(field.getAttribute('pattern')).test(field.value));
  
		  //add or remove the attribute is indicated by
		  //the invalid flag and the current attribute state
		  if (!invalid && field.getAttribute('aria-invalid')) {
			field.removeAttribute('aria-invalid');
		  } else if (invalid && !field.getAttribute('aria-invalid')) {
			field.setAttribute('aria-invalid', 'true');
		}
	}
}

(function() {
	'use strict';	  
	window.addEventListener('load', function() {
		var form = document.getElementById('contact-form');
		var fields = [ form.getElementsByTagName("input") ];
		
		for (var a = fields.length, i = 0; i < a; i++) {
			for (var b = fields[i].length, j = 0; j < b; j++) {
				  addEvent(fields[i][j], 'change', function(e, target) {
					instantValidation(target);
				});
			}
		}
		
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			//event.stopPropagation();

			if (form.checkValidity() === true) {
				var formData = new FormData($(form)[0]);
				//console.log(fileStorage);

				if (fileStorage.length > 0) {
					formData.delete('attachments[]');
					for (i = 0; i < fileStorage.length; i++) {
						formData.append('attachments[]', fileStorage[i]);
					}
				}

				$.ajax({
					type: 'POST',
					url: 'process.php',
					data: formData,
					// data: new FormData($(form)[0]),
					//dataType: 'JSON',
					cache: false,
    				contentType: false,
					processData: false,
					beforeSend: function() {
						$('#submit-form').html('<i class="fa fa-circle-o-notch fa-spin"></i>');
					},
					success: function(response) {
						$('#form-response .modal-body').html('<center>' + response + '</center>');
						$('#form-response').modal('show');
						form.reset();
						fileStorage = [];
						$('#attachments-list').css('display','none').find('ul li').remove();
						$('#contact-form label center').html('<i class="fa fa-paperclip" aria-hidden="true"></i> Прикрепить файлы');
						$('#submit-form').html('Отправить');
						
						console.log(response); // for debug purposes
					}					
				});
			} else {
				$('#needs-validation').addClass('was-validated');
			}
		}, false);
	}, false);
})();