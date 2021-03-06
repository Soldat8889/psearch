/*  ==================
    Lazy Loading (Img)
    ================== */

let
    lazyLoading = () => {
        // There may be no .lazy-loading
        // try {
            // Get lazy load img
            const
                lazyImgs = document.getElementsByClassName('lazy-loading');

            // Get the absolute pos
            function cumulativeOffset(element) {
				var top = 0, left = 0;
				do {
					top += element.offsetTop || 0;
					left += element.offsetLeft || 0;
					element = element.offsetParent;
				} while(element);
			
				return {
					top: top,
					left: left
				};
			};

            Array.prototype.forEach.call(lazyImgs, (lazyImg) => {
                new Promise(async (res, rej) => {
                    // Search is-webp classname
                    let waitingWebp = new Promise((res, rej) => {
                        function getCookie(cname) {
                            const name = cname + "=",
                                decodedCookie = decodeURIComponent(document.cookie),
                                ca = decodedCookie.split(';');
                    
                            for(let i = 0; i < ca.length; i++) {
                                let c = ca[i];
                    
                                while(c.charAt(0) == ' ') {
                                    c = c.substring(1);
                                }
                    
                                if(c.indexOf(name) == 0) {
                                    return c.substring(name.length, c.length);
                                }
                            }
                            
                            return null;
                        }

                        res(getCookie('webpSupport'));
                    }).catch((e) => {
                        window.CONF.env === 'development' ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
                    });

                    if(await waitingWebp) {
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

                    // Look if it's compatible with .webp format
                    if(isWebp === true) {
                        lazyImgObjectProps.ext = '.webp';
                    } else {
                        lazyImgObjectProps.ext = lazyImgProperties[1];
                    }

                    lazyImgReturn = lazyImgObjectProps.src.concat(lazyImgObjectProps.ext);

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
        // } catch(e) {
            // IF window.CONF.env is development mode
            // window.CONF.env === 'development' ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
        // }
    }

export default lazyLoading;