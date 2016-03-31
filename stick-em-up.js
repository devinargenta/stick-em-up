;(function($, window, document, undefined) {
  "use strict";

  var pluginName = "stickEmUp",
    defaults = {
      autoMove: true,
      offset: 0,
      fixedClass: 'stickEm-fixed',
      inClass: 'stickEm-in',
      outClass: 'stickEm-out',
      delay: '',
      duration: '.3s'
    };

  function Plugin(element, options) {
    this._name = pluginName;
    this._defaults = defaults;
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this.init();

  }

  $.extend(Plugin.prototype, {

    init: function() {
      var header = this.element,
          $body = $('body'),
          autoMove = this.options.autoMove,
          spacer,
          elTop = $(header).offset().top;

      if (autoMove) {
        $(header).css({
          'transition': '' + this.options.duration + ' all ' + this.options.delay + ' ease-in-out',
           '-webkit-overflow-scrolling': 'touch'});
        $(header).before('<div class="blurry-spacer"></div>');
         spacer = $('.blurry-spacer');
      }

      this.scrollEvent(this.element, this.options, elTop, spacer);

    },
    scrollEvent: function(el, options, elTop, spacer) {
      var prevTop = 0,
        offset = options.offset,
        _ = this;
      $(window).on("scroll", function(e) {
        var top = $(this).scrollTop();
        console.log(top);
        // if we're going down, and we've gone past element top + offset
        // add a class and set the element to fixed (if automove)
        if (top > prevTop && top > elTop + offset) {
          _.setFixed(_.element, _.options, spacer);
          // if we're going up && we've gone higher up than the element top + offset
          // we must reset, to translate 0 & position relative;
        } else if (top < elTop && top < prevTop) {
          _.reset(_.element, _.options, spacer);
          //if we're too close to the fixing point, fix it
        } else if (top < elTop) {
          _.reset(_.element, _.options, spacer);
          // if wer'e goign up slide the top in
        } else if (top < prevTop) {
          _.slideIn(_.element, _.options);
        }
        prevTop = top;
      });
    },
    setFixed: function(el, options, spacer) {
      var $body = $('body');
      $body.addClass(options.fixedClass);
      $body.addClass(options.outClass);
      if ($body.hasClass(options.inClass)) {
        $body.removeClass(options.inClass);
      }
      if (options.autoMove) {
        spacer.css({height: $(el).height()});
        $(el).css({
          'position': 'fixed',
          'transform': 'translateY(-100px)',
          '-webkit-transform': 'translateY(-100px)'
        });
      }
    },
    reset: function(el, options, spacer) {
      var $body = $('body');
      $body.removeClass(options.fixedClass);
      if (options.autoMove) {
        this.slideIn(el, options);
        spacer.css({height: 0});
        $(el).css({
          'position': 'relative'
        });
      }
    },
    slideIn: function(el, options) {
      var $body = $('body');
      $body.addClass(options.inClass);
      if ($body.hasClass(options.outClass)) {
        $body.removeClass(options.outClass);
      }
      if (options.autoMove) {
        $(el).css({
          'transform': 'translateY(0px)',
          '-webkit-transform': 'translateY(0)'
        });
      }
    }
  });
  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);