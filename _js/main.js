const $ = require('jquery');
require('./libs/vanilla.idle.min');

(() => {
  const app = {
    init: () => {
      app.imgHelper();
      app.panelFocus();
      app.idle();
      app.headerPositioner();
      app.resizeBinder();
    },
    ele: {
      navigation: $('.navigation'),
      imageGrid: $('#image-grid'),
      metaImageItem: $('[data-metaimage]'),
    },
    makeNewPosition: () => {
      // Get viewport dimensions (remove the dimension of the div)
      const h = window.innerHeight;
      const w = window.innerWidth;
      const nh = Math.floor(Math.random() * h) / h * 100;
      const nw = Math.floor(Math.random() * w) / w * 100;
      return [nh, nw];
    },
    headerPositioner: () => {
      console.log('asd');
      const targetHeaderPos = $('.edition-current .heading-one').position();
      $('.section-panel .header').css('paddingTop', targetHeaderPos.top);
    },
    panelFocus: () => {
      $('.panel').on('click', (ele) => {
        if ($(ele.currentTarget).hasClass('edition-current')) {
          $('.panel').removeClass('panel-focus');
        } else if ($(ele.currentTarget).hasClass('info')) {
          $('.info').addClass('panel-focus');
        } else if ($(ele.currentTarget).hasClass('edition-first')) {
          $('.edition-first').addClass('panel-focus');
          $('.info').removeClass('panel-focus');
        }
      });

      $(document).keydown((e) => {
        if (e.keyCode === 27) {
          $('.panel').removeClass('panel-focus');
        }
      });
    },
    idlerHappenings: () => {
      console.log('idle !');

      const pos = app.makeNewPosition();
      const randImage = Math.floor(Math.random() * 7);

      function imageEle() {
        return `<div class="idle-object" style="top:${pos[0]}%; left:${pos[1]}%">
            <img src="/img/idler/${randImage}.gif" />
          </div>`;
      }

      $('.edition-current').append(imageEle());
    },
    idle: () => {
      let idlerHappeningsTimer;

      idle({
        onIdle: () => {
          idlerHappeningsTimer = setInterval(app.idlerHappenings, 30000);
        },
        onActive: () => {
          clearInterval(idlerHappeningsTimer);
        },
        idle: 60000,
      }).start();
    },
    imgHelper: () => {
      const searchID = '017668023985580936890:l2eosepcyty';
      const searchAPIkey = 'AIzaSyDKm3GPSVDzltXsAcZTB8VeYdrL0N2ZZhc';

      function imageEle(obj) {
        const pos = app.makeNewPosition();
        return `
          <div class="image-unit" style="top:${pos[0]}%; left:${pos[1]}%">
            <img src=${obj.link} class="image-item" />
            <div class="image-item-caption">${obj.link}</div>
          </div>
        `;
      }

      function googleSearch(term) {
        const googleAPIurl = `https://www.googleapis.com/customsearch/v1?key=${searchAPIkey}&cx=${searchID}&q=${term}&alt=json&searchType=image`;

        $.get(googleAPIurl)
        .done((results) => {
          app.ele.imageGrid.append(results.items.map(imageEle));
        });
      }

      function gridPresenter(e) {
        const width = e.offsetX - e.currentTarget.offsetWidth;
        const height = e.offsetY - e.currentTarget.offsetHeight;
        const y = height / 2;
        const x = width / 2;
        app.ele.imageGrid.css({ transform: `translateY(${y}px) translateX(${x}px)` });
      }

      app.ele.metaImageItem.on('mouseenter',
        (ele) => {
          const term = $(ele.currentTarget).data('metaimage');

          googleSearch(term);

          $(ele.currentTarget).mousemove((e) => {
            requestAnimationFrame(() => {
              gridPresenter(e);
            });
          });

          app.ele.imageGrid.empty().addClass('active');
        });

      app.ele.metaImageItem.on('mouseleave',
        () => {
          app.ele.imageGrid.empty().removeClass('active');
        });
    },
    resizeBinder: () => {
      (() => {
        const throttle = (type, name, obj) => {
          obj = obj || window;
          let running = false;
          const func = () => {
            if (running) { return; }
            running = true;
            requestAnimationFrame(() => {
              obj.dispatchEvent(new CustomEvent(name));
              running = false;
            });
          };
          obj.addEventListener(type, func);
        };

        /* init - you can init any event */
        throttle('resize', 'optimizedResize');
      })();

      // handle event
      window.addEventListener('optimizedResize', () => {
        app.headerPositioner();
      });
    },
  };
  app.init();
})();
