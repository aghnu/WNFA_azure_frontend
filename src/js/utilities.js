export function createHTMLElement(tag, innerHTML="", attributes={}) {
    const el = document.createElement(tag);
    el.innerHTML = innerHTML;
    for (let att in attributes) {
        el.setAttribute(att, attributes[att]);
    }
    return el;
}

export function setRandInterval (func, min, max) {
    let currentTimeout;

    const runTimeout = () => {
        currentTimeout = setTimeout(() => {
            func();
            runTimeout();
        }, Math.floor(Math.random() * (max - min + 1)) + min);
    }

    runTimeout();

    return {
        clear: () => {
            clearTimeout(currentTimeout);
        }
    }
}

export function flashElement(ele, callback) {
    const displayValue = ele.style.display;
    ele.style.display = "none";
    setTimeout(() => {
        ele.style.display = displayValue;
        setTimeout(() => {
            ele.style.display = "none";
                setTimeout(() => {
                    callback();
                    ele.style.display = displayValue;
                }, 50);
        }, 80);
    }, 50);
}