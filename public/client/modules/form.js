/*  ==================
   	Form
    ================== */

let 
    form = () => {
        try {
            const 
                materialInputs = document.querySelectorAll('.form-input');

            Array.prototype.forEach.call(materialInputs, (materialInput) => {
                const
                    materialLabel = materialInput.previousSibling;

                const labelStyle = state => {
                    materialLabel.setAttribute('data-state', state);

                    switch (state) {
                        case 'active':
                            materialLabel.classList.add("form-label_active");
                            break;
                        case 'none':
                            materialLabel.classList.remove("form-label_active");
                        break;

                        default:
                            materialLabel.classList.remove("form-label_active");
                            break;
                    }
                }

                materialInput.addEventListener('focus', () => {
                    labelStyle('active');
                }, false);

                materialInput.addEventListener('keyup', () => {
                    labelStyle('active');
                }, false);

                materialInput.addEventListener('blur', () => {
                    if(materialInput.value !== "") {
                        labelStyle('active');
                        return;
                    }

                    labelStyle('none');
                }, false);

                materialInput.value === "" ? labelStyle('none') : labelStyle('active');
                materialInput.value === "" ? materialInput.setAttribute('data-available', false) : materialInput.setAttribute('data-available', true);
            });
        } catch (e) {
            console.warn(e)
        }
    }

export default form;