/*  ==================
    Lazy Loading (Img)
    ================== */

let
    lazyLoading = () => {
        try {
            const
                lazyLoader = document.querySelectorAll('[data-lazy-loading]');
    
            for(let i = 0, j = lazyLoader.length; i < j; i++) {
                window.addEventListener('scroll', (e) => {
                    if(e.pageY >= lazyLoader[i].offsetTop - lazyLoader[i].height * 2) {
                        lazyLoader[i].setAttribute('src', lazyLoader[i].getAttribute('data-lazy-loading'));
                        lazyLoader[i].setAttribute('data-spawned', 'true');
                    }
                }, false);
            }
        } catch(e) {}
    }

export default lazyLoading;