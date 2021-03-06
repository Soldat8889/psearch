/*  ==================
    getCookie
    ================== */

let getCookie = (cname) => {
    try {
        const 
            name          = cname + "=",
            decodedCookie = decodeURIComponent(document.cookie),
            ca            = decodedCookie.split(';');

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
    } catch (e) {
        window.CONF.env == "development" ? console.warn(`DEVELOPMENT MODE => ${e}`) : null;
        return false;
    }
}

export default getCookie;