function addMtfkElements(textBox) {
    if (textBox.dataset.mtfk) {
        return;
    }

    textBox.dataset.mtfk = true;

    const mtfkWrapper = createMtfkWrapper();
    const mtfkButton = createMtfkButton();
    const mtfkOptions = createMtfkOptions();

    mtfkWrapper.appendChild(mtfkButton);
    mtfkWrapper.appendChild(mtfkOptions);
    appendCloseButton(mtfkOptions);

    textBox.parentNode.appendChild(mtfkWrapper);

    mtfkButton.addEventListener('click', () => {
        toggleMtfkOptions(mtfkOptions);
    });

    addMtfkListeners(mtfkWrapper, textBox);
}

function appendCloseButton(mtfkOptions) {
    const closeButton = document.createElement('div');
    closeButton.className = 'mtfk__options_close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        mtfkOptions.style.display = 'none';
    });
    mtfkOptions.prepend(closeButton);
}

function createMtfkWrapper() {
    const mtfkWrapper = document.createElement('div');
    mtfkWrapper.className = 'mtfk';
    return mtfkWrapper;
}

function createMtfkButton() {
    const mtfkButton = document.createElement('div');
    mtfkButton.setAttribute('role', 'button');
    mtfkButton.className = 'mtfk__button';
    mtfkButton.style.backgroundImage = `url(${chrome.runtime.getURL('images/mtfk-logo.png')})`;
    return mtfkButton;
}

function createMtfkOptions() {
    const mtfkOptions = document.createElement('div');
    mtfkOptions.className = 'mtfk__options';
    mtfkOptions.style.display = 'none';
    mtfkOptions.innerHTML = `
    <span class="mtfk__option mtfk__option--formal" aria-label="Professional" role="button">Formal</span>
    <span class="mtfk__option mtfk__option--casual" aria-label="Casual" role="button">Casual</span>
    <span class="mtfk__option mtfk__option--friendly" aria-label="Friendly" role="button">Friendly</span>
  `;
    return mtfkOptions;
}

function toggleMtfkOptions(mtfkOptions) {
    mtfkOptions.style.display = mtfkOptions.style.display === 'none' ? 'block' : 'none';
}

function addMtfkListeners(mtfkWrapper, textBox) {
    const buttons = mtfkWrapper.querySelectorAll('.mtfk__option');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = textBox.value,
                port = chrome.runtime.connect({ name: 'waitGPT' }),
                tone = button.getAttribute('aria-label');
            port.postMessage({ prompt: value, tone: tone });
            port.onMessage.addListener(function(response) {
                textBox.value = response.editedPrompt;
                port.disconnect();
            });
        });
    });
}

const textBoxes = document.querySelectorAll('[role="textbox"], textarea');

textBoxes.forEach(textBox => {
    textBox.addEventListener('focus', () => {
        addMtfkElements(textBox);
    });
});
