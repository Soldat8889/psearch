/*  ==================
    .webp Support
    ================== */

let 
    webp = () => {
        const
            isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
            webpEl = document.getElementsByClassName('chrome-test');

        if(isChrome) {
            document.documentElement.classList.add('is-chrome');

            for(let i = 0, j = webpEl.length; i < j; i++) {
                webpEl[i].classList.add('is-chrome');
            }
        } else {
            for(let i = 0, j = webpEl.length; i < j; i++) {
                webpEl[i].classList.add('no-chrome');
            }
        }
    }

export default webp;