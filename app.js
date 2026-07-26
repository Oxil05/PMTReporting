/**
 * Instructional Material & Strategies - Interactive Deck Controller
 */

(function () {
  'use strict';

  // State Management
  let currentIndex = 0; // 0-indexed
  const totalSlides = SLIDES_DATA.length;
  let isAutoplay = false;
  let autoplayTimer = null;
  let isLaserActive = false;
  let isDrawingMode = false;
  let isBlackout = false;
  let isWhiteout = false;
  let timerInterval = null;
  let timerSeconds = 0;
  let currentPenColor = '#ff4757';
  let currentPenSize = 4;
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // DOM Elements
  const slideContainer = document.getElementById('slideContainer');
  const slideWrapper = document.getElementById('slideWrapper');
  const currentSlideImg = document.getElementById('currentSlideImg');
  const slideHeaderTitle = document.getElementById('slideHeaderTitle');
  const slideInput = document.getElementById('slideInput');
  const totalSlidesCount = document.getElementById('totalSlidesCount');

  // Controls & Modals
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const hotspotPrev = document.getElementById('hotspotPrev');
  const hotspotNext = document.getElementById('hotspotNext');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnGrid = document.getElementById('btnGrid');
  const btnSearch = document.getElementById('btnSearch');
  const btnPresenter = document.getElementById('btnPresenter');
  const btnDraw = document.getElementById('btnDraw');
  const btnLaser = document.getElementById('btnLaser');
  const btnHelp = document.getElementById('btnHelp');
  const btnAutoplay = document.getElementById('btnAutoplay');
  const autoplaySpeed = document.getElementById('autoplaySpeed');
  const transitionSelect = document.getElementById('transitionSelect');
  const btnOriginalPdf = document.getElementById('btnOriginalPdf');

  // Drawing Canvas
  const drawingCanvas = document.getElementById('drawingCanvas');
  const ctx = drawingCanvas.getContext('2d');
  const drawingToolbar = document.getElementById('drawingToolbar');
  const penSizeInput = document.getElementById('penSize');
  const btnClearCanvas = document.getElementById('btnClearCanvas');
  const btnCloseDraw = document.getElementById('btnCloseDraw');
  const colorDots = document.querySelectorAll('.color-dot');

  // Laser Pointer
  const laserPointer = document.getElementById('laserPointer');
  const presentationStage = document.getElementById('presentationStage');

  // Screen Overlay
  const screenOverlay = document.getElementById('screenOverlay');
  const overlayMsg = document.getElementById('overlayMsg');

  // Presenter Panel
  const presenterPanel = document.getElementById('presenterPanel');
  const btnClosePresenter = document.getElementById('btnClosePresenter');
  const timerDisplay = document.getElementById('timerDisplay');
  const btnTimerStart = document.getElementById('btnTimerStart');
  const btnTimerReset = document.getElementById('btnTimerReset');
  const notesSlideTitle = document.getElementById('notesSlideTitle');
  const notesContent = document.getElementById('notesContent');
  const nextSlideImg = document.getElementById('nextSlideImg');
  const nextSlideTitle = document.getElementById('nextSlideTitle');

  // Modals
  const gridModal = document.getElementById('gridModal');
  const btnCloseGrid = document.getElementById('btnCloseGrid');
  const slidesGridContainer = document.getElementById('slidesGridContainer');
  const gridSearchInput = document.getElementById('gridSearchInput');

  const searchModal = document.getElementById('searchModal');
  const btnCloseSearch = document.getElementById('btnCloseSearch');
  const searchInput = document.getElementById('searchInput');
  const searchResultsList = document.getElementById('searchResultsList');

  const helpModal = document.getElementById('helpModal');
  const btnCloseHelp = document.getElementById('btnCloseHelp');

  // Initialize
  function init() {
    totalSlidesCount.textContent = totalSlides;
    slideInput.max = totalSlides;

    renderGridThumbnails();
    goToSlide(0);

    // Event Listeners
    setupEventListeners();
    preloadAdjacentImages();
    resizeCanvas();
  }

  // Go to Slide Function with Animations
  function goToSlide(index, direction = 'next') {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    const oldIndex = currentIndex;
    currentIndex = index;

    // Apply animation class
    const transitionType = transitionSelect.value || 'transition-fade';
    document.body.className = `${transitionType} ${isDrawingMode ? 'drawing-mode' : ''}`;
    
    if (direction === 'next') {
      slideWrapper.classList.add('slide-changing-next', 'slide-changing');
    } else {
      slideWrapper.classList.add('slide-changing-prev', 'slide-changing');
    }

    setTimeout(() => {
      const slide = SLIDES_DATA[currentIndex];
      currentSlideImg.src = slide.image;
      slideHeaderTitle.textContent = slide.title;
      slideInput.value = currentIndex + 1;

      // Clear drawing on slide change
      clearCanvas();

      // Update Presenter View
      updatePresenterView();

      // Highlight in Grid if open
      updateGridHighlight();

      setTimeout(() => {
        slideWrapper.classList.remove('slide-changing-next', 'slide-changing-prev', 'slide-changing');
      }, 50);
    }, 150);

    preloadAdjacentImages();
  }

  // Preload images around current slide
  function preloadAdjacentImages() {
    const indicesToPreload = [currentIndex - 1, currentIndex + 1, currentIndex + 2];
    indicesToPreload.forEach(idx => {
      if (idx >= 0 && idx < totalSlides) {
        const img = new Image();
        img.src = SLIDES_DATA[idx].image;
      }
    });
  }

  // Update Presenter Side Panel
  function updatePresenterView() {
    const slide = SLIDES_DATA[currentIndex];
    notesSlideTitle.textContent = `Slide ${slide.id}: ${slide.title}`;
    notesContent.textContent = slide.content || 'No speaker notes for this slide.';

    const nextIndex = currentIndex + 1;
    if (nextIndex < totalSlides) {
      const nextSlide = SLIDES_DATA[nextIndex];
      nextSlideImg.src = nextSlide.image;
      nextSlideImg.style.display = 'block';
      nextSlideTitle.textContent = `Slide ${nextSlide.id}: ${nextSlide.title}`;
    } else {
      nextSlideImg.style.display = 'none';
      nextSlideTitle.textContent = 'End of presentation';
    }
  }

  // Timer Controls
  function toggleTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      btnTimerStart.textContent = 'Start';
    } else {
      btnTimerStart.textContent = 'Pause';
      timerInterval = setInterval(() => {
        timerSeconds++;
        const hrs = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
      }, 1000);
    }
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerSeconds = 0;
    timerDisplay.textContent = '00:00:00';
    btnTimerStart.textContent = 'Start';
  }

  // Render Grid Thumbnails
  function renderGridThumbnails(filterText = '') {
    slidesGridContainer.innerHTML = '';
    
    SLIDES_DATA.forEach((slide, idx) => {
      if (filterText && !slide.title.toLowerCase().includes(filterText.toLowerCase()) && !slide.content.toLowerCase().includes(filterText.toLowerCase())) {
        return;
      }

      const card = document.createElement('div');
      card.className = `slide-grid-card ${idx === currentIndex ? 'active' : ''}`;
      card.setAttribute('data-index', idx);

      card.innerHTML = `
        <img src="${slide.image}" class="grid-card-thumb" alt="Slide ${slide.id}" loading="lazy">
        <div class="grid-card-info">
          <span class="grid-card-title">${slide.title}</span>
          <span class="grid-card-num">#${slide.id}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        goToSlide(idx);
        gridModal.classList.remove('active');
      });

      slidesGridContainer.appendChild(card);
    });
  }

  function updateGridHighlight() {
    const cards = slidesGridContainer.querySelectorAll('.slide-grid-card');
    cards.forEach(card => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      if (idx === currentIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Live Full-Text Search
  function performSearch(query) {
    if (!query.trim()) {
      searchResultsList.innerHTML = '<div class="empty-search">Type a query above to search across all slides...</div>';
      return;
    }

    const matches = [];
    const q = query.toLowerCase();

    SLIDES_DATA.forEach((slide, idx) => {
      if (slide.title.toLowerCase().includes(q) || slide.content.toLowerCase().includes(q)) {
        // Snippet extraction
        let snippet = slide.content.replace(/\n/g, ' ');
        const matchPos = snippet.toLowerCase().indexOf(q);
        if (matchPos !== -1) {
          const start = Math.max(0, matchPos - 30);
          const end = Math.min(snippet.length, matchPos + 70);
          snippet = (start > 0 ? '...' : '') + snippet.substring(start, end) + (end < snippet.length ? '...' : '');
        } else {
          snippet = snippet.substring(0, 100) + '...';
        }

        matches.push({ slide, idx, snippet });
      }
    });

    if (matches.length === 0) {
      searchResultsList.innerHTML = `<div class="empty-search">No matching slides found for "${query}"</div>`;
      return;
    }

    searchResultsList.innerHTML = '';
    matches.forEach(item => {
      const resItem = document.createElement('div');
      resItem.className = 'search-result-item';
      resItem.innerHTML = `
        <div class="search-item-header">
          <span class="search-item-title">${item.slide.title}</span>
          <span class="search-item-num">Slide ${item.slide.id}</span>
        </div>
        <div class="search-item-snippet">${item.snippet}</div>
      `;

      resItem.addEventListener('click', () => {
        goToSlide(item.idx);
        searchModal.classList.remove('active');
      });

      searchResultsList.appendChild(resItem);
    });
  }

  // Auto-Play Slideshow Toggle
  function toggleAutoplay() {
    isAutoplay = !isAutoplay;

    if (isAutoplay) {
      btnAutoplay.classList.add('active');
      document.getElementById('autoplayText').textContent = 'Pause';
      const speed = parseInt(autoplaySpeed.value, 10);
      autoplayTimer = setInterval(() => {
        if (currentIndex < totalSlides - 1) {
          goToSlide(currentIndex + 1, 'next');
        } else {
          goToSlide(0, 'next'); // Loop back
        }
      }, speed);
    } else {
      btnAutoplay.classList.remove('active');
      document.getElementById('autoplayText').textContent = 'Auto Play';
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
  }

  // Laser Pointer Logic
  function toggleLaser() {
    isLaserActive = !isLaserActive;
    btnLaser.classList.toggle('active', isLaserActive);
    if (isLaserActive) {
      laserPointer.style.display = 'block';
      if (isDrawingMode) toggleDrawingMode(); // Mutually exclusive
    } else {
      laserPointer.style.display = 'none';
    }
  }

  // Pen / Drawing Tool Logic
  function toggleDrawingMode() {
    isDrawingMode = !isDrawingMode;
    btnDraw.classList.toggle('active', isDrawingMode);
    drawingToolbar.style.display = isDrawingMode ? 'flex' : 'none';
    document.body.classList.toggle('drawing-mode', isDrawingMode);

    if (isDrawingMode && isLaserActive) toggleLaser();
  }

  function resizeCanvas() {
    if (currentSlideImg) {
      drawingCanvas.width = currentSlideImg.clientWidth || slideWrapper.clientWidth;
      drawingCanvas.height = currentSlideImg.clientHeight || slideWrapper.clientHeight;
    }
  }

  function startDrawing(e) {
    if (!isDrawingMode) return;
    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  }

  function draw(e) {
    if (!isDrawing || !isDrawingMode) return;
    const rect = drawingCanvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = currentPenColor;
    ctx.lineWidth = currentPenSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }

  // Blackout / Whiteout
  function toggleBlackout() {
    isBlackout = !isBlackout;
    isWhiteout = false;
    screenOverlay.className = `screen-overlay ${isBlackout ? 'active blackout' : ''}`;
    overlayMsg.textContent = 'Screen Blackout (Press B to Resume)';
  }

  function toggleWhiteout() {
    isWhiteout = !isWhiteout;
    isBlackout = false;
    screenOverlay.className = `screen-overlay ${isWhiteout ? 'active whiteout' : ''}`;
    overlayMsg.textContent = 'Screen Whiteout (Press W to Resume)';
  }

  // Fullscreen Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Touch Swipe Gesture
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        goToSlide(currentIndex + 1, 'next'); // Swipe Left -> Next
      } else {
        goToSlide(currentIndex - 1, 'prev'); // Swipe Right -> Prev
      }
    }
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Navigation
    btnNext.addEventListener('click', () => goToSlide(currentIndex + 1, 'next'));
    btnPrev.addEventListener('click', () => goToSlide(currentIndex - 1, 'prev'));
    hotspotNext.addEventListener('click', () => goToSlide(currentIndex + 1, 'next'));
    hotspotPrev.addEventListener('click', () => goToSlide(currentIndex - 1, 'prev'));

    slideInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) goToSlide(val - 1);
    });

    // Header buttons
    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnGrid.addEventListener('click', () => gridModal.classList.add('active'));
    btnCloseGrid.addEventListener('click', () => gridModal.classList.remove('active'));
    gridSearchInput.addEventListener('input', (e) => renderGridThumbnails(e.target.value));

    btnSearch.addEventListener('click', () => {
      searchModal.classList.add('active');
      searchInput.focus();
    });
    btnCloseSearch.addEventListener('click', () => searchModal.classList.remove('active'));
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));

    btnPresenter.addEventListener('click', () => presenterPanel.classList.toggle('active'));
    btnClosePresenter.addEventListener('click', () => presenterPanel.classList.remove('active'));

    btnHelp.addEventListener('click', () => helpModal.classList.add('active'));
    btnCloseHelp.addEventListener('click', () => helpModal.classList.remove('active'));

    btnOriginalPdf.addEventListener('click', () => {
      window.open('Green Monochromatic Simple The Minimalist Presentation Template.pdf', '_blank');
    });

    // Auto play & Speed
    btnAutoplay.addEventListener('click', toggleAutoplay);

    // Laser & Pen
    btnLaser.addEventListener('click', toggleLaser);
    btnDraw.addEventListener('click', toggleDrawingMode);
    btnCloseDraw.addEventListener('click', toggleDrawingMode);
    btnClearCanvas.addEventListener('click', clearCanvas);

    penSizeInput.addEventListener('input', (e) => currentPenSize = e.target.value);
    colorDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        colorDots.forEach(d => d.classList.remove('active'));
        e.target.classList.add('active');
        currentPenColor = e.target.getAttribute('data-color');
      });
    });

    // Drawing Canvas events
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseleave', stopDrawing);

    // Laser Pointer movement
    presentationStage.addEventListener('mousemove', (e) => {
      if (isLaserActive) {
        laserPointer.style.left = `${e.clientX}px`;
        laserPointer.style.top = `${e.clientY}px`;
      }
    });

    // Touch events for mobile/tablet swipe
    presentationStage.addEventListener('touchstart', handleTouchStart, { passive: true });
    presentationStage.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Presenter Timer
    btnTimerStart.addEventListener('click', toggleTimer);
    btnTimerReset.addEventListener('click', resetTimer);

    // Window Resize -> Resize canvas
    window.addEventListener('resize', resizeCanvas);

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
          gridModal.classList.remove('active');
          searchModal.classList.remove('active');
          helpModal.classList.remove('active');
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
        case 'PageDown':
          e.preventDefault();
          goToSlide(currentIndex + 1, 'next');
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goToSlide(currentIndex - 1, 'prev');
          break;
        case 'Home':
          goToSlide(0);
          break;
        case 'End':
          goToSlide(totalSlides - 1);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'o':
        case 'O':
        case 'g':
        case 'G':
          gridModal.classList.toggle('active');
          break;
        case 'p':
        case 'P':
          presenterPanel.classList.toggle('active');
          break;
        case 's':
        case 'S':
          searchModal.classList.toggle('active');
          if (searchModal.classList.contains('active')) searchInput.focus();
          break;
        case 'l':
        case 'L':
          toggleLaser();
          break;
        case 'd':
        case 'D':
          toggleDrawingMode();
          break;
        case 'b':
        case 'B':
          toggleBlackout();
          break;
        case 'w':
        case 'W':
          toggleWhiteout();
          break;
        case '?':
          helpModal.classList.toggle('active');
          break;
        case 'Escape':
          gridModal.classList.remove('active');
          searchModal.classList.remove('active');
          helpModal.classList.remove('active');
          if (isBlackout || isWhiteout) {
            screenOverlay.className = 'screen-overlay';
            isBlackout = false;
            isWhiteout = false;
          }
          break;
      }
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
