document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const totalImages = 41; // Mets ici le nombre total d'images
    const folderPath = "INRAE/"; // Chemin du dossier contenant les images
    let index = 0;

    // Vérifier et supprimer les anciens boutons s'ils existent
    document.querySelectorAll(".prev-btn, .next-btn").forEach(btn => btn.remove());

    // Ajout dynamique des images au carrousel
    for (let i = 1; i <= totalImages; i++) {
        let img = document.createElement("img");
        img.src = `${folderPath}${i}.png`; // Images format .png
        img.alt = `INRAE Image ${i}`;
        img.classList.add("carousel-image");
        carousel.appendChild(img);
    }

    const totalSlides = document.querySelectorAll(".carousel img").length;

    // Mise à jour de la position du carrousel
    function updateCarousel() {
        const offset = -index * 100;
        carousel.style.transform = `translateX(${offset}%)`;
    }

    window.moveSlide = function (direction) {
        index += direction;
        if (index < 0) {
            index = totalSlides - 1; // Retourne à la dernière image
        } else if (index >= totalSlides) {
            index = 0; // Revient à la première image
        }
        updateCarousel();
    };

    // Création unique des boutons de navigation
    const prevButton = document.createElement("button");
    prevButton.classList.add("prev-btn");
    prevButton.innerHTML = "‹"; // Flèche gauche
    prevButton.onclick = () => moveSlide(-1);

    const nextButton = document.createElement("button");
    nextButton.classList.add("next-btn");
    nextButton.innerHTML = "›"; // Flèche droite
    nextButton.onclick = () => moveSlide(1);

    // Ajouter les boutons UNIQUEMENT s'ils n'existent pas déjà
    const carouselContainer = document.querySelector(".carousel-container");
    if (!document.querySelector(".prev-btn")) {
        carouselContainer.appendChild(prevButton);
    }
    if (!document.querySelector(".next-btn")) {
        carouselContainer.appendChild(nextButton);
    }
});
