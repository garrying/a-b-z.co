const $ = require('jquery');
const vhCheck = require('vh-check');
const IdleJs = require('idle-js');

const searchID = '017668023985580936890:l2eosepcyty';
const searchAPIkey = 'AIzaSyDJuy-kp0l0J5eyExT3rdr68dpx11pJlz8';
let idleCounter = 5;
let intervalID;

(() => {
  const app = {
    init: () => {
      app.imgHelper();
      app.panelFocus();
      app.headerPositioner();
      app.eventBinders();
      app.vhCheck();
      app.idle();
    },
    ele: {
      imageGrid: $('#image-grid'),
      metaImageItem: $('[data-metaimage]'),
      panel: $('.panel'),
      metaImageItemCurrent: $('.edition-current [data-metaimage]'),
    },
    panelGAevents: (panelName) => {
      ga('send', 'event', 'Panels', 'Opened', panelName);
    },
    idle: () => {
      const idle = new IdleJs({
        idle: 30000,
        events: ['mousemove', 'keydown', 'mousedown', 'touchstart'],
        onIdle: () => {
          intervalID = window.setInterval(app.idleImageGrid, 20000);
        },
        onActive: () => {
          idleCounter = 5;
          clearInterval(intervalID);
          app.ele.imageGrid.empty().removeClass('active');
        },
        keepTracking: true,
        startAtIdle: false,
      }).start();
    },
    idleImageGrid: () => {
      const rand = Math.floor(Math.random() * app.ele.metaImageItemCurrent.length);
      const searchItem = app.ele.metaImageItemCurrent[rand];
      idleCounter--;
      if (idleCounter >= 0) {
        app.imgHelperGoogleSearch($(searchItem).data('metaimage'));
        app.ele.imageGrid.removeAttr('style').addClass('active');
      } else {
        clearInterval(intervalID);
      }
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
      const targetHeaderPos = $('.edition-current .heading-one').offset();
      const pairedHeaders = $('.section-panel .header');
      if (window.matchMedia('(max-width: 568px)').matches) {
        pairedHeaders.removeAttr('style');
      } else {
        pairedHeaders.css('paddingTop', targetHeaderPos.top);
      }
    },
    panelFocus: () => {
      app.ele.panel.on('click', (ele) => {
        $(ele.currentTarget).addClass('panel-focus').attr('aria-hidden', 'false');
        $('.editions-container .panel').not(ele.currentTarget).removeClass('panel-focus').attr('aria-hidden', 'true');

        if ($(ele.currentTarget).hasClass('info')) {
          $('.info').addClass('panel-focus').attr('aria-hidden', 'false');
          app.panelGAevents('Info');
        } else {
          app.panelGAevents('Edition Panel');
        }

        if (window.matchMedia('(max-width: 568px)').matches) {
          $('.panel, .info').scrollTop(0);
        }
      });

      $(document).keydown((e) => {
        if (e.keyCode === 27) {
          app.ele.panel.removeClass('panel-focus');
        }
      });
    },
    imgHelperGoogleSearch: (term) => {
      const googleAPIurl = `https://www.googleapis.com/customsearch/v1?key=${searchAPIkey}&cx=${searchID}&q=${term}&alt=json&searchType=image`;

      function imageEle(obj) {
        const pos = app.makeNewPosition();
        return `
          <div class="image-unit" style="top:${pos[0]}%; left:${pos[1]}%">
            <img src=${obj.link} class="image-item" />
            <div class="image-item-caption">${obj.link}</div>
          </div>
        `;
      }

      $.get(googleAPIurl)
        .done((results) => {
          app.ele.imageGrid.append(results.items.map(imageEle));
        });
    },
    imgHelper: () => {
      function gridPresenter(e) {
        const width = e.offsetX - e.currentTarget.offsetWidth;
        const height = e.offsetY - e.currentTarget.offsetHeight;
        const y = height / 2;
        const x = width / 2;
        app.ele.imageGrid.css({ transform: `translateY(${y}px) translateX(${x}px)` });
      }

      app.ele.metaImageItem.on(
        'mouseenter',
        (ele) => {
          const term = $(ele.currentTarget).data('metaimage');

          app.imgHelperGoogleSearch(term);

          $(ele.currentTarget).mousemove((e) => {
            requestAnimationFrame(() => {
              gridPresenter(e);
            });
          });

          app.ele.imageGrid.empty().addClass('active');
        },
      );

      app.ele.metaImageItem.on(
        'mouseleave',
        () => {
          app.ele.imageGrid.empty().removeClass('active');
        },
      );
    },
    eventBinders: () => {
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

      // Window resize event
      window.addEventListener('optimizedResize', () => {
        app.headerPositioner();
      });

      // Window on load
      $(window).on('load', () => {
        app.headerPositioner();
      });

      $('.section-panel').addClass('ready');
    },
    vhCheck: () => {
      vhCheck('ios-gap');
    },
  };
  app.init();
})();
