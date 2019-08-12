/*  ==================
    Lazy Loading (Img)
    ================== */

// Utils
import getCookie from "../utils/getCookie";
import getOffsetPosition from "../utils/getOffsetPosition";

const lazyLoading = () => {
    // There may be no .lazy-loading
    // try {
    // Get lazy load img
    const lazyImgs = document.getElementsByClassName("lazy-loading");

    Array.prototype.forEach.call(lazyImgs, (lazyImg) => {
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (res) => {
            // Search is-webp classname
            const waitingWebp = new Promise((res) => {
                res(getCookie("webpSupport"));
            }).catch((e) => {
                window.CONF.env === "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
            });

            if (await waitingWebp) {
                res(true);
            } else {
                res(false);
            }
        }).then((isWebp) => {
            const lazyImgProperties  = lazyImg.getAttribute("data-lazy-loading").split(" ");
            const lazyImgObjectProps = {};

            let lazyImgReturn;

            /**
             * [0]: Img SRC
             * [1]: Img no .webp format, alternative format
             **/

            // Stock in lazyImgObjectProps
            lazyImgObjectProps.src = lazyImgProperties[0];

            // Look if it"s compatible with .webp format
            if(isWebp === true) {
                lazyImgObjectProps.ext = ".webp";
            } else {
                lazyImgObjectProps.ext = lazyImgProperties[1];
            }

            lazyImgReturn = lazyImgObjectProps.src.concat(lazyImgObjectProps.ext);

            function lazyLoadingScroll() {
                if(window.pageYOffset >= getOffsetPosition(lazyImg).top - lazyImg.height - window.innerHeight * 1.75) {
                    if(!lazyImg.getAttribute("data-background")) lazyImg.src = lazyImgReturn;

                    lazyImg.classList.remove("lazy-loading");
                    lazyImg.removeAttribute("data-lazy-loading");

                    window.removeEventListener("scroll", lazyLoadingScroll, false);
                }
            }

            if(!lazyImg.getAttribute("data-background")) {
                // OK !
                window.addEventListener("scroll", lazyLoadingScroll, false);
                lazyLoadingScroll();
            } else {
                lazyImg.style.backgroundImage = `url("${lazyImgReturn}")`;
            }
        }).catch(e => {
            // IF window.CONF.env is development mode
            window.CONF.env === "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
        });
    });
};
        
export default lazyLoading;
