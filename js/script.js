// Modal para imágenes - VERSIÓN CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const carImages = document.querySelectorAll('.car-image');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentImageIndex = 0;
    let imagesArray = [];

    console.log('Script cargado. Imágenes encontradas:', carImages.length);

    // Inicializar el array de imágenes
    carImages.forEach((img, index) => {
        console.log(`Imagen ${index}:`, img.src);
        
        imagesArray.push({
            src: img.getAttribute('data-full') || img.src,
            alt: img.alt
        });
        
        // Agregar evento click a cada imagen
        img.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Clic en imagen', index);
            currentImageIndex = index;
            openModal(currentImageIndex);
        });
        
        // Eliminar el enlace <a> que rodea la imagen si existe
        const parentLink = img.closest('a');
        if (parentLink) {
            parentLink.addEventListener('click', function(e) {
                e.preventDefault();
            });
        }
    });

    function openModal(index) {
        console.log('Abriendo modal con índice:', index);
        console.log('URL de la imagen:', imagesArray[index].src);
        
        // Mostrar el modal
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Cargar la imagen
        modalImage.src = imagesArray[index].src;
        modalImage.alt = imagesArray[index].alt;
        
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        console.log('Modal debería estar visible ahora');
    }

    function closeImageModal() {
        console.log('Cerrando modal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesArray.length;
        modalImage.src = imagesArray[currentImageIndex].src;
        modalImage.alt = imagesArray[currentImageIndex].alt;
        console.log('Siguiente imagen:', currentImageIndex);
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesArray.length) % imagesArray.length;
        modalImage.src = imagesArray[currentImageIndex].src;
        modalImage.alt = imagesArray[currentImageIndex].alt;
        console.log('Imagen anterior:', currentImageIndex);
    }

    // Event Listeners
    closeModal.addEventListener('click', function(e) {
        e.stopPropagation();
        closeImageModal();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });

    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevImage();
    });

    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNextImage();
    });

    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show')) {
            console.log('Tecla presionada:', e.key);
            if (e.key === 'Escape' || e.key === 'Esc') {
                closeImageModal();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

    // Asegurarse de que todas las imágenes tengan el atributo data-full
    carImages.forEach(img => {
        if (!img.hasAttribute('data-full')) {
            img.setAttribute('data-full', img.src);
        }
    });

    // Depuración: verificar que los elementos existen
    console.log('Modal encontrado:', !!modal);
    console.log('Botón cerrar:', !!closeModal);
    console.log('Botón anterior:', !!prevBtn);
    console.log('Botón siguiente:', !!nextBtn);
    console.log('Array de imágenes:', imagesArray.length);

    // Smooth scroll para enlaces internos - AGREGA ESTO AL FINAL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Scroll suave
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
});
