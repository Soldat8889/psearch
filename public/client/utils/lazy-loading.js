/*  ==================
    Lazy Loading (Img)
    ================== */

let
    lazyLoading = () => {
        // Get lazy load img
        const
            lazyImgs = document.getElementsByClassName('lazy-loading');

        Array.prototype.forEach.call(lazyImgs, (lazyImg) => {
            const
                lazyImgClassNames = lazyImg.className.split(' ');

            new Promise((res, rej) => {
                for(let i = 0, j = lazyImgClassNames.length; i < j; i++) {
                    // Look if there's .is-webp className
                    if(lazyImgClassNames[i] === 'is-webp') {
                        res(true);
                    } else {
                        res(false);
                    }
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

                // OK !
                window.addEventListener('scroll', (e) => {
                    if(e.pageY >= lazyImg.offsetTop - 200) {
                        lazyImg.src = lazyImgReturn;
                    }
                }, false);
            });
        });
    }

export default lazyLoading;