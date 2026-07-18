document.addEventListener('DOMContentLoaded', () => {
    const swipeBtn = document.getElementById('swipe-start');
    if (!swipeBtn) return;

    const thumb = swipeBtn.querySelector('.swipe-thumb');
    const fill = swipeBtn.querySelector('.swipe-fill');
    const text = swipeBtn.querySelector('.swipe-text');

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let maxTranslate = 0;

    // Calculate max translation (track width - thumb width - padding)
    const updateDimensions = () => {
        const btnRect = swipeBtn.getBoundingClientRect();
        const thumbRect = thumb.getBoundingClientRect();
        // 3px left padding + 3px right padding = 6px
        maxTranslate = btnRect.width - thumbRect.width - 6; 
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const onPointerDown = (e) => {
        if (swipeBtn.classList.contains('success')) return; // Already unlocked

        isDragging = true;
        startX = e.clientX || (e.touches && e.touches[0].clientX);
        
        // Remove transitions during drag for immediate response
        thumb.style.transition = 'none';
        fill.style.transition = 'none';
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        let deltaX = clientX - startX;

        // Constrain movement
        if (deltaX < 0) deltaX = 0;
        if (deltaX > maxTranslate) deltaX = maxTranslate;

        currentX = deltaX;

        // Apply transformations
        thumb.style.transform = `translateX(${currentX}px)`;
        fill.style.width = `${currentX + 26}px`; // 26px to cover half the thumb
    };

    const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;

        // Restore transitions for snapping
        thumb.style.transition = 'transform 0.3s ease-out';
        fill.style.transition = 'width 0.3s ease-out';

        // Check if swiped all the way (allow small margin of error, 95%)
        if (currentX >= maxTranslate * 0.95) {
            // Success!
            thumb.style.transform = `translateX(${maxTranslate}px)`;
            fill.style.width = `100%`;
            swipeBtn.classList.add('success');
            text.textContent = 'Redirigiendo...';
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'contacto.html'; // Default link
            }, 600);
        } else {
            // Snap back
            currentX = 0;
            thumb.style.transform = `translateX(0px)`;
            fill.style.width = `0px`;
        }
    };

    // Use standard events since touch events are sometimes wonky with pointer events on mobile
    thumb.addEventListener('mousedown', onPointerDown);
    thumb.addEventListener('touchstart', onPointerDown, {passive: true});
    
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, {passive: true});
    
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
});
