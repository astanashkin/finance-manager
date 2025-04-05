// Активное меню
document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", function () {
        document.querySelectorAll(".menu-link").forEach(l => l.classList.remove("is-active"));
        this.classList.add("is-active");
    });
});

// Активные ссылки в заголовке
document.querySelectorAll(".main-header-link").forEach(link => {
    link.addEventListener("click", function () {
        document.querySelectorAll(".main-header-link").forEach(l => l.classList.remove("is-active"));
        this.classList.add("is-active");
    });
});

// Выпадающие списки (Dropdown)
let dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdowns.forEach(d => d.classList.remove("is-active"));
        dropdown.classList.add("is-active");
    });
});

// Закрытие dropdown при клике вне его
document.addEventListener("click", function (e) {
    let dd = document.querySelector(".dropdown");
    if (dd && !e.target.closest(".dropdown")) {
        dd.classList.remove("is-active");
    }
});

// Закрытие overlay при клике вне dropdown
document.addEventListener("click", function (e) {
    let contentWrapper = document.querySelector(".content-wrapper");
    if (contentWrapper && !e.target.closest(".dropdown")) {
        contentWrapper.classList.remove("overlay");
    }
});

// Проверка перед работой с элементами, чтобы избежать ошибки
const statusButton = document.querySelector(".status-button:not(.open)");
if (statusButton) {
    statusButton.addEventListener("click", function () {
        let overlayApp = document.querySelector(".overlay-app");
        if (overlayApp) overlayApp.classList.add("is-active");

        let popUp = document.querySelector(".pop-up");
        if (popUp) popUp.classList.add("visible");
    });
}

// Темная/светлая тема
const toggleButton = document.querySelector('.dark-light');
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });
}
