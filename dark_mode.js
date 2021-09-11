// dark mode for the website - maria
import Darkmode from 'darkmode-js';

const options = {
    bottom: '30px',
    right: '30px',
    time: '0.5s',
    mixColor: '#fff',
    backgroundColor: '#fff',
    buttonColorDark: '#1A5163',
    buttonColorLight: '#00704a',
    label: '🌓',
    autoMatchOsTheme: false,
}

const darkmode = new Darkmode(options);
darkmode.showWidget();

export function automaticDarkMode() {
    setTimeout(() => {
        const time = document.querySelector(".time p").textContent;
        const hour = time.substring(1, 3);

        if (hour >= 22 || hour <= 4) {
            darkmode.toggle();
        } else if (darkmode.isActivated() && hour > 4 && hour < 22) {
            darkmode.toggle();
        }
    }, 5000)
}