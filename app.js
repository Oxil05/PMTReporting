/**
 * Instructional Material & Strategies - Slide Deck Controller with PowerPoint Live Text Edit Mode
 */

(function () {
  'use strict';

  // State Management
  let currentIndex = 0; // 0-indexed
  const totalSlides = (typeof DECK_SLIDES !== 'undefined') ? DECK_SLIDES.length : 0;
  let isAutoplay = false;
  let autoplayTimer = null;
  let isLaserActive = false;
  let isDrawingMode = false;
  let isEditMode = false;
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
  const btnEdit = document.getElementById('btnEdit');
  const btnHelp = document.getElementById('btnHelp');
  const btnAutoplay = document.getElementById('btnAutoplay');
  const autoplaySpeed = document.getElementById('autoplaySpeed');

  // Edit Toolbar
  const editBar = document.getElementById('editBar');
  const btnResetSlideText = document.getElementById('btnResetSlideText');
  const btnCloseEdit = document.getElementById('btnCloseEdit');

  // Drawing Canvas
  const drawingCanvas = document.getElementById('drawingCanvas');
  const ctx = drawingCanvas ? drawingCanvas.getContext('2d') : null;
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
    // Clear legacy cached edits from earlier versions
    const CURRENT_DECK_VERSION = 'v4_icebreaker_bibleverse_fixed';
    if (localStorage.getItem('deck_version') !== CURRENT_DECK_VERSION) {
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('slide_edit_')) localStorage.removeItem(key);
        });
      } catch (e) {}
      localStorage.setItem('deck_version', CURRENT_DECK_VERSION);
    }

    if (totalSlidesText) totalSlidesText.textContent = totalSlides;
    if (slideInput) slideInput.max = totalSlides;

    renderGridItems();
    goToSlide(0);

    setupEventListeners();
    resizeCanvas();
  }

  // Go to Slide Function - Instant 0ms Slide Navigation
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentIndex = index;

    // Render Slide Content INSTANTLY (0ms)
    try {
      renderSlideContent(currentIndex);
    } catch (err) {
      console.error('Slide render error:', err);
    }

    // Update Controls & Counters
    if (slideInput) slideInput.value = currentIndex + 1;
    
    if (progressBarFill && totalSlides > 0) {
      const progress = ((currentIndex + 1) / totalSlides) * 100;
      progressBarFill.style.width = `${progress}%`;
    }

    clearCanvas();
    updatePresenterView();
    updateGridHighlight();

    // Trigger subtle entrance animation on slideBody
    if (slideBody) {
      slideBody.classList.remove('slide-animate');
      void slideBody.offsetWidth; // Reflow
      slideBody.classList.add('slide-animate');
    }
  }

  // Render HTML Slide Content (With localStorage Overrides for Edited Text)
  function renderSlideContent(idx) {
    if (typeof DECK_SLIDES === 'undefined' || !DECK_SLIDES.length) return;
    let slide = DECK_SLIDES[idx] || { number: idx + 1, tag: 'REPORTING', title: `Slide ${idx + 1}`, paragraphs: [] };
    
    // Check for saved local edit
    const savedEdit = localStorage.getItem(`slide_edit_${idx}`);
    if (savedEdit) {
      try {
        const parsed = JSON.parse(savedEdit);
        slide = { ...slide, ...parsed };
      } catch (e) {
        console.error('Failed parsing slide edit:', e);
      }
    }

    if (currentSlideTag) currentSlideTag.textContent = slide.tag || 'REPORTING';

    let html = '';

    // Title Slide (Slide 1)
    if (slide.number === 1) {
      html = `
        <div style="text-align: center; max-width: 850px; margin: 0 auto; width: 100%;">
          <span class="slide-header-tag editable-target" data-field="tag">${slide.tag || 'INTRODUCTION'}</span>
          <h1 class="slide-title-hero editable-target" data-field="title">${slide.title || 'INSTRUCTIONAL MATERIAL / STRATEGY OF TEACHING'}</h1>
          <p class="slide-subtitle editable-target" data-field="subtitle">${slide.subtitle || 'A Comprehensive Guide to Methods, Techniques, Strategies & Educational Devices'}</p>
          <div style="margin-top: 20px; display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 16px; background: rgba(0,0,0,0.35); padding: 12px 24px; border-radius: 30px; border: 1px solid var(--border-mint);">
            <span style="font-size: 0.9rem; color: var(--primary-mint); font-weight: 700;">Group 5 • BSIT-31A</span>
            <span style="font-size: 0.9rem; color: var(--text-muted);">Shawn Garcia • Liceria & Co.</span>
          </div>
        </div>
      `;
    }
    // Ice Breaker Slide (Slide 4)
    else if (slide.number === 4) {
      const hasImage = slide.images && slide.images.length > 0;
      if (hasImage) {
        html = `
          <div style="text-align: center; max-width: 850px; margin: 0 auto; width: 100%;">
            <span class="slide-header-tag editable-target" data-field="tag">ICE BREAKER</span>
            <h1 class="slide-title-hero editable-target" data-field="title" style="font-size: clamp(2.2rem, 5vw, 3.8rem); color: var(--primary-mint); margin-bottom: 24px;">ICE BREAKER</h1>
            <div class="slide-image-box" style="max-height: clamp(250px, 45vh, 400px); margin: 0 auto;">
              <img src="${slide.images[0]}" alt="Ice Breaker" decoding="async" loading="lazy">
            </div>
          </div>
        `;
      } else {
        html = `
          <div style="text-align: center; max-width: 850px; margin: 0 auto; width: 100%;">
            <span class="slide-header-tag editable-target" data-field="tag">ICE BREAKER</span>
            <h1 class="slide-title-hero editable-target" data-field="title" style="font-size: clamp(2.5rem, 6vw, 4.2rem); color: var(--primary-mint); margin-top: 20px;">ICE BREAKER</h1>
          </div>
        `;
      }
    }
    // Bible Verse Slide (Slide 45)
    else if (slide.number === 45) {
      const verseText = "“A WISE MAN IS FULL OF STRENGTH, AND A MAN OF KNOWLEDGE ENHANCES HIS MIGHT, FOR BY WISE GUIDANCE YOU CAN WAGE YOUR WAR, AND IN ABUNDANCE OF COUNSELORS THERE IS VICTORY.”";
      const citation = "PROVERBS 24:5-6";

      html = `
        <div style="text-align: center; max-width: 850px; margin: 0 auto; padding: 32px 24px; background: rgba(0,0,0,0.35); border-radius: 16px; border: 1px solid var(--border-mint); width: 100%;">
          <span class="slide-header-tag editable-target" data-field="tag">BIBLE VERSE</span>
          <blockquote class="editable-target" data-field="verse" style="font-family: var(--font-heading); font-size: clamp(1.2rem, 2.5vw, 1.85rem); color: #ffffff; line-height: 1.6; margin: 20px 0; font-weight: 600; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
            ${verseText}
          </blockquote>
          <div class="editable-target" data-field="citation" style="font-size: clamp(1.1rem, 2vw, 1.35rem); color: var(--primary-mint); font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
            ${citation}
          </div>
        </div>
      `;
    }
    // Closing Slide (Slide 46)
    else if (slide.number === 46) {
      html = `
        <div style="text-align: center; max-width: 700px; margin: 0 auto; width: 100%;">
          <span class="slide-header-tag editable-target" data-field="tag">THE END</span>
          <h1 class="slide-title-hero editable-target" data-field="title">${slide.title || 'THANK YOU FOR LISTENING'}</h1>
          <p class="editable-target" data-field="subtitle" style="font-size: 1.1rem; color: var(--text-muted); margin-top: 16px;">${slide.subtitle || 'Shawn Garcia • Liceria & Co.'}</p>
        </div>
      `;
    }
    // Content Slides
    else {
      const hasImage = slide.images && slide.images.length > 0;
      let displayParas = slide.paragraphs || [];

      if (!displayParas.length && slide.raw_text) {
        displayParas = [slide.raw_text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim()];
      }

      const contentHtml = displayParas.map((p, pIdx) => {
        if (/^[-•*▪]\s|^\d+\.\s/.test(p)) {
          return `<div class="slide-paragraph-box"><span class="bullet-icon">✦</span><span class="editable-target" data-para-idx="${pIdx}">${p}</span></div>`;
        } else {
          return `<p class="slide-paragraph-plain editable-target" data-para-idx="${pIdx}">${p}</p>`;
        }
      }).join('');

      if (hasImage) {
        html = `
          <span class="slide-header-tag editable-target" data-field="tag">${slide.tag || 'REPORTING'}</span>
          <div class="slide-split-grid">
            <div>
              <h2 class="slide-main-title editable-target" data-field="title">${slide.title}</h2>
              <div class="slide-text-container">
                ${contentHtml}
              </div>
            </div>
            <div class="slide-image-box">
              <img src="${slide.images[0]}" alt="${slide.title}" decoding="async" loading="lazy">
            </div>
          </div>
        `;
      } else {
        html = `
          <span class="slide-header-tag editable-target" data-field="tag">${slide.tag || 'REPORTING'}</span>
          <h2 class="slide-main-title editable-target" data-field="title">${slide.title}</h2>
          <div class="slide-text-container">
            ${contentHtml}
          </div>
        `;
      }
    }

    if (slideBody) {
      slideBody.innerHTML = html;
      applyEditModeState();
    }
  }

  // Toggle Live Edit Mode
  function toggleEditMode() {
    isEditMode = !isEditMode;
    if (btnEdit) btnEdit.classList.toggle('edit-active', isEditMode);
    if (editBar) editBar.style.display = isEditMode ? 'flex' : 'none';
    document.body.classList.toggle('edit-mode', isEditMode);

    if (isEditMode && isDrawingMode) toggleDrawingMode();
    if (isEditMode && isLaserActive) toggleLaser();

    applyEditModeState();
  }

  // Apply contenteditable state to editable targets
  function applyEditModeState() {
    if (!slideBody) return;
    const editableElements = slideBody.querySelectorAll('.editable-target');
    
    editableElements.forEach(el => {
      if (isEditMode) {
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('input', saveSlideEdits);
        el.addEventListener('blur', saveSlideEdits);
      } else {
        el.removeAttribute('contenteditable');
      }
    });
  }

  // Save current slide text edits to localStorage
  function saveSlideEdits() {
    if (!slideBody) return;

    const baseSlide = DECK_SLIDES[currentIndex];
    const editedData = {
      tag: baseSlide.tag,
      title: baseSlide.title,
      paragraphs: [...(baseSlide.paragraphs || [])]
    };

    const tagEl = slideBody.querySelector('.editable-target[data-field="tag"]');
    if (tagEl) editedData.tag = tagEl.innerText.trim();

    const titleEl = slideBody.querySelector('.editable-target[data-field="title"]');
    if (titleEl) editedData.title = titleEl.innerText.trim();

    const paraEls = slideBody.querySelectorAll('.editable-target[data-para-idx]');
    if (paraEls.length > 0) {
      editedData.paragraphs = [];
      paraEls.forEach(pEl => {
        editedData.paragraphs.push(pEl.innerText.trim());
      });
    }

    localStorage.setItem(`slide_edit_${currentIndex}`, JSON.stringify(editedData));
    updateGridItemTitle(currentIndex, editedData.title);
  }

  // Reset slide back to original text
  function resetSlideEdits() {
    localStorage.removeItem(`slide_edit_${currentIndex}`);
    renderSlideContent(currentIndex);
    const origTitle = DECK_SLIDES[currentIndex].title;
    updateGridItemTitle(currentIndex, origTitle);
  }

  function updateGridItemTitle(idx, newTitle) {
    if (!gridContainer) return;
    const item = gridContainer.querySelector(`.grid-item[data-index="${idx}"] .grid-title`);
    if (item) item.textContent = newTitle;
  }

  // Update Presenter Notes
  function updatePresenterView() {
    if (typeof DECK_SLIDES === 'undefined') return;
    const slide = DECK_SLIDES[currentIndex];
    if (!slide) return;

    if (notesTitle) notesTitle.textContent = `Slide ${slide.number}: ${slide.title}`;
    if (notesText) notesText.textContent = slide.raw_text || 'No speaker notes for this slide.';

    const nextIndex = currentIndex + 1;
    if (nextIndex < totalSlides) {
      if (nextSlideTitle) nextSlideTitle.textContent = `Slide ${DECK_SLIDES[nextIndex].number}: ${DECK_SLIDES[nextIndex].title}`;
    } else {
      if (nextSlideTitle) nextSlideTitle.textContent = 'End of presentation';
    }
  }

  // Timer Controls
  function toggleTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      if (btnTimerStart) btnTimerStart.textContent = 'Start';
    } else {
      if (btnTimerStart) btnTimerStart.textContent = 'Pause';
      timerInterval = setInterval(() => {
        timerSeconds++;
        const hrs = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        if (timerDisplay) timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
      }, 1000);
    }
  }

  function resetTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerSeconds = 0;
    if (timerDisplay) timerDisplay.textContent = '00:00:00';
    if (btnTimerStart) btnTimerStart.textContent = 'Start';
  }

  // Render Grid Overview Items
  function renderGridItems() {
    if (!gridContainer || typeof DECK_SLIDES === 'undefined') return;
    gridContainer.innerHTML = '';
    DECK_SLIDES.forEach((slide, idx) => {
      // Check saved edits for grid view
      let displayTitle = slide.title;
      const savedEdit = localStorage.getItem(`slide_edit_${idx}`);
      if (savedEdit) {
        try { displayTitle = JSON.parse(savedEdit).title || displayTitle; } catch(e) {}
      }

      const item = document.createElement('div');
      item.className = `grid-item ${idx === currentIndex ? 'active' : ''}`;
      item.setAttribute('data-index', idx);
      item.innerHTML = `
        <div class="grid-num">SLIDE ${slide.number}</div>
        <div class="grid-title">${displayTitle}</div>
      `;

      item.addEventListener('click', () => {
        goToSlide(idx);
        if (gridModal) gridModal.classList.remove('active');
      });

      gridContainer.appendChild(item);
    });
  }

  function updateGridHighlight() {
    if (!gridContainer) return;
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
    if (btnAutoplay) btnAutoplay.classList.toggle('active', isAutoplay);
    const autoplayText = document.getElementById('autoplayText');
    if (autoplayText) autoplayText.textContent = isAutoplay ? 'Pause' : 'Auto Play';

    if (isAutoplay) {
      const speed = autoplaySpeed ? parseInt(autoplaySpeed.value, 10) : 5000;
      autoplayTimer = setInterval(() => {
        if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
        else goToSlide(0);
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
    if (btnLaser) btnLaser.classList.toggle('active', isLaserActive);
    if (laserPointer) laserPointer.style.display = isLaserActive ? 'block' : 'none';
    if (isLaserActive && isDrawingMode) toggleDrawingMode();
    if (isLaserActive && isEditMode) toggleEditMode();
  }

  // Pen Drawing Tool
  function toggleDrawingMode() {
    isDrawingMode = !isDrawingMode;
    if (btnDraw) btnDraw.classList.toggle('active', isDrawingMode);
    if (drawingBar) drawingBar.style.display = isDrawingMode ? 'flex' : 'none';
    document.body.classList.toggle('drawing-mode', isDrawingMode);
    if (isDrawingMode && isLaserActive) toggleLaser();
    if (isDrawingMode && isEditMode) toggleEditMode();
  }

  function resizeCanvas() {
    if (drawingCanvas && slideFrame) {
      drawingCanvas.width = slideFrame.clientWidth;
      drawingCanvas.height = slideFrame.clientHeight;
    }
  }

  function startDrawing(e) {
    if (!isDrawingMode || !drawingCanvas) return;
    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  }

  function draw(e) {
    if (!isDrawing || !isDrawingMode || !ctx || !drawingCanvas) return;
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
  function clearCanvas() { if (ctx && drawingCanvas) ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); }

  // Blackout / Whiteout
  function toggleBlackout() {
    isBlackout = !isBlackout;
    isWhiteout = false;
    if (screenOverlay) screenOverlay.className = `screen-overlay ${isBlackout ? 'active blackout' : ''}`;
    if (overlayMsg) overlayMsg.textContent = 'Screen Blackout (Press B to Resume)';
  }

  function toggleWhiteout() {
    isWhiteout = !isWhiteout;
    isBlackout = false;
    if (screenOverlay) screenOverlay.className = `screen-overlay ${isWhiteout ? 'active whiteout' : ''}`;
    if (overlayMsg) overlayMsg.textContent = 'Screen Whiteout (Press W to Resume)';
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
    if (isEditMode) return;
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goToSlide(currentIndex + 1);
      else goToSlide(currentIndex - 1);
    }
  }

  // Event Listeners Setup
  function setupEventListeners() {
    if (btnNext) btnNext.addEventListener('click', () => goToSlide(currentIndex + 1));
    if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (btnSideNext) btnSideNext.addEventListener('click', () => goToSlide(currentIndex + 1));
    if (btnSidePrev) btnSidePrev.addEventListener('click', () => goToSlide(currentIndex - 1));

    if (slideInput) {
      slideInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) goToSlide(val - 1);
      });
    }

    if (btnEdit) btnEdit.addEventListener('click', toggleEditMode);
    if (btnCloseEdit) btnCloseEdit.addEventListener('click', toggleEditMode);
    if (btnResetSlideText) btnResetSlideText.addEventListener('click', resetSlideEdits);

    if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
    if (btnGrid) btnGrid.addEventListener('click', () => { if (gridModal) gridModal.classList.add('active'); });
    if (btnCloseGrid) btnCloseGrid.addEventListener('click', () => { if (gridModal) gridModal.classList.remove('active'); });

    if (btnPresenter) btnPresenter.addEventListener('click', () => { if (presenterPanel) presenterPanel.classList.toggle('active'); });
    if (btnClosePresenter) btnClosePresenter.addEventListener('click', () => { if (presenterPanel) presenterPanel.classList.remove('active'); });

    if (btnHelp) btnHelp.addEventListener('click', () => { if (helpModal) helpModal.classList.add('active'); });
    if (btnCloseHelp) btnCloseHelp.addEventListener('click', () => { if (helpModal) helpModal.classList.remove('active'); });

    if (btnAutoplay) btnAutoplay.addEventListener('click', toggleAutoplay);

    if (btnLaser) btnLaser.addEventListener('click', toggleLaser);
    if (btnDraw) btnDraw.addEventListener('click', toggleDrawingMode);
    if (btnCloseDraw) btnCloseDraw.addEventListener('click', toggleDrawingMode);
    if (btnClearCanvas) btnClearCanvas.addEventListener('click', clearCanvas);

    if (penSizeInput) penSizeInput.addEventListener('input', (e) => currentPenSize = e.target.value);
    colorDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        colorDots.forEach(d => d.classList.remove('active'));
        e.target.classList.add('active');
        currentPenColor = e.target.getAttribute('data-color');
      });
    });

    if (drawingCanvas) {
      drawingCanvas.addEventListener('mousedown', startDrawing);
      drawingCanvas.addEventListener('mousemove', draw);
      drawingCanvas.addEventListener('mouseup', stopDrawing);
      drawingCanvas.addEventListener('mouseleave', stopDrawing);
    }

    if (stage) {
      stage.addEventListener('mousemove', (e) => {
        if (isLaserActive && laserPointer) {
          laserPointer.style.left = `${e.clientX}px`;
          laserPointer.style.top = `${e.clientY}px`;
        }
      });

      stage.addEventListener('touchstart', handleTouchStart, { passive: true });
      stage.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    if (btnTimerStart) btnTimerStart.addEventListener('click', toggleTimer);
    if (btnTimerReset) btnTimerReset.addEventListener('click', resetTimer);

    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if user is typing inside input or editing slide text
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
        if (e.key === 'Escape') {
          if (document.activeElement) document.activeElement.blur();
        }
        return;
      }

      switch (e.key) {
        case 'e': case 'E': toggleEditMode(); break;
        case 'ArrowRight':
        case 'Space':
        case 'PageDown':
          e.preventDefault();
          goToSlide(currentIndex + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          goToSlide(currentIndex - 1);
          break;
        case 'Home': goToSlide(0); break;
        case 'End': goToSlide(totalSlides - 1); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'o': case 'O': case 'g': case 'G': if (gridModal) gridModal.classList.toggle('active'); break;
        case 'p': case 'P': if (presenterPanel) presenterPanel.classList.toggle('active'); break;
        case 'l': case 'L': toggleLaser(); break;
        case 'd': case 'D': toggleDrawingMode(); break;
        case 'b': case 'B': toggleBlackout(); break;
        case 'w': case 'W': toggleWhiteout(); break;
        case '?': if (helpModal) helpModal.classList.toggle('active'); break;
        case 'Escape':
          if (isEditMode) toggleEditMode();
          if (gridModal) gridModal.classList.remove('active');
          if (helpModal) helpModal.classList.remove('active');
          if (isBlackout || isWhiteout) {
            if (screenOverlay) screenOverlay.className = 'screen-overlay';
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
