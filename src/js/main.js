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

function startPlaceholderAnimation(input, text, speed, callback) {

    const printChar = (char) => {
        input.placeholder += char;
    }

    const printText = (text) => {
        let index = 0;

        const printLoop = () => {
            setTimeout(() => {
                if (index < text.length) {
                    const char = text[index++];
                    printChar(char);
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

function clearPlaceholderAnimation(input, speed, callback) {

    const clearLoop = () => {
        setTimeout(() => {
            if (input.placeholder !== '') {
                input.placeholder = input.placeholder.slice(0,-1);
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
    const input = document.querySelector('#site-console .input');
    const printList = [
        ['Type into this area to write a poem, then click the TV to generate the poster.', 0.15],
        ['点击这里写一首诗，然后点击电视机开始生成海报。', 0.25],
        ['荷叶滴落泪水，来不及浸透书页。一百年一千年，点燃一片通电的网。回想回想，那心的铁片，也要发出轰响。', 0.1],
    ];

    const startTextListLoop = () => {
        const print = printList.shift();
        printList.push(print);
        
        startPlaceholderAnimation(input, print[0], print[1], () => {
            setTimeout(() => {
                clearPlaceholderAnimation(input, 0.05, () => {
                    setTimeout(() => {
                        startTextListLoop();
                    }, 2000);
                });                 
            }, 2000);
        });
        

    }

    startTextListLoop();


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