export function startTextTypingAnimation(text, speed, getCharFunc, setCharFunc, callback, ) {

    const printText = (text) => {
        let index = 0;

        const printLoop = () => {
            setTimeout(() => {
                if (index < text.length) {
                    const char = text[index++];
                    setCharFunc(getCharFunc() + char);
                    printLoop();
                } else {
                    callback();
                }
            }, Math.random() * speed * 1000 + 25);
        }

        printLoop();
    }

    printText(text);

}

export function clearTextTypingAnimation(speed, getCharFunc, setCharFunc ,callback) {
    const clearLoop = () => {
        setTimeout(() => {
            if (getCharFunc() !== '') {
                setCharFunc(getCharFunc().slice(0,-1));
                clearLoop();
            } else {
                callback();
            }
        }, Math.random() * speed * 1000);
    }

    clearLoop();
}