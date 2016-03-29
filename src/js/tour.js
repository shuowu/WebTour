(function(window, $) {
  var DEFAULT_EVENT_TIMEOUT = 3000;

  var app = {};

  var selector = null;
  var overlay = null;
  var captionContainer = null;
  var audio = null;
  var eventIndex = 0;

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

    // Handle click event outside target element
    $(document).off('click.tour');
    $(document).on('click.tour', function(event) {
      if(!$(event.target).closest(sel).length && !$(event.target).is(sel)) {
        this_.hide();
      }
    });
  };

  app.hideOverlay = function() {
    $('.tour-overlay').fadeOut();
    return this;
  };

  app.showCaption = function(caption) {
    if (!captionContainer) {
      $('body').append(Tour.templates.captionBar({caption: caption}).content);
      captionContainer = $('.tour-caption-container');
      return this;
    }

    captionContainer.find('.tour-caption').text(caption);
    return this;
  };

  app.hideCaption = function() {
    $('.tour-caption-container').fadeOut();
    return this;
  };

  app.hide = function() {
    this.hideCaption();
    this.hideOverlay();
  };

  app.playAudio = function(url) {
    if (!url) {
      return;
    }

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

  app.playEvent = function(events, index) {
    var event = events[index];
    if (!event ||
        typeof event['selector'] === 'undefined' ||
        typeof event['caption'] === 'undefined') {
      console.error('Bad tour event', event);
      return;
    }

    eventIndex = index;

    this.resizeOverlay(event['selector']);
    this.showCaption(event['caption']);
    this.playAudio(event['audio']);
  };

  app.play = function(events) {
    var this_ = this;

    if (!events || !events.length) {
      return;
    }

    for (var i = 0, ii = events.length; i < ii; i++) {
      if (i == 0) {
        this.playEvent(events, i);
      }

      (function(index) {
        setTimeout(function() {
          if (index == events.length - 1) {
            setTimeout(function() {
              this_.stop();
            }, events[index]['duration'] || DEFAULT_EVENT_TIMEOUT);
            return;
          }

          this_.playEvent(events, index + 1);
        }, events[index]['duration'] || DEFAULT_EVENT_TIMEOUT);
      })(i);
    }
  };

  app.pause = function() {
    this.pauseAudio();

    //TODO: timer function to pause and resume timeout
  };


  app.stop = function() {
    this.pause();
    this.hide();
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
