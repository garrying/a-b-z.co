const $ = require('jquery');
window.jQuery = window.$ = $;
require('./intent');

(() => {
  const app = {
    init: () => {
      app.scrollHelper();
      app.imgHelper();
    },
    ele: {
      navigation: $('.navigation'),
      imageGrid: $('#image-grid'),
    },
    imgHelper: () => {
      const searchID = '017668023985580936890:l2eosepcyty';
      const searchAPIkey = 'AIzaSyDKm3GPSVDzltXsAcZTB8VeYdrL0N2ZZhc';

      function makeNewPosition() {
        // Get viewport dimensions (remove the dimension of the div)
        const h = $(window).height();
        const w = $(window).width();
        const nh = Math.floor(Math.random() * h) / h * 100;
        const nw = Math.floor(Math.random() * w) / w * 100;
        return [nh, nw];
      }

      function imageEle(obj) {
        const pos = makeNewPosition();
        return `
          <div class="image-unit" style="top:${pos[0]}%; left:${pos[1]}%">
            <img src=${obj.link} class="image-item" />
            <div class="image-item-caption">${obj.link}</div>
          </div>
        `;
      }

      function googleSearch(term) {
        const googleAPIurl = `https://www.googleapis.com/customsearch/v1?key=${searchAPIkey}&cx=${searchID}&q=${term}&alt=json&searchType=image`;
        // const googleAPIurl = './js/data.json';

        $.get(googleAPIurl)
        .done((results) => {
          app.ele.imageGrid.empty().append(results.items.map(imageEle)).addClass('active');
        });
      }

      $('[data-metaimage]').hoverIntent(
        (ele) => {
          const term = $(ele.currentTarget).data('metaimage');
          googleSearch(term);
        },
        () => {
          app.ele.imageGrid.removeClass('active');
        }
      );
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
