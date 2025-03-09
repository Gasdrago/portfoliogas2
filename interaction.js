document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".design-card");
    const popup = document.getElementById("design-popup");
    const popupImg = document.getElementById("popup-img");
    const popupTitle = document.getElementById("popup-title");
    const closeBtn = document.querySelector(".close-btn");

    cards.forEach(card => {
        card.addEventListener("click", function () {
            let category = this.getAttribute("data-category");
            popupImg.src = this.querySelector("img").src;
            popupTitle.textContent = category;
            popup.style.display = "flex";
        });
    });

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

    popup.addEventListener("click", function (e) {
        if (e.target === popup) {
            popup.style.display = "none";
        }
    });
});
