/*  ==================
    Lazy Loading (Img)
    ================== */

let
    lazyLoading = () => {
        // There may be no .lazy-loading
        try {
            // Get lazy load img
            const
                lazyImgs = document.getElementsByClassName('lazy-loading');

            // Get the absolute pos
            function cumulativeOffset(element) {
				var top = 0, left = 0;
				do {
					top += element.offsetTop  || 0;
					left += element.offsetLeft || 0;
					element = element.offsetParent;
				} while(element);
			
				return {
					top: top,
					left: left
				};
			};

            Array.prototype.forEach.call(lazyImgs, (lazyImg) => {
                new Promise((res, rej) => {
                    // Search is-webp classname
                    if(/(is-webp)\w*/.test(lazyImg.className)) {
                        res(true);
                    } else {
                        res(false);
                    }
                })
                .then((isWebp) => {
                    const
                        lazyImgProperties  = lazyImg.getAttribute('data-lazy-loading').split(' '),
                        lazyImgObjectProps = {};

                    let lazyImgReturn;

                    /**
                     * [0]: Img SRC
                     * [1]: Img no .webp format, alternative format
                     **/

                    // Stock in lazyImgObjectProps
                    lazyImgObjectProps.src = lazyImgProperties[0];
                    lazyImgObjectProps.ext = lazyImgProperties[1];

                    // Look if it's compatible with .webp format
                    if(isWebp) {
                        lazyImgReturn = lazyImgObjectProps.src.concat('.webp');
                    } else {
                        lazyImgReturn = lazyImgObjectProps.src.concat(lazyImgObjectProps.ext);
                    }

                    async function lazyLoadingScroll() {
                        if(window.pageYOffset >= cumulativeOffset(lazyImg).top - lazyImg.height - window.innerHeight * 1.75) {
                            lazyImg.src = lazyImgReturn;
                            lazyImg.classList.remove('lazy-loading');
                            lazyImg.removeAttribute('data-lazy-loading');

                            window.removeEventListener('scroll', lazyLoadingScroll, false);
                        }
                    }

                    // OK !
                    window.addEventListener('scroll', lazyLoadingScroll, false);
                    lazyLoadingScroll();
                });
            });
        } catch(e) {
            // IF window.CONF.env is development mode
            window.CONF.env === 'development' ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
        }
    }

export default lazyLoading;