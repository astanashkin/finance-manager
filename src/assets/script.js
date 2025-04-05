document.querySelectorAll(".menu-link").forEach(link => {
    link.addEventListener("click", function () {
        document.querySelectorAll(".menu-link").forEach(l => l.classList.remove("is-active"));
        this.classList.add("is-active");
    });
});

document.querySelectorAll(".main-header-link").forEach(link => {
    link.addEventListener("click", function () {
        document.querySelectorAll(".main-header-link").forEach(l => l.classList.remove("is-active"));
        this.classList.add("is-active");
    });
});
	
let dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdowns.forEach(d => d.classList.remove("is-active"));
        dropdown.classList.add("is-active");
    });
});

document.addEventListener("click", function (e) {
    let container = document.querySelector(".status-button");
    let dd = document.querySelector(".dropdown");
    if (!container.contains(e.target)) {
        dd.classList.remove("is-active");
    }
});

document.querySelector(".dropdown").addEventListener("click", function (e) {
    document.querySelector(".content-wrapper").classList.add("overlay");
    e.stopPropagation();
});

document.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown")) {
        document.querySelector(".content-wrapper").classList.remove("overlay");
    }
});

document.querySelector(".status-button:not(.open)").addEventListener("click", function () {
    document.querySelector(".overlay-app").classList.add("is-active");
});

document.querySelector(".pop-up .close").addEventListener("click", function () {
    document.querySelector(".overlay-app").classList.remove("is-active");
});

document.querySelector(".status-button:not(.open)").addEventListener("click", function () {
    document.querySelector(".pop-up").classList.add("visible");
});

document.querySelector(".pop-up .close").addEventListener("click", function () {
    document.querySelector(".pop-up").classList.remove("visible");
});

const toggleButton = document.querySelector('.dark-light');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});
