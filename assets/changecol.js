const header = document.querySelector("header");
const services = document.querySelector(".services");
const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {

    if (header.id === "first-color") {

        header.id = "last-color";
        services.id = "last-color";

        toggleBtn.classList.remove("btn-outline-light");
        toggleBtn.classList.add("btn-outline-primary");

    } else {

        header.id = "first-color";
        services.id = "first-color";

        toggleBtn.classList.remove("btn-outline-primary");
        toggleBtn.classList.add("btn-outline-light");
    }

});