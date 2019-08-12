/*  ==================
    Parallax Effect
    ================== */

const parallax = (element, distance, speed, index) => {
	const item = document.querySelector(element);
	item.style.transform = `translateY(${distance * speed}px)`;
    item.style.zIndex = `${index}`;
};

export default parallax;
