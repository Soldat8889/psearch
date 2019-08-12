/*  ==================
    Navigator isOnline
    ================== */

const onLine = () => {
    setInterval(() => {
        if(!navigator.onLine) {
            console.log("Navigator is not online.");
        }
    }, 10000);
};

export default onLine;
