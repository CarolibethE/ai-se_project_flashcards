const modal = document.querySelector("#app-modal");
const modalTitle = modal.querySelector(".modal__title");
const modalMessage = modal.querySelector(".modal__message");
const closeBtn = modal.querySelector(".modal__close-btn");
const cancelBtn = modal.querySelector(".modal__btn_type_secondary");
const confirmBtn = modal.querySelector(".modal__btn_type_primary");

let confirmHandler = null;

/**
 * Close the application modal and clear any pending confirmation handler.
 * 
 * @returns {void}
 */
function closeModal() {
    modal.classList.remove("modal_visible");
    confirmHandler = null;
}

/**
 * Show an error message in the application modal.
 * 
 * @param {string} message - The error message to display.
 * @returns {void}
 */
function showError(message) {
    modalTitle.textContent = "An Error has occurred";
    modalMessage.textContent = message;
    cancelBtn.hidden = true;
    confirmBtn.textContent = "Dismiss";
    confirmHandler = null;
    modal.classList.add("modal_visible");
}

/**
 * Show a confirmation modal and run a callback if the user confirms.
 * 
 * @param {string} message - The confirmation message to display.
 * @param {Function} onConfirm - The callback to run after confirmation.
 * @returns {void}
 */
function showConfirmation(message, onConfirm) {
    modalTitle.textContent = "Confirm deletion";
    modalMessage.textContent = message;
    cancelBtn.hidden = false;
    confirmBtn.textContent = "Delete";
    confirmHandler = onConfirm;
    modal.classList.add("modal_visible");
}

closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

confirmBtn.addEventListener("click", () => {
    if (confirmHandler) {
        const callback = confirmHandler;
        closeModal();
        callback();
        return;
    }
    closeModal();
});

modal.addEventListener("click", (event) => {
    if(event.target === modal) {
        closeModal();
    }
});

export { closeModal, showError, showConfirmation}