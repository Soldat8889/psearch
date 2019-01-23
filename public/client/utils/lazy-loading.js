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

                    function lazyLoadingScroll() {
                        if(window.pageYOffset >= lazyImg.offsetTop - 200) {
                            lazyImg.src = lazyImgReturn;
                            lazyImg.classList.remove('lazy-loading');
                            lazyImg.removeAttribute('data-lazy-loading');

                            window.removeEventListener('scroll', lazyLoadingScroll, false);
                        }
                    }

                    // OK !
                    window.addEventListener('scroll', lazyLoadingScroll, false);
                });
            });
        } catch(e) {
            // IF window.CONF.env is development mode
            window.CONF.env === 'development' ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
        }
    }

export default lazyLoading;