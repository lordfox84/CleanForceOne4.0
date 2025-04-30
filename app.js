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
    console.log("Funkce odesílání byla spuštěna");
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

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();  // Zabráníme odeslání formuláře běžným způsobem

    // Vytvoříme nový FormData objekt, který obsahuje data formuláře
    var formData = new FormData(this);

    // Odeslání formuláře pomocí Fetch API
    fetch('contact.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())  // Zpracování JSON odpovědi
    .then(data => {
        // Pokud je status "success", zobrazíme úspěšnou zprávu
        const responseMessage = document.getElementById('response-message');
        if (data.status === 'success') {
            responseMessage.innerHTML = '<p class="success">' + data.message + '</p>';
            responseMessage.style.display = 'block'; // Zobrazíme zprávu
            document.getElementById('contact-form').reset(); // Vynulujeme formulář
        } else {
            // Pokud je status "error", zobrazíme chybovou zprávu
            responseMessage.innerHTML = '<p class="error">' + data.message + '</p>';
            responseMessage.style.display = 'block'; // Zobrazíme zprávu
        }
    })
    .catch(error => {
        // Pokud dojde k chybě, zobrazíme chybovou zprávu
        const responseMessage = document.getElementById('response-message');
        responseMessage.innerHTML = '<p class="error">Došlo k chybě při odesílání formuláře.</p>';
        responseMessage.style.display = 'block'; // Zobrazíme zprávu
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
    let end = parseInt(element.getAttribute("data-end")) || yearsPassed;
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