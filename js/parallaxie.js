/*! Copyright (c) 2016 THE ULTRASOFT (http://theultrasoft.com)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Project: Parallaxie
 * Version: 0.5
 *
 * Requires: jQuery 1.9+
 */

(function( $ ){

    $.fn.parallaxie = function( options ){

        var options = $.extend({
            speed: 0.2,
            repeat: 'no-repeat',
            size: 'cover',
            pos_x: 'center',
            offset: 0,
        }, options );

        this.each(function(){

            var $el = $(this);
            var local_options = $el.data('parallaxie');
            if( typeof local_options != 'object' ) local_options = {};
            local_options = $.extend( {}, options, local_options );

            var image_url = $el.data('image');
            if( typeof image_url == 'undefined' ){
                image_url = $el.css('background-image');
                if( !image_url ) return;

                // APPLY DEFAULT CSS
                var pos_y =  local_options.offset + ($el.offset().top - $(window).scrollTop()) * (1 - local_options.speed );
                $el.css({
                    'background-image': image_url,
                    'background-size': local_options.size,
                    'background-repeat': local_options.repeat,
                    'background-attachment': 'fixed',
                    'background-position': local_options.pos_x + ' ' + pos_y + 'px',
                });

                $(window).scroll( function(){
                        //var pos_y = - ( $(window).scrollTop() - $el.offset().top ) * ( 1 + local_options.speed ) - ( $el.offset().top * local_options.speed );
                        var pos_y =  local_options.offset + ($el.offset().top - $(window).scrollTop()) * (1 - local_options.speed );
                        $el.data( 'pos_y', pos_y );
                        $el.css( 'background-position', local_options.pos_x + ' ' + pos_y + 'px' );
                    }
                );
            }
        });
        return this;
    };
}( jQuery ));


(function () {
  const header = document.querySelector('.header-sticky');
  const headerParent = header.parentNode; // header.main-header
  const trigger = 50; // px to scroll before fixing
  let placeholder = null;
  let fixed = false;
  let ticking = false;

  function makeFixed() {
    const h = header.offsetHeight;
    // create placeholder to preserve document flow
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.className = 'header-placeholder';
      headerParent.insertBefore(placeholder, header.nextSibling);
    }
    placeholder.style.height = h + 'px';

    // set fixed state (off-screen) then force reflow and animate in
    header.classList.add('is-fixed');
    // force reflow so browser registers the is-fixed state (translateY(-100%))
    header.getBoundingClientRect();
    // now slide down
    header.classList.add('is-visible');
    fixed = true;
  }

  function removeFixed() {
    // slide up first
    header.classList.remove('is-visible');

    // after transform transition ends remove is-fixed and the placeholder
    const onTransitionEnd = function (e) {
      if (e.propertyName === 'transform') {
        header.classList.remove('is-fixed');
        if (placeholder) {
          placeholder.parentNode.removeChild(placeholder);
          placeholder = null;
        }
        header.removeEventListener('transitionend', onTransitionEnd);
        fixed = false;
      }
    };
    header.addEventListener('transitionend', onTransitionEnd);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const scroll = window.pageYOffset || document.documentElement.scrollTop;

      if (scroll > trigger && !fixed) {
        makeFixed();
      } else if (scroll <= 0 && fixed) {
        // only unfix when scrolled back to very top
        removeFixed();
      }

      ticking = false;
    });
  }

  // update placeholder height on resize if fixed
  function onResize() {
    if (placeholder) {
      placeholder.style.height = header.offsetHeight + 'px';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  // initialize in case page loads already scrolled
  document.addEventListener('DOMContentLoaded', function () {
    if ((window.pageYOffset || document.documentElement.scrollTop) > trigger) {
      makeFixed();
    }
  });
})();




