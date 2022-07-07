import '../style/styles.scss'
import { flickeringTextEl } from './flickerText';

function addButtonBehavior(btnEl, downFunc, upFunc) {
    let buttonDown = false;

    // touch events
    btnEl.addEventListener('touchstart', (e) => {
        e.preventDefault();
        buttonDown = true;
        downFunc();
    });

    btnEl.addEventListener('touchend', (e) => {
        e.preventDefault();
        buttonDown = false;
        upFunc();
    });

    btnEl.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        buttonDown = false;
        upFunc();
    });

    // click events
    btnEl.addEventListener('mousedown', (e) => {
        e.preventDefault();
        buttonDown = true;
        downFunc();
    });

    btnEl.addEventListener('mouseup', (e) => {
        e.preventDefault();
        buttonDown = false;
        upFunc();
    });

    //global up
    document.addEventListener('mouseup', (e) => {
        if (buttonDown) {
            buttonDown = false;
            upFunc();
        }
    });
}

function startTextTypingAnimation(text, speed, getCharFunc, setCharFunc, callback, ) {

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

function clearTextTypingAnimation(speed, getCharFunc, setCharFunc ,callback) {
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


function initStructures() {
    // logo
    const first = document.querySelector('#site-structure .footer .first');
    const second = document.querySelector('#site-structure .footer .second');

    flickeringTextEl(first, 'GENGYUAN HUANG & YUAN FANG');
    flickeringTextEl(second, '@ 2022 WNFA Posters Generator');

    // console
    // const prompt = document.querySelector('#site-prompt');
    const input = document.querySelector('#site-console .input');

    const printPlaceholderTextList = [
        ['Type into this area to write a poem,\nthen, click the TV to generate the poster.', 0.075],
        ['点击这里写一首诗，\n然后点击电视机开始生成海报。', 0.2],
        ['荷叶滴落泪水，来不及浸透书页。\n一百年一千年，点燃一片通电的网。\n\n回想回想，\n那心的铁片，\n也要发出轰响。', 0.2],
    ];

    // const printPromptTextList = [
    //     ['Click below to start writing.', 0.075],
    //     ['Click TV once to generate poster.', 0.075],
    //     ['点击这里写一首诗。', 0.2],
    // ];

    const startPlaceholderTextListLoop = () => {
        const print = printPlaceholderTextList.shift();
        printPlaceholderTextList.push(print);
        
        startTextTypingAnimation(print[0], print[1], () => input.placeholder, (char) => input.placeholder = char, () => {
            setTimeout(() => {
                clearTextTypingAnimation(0.05, () => input.placeholder, (char) => input.placeholder = char, () => {
                    setTimeout(() => {
                        startPlaceholderTextListLoop();
                    }, 2000);
                });                 
            }, 2000);
        });
    }

    // const startPromptTextListLoop = () => {
    //     const print = printPromptTextList.shift();
    //     printPromptTextList.push(print);
        
    //     startTextTypingAnimation(print[0], print[1], () => prompt.innerHTML, (char) => prompt.innerHTML = char, () => {
    //         setTimeout(() => {
    //             clearTextTypingAnimation(0.05, () => prompt.innerHTML, (char) => prompt.innerHTML = char, () => {
    //                 setTimeout(() => {
    //                     startPromptTextListLoop();
    //                 }, 2000);
    //             });                 
    //         }, 2000);
    //     });
    // }
    
    // startPromptTextListLoop();
    startPlaceholderTextListLoop();


    // initPlaceholderAnimation(input, [
    //     '荷叶滴落泪水，来不及浸透书页。一百年一千年，点燃一片通电的网。回想回想，那心的铁片，也要发出轰响。',
    //     'Tears dripped from the lotus leaves, too late to soak through the pages. One hundred and one thousand years, ignite an electrified net. Looking back, the iron piece of the heart will also make a roar.'
    // ])



    // enter button
    const button = document.querySelector('#site-structure .floor .monitor');
    addButtonBehavior(button, ()=>{
        button.classList.add('pressed');
    }, ()=>{
        button.classList.remove('pressed');
    })

}

function main() {
    initStructures();
}

window.addEventListener('load', main);