const $ = require('jquery');

(() => {
  const app = {
    init: () => {
      app.scrollHelper();
    },
    ele: {
      navigation: $('.navigation'),
    },
    scrollHelper: () => {
      let lastScrollY = 0;
      let ticking = false;

      const update = (event) => {
        console.log(event, lastScrollY);
        if (lastScrollY > 100) {
          app.ele.navigation.addClass('blur');
        } else {
          app.ele.navigation.removeClass('blur');
        }
        ticking = false;
      };

      const requestTick = () => {
        const scrollEvent = event;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            update(scrollEvent);
          });
          ticking = true;
        }
      };

      const onScroll = () => {
        lastScrollY = window.scrollY;
        requestTick();
      };

      $(window).on('mousewheel', onScroll);
    },

  };
  app.init();
})();
