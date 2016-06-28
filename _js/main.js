const $ = require('jquery');
window.jQuery = window.$ = $;
require('./waypoints');
require('./inview');

(() => {
  const app = {
    init: () => {
      app.scrollHelper();
      app.imgHelper();
    },
    ele: {
      navigation: $('.navigation'),
      imageGrid: $('#image-grid'),
      metaImageItem: $('[data-metaimage]'),
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
          app.ele.imageGrid.append(results.items.map(imageEle));
        });
      }

      app.ele.metaImageItem.on('mouseenter',
        (ele) => {
          const term = $(ele.currentTarget).data('metaimage');
          googleSearch(term);

          $(ele.currentTarget).mousemove(e => {
            const width = e.currentTarget.offsetWidth;
            const height = e.currentTarget.offsetHeight;
            const y = e.offsetY - height / 2;
            const x = e.offsetX - width / 2;
            app.ele.imageGrid.css({ transform: `translateY(${y}px) translateX(${x}px)` });
          });

          app.ele.imageGrid.empty().addClass('active');
        });

      app.ele.metaImageItem.on('mouseleave',
        () => {
          app.ele.imageGrid.empty().removeClass('active');
        });
    },
    scrollHelper: () => {
      const inview = new Waypoint.Inview({
        element: $('.header'),
        enter: () => {
          $('.header').removeClass('fixed');
        },
        exited: () => {
          $('.header').addClass('fixed');
        },
      });
    },

  };
  app.init();
})();
