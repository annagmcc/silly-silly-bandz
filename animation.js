//memes?

document.documentElement.className = "js";

const supportsCssVars = window.CSS?.supports?.("font-weight", "var(--tmp-var)") ?? false;
if (!supportsCssVars) {
  alert("Please view this demo in a modern browser that supports CSS Variables.");
}

const gallery = document.getElementById("gallery");

if (gallery) {
  let mouseX = 0;
  let mouseY = 0;
  let positionX = 0;
  let positionY = 0;

  window.addEventListener("mousemove", event => {
    mouseX = event.clientX / window.innerWidth;
    mouseY = event.clientY / window.innerHeight;
  });

  function moveGallery() {
    const maxX = Math.max(0, gallery.offsetWidth - window.innerWidth);
    const maxY = Math.max(0, gallery.offsetHeight - window.innerHeight);
    const targetX = -maxX * mouseX;
    const targetY = -maxY * mouseY;

    positionX += (targetX - positionX) * 0.08;
    positionY += (targetY - positionY) * 0.08;
    gallery.style.transform = `translate3d(${positionX}px, ${positionY}px, 0)`;

    requestAnimationFrame(moveGallery);
  }

  requestAnimationFrame(moveGallery);
}



// kevin

const bubbleBox = document.getElementById("bubbleBox");

if (bubbleBox) {
  const imagePaths = [
    "aqua", "blue", "dark blue", "green", "lime green", "magenta",
    "orange", "pink", "purple", "red", "yellow"
  ].map(color => `images/kevin/${color} kevin.PNG`);
  const imageSize = 432;
  const images = imagePaths.map(src => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = "";
    image.draggable = false;
    image.className = "kevin-bouncer";
    image.addEventListener("error", () => {
      console.error(`Could not load Kevin image: ${src}`);
    });
    bubbleBox.appendChild(image);

    return {
      element: image,
      x: 0,
      y: 0,
      velocityX: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.8),
      velocityY: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.8)
    };
  });

  function positionImages() {
    const maxX = Math.max(0, bubbleBox.clientWidth - imageSize);
    const maxY = Math.max(0, bubbleBox.clientHeight - imageSize);

    for (const image of images) {
      image.x = Math.min(image.x, maxX);
      image.y = Math.min(image.y, maxY);
      image.element.style.left = `${image.x}px`;
      image.element.style.top = `${image.y}px`;
    }
  }

  for (const image of images) {
    image.x = Math.random() * Math.max(0, bubbleBox.clientWidth - imageSize);
    image.y = Math.random() * Math.max(0, bubbleBox.clientHeight - imageSize);
  }
  positionImages();
  window.addEventListener("resize", positionImages);

  let previousTime = 0;
  function bounceImages(time) {
    const delta = previousTime ? Math.min((time - previousTime) / 16.67, 2) : 1;
    previousTime = time;
    const maxX = Math.max(0, bubbleBox.clientWidth - imageSize);
    const maxY = Math.max(0, bubbleBox.clientHeight - imageSize);

    for (const image of images) {
      image.x += image.velocityX * delta;
      image.y += image.velocityY * delta;

      if (image.x <= 0 || image.x >= maxX) {
        image.x = Math.max(0, Math.min(image.x, maxX));
        image.velocityX *= -1;
      }
      if (image.y <= 0 || image.y >= maxY) {
        image.y = Math.max(0, Math.min(image.y, maxY));
        image.velocityY *= -1;
      }

      image.element.style.left = `${image.x}px`;
      image.element.style.top = `${image.y}px`;
    }

    requestAnimationFrame(bounceImages);
  }

  requestAnimationFrame(bounceImages);
}




//scribbles


// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    // enable autoScroll
    autoScroll: true,

    listeners: {
      // call this function on every dragmove event
      move: dragMoveListener,

      // call this function on every dragend event
      end (event) {
        var textEl = event.target.querySelector('p')

        textEl && (textEl.textContent =
          'moved a distance of ' +
          (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                     Math.pow(event.pageY - event.y0, 2) | 0))
            .toFixed(2) + 'px')
      }
    }
  })

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener





//resizing

interact('.resize-drag')
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        var target = event.target
        var x = (parseFloat(target.getAttribute('data-x')) || 0)
        var y = (parseFloat(target.getAttribute('data-y')) || 0)

        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 100, height: 50 }
      })
    ],

    inertia: true
  })
  .draggable({
    listeners: { move: window.dragMoveListener },
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ]
  })


  //home page slider//

  const left = document.getElementById("left-side");

const handleMove = e => {
  left.style.width = `${e.clientX / window.innerWidth * 100}%`;
}

document.onmousemove = e => handleMove(e);

document.ontouchmove = e => handleMove(e.touches[0]);




// image trail cursor //

{
    // body element
    const body = document.body;

    // helper functions
    const MathUtils = {
        // linear interpolation
        lerp: (a, b, n) => (1 - n) * a + n * b,
        // distance between two points
        distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
    }

    // get the mouse position
    const getMousePos = (ev) => {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        } else if (ev.clientX || ev.clientY) {
            posx = ev.clientX + body.scrollLeft + document.documentElement.scrollLeft;
            posy = ev.clientY + body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posx, y: posy };
    }

    // mousePos: current mouse position
    // cacheMousePos: previous mouse position
    // lastMousePos: last last recorded mouse position (at the time the last image was shown)
    let mousePos = lastMousePos = cacheMousePos = { x: 0, y: 0 };

    // update the mouse position
    window.addEventListener('mousemove', ev => mousePos = getMousePos(ev));

    // gets the distance from the current mouse position to the last recorded mouse position
    const getMouseDistance = () => MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);

    class Image {
        constructor(el) {
            this.DOM = { el: el };
            // image default styles
            this.defaultStyle = {
                x: 0,
                y: 0,
                opacity: 0
            };
            // get sizes/position
            this.getRect();
            // init/bind events
            this.initEvents();
        }
        initEvents() {
            // on resize get updated sizes/position
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // reset styles
            gsap.set(this.DOM.el, this.defaultStyle);
            // get sizes/position
            this.getRect();
        }
        getRect() {
            this.rect = this.DOM.el.getBoundingClientRect();
        }
        isActive() {
            // check if image is animating or if it's visible
            return gsap.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
        }
    }

    class ImageTrail {
        constructor() {
            // images container
            this.DOM = { content: document.querySelector('.content') };
            // array of Image objs, one per image element
            this.images = [];
            [...this.DOM.content.querySelectorAll('img')].forEach(img => this.images.push(new Image(img)));
            // total number of images
            this.imagesTotal = this.images.length;
            // upcoming image index
            this.imgPosition = 0;
            // zIndex value to apply to the upcoming image
            this.zIndexVal = 1;
            // mouse distance required to show the next image
            this.threshold = 100;
            // render the images
            requestAnimationFrame(() => this.render());
        }
        render() {
            // get distance between the current mouse position and the position of the previous image
            let distance = getMouseDistance();
            // cache previous mouse position
            cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
            cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

            // if the mouse moved more than [this.threshold] then show the next image
            if (distance > this.threshold) {
                this.showNextImage();

                ++this.zIndexVal;
                this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

                lastMousePos = mousePos;
            }

            // check when mousemove stops and all images are inactive (not visible and not animating)
            let isIdle = true;
            for (let img of this.images) {
                if (img.isActive()) {
                    isIdle = false;
                    break;
                }
            }
            // reset z-index initial value
            if (isIdle && this.zIndexVal !== 1) {
                this.zIndexVal = 1;
            }

            // loop..
            requestAnimationFrame(() => this.render());
        }
        showNextImage() {
            // show image at position [this.imgPosition]
            const img = this.images[this.imgPosition];
            // kill any tween on the image
            gsap.killTweensOf(img.DOM.el);

            gsap.timeline()
                // show the image
                .set(img.DOM.el, {
                    startAt: { opacity: 0 },
                    opacity: 1,
                    scale: 1,
                    zIndex: this.zIndexVal,
                    x: cacheMousePos.x - img.rect.width / 2,
                    y: cacheMousePos.y - img.rect.height / 2,
                    yPercent: 0,
                }, 0)
                // animate position
                .to(img.DOM.el, {
                    duration: 1.8,
                    ease: 'expo.out',
                    x: mousePos.x - img.rect.width / 2,
                    y: mousePos.y - img.rect.height / 2
                }, 0)
                // then make it disappear
                .to(img.DOM.el, {
                    duration: 1.8,
                    ease: 'power2.in',
                    yPercent: 100,
                    opacity: 0
                }, 0.8);
            // scale down the image
            /*.to(img.DOM.el, 0.8, {
                ease: Quint.easeInOut,
                scale: 2
            }, 0.8);*/
        }
    }

    /***********************************/
    /********** Preload stuff **********/

    // Preload images
    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('.content__img'), resolve);
        });
    };

    // And then..
    preloadImages().then(() => {
        // Remove the loader
        document.body.classList.remove('loading');
        new ImageTrail();
    });
}