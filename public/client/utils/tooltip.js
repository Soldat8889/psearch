/*  ==================
    Tooltip
    ================== */

let 
    tooltip = () => {
        try {
            const
                tooltips = document.querySelectorAll('[data-tooltip]');
    
            for(let i = 0, j = tooltips.length; i < j; i++) {
                tooltips[i].addEventListener('mouseover', (e) => {
                    let 
                        targetClasses = [].slice.call(e.target.classList);
    
                    if(targetClasses.indexOf('tooltip_inner') !== -1 || targetClasses.indexOf('tooltip') !== -1) {
                        return;
                    }
    
                    let 
                        current = e.target,
                        posY = current.offsetTop,
                        posX = current.offsetLeft,
                        targWi = current.offsetWidth,
                        tooltipBubbleWrapper = document.createElement('div'),
                        tooltipBubbleInner = document.createElement('span'),
                        tooltipBubbleContent = current.getAttribute('data-tooltip'),
                        tooltipBubbleTheme = current.getAttribute('data-tooltip-theme');
    
                    tooltipBubbleWrapper.className = 'tooltip box-wrapper';
                    tooltipBubbleWrapper.style.top = `${posY - 60}px`;
                    tooltipBubbleWrapper.style.left = `${posX + targWi / 2}px`;
    
                    tooltipBubbleInner.className = `tooltip_inner tooltip--${tooltipBubbleTheme} box-inner text`;
                    tooltipBubbleInner.innerHTML = tooltipBubbleContent;
    
                    current.appendChild(tooltipBubbleWrapper);
                    tooltipBubbleWrapper.appendChild(tooltipBubbleInner);
                }, false);
                tooltips[i].addEventListener('mouseleave', (e) => {
                    let
                        tooltipsBubble = document.getElementsByClassName('tooltip');
    
                    for (let i = 0, j = tooltipsBubble.length; i < j; i++) {
                        for(let k = 0, l = tooltips.length; k < l; k++) {
                            if(tooltips[k].hasChildNodes()) {
                                try { tooltips[k].removeChild(tooltipsBubble[i]); }
                                catch(e) {}
                            }
                        }
                    }
                }, false);
            }
        } catch(e) {}
    }

export default tooltip;