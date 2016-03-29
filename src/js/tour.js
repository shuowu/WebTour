;(function(window, $) {
  var app = {};

  app.initOverlay = function() {
    var this_ = this;
    $('body').append(Tour.templates.overlay().content);
    var overlayEl = $('.tour-overlay');
    overlayEl.on('click', function() {
      this_.hide();
    });
    overlayEl.fadeIn();

    return this;
  };

  app.resizeOverlay = function(selector) {

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
