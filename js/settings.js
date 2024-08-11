export function initSettingsPage() {
    const buttonList = document.getElementById('buttonList')
    buttonList.querySelectorAll('div').forEach(button => {
        if (button.innerText == 'Локации') {
            button.classList.add('button-active')
        }
    })
    document.getElementById('contentName').innerText = `Настройки / Локации`;
    buttonList.addEventListener('click', function(event) {
        event.stopPropagation();

        const buttons = this.querySelectorAll('div');
        
        buttons.forEach(button => button.classList.remove('button-active'));
        if (event.target.matches('div')) {
            event.target.classList.add('button-active');

            const buttonName = event.target.innerText;
            document.getElementById('contentName').innerText = `Настройки / ${buttonName}`;
        }
    })
}