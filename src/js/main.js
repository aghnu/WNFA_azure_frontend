import { setRandInterval, flashElement } from './utilities';
import { flickeringTextEl } from './flickerText';
import { startTextTypingAnimation, clearTextTypingAnimation } from './typingAnimation';
import { generatePoster,ERROR_CODE } from './generatePoster';

import '../style/styles.scss'
import transition_pic from '../img/transition.webp';
import monitor_frame_0 from '../img/monitor0.webp';
import monitor_frame_1 from '../img/monitor1.webp';
import monitor_frame_2 from '../img/monitor2.webp';
import monitor_frame_3 from '../img/monitor3.webp';


const monitor_frames = [
    {class: 'monitor-0', url: monitor_frame_0},
    {class: 'monitor-1', url: monitor_frame_1},
    {class: 'monitor-2', url: monitor_frame_2},
    {class: 'monitor-3', url: monitor_frame_3},
]

const read_state = {
    frameInit_0: false,
    frameInit_1: false,
    frameInit_2: false,
    frameInit_3: false,
    posterInit: false,
    fontsLoaded: false,
}

// globals
let loading = false;
let buttonDown = false;

function checkLoaded() {

    for (const state in read_state) {
        if (!read_state[state]) {
            return false;
        }
    }

    return true;
}

function loaded() {
    const site_loading_screen = document.querySelector('#site-informative .loading');
    site_loading_screen.classList.add('hide');
}

function addButtonBehavior(btnEl, downFunc, upFunc) {
    

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

function initMonitor() {
    // set up monitor frame
    // poster
    const poster = document.querySelector('#site-structure .floor .monitor .poster');

    poster.addEventListener('load', () => {
        read_state.posterInit = true;
    }, {once: true});
    poster.src = transition_pic;

    // frames
    const monitor_frame_0 = document.querySelector('#site-structure .floor .monitor .monitor-frame.monitor-0');
    const monitor_frame_1 = document.querySelector('#site-structure .floor .monitor .monitor-frame.monitor-1');
    const monitor_frame_2 = document.querySelector('#site-structure .floor .monitor .monitor-frame.monitor-2');
    const monitor_frame_3 = document.querySelector('#site-structure .floor .monitor .monitor-frame.monitor-3');

    monitor_frame_0.addEventListener('load', () => {
        read_state.frameInit_0 = true;
    }, {once: true});

    monitor_frame_1.addEventListener('load', () => {
        read_state.frameInit_1 = true;
    }, {once: true});

    monitor_frame_2.addEventListener('load', () => {
        read_state.frameInit_2 = true;
    }, {once: true});

    monitor_frame_3.addEventListener('load', () => {
        read_state.frameInit_3 = true;
    }, {once: true});

    monitor_frame_0.src = monitor_frames[0].url;
    monitor_frame_1.src = monitor_frames[1].url;
    monitor_frame_2.src = monitor_frames[2].url;
    monitor_frame_3.src = monitor_frames[3].url;


    // rotation
    const monitor = document.querySelector('#site-structure .floor .monitor');
    let selected_monitor_frame_index = Math.floor(Math.random() * monitor_frames.length);
    monitor.classList.add(monitor_frames[selected_monitor_frame_index].class);

    setRandInterval(()=>{
        if (!loading && !buttonDown) {
            flashElement(monitor, () => {
                monitor.classList.remove(monitor_frames[selected_monitor_frame_index].class);
                selected_monitor_frame_index = (selected_monitor_frame_index + 1) % monitor_frames.length;
                monitor.classList.add(monitor_frames[selected_monitor_frame_index].class);            
            });            
        }
    }, 10000, 15000);

    // wait for font
    document.fonts.ready.then(()=>{read_state.fontsLoaded = true});
}

function initStructures() {
    const site_structure = document.querySelector('#site-structure');

    // logo
    const first = document.querySelector('#site-structure .footer .first');
    const second = document.querySelector('#site-structure .footer .second');

    flickeringTextEl(first, 'GENGYUAN HUANG & YUAN FANG');
    flickeringTextEl(second, '© 2022 WNFA Posters Generator');

    // console
    const input = document.querySelector('#site-console .input');

    const printPlaceholderTextList = [
        ['Type into this area to write a poem, then, click the display device to generate the poster.', 0.075],
        ['点击这里写一首诗，然后单击显示装置生成海报。', 0.2],
        ['荷叶滴落泪水\n来不及 浸透书页\n一百年 一千年\n点燃一片通电的网\n\n回想 回想\n那心的铁片\n也要发出轰响', 0.2],
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

    let current_button_down_func;
    let current_button_up_func;

    const button_up_func_submit = () => {
        if (input.value !== '' && input.value !== oldText) {
            loading = true;
            flickeringTextEl(prompt, 'Generating / 生成中');
            site_structure.classList.add('processing');
            input.blur();
            generatePoster(input.value, (d) => {
                loading = false;
                current_button_up_func = button_up_func_show;


                site_structure.classList.remove('processing');
                flickeringTextEl(prompt, 'Poster Ready / 海报就绪');
                poster.src = "data:image/jpeg; base64, " + d.image_data;
                oldText = input.value;

                // when value change remove this state
                input.addEventListener('input', () => {
                    current_button_up_func = button_up_func_submit;
                    oldText = "";
                    poster.src = transition_pic;
                    flickeringTextEl(prompt, 'System Ready / 系统就绪');
                }, { once: true});
            }, (error_code) => {
                loading = false;
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

    initMonitor();

}

function main() {
    initStructures();

    // loading prompt
    const prompt = document.querySelector('#site-informative .loading .prompt');

    const loadingPrompts = [
        '·',
        '· ·',
        '· · ·',
    ]

    let i = 0;
    let loadingCompleteFunc = () => {};
    setInterval(() => {
        prompt.innerHTML = "Loading / 载入中" + "<br>" + loadingPrompts[i];
        i = (i + 1) % loadingPrompts.length;
        loadingCompleteFunc();
    }, 750);

    setTimeout(() => {
        loadingCompleteFunc = () => {
            if (checkLoaded()) {
                loaded();
            }
        }
    }, 2250);


}

window.addEventListener('load', main);