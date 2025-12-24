// Modal para imágenes
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close-modal');
const carImages = document.querySelectorAll('.car-image');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentImageIndex = 0;
let imagesArray = [];

// Inicializar el array de imágenes
carImages.forEach((img, index) => {
    imagesArray.push({
        src: img.getAttribute('data-full') || img.src,
        alt: img.alt
    });
    
    // Agregar evento click a cada imagen
    img.addEventListener('click', () => {
        currentImageIndex = index;
        openModal(currentImageIndex);
    });
});

function openModal(index) {
    modal.style.display = 'flex';
    modalImage.src = imagesArray[index].src;
    modalImage.alt = imagesArray[index].alt;
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

function closeImageModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
    modalImage.src = imagesArray[currentImageIndex].src;
    modalImage.alt = imagesArray[currentImageIndex].alt;
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
    modalImage.src = imagesArray[currentImageIndex].src;
    modalImage.alt = imagesArray[currentImageIndex].alt;
}

// Event Listeners
closeModal.addEventListener('click', closeImageModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeImageModal();
    }
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

// Efecto de carga suave para imágenes
window.addEventListener('load', () => {
    document.body.style.opacity = 0;
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 100);
});

// Smooth scroll para anclas internas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
