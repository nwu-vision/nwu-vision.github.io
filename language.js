// Language data
const langData = {
    'en': {
        'dynamicVisualization': "Hello World!",
        'piName': "PI: Meng-Yu Jennifer Kuo",
        'piRole': "Assistant Professor",
    },
    'ja': {
        'dynamicVisualization': "こんにちは",
        'piName': "PI: Meng-Yu Jennifer Kuo",
        'piRole': "助教",
    }
};

// Function to switch language
function switchLanguage(lang, event) {
    if (event) {
        event.preventDefault(); // Ensure no navigation happens
    }
    localStorage.setItem('currentLang', lang); // Store current language in local storage
    updateContent(lang);
}

function updateContent(lang) {
    const dynamicVisualization = document.getElementById('dynamicVisualization');
    const piName = document.getElementById('piName');
    const piRole = document.getElementById('piRole');

    if(dynamicVisualization && piName && piRole) {
        dynamicVisualization.textContent = langData[lang]['dynamicVisualization'];
        piName.textContent = langData[lang]['piName'];
        piRole.textContent = langData[lang]['piRole'];
    }

    // New: Update the research image based on language
    const researchImage = document.getElementById('researchImage');
    if (researchImage) {
        if (lang === 'ja') {
            researchImage.src = 'assets/images/lab_intro_ja.png'; // Your Japanese image path
        } else {
            researchImage.src = 'assets/images/lab_intro_en.png'; // Your English image path
        }
    }
}

function returnToOverview() {
    const currentLang = localStorage.getItem('currentLang') || 'en';
    updateContent(currentLang);
}

// Set language on page load based on stored preference or default to English
document.addEventListener('DOMContentLoaded', function() {
    const storedLang = localStorage.getItem('currentLang') || 'en';
    switchLanguage(storedLang, null);
});

// Slides
document.addEventListener('DOMContentLoaded', function() {
    showSlides(slideIndex);
});

var slideIndex = 1;
var slideTimer;

function plusSlides(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    // Loop through slides
    Array.from(slides).forEach((slide, index) => {
        if (index === slideIndex - 1) {
            slide.classList.add("show");
        } else {
            slide.classList.remove("show");
        }
    });

    // Update dots
    Array.from(dots).forEach(dot => dot.className = dot.className.replace(" active", ""));
    dots[slideIndex - 1].className += " active";

    // Handle timer / media
    clearTimeout(slideTimer);
    handleMediaContent(slides[slideIndex - 1]);
}


function handleMediaContent(currentSlide) {
    if (currentSlide.tagName === "VIDEO") {
        if(currentSlide.paused || currentSlide.ended) {
            currentSlide.play().catch(e => console.log("Error playing video: ", e));
        }
        currentSlide.onended = () => { plusSlides(1); };
    } else if (currentSlide.tagName === "IMG") {
        slideTimer = setTimeout(() => { plusSlides(1); }, 5000); // 5 seconds for images
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}

// Remove the automatic change every 4 seconds
// setInterval(function() {
//     plusSlides(1);
// }, 4000);