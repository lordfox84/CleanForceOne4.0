const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        header.classList.add("scrolled")
    } else {
        header.classList.remove("scrolled")
    }
})

const scrollers = document.querySelectorAll(".scroller");

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
}

function addAnimation() {
    scrollers.forEach((scroller) => {
        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
        })


    });  
};

function resizeTextarea(el) {
    el.style.height = "auto"; // Resetne výšku
    el.style.height = el.scrollHeight + "px"; // Nastaví novou výšku podle obsahu
}


function onSubmit(token) {
document.getElementById("contact-form").submit();
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".filter-buttons button");
    const images = document.querySelectorAll(".gallery-group .gallery-image");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            images.forEach(image => {
                const category = image.getAttribute("data-category");

                if (filter === "all" || category === filter) {
                    image.classList.remove("hidden");
                } else {
                    image.classList.add("hidden");
                }
            });
        });
    });
});

const buttons = document.querySelectorAll(".filter-buttons button");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});

const items = document.querySelectorAll(".nav__links li a");
items.forEach(li => {
    li.addEventListener("click", () => {
        items.forEach(lii => lii.classList.remove("active"));
        li.classList.add("active");
    });
});

function animateCounter(element) {
    let start = parseInt(element.getAttribute("data-start")) || 0;
    let end = parseInt(element.getAttribute("data-end")) || 100;
    let duration = parseInt(element.getAttribute("data-duration")) || 2000;

    let startTime = null;

    function updateCounter(currentTime) {
        if (!startTime) startTime = currentTime;
        let elapsedTime = currentTime - startTime;
        let progress = Math.min(elapsedTime / duration, 1);
        let currentNumber = Math.floor(progress * (end - start) + start);
        element.textContent = currentNumber;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

document.querySelectorAll(".counter").forEach(animateCounter);