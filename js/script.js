// Modal para imágenes - VERSIÓN COMPLETA CON GALERÍA POR VEHÍCULO
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
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

    console.log('Imágenes organizadas por vehículo:', imagesByCar);

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
        console.log('Abriendo modal para:', currentCar);
        console.log('Imágenes disponibles:', currentImages);
        console.log('Índice actual:', currentIndex);
        
        // Mostrar el modal
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Cargar la imagen actual
        updateModalImage();
        
        // Resetear zoom
        isZoomed = false;
        modalImage.classList.remove('zoomed');
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        console.log('Modal abierto con éxito');
    }

    // Función para cerrar el modal
    function closeImageModal() {
        console.log('Cerrando modal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Función para actualizar la imagen en el modal
    function updateModalImage() {
        if (currentImages.length > 0 && currentIndex < currentImages.length) {
            modalImage.src = currentImages[currentIndex].src;
            modalImage.alt = currentImages[currentIndex].alt;
            
            // Precargar siguiente y anterior para mejor experiencia
            preloadAdjacentImages();
        }
    }

    // Función para mostrar la siguiente imagen
    function showNextImage() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateModalImage();
            console.log('Siguiente imagen:', currentIndex);
        }
    }

    // Función para mostrar la imagen anterior
    function showPrevImage() {
        if (currentImages.length > 0) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateModalImage();
            console.log('Imagen anterior:', currentIndex);
        }
    }

    // Función para alternar zoom
    function toggleZoom() {
        isZoomed = !isZoomed;
        if (isZoomed) {
            modalImage.classList.add('zoomed');
            modalImage.title = 'Haz clic o presiona Esc para salir del zoom';
        } else {
            modalImage.classList.remove('zoomed');
            modalImage.title = '';
        }
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
            console.log('Tecla presionada:', e.key);
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

    // Asegurar que todas las imágenes tengan atributos necesarios
    allImages.forEach(img => {
        if (!img.hasAttribute('data-full')) {
            img.setAttribute('data-full', img.src);
        }
        if (!img.hasAttribute('data-car')) {
            // Extraer nombre del vehículo del alt
            const alt = img.alt.toLowerCase();
            if (alt.includes('volvo')) img.setAttribute('data-car', 'volvo');
            else if (alt.includes('jeep')) img.setAttribute('data-car', 'jeep');
            else if (alt.includes('renault')) img.setAttribute('data-car', 'renault');
            else if (alt.includes('fiat')) img.setAttribute('data-car', 'fiat');
            else if (alt.includes('nissan')) img.setAttribute('data-car', 'nissan');
            else if (alt.includes('chevrolet')) img.setAttribute('data-car', 'chevrolet');
            else img.setAttribute('data-car', 'car' + Math.floor(Math.random() * 1000));
        }
    });

    // Depuración en consola
    console.log('=== CARS OUTLET FUSA - GALERÍA INICIADA ===');
    console.log('Modal encontrado:', !!modal);
    console.log('Botón cerrar:', !!closeModal);
    console.log('Botones de navegación:', !!prevBtn, !!nextBtn);
    console.log('Vehículos con imágenes:', Object.keys(imagesByCar).length);
    Object.keys(imagesByCar).forEach(car => {
        console.log(`- ${car}: ${imagesByCar[car].length} imágenes`);
    });
    console.log('===========================================');
});
