// Modal para imágenes - VERSIÓN COMPLETA CON ZOOM
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const zoomBtn = document.getElementById('zoomBtn');
    
    // Crear contador de imágenes dinámicamente
    const counter = document.createElement('div');
    counter.className = 'modal-counter';
    counter.innerHTML = '<span id="currentImg">1</span> / <span id="totalImg">2</span>';
    document.querySelector('.modal-content').appendChild(counter);

    // Variables globales
    let currentCar = '';
    let currentImages = [];
    let currentIndex = 0;
    let isZoomed = false;

    // Organizar imágenes por vehículo
    const allImages = document.querySelectorAll('.car-image');
    const imagesByCar = {};
    
    allImages.forEach(img => {
        const carId = img.getAttribute('data-car');
        if (!carId) return;
        
        if (!imagesByCar[carId]) {
            imagesByCar[carId] = [];
        }
        
        imagesByCar[carId].push({
            src: img.getAttribute('data-full'),
            alt: img.alt
        });
    });

    // Agregar evento click a cada imagen
    allImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const carId = this.getAttribute('data-car');
            const imgIndex = parseInt(this.getAttribute('data-index'));
            
            if (carId && imagesByCar[carId]) {
                currentCar = carId;
                currentImages = imagesByCar[carId];
                currentIndex = imgIndex;
                
                openModal();
            }
        });
    });

    // Función para abrir el modal
    function openModal() {
        // Mostrar el modal
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Cargar la imagen actual
        updateModalImage();
        
        // Actualizar contador
        updateCounter();
        
        // Resetear zoom
        resetZoom();
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    }

    // Función para actualizar el contador
    function updateCounter() {
        document.getElementById('currentImg').textContent = currentIndex + 1;
        document.getElementById('totalImg').textContent = currentImages.length;
    }

    // Función para cerrar el modal
    function closeImageModal() {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetZoom();
    }

    // Función para actualizar la imagen en el modal
    function updateModalImage() {
        if (currentImages.length > 0 && currentIndex < currentImages.length) {
            modalImage.src = currentImages[currentIndex].src;
            modalImage.alt = currentImages[currentIndex].alt;
            updateCounter();
            
            // Precargar imágenes adyacentes
            preloadAdjacentImages();
        }
    }

    // Función para mostrar la siguiente imagen
    function showNextImage() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateModalImage();
            resetZoom(); // Resetear zoom al cambiar imagen
        }
    }

    // Función para mostrar la imagen anterior
    function showPrevImage() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateModalImage();
            resetZoom(); // Resetear zoom al cambiar imagen
        }
    }

    // Función para alternar zoom
    function toggleZoom() {
        isZoomed = !isZoomed;
        if (isZoomed) {
            modalImage.classList.add('zoomed');
            zoomBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
            zoomBtn.title = 'Reducir zoom (Esc)';
        } else {
            modalImage.classList.remove('zoomed');
            zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
            zoomBtn.title = 'Ampliar imagen';
        }
    }

    // Función para resetear zoom
    function resetZoom() {
        isZoomed = false;
        modalImage.classList.remove('zoomed');
        zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        zoomBtn.title = 'Ampliar imagen';
    }

    // Función para precargar imágenes adyacentes
    function preloadAdjacentImages() {
        const nextIndex = (currentIndex + 1) % currentImages.length;
        const prevIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        
        const nextImg = new Image();
        nextImg.src = currentImages[nextIndex].src;
        
        const prevImg = new Image();
        prevImg.src = currentImages[prevIndex].src;
    }

    // EVENT LISTENERS

    // Cerrar modal con la X
    closeModal.addEventListener('click', function(e) {
        e.stopPropagation();
        closeImageModal();
    });

    // Cerrar modal haciendo clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    // Navegación con flechas
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevImage();
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextImage();
    });

    // Botón de zoom
    zoomBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleZoom();
    });

    // Zoom con doble clic en la imagen
    modalImage.addEventListener('dblclick', function(e) {
        e.stopPropagation();
        toggleZoom();
    });

    // Zoom con clic simple cuando ya está zoom (para salir)
    modalImage.addEventListener('click', function(e) {
        if (isZoomed) {
            e.stopPropagation();
            toggleZoom();
        }
    });

    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show')) {
            switch(e.key) {
                case 'Escape':
                case 'Esc':
                    if (isZoomed) {
                        toggleZoom();
                    } else {
                        closeImageModal();
                    }
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    toggleZoom();
                    break;
                case '+':
                case '=':
                    if (!isZoomed) toggleZoom();
                    break;
                case '-':
                case '_':
                    if (isZoomed) toggleZoom();
                    break;
            }
        }
    });

    // Smooth scroll para enlaces internos
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

    console.log('✅ Galería de imágenes cargada correctamente');
    console.log(`📷 Vehículos cargados: ${Object.keys(imagesByCar).length}`);
});
