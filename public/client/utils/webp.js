/*  ==================
    .webp Support
    Source: https://davidwalsh.name/detect-webp
    ================== */

let 
    webp = () => {
        // There may be no .webp-test
        try {
            // Get .webp-test
            const
                webpEls = document.getElementsByClassName('webp-test');

            // Support webp function
            // Look if webp can be available
            async function supportsWebp() {
                if (!self.createImageBitmap) return false;
                
                const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
                const blob = await fetch(webpData).then(r => r.blob());
                return createImageBitmap(blob).then(() => true, () => false);
            }
            
            Array.prototype.forEach.call(webpEls, async (webpEl) => {
                if(await supportsWebp()) {
                    // Add .is-webp to html tag and .webp-test
                    document.documentElement.classList.add('is-webp');
                    webpEl.classList.add('is-webp');
                }
                else {
                    // Add .is-webp to html tag and .webp-test
                    document.documentElement.classList.add('no-webp');
                    webpEl.classList.add('no-webp');
                }
            });
        } catch(e) {
            // IF window.CONF.env is development mode
            window.CONF.env === 'development' ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
        }
    }

export default webp;