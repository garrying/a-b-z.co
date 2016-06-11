const $ = require('jquery');

(() => {
  const app = {
    init: () => {
      app.scrollHelper();
    },
    scrollHelper: () => {
      let lastScrollY = 0;
      let ticking = false;

      const update = (event) => {
        console.log(event, lastScrollY);
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
