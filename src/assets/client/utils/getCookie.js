/*  ==================
    getCookie
    ================== */

const getCookie = (cname) => {
    try {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca            = decodedCookie.split(";");

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return null;
    } catch (e) {
        // eslint-disable-next-line no-unused-expressions
        window.CONF.env == "development" && console.warn(`DEVELOPMENT MODE => ${e}`);
        return false;
    }
};

export default getCookie;
