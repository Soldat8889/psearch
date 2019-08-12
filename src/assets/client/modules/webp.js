/*  ==================
    .webp Support
    Source: https://davidwalsh.name/detect-webp
    ================== */

// Get .webp-test
const webpEls = document.getElementsByClassName("webp-test");
const userAgentEncode = encodeURIComponent(`${navigator.userAgent}`.replace(/(;)\w*/g, "_"));

async function getCookie (cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) === " ") {
            c = c.substring(1);
        }

        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    return null;
}

async function eraseCookie (name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}

// Support webp function
// Look if webp can be available
async function supportsWebp () {
    const webpData = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";

    if (!self.createImageBitmap) return false;
    if (await getCookie("webpSupport") && await getCookie("userAgent")) {
        // Look the version of User"s browser
        if (encodeURIComponent(await getCookie("userAgent")) !== userAgentEncode) {
            await eraseCookie("userAgent");
            await eraseCookie("webpSupport");
            return createImageBitmap(await fetch(webpData).then(r => r.blob())).then(() => true, () => false);
        } else {
            return true;
        }
    } else {
        return createImageBitmap(await fetch(webpData).then(r => r.blob())).then(() => true, () => false);
    }
}

// Adding cookie to remember the decision
async function supportsWebpControl (value) {
    const date = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const expiresDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear() + 1} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT`;

    document.cookie = `webpSupport=${value}; Expires=${expiresDate}; Path=/;`;
    document.cookie = `userAgent=${userAgentEncode}; Expires=${expiresDate}; Path=/;`;
}

const webp = () => {
    // There may be no .webp-test
    try {
        if (supportsWebp()) {
            Array.prototype.forEach.call(webpEls, async (webpEl) => {
                // Add .is-webp to html tag and .webp-test
                document.documentElement.classList.add("is-webp");
                webpEl.classList.add("is-webp");

                // Add cookie to remember the decision
                if (!await getCookie("webpSupport") || !await getCookie("userAgent")) {
                    await supportsWebpControl(true);
                }
            });
        } else {
            Array.prototype.forEach.call(webpEls, async (webpEl) => {
                // Add .is-webp to html tag and .webp-test
                document.documentElement.classList.add("no-webp");
                webpEl.classList.add("no-webp");

                // Add cookie to remember the decision
                if (!await getCookie("webpSupport") || !await getCookie("userAgent")) {
                    await supportsWebpControl(false);
                }
            });
        }
    } catch (e) {
        // IF window.CONF.env is development mode
        // eslint-disable-next-line no-unused-expressions
        window.CONF.env === "development" && console.warn(`DEVELOPMENT MODE => ${e}`);
    }
};

export default webp;
