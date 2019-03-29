/*  ==================
   	Form
    ================== */

let 
    form = () => {
        try {
            const 
                materialInputs = document.querySelectorAll('.auth-input');

            Array.prototype.forEach.call(materialInputs, (materialInput) => {
                const
                    materialLabel            = materialInput.previousSibling,
                    materialLabelActiveColor = "#26a75d";

                const labelStyle = state => {
                    materialLabel.setAttribute('data-state', state);

                    switch (state) {
                        case 'active':
                            materialLabel.style.transform = "translateY(-24px)";
                            materialLabel.style.fontSize = "1.6rem";
                            materialLabel.style.color = materialLabelActiveColor;
                            materialLabel.style.fontWeight = "600";
                            break;
                        case 'none':
                            materialLabel.style.transform = "";
                            materialLabel.style.fontSize = "";
                            materialLabel.style.color = "";
                            materialLabel.style.fontWeight = "";
                        break;

                        default:
                            materialLabel.style.transform = "";
                            materialLabel.style.fontSize = "";
                            materialLabel.style.color = "";
                            materialLabel.style.fontWeight = "";
                            break;
                    }
                }

                materialInput.addEventListener('focus', () => {
                    labelStyle('active')                    
                }, false);

                materialInput.addEventListener('blur', () => {
                    if(materialInput.value !== "") {
                        labelStyle('active')
                        return;
                    }

                    labelStyle('none')
                }, false);
            });
        } catch (e) {
            console.warn(e)
        }
    }

export default form;