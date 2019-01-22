/*  ==================
    .webp Support
    ================== */

let 
    webp = () => {
        const
            isWebp = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
            webpEl = document.getElementsByClassName('webp-test');

        if(isWebp) {
            document.documentElement.classList.add('is-webp');

            for(let i = 0, j = webpEl.length; i < j; i++) {
                webpEl[i].classList.add('is-webp');
            }
        } else {
            for(let i = 0, j = webpEl.length; i < j; i++) {
                webpEl[i].classList.add('no-webp');
            }
        }
    }

export default webp;