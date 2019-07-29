/*  ==================
    getOffsetPostion
    https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    Thanks meouw
    ================== */

let getOffsetPosition = (el) => {
    let _x = 0;
    let _y = 0;
    
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

export default getOffsetPosition;