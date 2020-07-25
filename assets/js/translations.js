window.localization = window.localization || {},
function(n) {
    localization.translate = {

      menu: function() {
        $('#welcome-menu').text('Welcome');
        $('#posture-menu').text('Sitting Position');
        $('#light-menu').text('Ambient Brightness');
        $('#noise-menu').text('Ambient Sound');
        $('#meme-menu').text('Meme Accessibility');

      },

      welcome: function() {
        $('#welcome .inner p').text('Improving your health with ergonomics');
      },

      init: function() {
        this.welcome();
        this.menu();
      }
    };

    n(function() {
        localization.translate.init();
    })

}(jQuery);
