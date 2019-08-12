/*  ==================
    Alert
    ================== */

function alert () {
    try {
        const 
            alertDeleteButton = document.getElementById("flash_delete");
    
        alertDeleteButton.addEventListener("click", () => {
            alertDeleteButton.parentNode.parentNode.classList.add("is-hidden");
        }, false);
    } catch(e) {}
}

export default alert;
