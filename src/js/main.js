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
    generatePoster,
    ERROR_CODE
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
    const site_structure = document.querySelector('#site-structure');

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
    
    // prompt init
    const prompt = document.querySelector('#site-structure .prompt');
    flickeringTextEl(prompt, 'System Ready / 系统就绪');
    
    // enter button
    const button = document.querySelector('#site-structure .floor .monitor');
    const poster = document.querySelector('#site-structure .floor .monitor .poster');
    let oldText = "";
    poster.src = transition_gif;

    let current_button_down_func;
    let current_button_up_func;

    const button_up_func_submit = () => {
        if (input.value !== '' && input.value !== oldText) {
            flickeringTextEl(prompt, 'Generating / 生成中');
            site_structure.classList.add('processing');
            input.blur();
            generatePoster(input.value, (d) => {

                current_button_up_func = button_up_func_show;


                site_structure.classList.remove('processing');
                flickeringTextEl(prompt, 'Poster Ready / 海报就绪');
                poster.src = "data:image/jpeg; base64, " + d.image_data;
                oldText = input.value;

                // when value change remove this state
                input.addEventListener('input', () => {
                    current_button_up_func = button_up_func_submit;
                    oldText = "";
                    poster.src = transition_gif;
                    flickeringTextEl(prompt, 'System Ready / 系统就绪');
                }, { once: true});
            }, (error_code) => {
                site_structure.classList.remove('processing');

                console.error('ERROR: ' + error_code);

                switch (error_code) {
                    case ERROR_CODE.NETWORK_ERROR:
                        flickeringTextEl(prompt, 'Network Error / 网络错误');

                        break;
                    case ERROR_CODE.SERVER_ERROR:
                        flickeringTextEl(prompt, 'Sever Error / 服务器错误');

                        break;
                    case ERROR_CODE.USER_ERROR:
                        oldText = input.value;
                        flickeringTextEl(prompt, 'Invalid input / 文本不规范');
                        break;
                }

            });
        }
    }

    const button_up_func_show = () => {
        const posterview = document.querySelector('#site-posterview');
        posterview.innerHTML = "";

        const posterDetailed = document.createElement('img');
        posterDetailed.classList.add('poster');
        posterDetailed.src = poster.src;

        posterview.appendChild(posterDetailed);


        posterview.addEventListener('click', () => {
            posterview.classList.remove('show');
        }, {once: true});


        posterview.classList.add('show');
    }

    current_button_down_func = () => {};
    current_button_up_func = button_up_func_submit;



    addButtonBehavior(button, () => {
        button.classList.add('pressed');
        current_button_down_func();
    }, () => {
        button.classList.remove('pressed');
        current_button_up_func();
    })


    
    

}

function main() {
    initStructures();
}

window.addEventListener('load', main);