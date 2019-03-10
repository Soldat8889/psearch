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
                webpEls = document.getElementsByClassName('webp-test'),
                userAgentEncode = encodeURIComponent(`${navigator.userAgent}`.replace(/(\;)\w*/g, '_'));

            async function getCookie(cname) {
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

            // Support webp function
            // Look if webp can be available
            async function supportsWebp() {
                const 
                    webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

                if (!self.createImageBitmap) return false;
                if(await getCookie('webpSupport') && await getCookie('userAgent')) {
                    // Look the version of User's browser
                    if(encodeURIComponent(await getCookie('userAgent')) != userAgentEncode) {
                        return createImageBitmap(await fetch(webpData).then(r => r.blob())).then(() => true, () => false);
                    } else {
                        return true;
                    }
                } else {
                    return createImageBitmap(await fetch(webpData).then(r => r.blob())).then(() => true, () => false);
                }
            }

            // Adding cookie to remember the decision
            async function supportsWebpControl(value) {
                let date = new Date(),
					monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
					expiresDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear() + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT`;

                document.cookie = `webpSupport=${value}; Expires=${expiresDate}; Path=/;`;
                document.cookie = `userAgent=${userAgentEncode}; Expires=${expiresDate}; Path=/;`;
            }
            
            Array.prototype.forEach.call(webpEls, async (webpEl) => {
                if(await supportsWebp()) {
                    // Add .is-webp to html tag and .webp-test
                    document.documentElement.classList.add('is-webp');
                    webpEl.classList.add('is-webp');

                    // Add cookie to remember the decision
                    if(!await getCookie('webpSupport') || !await getCookie('userAgent')) {
                        await supportsWebpControl(true);
                    }
                } else {
                    // Add .is-webp to html tag and .webp-test
                    document.documentElement.classList.add('no-webp');
                    webpEl.classList.add('no-webp');

                    // Add cookie to remember the decision
                    if(!await getCookie('webpSupport') || !await getCookie('userAgent')) {
                        await supportsWebpControl(false);
                    }
                }
            });
        } catch(e) {
            // IF window.CONF.env is development mode
            window.CONF.env === 'development' ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
        }
    }

export default webp;