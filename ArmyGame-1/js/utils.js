// utils.js

export function playSound(sound, mute) {
    if (!mute) {
        sound.currentTime = 0;
        sound.play();
    }
}

export function showToast(message, type = "success") {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (type === "error") {
        toast.style.backgroundColor = '#f44336'; // Red for errors
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
