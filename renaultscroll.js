document.addEventListener("DOMContentLoaded", function () {
    const projectContainer = document.querySelector(".project-container");

    // Chargement dynamique des images sous forme de sections
    for (let i = 1; i <= 34; i++) {
        let section = document.createElement("section");
        section.classList.add("project-step");

        let img = document.createElement("img");
        img.src = `RENAULT/${i}.png`;
        img.alt = `Étape ${i}`;

        section.appendChild(img);
        projectContainer.appendChild(section);
    }

    console.log("Sections du projet Renault chargées avec succès !");

    // Effet d'apparition progressive au scroll
    function revealOnScroll() {
        let sections = document.querySelectorAll(".project-step");
        let windowHeight = window.innerHeight;

        sections.forEach(function (section) {
            let positionFromTop = section.getBoundingClientRect().top;

            if (positionFromTop < windowHeight - 100) {
                section.classList.add("visible");
            }
        });
    }

    // Déclencher l'effet au scroll
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Exécuter une première fois pour les éléments visibles dès le début
});
