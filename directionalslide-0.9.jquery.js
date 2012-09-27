/* ------------------------------------------------------------------------------------------------------
| A jQuery plugin for directional slide effect on rollover/click
| -------------------------------------------------------------------------------------------------------
|
| Plugin name : Directional Slide
| Version : 0.9 (Beta)
| author : Stéphane Guigné (http://stephaneguigne.com)
|
| TODO : enable CSS3 animations
|
| Simple exemple : 
    $('.my_elements').directionalSlide();
|
| Full options exemple : 
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
|
*/
;(function($) 
{
    $.DirectionalSlide = function( $el, options ) 
    {
        var s = $.DirectionalSlide.settings,
            $hoverElmt,
            $normalElmt,
            coords = {
                origin : {
                    top     : "0%",
                    left    : "0%",
                    avoidTransforms : options.avoidTransforms
                },
                fromTop : {
                    top     : "-100%",
                    left    : "0%",
                    avoidTransforms : options.avoidTransforms
                },
                fromRight : {
                    top     : "0%",
                    left    : "100%",
                    avoidTransforms : options.avoidTransforms
                },
                fromBottom : {
                    top     : "100%",
                    left    : "0%",
                    avoidTransforms : options.avoidTransforms
                },
                fromLeft   : {
                    top     : "0%",
                    left    : "-100%",
                    avoidTransforms : options.avoidTransforms
                }
            };

        /*
        | Initialisation of the plugin
        | 
        */
        function _init() 
        {    
            if(options.animateOnClick || s.isTouch) {
                s.animationOn = 'click';
                $el.css({ cursor : 'pointer' });
            }

            $hoverElmt = $el.find( options.hoverElmt );
            $normalElmt = $el.find( options.normalElmt );

            _initCss();
            _initEvents();
        }

        /*
        | Init all css
        | 
        */
        function _initCss()
        {
            var childrenProps = {
                    position : "absolute",
                    top : '0%',
                    left : '0%',
                    width : '100%',
                    height : '100%' 
                };
            
            if($el.css('position') && $el.css('position')=="static")
                $el.css({ position : "relative" });


            $el.css({ overflow : "hidden" });
            $normalElmt.css(childrenProps);
            $hoverElmt.css(childrenProps).hide();
        }

        /*
        | Init all events
        |
        | Rmq : Chosen event to launch animation (mouseenter or click).
        | - Default on screen : mouseenter
        | - Default on touch device : click
        | 
        */
        function _initEvents() 
        {    
            $el.bind(s.animationOn+' mouseleave', function( event ) 
            {    
                var isAnimate = $el.data('isAnimate') ? true : false,
                    isOpen = $el.data('isOpen') ? true : false,
                    direction = _getDirection( { x : event.pageX, y : event.pageY } ),
                    props = _getCoordinates( direction );
                
                if( event.type === s.animationOn ) 
                {
                    if(!isAnimate)
                        $el.data('props', props);

                    if(!options.animateOnClick || (options.animateOnClick && !isAnimate && !isOpen) )
                        _animate(false,true);
                    else if (options.animateOnClick && !isAnimate && isOpen)
                        _animate(true,false);
                }
                else if( event.type === 'mouseleave' )
                {
                    if(options.animateOnClick && !isAnimate && !isOpen)
                        return;

                    if(!isAnimate && isOpen)
                        $el.data('props', props);

                    _animate(true,false);
                };
            });
        }

        /*
        | Animate elements
        |
        | @reverse (boolean) - If true, the animation will be reversed
        | @openAtEndOfAnimation (boolean) - If true, it will be considered as an "open" state at the end of the animation
        | 
        */
        function _animate( reverse, openAtEndOfAnimation )
        {
            if($el.data('props') == undefined) return;

            var props = $el.data('props'),
                isAnimate = $el.data('isAnimate') ? true : false,
                normalProps = {},
                hoverProps = {},
                hoverSpeed = options.animateSpeed,
                normalSpeed = options.animateSpeed;

            if( !reverse )
            {
                hoverProps['from'] = !isAnimate ? props.hover : {};
                hoverProps['to'] = coords.origin;

                normalProps['from'] = {};
                normalProps['to'] = props.normal;

                hoverSpeed -= 50;
            }
            else
            {
                hoverProps['from'] = {};
                hoverProps['to'] = props.hover;

                normalSpeed -= 50;

                normalProps['from'] = !isAnimate ? props.normal : {};
                normalProps['to'] = coords.origin;
            }

            _onAnimateStart();

            $hoverElmt.stop(true,false).css(hoverProps.from).show().animate(hoverProps.to, hoverSpeed, function()
            {
                _onAnimateEnd(openAtEndOfAnimation);
            });

            $normalElmt.stop(true,false).css(normalProps.from).show().animate(normalProps.to, normalSpeed, function()
            {
                _onAnimateEnd(openAtEndOfAnimation);
            });
           
        }

        /*
        | Callback each time an animation start
        | 
        */
        function _onAnimateStart()
        {
            $el.data('isAnimate', true);
            $el.data('isOpen', false);
        }

        /*
        | Callback each time an animation stop
        |
        | @openAtEndOfAnimation (boolean) - If true, it will be considered as an "open" state at the end of the animation
        | 
        */
        function _onAnimateEnd( openAtEndOfAnimation )
        {
            $el.data('isAnimate', false);
            if(openAtEndOfAnimation) $el.data('isOpen', true);
        }

        /*
        | Get mouse entrance direction  
        |
        | @coordinates (object) - Mouse coordinates in element
        |
        | return @direction (Number) : 0 (from top), 1 (from right), 2 (from bottom) or 3 (from left)
        | 
        */
        function _getDirection( coordinates )
        {    
            var w = $el.outerWidth(),
                h = $el.outerHeight(),
                x = ( coordinates.x - $el.offset().left ),
                y = ( coordinates.y - $el.offset().top ),
                direction;

                if(x<=w/2 && y<=h/2)
                    direction = (x>y) ? 0 : 3;
                else if(x>=w/2 && y<=h/2)
                    direction = ((w-x)>y) ? 0 : 1;
                else if(x>=w/2 && y>=h/2)
                    direction = ((w-x)>(h-y)) ? 2 : 1;
                else if(x<=w/2 && y>=h/2)
                    direction = (x>(h-y)) ? 2 : 3;
            
            return direction;
        }

        /*
        | Get coordinates for animations
        |
        | @direction (Number) : 0 (from top), 1 (from right), 2 (from bottom) or 3 (from left)
        | 
        */
        function _getCoordinates( direction )
        {
            var coordinates = {};

            switch( direction ) {
                case 0:
                    coordinates['normal'] = ( !options.reverseNormal ) ? coords.fromBottom : coords.fromTop;
                    coordinates['hover'] = ( !options.reverseHover ) ? coords.fromTop : coords.fromBottom;
                    break;
                case 1:
                    coordinates['normal'] = ( !options.reverseNormal ) ? coords.fromLeft : coords.fromRight;
                    coordinates['hover'] = ( !options.reverseHover ) ? coords.fromRight : coords.fromLeft;
                    break;
                case 2:
                    coordinates['normal'] = ( !options.reverseNormal ) ? coords.fromTop : coords.fromBottom;
                    coordinates['hover'] = ( !options.reverseHover ) ? coords.fromBottom : coords.fromTop;
                    break;
                case 3:
                    coordinates['normal'] = ( !options.reverseNormal ) ? coords.fromRight : coords.fromLeft;
                    coordinates['hover'] = ( !options.reverseHover ) ? coords.fromLeft : coords.fromRight;
                    break;
            };
            
            return coordinates;
        }

        // Init (Singleton)
        _init();

        // return public methods
        return {};
    };

    /*
    | Default Directional Slide Settings
    |
    | @return (object) - default settings 
    | 
    */
    $.DirectionalSlide.settings = (function()
    {
        var isTouch = ('ontouchstart' in window || 'ontouchstart' in document.documentElement),
            animationOn = 'mouseenter',
            hasTransitions = false,
            transitionType = null,
            transitionTypes = ["WebkitTransition","MozTransition","OTransition","transition"],
            transitionEndOptions = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd',
                'transition'       : 'transitionEnd'
            },
            transitionEnd = {},
            $body = document.body || document.documentElement,
            style = $body.style,
            nbTypes = transitionTypes.length;

        for(var i = 0; i < nbTypes; i++)
        {
            var transType = transitionTypes[i];
            if(style[transType]!==undefined)
            {
                transitionType = transType;
                hasTransitions = true;
            }
        }

        if( hasTransitions )
            transitionEnd = transitionEndOptions[transitionType];

        return {
            hasTransitions  : hasTransitions,
            transitionType  : transitionType,
            transitionEnd   : transitionEnd,
            animationOn     : animationOn,
            isTouch         : isTouch 
        }
    })();
    
    $.fn.directionalSlide = function( options ) 
    {
        var defaults = {
                avoidTransforms     : true,
                reverseHover        : false,
                reverseNormal       : false,
                normalElmt          : '.directional-slide-normal',
                hoverElmt           : '.directional-slide-hover',
                // transitionEase      : 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                // transitionSpeed     : '.3s',
                animateSpeed        : 500,
                animateOnClick      : false
            };

        this.each(function() 
        {    
            var instance = $.data( this, 'hoverdir' );
            
            if ( !instance ) 
            {
                options = $.extend( true, {}, defaults, options );

                $.data( this, 'hoverdir', new $.DirectionalSlide( $(this), options ) );
            }
        });
        
        return this;
    };
    
})( jQuery );