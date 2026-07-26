/**
 * Instructional Material & Strategies - Interactive HTML Slide Deck Controller
 */

(function () {
  'use strict';

  // State Management
  let currentIndex = 0; // 0-indexed
  const totalSlides = DECK_SLIDES.length;
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
  const stage = document.getElementById('stage');
  const slideFrame = document.getElementById('slideFrame');
  const slideBody = document.getElementById('slideBody');
  const currentSlideTag = document.getElementById('currentSlideTag');
  const slideInput = document.getElementById('slideInput');
  const totalSlidesText = document.getElementById('totalSlidesText');
  const progressBarFill = document.getElementById('progressBarFill');

  // Controls & Modals
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnSidePrev = document.getElementById('btnSidePrev');
  const btnSideNext = document.getElementById('btnSideNext');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnGrid = document.getElementById('btnGrid');
  const btnPresenter = document.getElementById('btnPresenter');
  const btnDraw = document.getElementById('btnDraw');
  const btnLaser = document.getElementById('btnLaser');
  const btnHelp = document.getElementById('btnHelp');
  const btnAutoplay = document.getElementById('btnAutoplay');
  const autoplaySpeed = document.getElementById('autoplaySpeed');
  const transitionSelect = document.getElementById('transitionSelect');

  // Drawing Canvas
  const drawingCanvas = document.getElementById('drawingCanvas');
  const ctx = drawingCanvas.getContext('2d');
  const drawingBar = document.getElementById('drawingBar');
  const penSizeInput = document.getElementById('penSize');
  const btnClearCanvas = document.getElementById('btnClearCanvas');
  const btnCloseDraw = document.getElementById('btnCloseDraw');
  const colorDots = document.querySelectorAll('.color-dot');

  // Laser & Overlay
  const laserPointer = document.getElementById('laserPointer');
  const screenOverlay = document.getElementById('screenOverlay');
  const overlayMsg = document.getElementById('overlayMsg');

  // Presenter Notes
  const presenterPanel = document.getElementById('presenterPanel');
  const btnClosePresenter = document.getElementById('btnClosePresenter');
  const timerDisplay = document.getElementById('timerDisplay');
  const btnTimerStart = document.getElementById('btnTimerStart');
  const btnTimerReset = document.getElementById('btnTimerReset');
  const notesTitle = document.getElementById('notesTitle');
  const notesText = document.getElementById('notesText');
  const nextSlideTitle = document.getElementById('nextSlideTitle');

  // Modals
  const gridModal = document.getElementById('gridModal');
  const btnCloseGrid = document.getElementById('btnCloseGrid');
  const gridContainer = document.getElementById('gridContainer');
  const helpModal = document.getElementById('helpModal');
  const btnCloseHelp = document.getElementById('btnCloseHelp');

  // Initialize Application
  function init() {
    totalSlidesText.textContent = totalSlides;
    slideInput.max = totalSlides;

    renderGridItems();
    goToSlide(0);

    setupEventListeners();
    resizeCanvas();
  }

  // Go to Slide Function
  function goToSlide(index, direction = 'next') {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentIndex = index;

    // Apply Transition Animation
    const transitionType = transitionSelect.value || 'transition-slide';
    document.body.className = `${transitionType} ${isDrawingMode ? 'drawing-mode' : ''}`;

    if (direction === 'next') {
      slideFrame.classList.add('changing-next', 'changing');
    } else {
      slideFrame.classList.add('changing-prev', 'changing');
    }

    setTimeout(() => {
      renderSlideContent(currentIndex);
      slideInput.value = currentIndex + 1;
      
      // Update Progress Bar
      const progress = ((currentIndex + 1) / totalSlides) * 100;
      progressBarFill.style.width = `${progress}%`;

      // Clear Canvas
      clearCanvas();

      // Update Presenter Panel & Grid Highlight
      updatePresenterView();
      updateGridHighlight();

      setTimeout(() => {
        slideFrame.classList.remove('changing-next', 'changing-prev', 'changing');
      }, 50);
    }, 150);
  }

  // Render HTML Slide Content
  function renderSlideContent(idx) {
    const slide = DECK_SLIDES[idx];
    currentSlideTag.textContent = slide.tag;

    let html = '';

    // Title Slide (Slide 1)
    if (slide.number === 1) {
      html = `
        <div style="text-align: center; max-width: 800px; margin: 0 auto;">
          <span class="slide-header-tag">${slide.tag}</span>
          <h1 class="slide-title-hero">INSTRUCTIONAL MATERIAL / STRATEGY OF TEACHING</h1>
          <p class="slide-subtitle">A Comprehensive Guide to Methods, Techniques, Strategies & Educational Devices</p>
          <div style="margin-top: 30px; display: inline-flex; gap: 20px; background: rgba(0,0,0,0.3); padding: 12px 24px; border-radius: 30px; border: 1px solid var(--border-mint);">
            <span style="font-size: 0.9rem; color: var(--primary-mint); font-weight: 700;">Presenter: Shawn Garcia | Liceria & Co.</span>
            <span style="font-size: 0.9rem; color: var(--text-muted);">2026 February 9</span>
          </div>
        </div>
      `;
    }
    // Bible Verse Slide (Slide 45)
    else if (slide.number === 45) {
      html = `
        <div style="text-align: center; max-width: 800px; margin: 0 auto; padding: 30px; background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px solid var(--border-mint);">
          <span class="slide-header-tag">BIBLE VERSE</span>
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #fff; line-height: 1.6; margin-bottom: 20px;">
            “A WISE MAN IS FULL OF STRENGTH, AND A MAN OF KNOWLEDGE ENHANCES HIS MIGHT, FOR BY WISE GUIDANCE YOU CAN WAGE YOUR WAR, AND IN ABUNDANCE OF COUNSELORS THERE IS VICTORY.”
          </h2>
          <div style="font-size: 1.1rem; color: var(--primary-mint); font-weight: 800; letter-spacing: 0.05em;">PROVERBS 24:5-6</div>
        </div>
      `;
    }
    // Closing Slide (Slide 46)
    else if (slide.number === 46) {
      html = `
        <div style="text-align: center; max-width: 700px; margin: 0 auto;">
          <span class="slide-header-tag">THE END</span>
          <h1 class="slide-title-hero" style="font-size: 3.5rem;">THANK YOU FOR LISTENING</h1>
          <p style="font-size: 1.1rem; color: var(--text-muted); margin-top: 20px;">Shawn Garcia • Liceria & Co.</p>
        </div>
      `;
    }
    // Content Slides with Images & Bullets
    else {
      const hasImage = slide.images && slide.images.length > 0;

      if (hasImage) {
        html = `
          <span class="slide-header-tag">${slide.tag} • SLIDE ${slide.number}</span>
          <div class="slide-split-grid">
            <div>
              <h2 class="slide-main-title">${slide.title}</h2>
              <div class="slide-bullets-list">
                ${slide.bullets.map(b => `<div class="slide-bullet-item"><span>${b}</span></div>`).join('')}
              </div>
            </div>
            <div class="slide-image-box">
              <img src="${slide.images[0]}" alt="${slide.title}">
            </div>
          </div>
        `;
      } else {
        html = `
          <span class="slide-header-tag">${slide.tag} • SLIDE ${slide.number}</span>
          <h2 class="slide-main-title">${slide.title}</h2>
          <div class="slide-bullets-list">
            ${slide.bullets.map(b => `<div class="slide-bullet-item"><span>${b}</span></div>`).join('')}
          </div>
        `;
      }
    }

    slideBody.innerHTML = html;
  }

  // Update Presenter Notes
  function updatePresenterView() {
    const slide = DECK_SLIDES[currentIndex];
    notesTitle.textContent = `Slide ${slide.number}: ${slide.title}`;
    notesText.textContent = slide.raw_text || 'No speaker notes for this slide.';

    const nextIndex = currentIndex + 1;
    if (nextIndex < totalSlides) {
      nextSlideTitle.textContent = `Slide ${DECK_SLIDES[nextIndex].number}: ${DECK_SLIDES[nextIndex].title}`;
    } else {
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

  // Render Grid Overview Items
  function renderGridItems() {
    gridContainer.innerHTML = '';
    DECK_SLIDES.forEach((slide, idx) => {
      const item = document.createElement('div');
      item.className = `grid-item ${idx === currentIndex ? 'active' : ''}`;
      item.setAttribute('data-index', idx);
      item.innerHTML = `
        <div class="grid-num">SLIDE ${slide.number}</div>
        <div class="grid-title">${slide.title}</div>
      `;

      item.addEventListener('click', () => {
        goToSlide(idx);
        gridModal.classList.remove('active');
      });

      gridContainer.appendChild(item);
    });
  }

  function updateGridHighlight() {
    const items = gridContainer.querySelectorAll('.grid-item');
    items.forEach(item => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      if (idx === currentIndex) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  // Auto-Play Slideshow
  function toggleAutoplay() {
    isAutoplay = !isAutoplay;
    btnAutoplay.classList.toggle('active', isAutoplay);
    document.getElementById('autoplayText').textContent = isAutoplay ? 'Pause' : 'Auto Play';

    if (isAutoplay) {
      const speed = parseInt(autoplaySpeed.value, 10);
      autoplayTimer = setInterval(() => {
        if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1, 'next');
        else goToSlide(0, 'next');
      }, speed);
    } else {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }
  }

  // Laser Pointer
  function toggleLaser() {
    isLaserActive = !isLaserActive;
    btnLaser.classList.toggle('active', isLaserActive);
    laserPointer.style.display = isLaserActive ? 'block' : 'none';
    if (isLaserActive && isDrawingMode) toggleDrawingMode();
  }

  // Pen Drawing Tool
  function toggleDrawingMode() {
    isDrawingMode = !isDrawingMode;
    btnDraw.classList.toggle('active', isDrawingMode);
    drawingBar.style.display = isDrawingMode ? 'flex' : 'none';
    document.body.classList.toggle('drawing-mode', isDrawingMode);
    if (isDrawingMode && isLaserActive) toggleLaser();
  }

  function resizeCanvas() {
    drawingCanvas.width = slideFrame.clientWidth;
    drawingCanvas.height = slideFrame.clientHeight;
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

  function stopDrawing() { isDrawing = false; }
  function clearCanvas() { ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); }

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

  // Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  // Touch Swipe
  let touchStartX = 0;
  let touchEndX = 0;

  function handleTouchStart(e) { touchStartX = e.changedTouches[0].screenX; }
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goToSlide(currentIndex + 1, 'next');
      else goToSlide(currentIndex - 1, 'prev');
    }
  }

  // Event Listeners Setup
  function setupEventListeners() {
    btnNext.addEventListener('click', () => goToSlide(currentIndex + 1, 'next'));
    btnPrev.addEventListener('click', () => goToSlide(currentIndex - 1, 'prev'));
    btnSideNext.addEventListener('click', () => goToSlide(currentIndex + 1, 'next'));
    btnSidePrev.addEventListener('click', () => goToSlide(currentIndex - 1, 'prev'));

    slideInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) goToSlide(val - 1);
    });

    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnGrid.addEventListener('click', () => gridModal.classList.add('active'));
    btnCloseGrid.addEventListener('click', () => gridModal.classList.remove('active'));

    btnPresenter.addEventListener('click', () => presenterPanel.classList.toggle('active'));
    btnClosePresenter.addEventListener('click', () => presenterPanel.classList.remove('active'));

    btnHelp.addEventListener('click', () => helpModal.classList.add('active'));
    btnCloseHelp.addEventListener('click', () => helpModal.classList.remove('active'));

    btnAutoplay.addEventListener('click', toggleAutoplay);

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

    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseleave', stopDrawing);

    stage.addEventListener('mousemove', (e) => {
      if (isLaserActive) {
        laserPointer.style.left = `${e.clientX}px`;
        laserPointer.style.top = `${e.clientY}px`;
      }
    });

    stage.addEventListener('touchstart', handleTouchStart, { passive: true });
    stage.addEventListener('touchend', handleTouchEnd, { passive: true });

    btnTimerStart.addEventListener('click', toggleTimer);
    btnTimerReset.addEventListener('click', resetTimer);

    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

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
        case 'Home': goToSlide(0); break;
        case 'End': goToSlide(totalSlides - 1); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'o': case 'O': case 'g': case 'G': gridModal.classList.toggle('active'); break;
        case 'p': case 'P': presenterPanel.classList.toggle('active'); break;
        case 'l': case 'L': toggleLaser(); break;
        case 'd': case 'D': toggleDrawingMode(); break;
        case 'b': case 'B': toggleBlackout(); break;
        case 'w': case 'W': toggleWhiteout(); break;
        case '?': helpModal.classList.toggle('active'); break;
        case 'Escape':
          gridModal.classList.remove('active');
          helpModal.classList.remove('active');
          if (isBlackout || isWhiteout) {
            screenOverlay.className = 'screen-overlay';
            isBlackout = false; isWhiteout = false;
          }
          break;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
