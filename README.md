# jQuery Directional Plugin (Version 0.9 - Stable Beta)

A simple plugin for funky directional slide effect on rollover/click on elements

Here is a very simple [demo](http://lab.stephaneguigne.com/js/jquery-directionalslide/)

## Examples

Here is a basic exemple

	// minimum
	$('.my_elements').directionalSlide();

Here is a full options exemple

	// full options
	$('.my_elements').directionalSlide(
    {
        animateOnClick      : false,     // set to true if you prefer the click event rather than mousenter
        normalElmt          : '.directional-slide-normal', // ClassName for the "normal" element 
        hoverElmt           : '.directional-slide-hover', // ClassName for the "hover" element 
        avoidTransforms     : true,     // set to true to prevent jQuery Enhancement Plugin bugs
        reverseNormal       : false,    // set to true if you want to reverse animation of the "normal" element (repulsion effect)
        reverseHover        : false,    // set to true if you want to reverse animation of the "hover" element (repulsion effect)
        animateSpeed        : 800,      // animations speed (in ms)
    });


## Cross-browser Compatibility

Chrome/Firefox/Safari and IE7+


## License

Feel free to use it, just leave my copyright.

Copyright (c) 2011 [Stéphane Guigné](http://stephaneguigne.com)