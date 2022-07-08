import '../style/styles.scss'
import transition_gif from '../img/transition_animation.gif';

import {
    flickeringTextEl
} from './flickerText';
import {
    startTextTypingAnimation,
    clearTextTypingAnimation
} from './typingAnimation';
import {
    generatePoster
} from './generatePoster';

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

function initStructures() {
    // logo
    const first = document.querySelector('#site-structure .footer .first');
    const second = document.querySelector('#site-structure .footer .second');

    flickeringTextEl(first, 'GENGYUAN HUANG & YUAN FANG');
    flickeringTextEl(second, '@ 2022 WNFA Posters Generator');

    // console
    const input = document.querySelector('#site-console .input');

    const printPlaceholderTextList = [
        ['Type into this area to write a poem,\nthen, click the TV to generate the poster.', 0.075],
        ['点击这里写一首诗，\n然后点击电视机开始生成海报。', 0.2],
        ['荷叶滴落泪水，来不及浸透书页。\n一百年一千年，点燃一片通电的网。\n\n回想回想，\n那心的铁片，\n也要发出轰响。', 0.2],
    ];

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
    startPlaceholderTextListLoop();

    // enter button
    const button = document.querySelector('#site-structure .floor .monitor');
    const poster = document.querySelector('#site-structure .floor .monitor .poster');
    poster.src = transition_gif;
    addButtonBehavior(button, () => {
        button.classList.add('pressed');
        if (input.value !== '') {
            generatePoster(input.value, (d) => {
                
                poster.src = "data:image/jpeg; base64, " + d.image_data;
            }, (error_code) => {
                console.error('ERROR: ' + error_code);
            });
        }

    }, () => {
        button.classList.remove('pressed');
    })
}

function main() {
    initStructures();
}

window.addEventListener('load', main);