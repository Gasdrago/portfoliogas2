document.addEventListener("DOMContentLoaded", function () {
    const carouselPopup = document.getElementById("carousel-popup");
    const carousel = document.querySelector(".carousel");
    const totalImages = 14; // Nombre total d'images
    const folderPath = "typo/"; // Dossier contenant les images
    let index = 0;

    function openCarousel() {
        console.log("Ouverture du carrousel...");
        carouselPopup.style.display = "flex";
        loadImages();
    }

    function closeCarousel() {
        console.log("Fermeture du carrousel...");
        carouselPopup.style.display = "none";
    }

    function loadImages() {
        console.log("Chargement des images...");
        carousel.innerHTML = ""; // Vide l'ancien contenu

        for (let i = 2; i <= totalImages; i++) {
            let img = document.createElement("img");
            img.src = `${folderPath}${i}.png`;
            img.alt = `Typographie ${i}`;
            img.classList.add("carousel-image");
            carousel.appendChild(img);
        }

        // Ajout d'une largeur dynamique pour la div contenant les images
        carousel.style.width = `${(totalImages - 1) * 100}%`;

        // Position initiale à 0
        index = 0;
        updateCarousel();
    }

    function updateCarousel() {
        const offset = -index * 100;
        console.log(`Déplacement: ${offset}%`);
        carousel.style.transform = `translateX(${offset}%)`;
    }

    function moveSlide(direction) {
        index += direction;
        if (index < 0) {
            index = totalImages - 2; // Revient à la dernière image
        } else if (index >= totalImages - 1) {
            index = 0; // Revient à la première image
        }
        updateCarousel();
    }

    // Assigner les fonctions au `window` pour éviter "not defined"
    window.openCarousel = openCarousel;
    window.closeCarousel = closeCarousel;
    window.moveSlide = moveSlide;
});
