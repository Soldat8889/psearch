/*  ==================
    Tooltip
    ================== */

const tooltip = () => {
    try {
        const tooltips = document.querySelectorAll("[data-tooltip]");

        for (let i = 0, j = tooltips.length; i < j; i++) {
            tooltips[i].addEventListener("mouseover", (e) => {
                const targetClasses = [].slice.call(e.target.classList);

                if (targetClasses.indexOf("tooltip_inner") !== -1 || targetClasses.indexOf("tooltip") !== -1) {
                    return;
                }

                const current = tooltips[i];
                const posY = current.offsetTop;
                const posX = current.offsetLeft;
                const targWi = current.offsetWidth;
                const tooltipBubbleWrapper = document.createElement("div");
                const tooltipBubbleInner = document.createElement("span");
                const tooltipBubbleContent = current.getAttribute("data-tooltip");
                const tooltipBubbleTheme = current.getAttribute("data-tooltip-theme");

                tooltipBubbleWrapper.className = "tooltip box-wrapper";
                tooltipBubbleWrapper.style.top = `${posY - 60}px`;
                tooltipBubbleWrapper.style.left = `${posX + targWi / 2}px`;

                tooltipBubbleInner.className = `tooltip_inner tooltip--${tooltipBubbleTheme} box-inner text`;
                tooltipBubbleInner.innerHTML = tooltipBubbleContent;

                current.appendChild(tooltipBubbleWrapper);
                tooltipBubbleWrapper.appendChild(tooltipBubbleInner);
            }, false);

            tooltips[i].addEventListener("mouseleave", () => {
                const
                    tooltipsBubble = document.getElementsByClassName("tooltip");

                for (let i = 0, j = tooltipsBubble.length; i < j; i++) {
                    for (let k = 0, l = tooltips.length; k < l; k++) {
                        if (tooltips[k].hasChildNodes()) {
                            try { tooltips[k].removeChild(tooltipsBubble[i]); } catch (e) {}
                        }
                    }
                }
            }, false);
        }
    } catch (e) {}
};

export default tooltip;
