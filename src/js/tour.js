(function(window, $) {
  var app = {};

  var selector = null;
  var overlay = null;
  var audio = null;

  app.initOverlay = function() {
    var this_ = this;

    if (overlay) {
      return;
    }

    $('body').append(Tour.templates.overlay().content);
    overlay = $('.tour-overlay');

    // Handle overlay for window resize
    $(window).off('resize.tour');
    $(window).on('resize.tour', function() {
      this_.resizeOverlay(selector);
    });

    return this;
  };

  app.resizeOverlay = function(sel) {
    var this_ = this;

    if (!sel) {
      return;
    }

    if (!overlay) {
      this.initOverlay();
    }

    selector = sel;

    var el = $(sel);
    var offset = el.offset();
    var top = offset.top;
    var left = offset.left;
    var bottom = top + el.outerHeight();
    var right = left + el.outerWidth();
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    var path = overlay.find('svg path');
    path.attr('d', 'M0,0 l' + windowWidth + ',0 l0,' + windowHeight + ' l-' + windowWidth + ',0 l0,' + windowHeight +
        ' M' + left + ' ' + top +
        ' L' + left + ',' + bottom +
        ' L' + right + ',' + bottom +
        ' L' + right + ',' + top +
        ' L' + left + ',' + top);

    overlay.fadeIn();

    $(document).off('click.tour');
    $(document).on('click.tour', function(event) {
      if(!$(event.target).closest(sel).length &&
          !$(event.target).is(sel)) {
        this_.hide();
      }
    });
  };

  app.hideOverlay = function() {
    $('.tour-overlay').fadeOut();
    return this;
  };

  app.showCaption = function(caption) {
    $('body').append(Tour.templates.captionBar({caption: caption}).content);
    return this;
  };

  app.hideCaption = function() {
    $('.tour-caption-bar').fadeOut();
    return this;
  };

  app.hide = function() {
    this.hideCaption();
    this.hideOverlay();
  };

  app.playAudio = function(url) {
    // Stop audio for previous event
    if (audio) {
      audio.stop();
    }

    audio = new Audio(url);
    audio.play();
    return this;
  };

  app.pauseAudio = function() {
    if (audio) {
      audio.pause();
    }
  };

  app.previous = function() {

  };

  app.next = function() {

  };


  app.destroy = function() {

  };

  // Append app to window.Tour
  if (typeof window.Tour === 'undefined') {
    window.Tour = app;
  } else {
    for (var key in app) {
      if (app.hasOwnProperty(key)) {
        window.Tour[key] = app[key];
      }
    }
  }
}(window, jQuery));
