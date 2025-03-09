document.addEventListener("DOMContentLoaded", function () {
    const carouselPopup = document.getElementById("carousel-popup-3d");
    const carousel = document.querySelector(".carousel-3d");
    const totalImages = 6; // Nombre total d'images
    const folderPath = "3d/"; // Dossier contenant les images
    let index = 0;

    function openCarousel3D() {
        console.log("Ouverture du carrousel 3D...");
        carouselPopup.style.display = "flex";
        loadImages3D();
    }

    function closeCarousel3D() {
        console.log("Fermeture du carrousel 3D...");
        carouselPopup.style.display = "none";
    }

    function loadImages3D() {
        console.log("Chargement des images 3D...");
        carousel.innerHTML = ""; // Vide l'ancien contenu

        for (let i = 1; i <= totalImages; i++) {
            let img = document.createElement("img");
            img.src = `${folderPath}${i}.jpg`;
            img.alt = `3D Image ${i}`;
            img.classList.add("carousel-image");
            carousel.appendChild(img);
        }

        // Ajout d'une largeur dynamique pour la div contenant les images
        carousel.style.width = `${totalImages * 100}%`;

        // Position initiale à 0
        index = 0;
        updateCarousel3D();
    }

    function updateCarousel3D() {
        const offset = -index * 100;
        console.log(`Déplacement: ${offset}%`);
        carousel.style.transform = `translateX(${offset}%)`;
    }

    function moveSlide3D(direction) {
        index += direction;
        if (index < 0) {
            index = totalImages - 1; // Revient à la dernière image
        } else if (index >= totalImages) {
            index = 0; // Revient à la première image
        }
        updateCarousel3D();
    }

    // Assigner les fonctions au `window` pour éviter "not defined"
    window.openCarousel3D = openCarousel3D;
    window.closeCarousel3D = closeCarousel3D;
    window.moveSlide3D = moveSlide3D;
});
