;
(function($, window, document, undefined) {
  "use strict";

  var pluginName = "stickEmUp",
    defaults = {
      autoMove: true,
      offset: 150,
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
        options = this.options,
        _ = this,
        offsetTop = {
          val: $(header).offset().top
        };

      this.prevTop = 0;
      this.elTop = offsetTop.val;
      this.buildCache();
      this.down();
      this.up();

      if (autoMove) {
        $(header).css({
          'transition': '' + options.duration + ' transform ' + options.delay + ' ease-in-out',
          '-webkit-overflow-scrolling': 'touch'
        });
        $(header).before('<div class="sticky-spacer"></div>');
        this.spacer = '.sticky-spacer';
        this.$spacer = $('.sticky-spacer');
      }

      $(window).on('resize load', this.checkSize.bind(_));

      $(window).on('scroll', function() {
        var top = $(window).scrollTop();

        this.requestAnimationFrame(
          _.scrollEvent.bind(_, top)
        );

      });

    },

    buildCache: function() {
      this.$element = $(this.element);
      this.$body = $('body');

    },

    checkSize: function checkSize() {

      var _ = this;

      var debounced = _.debounce(function() {
        _.elTop = $(_.element).offset().top;
      }, 250);

      debounced();
    },
    debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    scrollEvent: function(top) {
      var offset = this.options.offset,
        elTop = this.elTop,
        prevTop = this.prevTop,
        _ = this;


      if (top > prevTop && top > elTop && $('body').data('direction') !== 'down') {

        _.$body.trigger('GOING_DOWN');

      } else if (top > prevTop && top > elTop + offset) {

        _.animateOut();

      } else if (top <= elTop && top < prevTop || top <= elTop && $('body').data('direction') !== 'up') {
        _.$body.trigger('GOING_UP');

      } else if (top < prevTop) {
        _.slideIn();
      }

      _.prevTop = top;

    },
    down: function() {
      var _ = this;
      this.$body.on('GOING_DOWN', function(top, offset) {
        _.$body.data('direction', 'down');
        _.setFixed();
      });
    },
    up: function() {
      var _ = this;
      this.$body.on('GOING_UP', function() {
        _.$body.data('direction', 'up');
        _.reset();
      });
    },
    setFixed: function() {
      var _ = this,
        elHeight = this.$element.height();
      this.$body.addClass(this.options.fixedClass);

      if (this.$body.hasClass(this.options.inClass)) {
        this.$body.removeClass(this.options.inClass);
      }
      if (this.options.autoMove) {
        this.$spacer.css({
          height: elHeight
        });
        this.$element.css({
          'position': 'fixed',
          'top': 0
        });
      }
    },
    animateOut: function(i) {
      var _ = this,
        _o = _.options,
        elHeight = _.$element.height();
      _.$body.removeClass(_o.inClass);
      _.$body.addClass(_o.outClass);

      if (_o.autoMove) {
        _.$element.css({
          'transform': 'translateY(' + elHeight * -2 + 'px)',
          '-webkit-transform': 'translateY(' + elHeight * -2 + 'px)'
        });
      }
    },
    reset: function() {
      var _ = this,
        _o = _.options;
      _.$body.removeClass(_o.fixedClass);
      if (this.$body.hasClass(this.options.inClass)) {
        this.$body.removeClass(this.options.inClass);
      }
      if (_o.autoMove) {
        _.slideIn();
        _.$spacer.css({
          height: 0
        });
        _.$element.css({
          'position': 'initial'
        });
      }
    },
    slideIn: function() {
      var _ = this,
        _o = _.options;
      this.$body.addClass(_o.inClass);
      if (this.$body.hasClass(_o.outClass)) {
        this.$body.removeClass(_o.outClass);
      }
      if (_o.autoMove) {
        this.$element.css({
          'transform': 'translateY(0)',
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
