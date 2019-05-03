import React              from "react";
import { renderToString } from "react-dom/server";
import Layout             from "../../../public/components/App";
import fs                 from 'fs';

// HTML Template
let htmlTemplate = (reactDom, _LANG, _CURRENT_TITLE, _CURRENT_DESCRIPTION, _CURRENT_URL, _CSS, _JS, _JS_APP) => {
    return `
        <!DOCTYPE html>
        <html 
            lang="${_LANG}"
            prefix="og: http://ogp.me/ns#"
            class="no-js"
        >
        <head>
            <title>${_CURRENT_TITLE}</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="author" content="Soldat8889|pSearch" />
            <meta name="publisher" content="Soldat8889|pSearch" />
            <meta name="reply-to" content="psearchfr@gmail.com" />
            <meta name="copyright" content="Copyright © 2018 pSearch" />
            <meta name="Identifier-URL" content="https://psearch.alwaysdata.net" />
            <meta name="description" content="${_CURRENT_DESCRIPTION} " />
            <meta name="category" content="Searching Players, Playing, Chatting" />
            <meta name="language" content="fr, en" />
            <meta name="keywords" content="players, search, play, chat" />
            <meta name="theme-color" content="#30AE60" />
            <meta name="og:title" content="${_CURRENT_TITLE}" />
            <meta name="og:description" content="${_CURRENT_DESCRIPTION}" />
            <meta name="og:locale" content="fr_FR" />
            <meta name="og:site_name" content="pSearch" />
            <meta name="og:url" content="${_CURRENT_URL}" />
            <meta name="og:type" content="website" />
            <link rel="shortcut icon" type="image/png" href="/assets/images/favicon.png" />
            <link rel="stylesheet" type="text/css" href="${_CSS}" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/solid.css" integrity="sha384-VGP9aw4WtGH/uPAOseYxZ+Vz/vaTb1ehm1bwx92Fm8dTrE+3boLfF1SpAtB1z7HW" crossorigin="anonymous" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/regular.css" integrity="sha384-4e3mPOi7K1/4SAx8aMeZqaZ1Pm4l73ZnRRquHFWzPh2Pa4PMAgZm8/WNh6ydcygU" crossorigin="anonymous" />
        </head>
        <body class="has-no-scroll">
            <div id="pageLoader" class="loader all-page-size" data-state="onload">
                <div class="loader_content">
                    <span class="loader_bubble"></span>
                    <span class="loader_bubble"></span>
                    <span class="loader_bubble"></span>
                </div>
            </div>
            <!-- Noscript tag delimiter (start) -->
            <noscript>
                <section class="page-content">
                    <section class="noscript page-part-wrapper">
                        <div class="background-overlay overlay--neutral"></div>
                        <div class="page-part-content noscript-content">
                            <h1>
                                Sorry, to use <i>pSearch </i><img src="/assets/images/favicon.png" alt="pSearch's Logo" class="noscript-icon" /> you have to enable <u>Javascript</u>.
                            </h1>
                            <div class="noscript-delimitation"></div>
                        </div>
                    </section>
                </section>
            </noscript>
            <!-- Noscript tag delimiter (end) -->
            <main class="root" id="root" data-state="onload">
                ${reactDom}
            </main>
            <div id="scrollToTop" class="scroll-to-top">
                <i class="fa fa-2x scroll-to-top_icon"></i>
            </div>
            <!-- Scripts -->
            <script type="application/javascript">
            // JS File can access window.CONF Object
            window.CONF = {env: "${process.env.NODE_ENV}"}
            // JS Control
            document.documentElement.classList.remove("no-js");
        </script>
        <script type="application/javascript" src="${_JS}"></script>
        <script type="application/javascript" src="${_JS_APP}"></script>
        <script type="application/javascript" src="https://unpkg.com/nprogress@0.2.0/nprogress.js"></script>
    </body>
    </html>
    `;
}

module.exports = (req, res, next) => {
    req.getPage = (path) => {
        const 
            JSX      = (<Layout />),
            reactDom = renderToString(JSX);

        // Template
        let Template = 
        {
            lang: 'en',
            mainCSS: '/assets/styles/main-css.css',
            mainJS: '/assets/dist/main-js.js',
            appJS: '/assets/dist/app.js'
        }

        // Get Lang
        new Promise((res, rej) => {
            if(req.cookies.lang) {
                Template.lang = req.cookies.lang;
                res(true);
            } else {
                res(true);
            }
        });

        // Get Path of files
        new Promise((res, rej) => {
            fs.readFile('public/dist/manifest.json', 'utf-8', (e, data) => {
                if(e) { 
                    process.env.NODE_ENV == 'development' ? console.warn('DEVELOPMENT =>' + e) : false;
                    rej(false);
                }

                if(e || process.env.NODE_ENV !== 'development') {
                    Template.mainCSS = JSON.parse(data)['main-css.css'];
                    Template.mainJS  = JSON.parse(data)['main-js.js'];
                    Template.appJS   = JSON.parse(data)['app.js'];
                }

                res(true);
            });
        });

        fs.readFile(`public/config/config-${req.cookies.lang}.json`, 'utf-8', (err, data) => {
            if(err) {
                // REDIRECT
                res.redirect('/lang-select');
                return;
            }
            
            Template.title       = JSON.parse(data)['title'][path];
            Template.description = JSON.parse(data)['description'][path];        
        });

        return htmlTemplate(reactDom, Template.lang, Template.title, Template.description, `${req.protocol}://${req.get('host')}${req.originalUrl}`, Template.mainCSS, Template.mainJS, Template.appJS);
    }

	next();
};