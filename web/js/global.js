mdc.autoInit();

window.onscroll = function(e) {
	if ($(document).scrollTop() === 0) {
		$('.navbar').css('box-shadow', 'none');
		$('.navbar').css('border-bottom', 'none');
	} else {
		$('.navbar').css('box-shadow', '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)');
		$('.navbar').css('border-bottom', '3px solid red');
	}
};