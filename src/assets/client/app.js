import webp        from './modules/webp';
import lazyLoading from './modules/lazy-loading';
import onLine      from './modules/onLine';
import flash       from './modules/flash';
import tooltip     from './modules/tooltip';

/*  ==================
   	Initialializing
    ================== */
const 
    root        = document.getElementById('root'),
    loader      = document.getElementById('pageLoader'),
    scrollToTop = document.getElementById('scrollToTop');

const
    btnsStylized = document.getElementsByClassName('button');

// FUNCTIONS
function onScroll() {
    if(window.pageYOffset >= 400) {
        scrollToTop.classList.add('is-visible');
    } else {
        scrollToTop.classList.remove('is-visible');
    }
}

loader.setAttribute('data-state', 'loaded');
root.setAttribute('data-state', 'loaded');
document.body.classList.remove('has-no-scroll');

// EVENTS
window.addEventListener('scroll', onScroll, false);
scrollToTop.addEventListener('click', () => {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    });
}, false);

Array.prototype.forEach.call(btnsStylized, (btnStylized) => {
    let
        color = getComputedStyle(btnStylized, null).getPropertyValue("border-top-color");

    btnStylized.addEventListener('mouseover', (e) => {
        e.currentTarget.style.backgroundColor = `${color}`;
    }, false);

    btnStylized.addEventListener('mouseout', (e) => {
        e.currentTarget.style.backgroundColor = '';
    }, false);
});

// INITIALISATION
onScroll();

// Apply
webp();
onLine();
flash();
tooltip();
lazyLoading();