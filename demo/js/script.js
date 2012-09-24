/* Author:

*/

$(function(){

	var _window = $(window),
		maxSize = 300;

	/* ------------------------------
		Init
	------------------------------ */
	function _init()
	{
		$("#pictures > div")
			.each(function(){ 
				$(this).find('.directional-slide-normal, .directional-slide-hover').css({
					background: '#'+(Math.random()*0xFFFFFF<<0).toString(16) 
				}); 
			})
			.directionalSlide();

		_window.bind('load resize', _replaceAndResize);
	}
	_init();

	/* ------------------------------
		Resize
	------------------------------ */
	function _replaceAndResize()
	{
		var w = 100 / (_window.width()/maxSize>>0)
			h = w / 100 *  _window.width();

		$("#pictures > div").css({
			width:w +"%",
			height:h +"px" 
		});
	}
});



