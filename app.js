/**
 * EduStrategy Hub - Interactive Static Web Application Controller
 */

(function () {
  'use strict';

  // Quiz Data (5 Questions based on Presentation Content)
  const QUIZ_QUESTIONS = [
    {
      question: "Which teaching method involves a teacher modeling a skill first with a concrete example, followed by student practice?",
      options: [
        "A. Lecture Method",
        "B. Demonstration / Performance Method",
        "C. Case Study Method",
        "D. Role Playing Method"
      ],
      correct: 1,
      explanation: "Demonstration/Performance method starts with the teacher illustrating a general principle using a real example (modeling), after which students practice that same skill."
    },
    {
      question: "What are the 3 General Techniques of Teaching?",
      options: [
        "A. Lecture, Group Work, and Field Trip",
        "B. Question & Answer, Drill, and Appreciation",
        "C. Direct Instruction, Inquiry, and Assessment",
        "D. Material Devices, Mental Devices, and Replicas"
      ],
      correct: 1,
      explanation: "The 3 general techniques are Question & Answer (Knowledge focus), Drill (Skill & Habits focus), and Appreciation (Attitude focus)."
    },
    {
      question: "Which instructional strategy encourages students to explore ideas, ask questions, and discover answers on their own?",
      options: [
        "A. Direct Instruction",
        "B. Collaborative Learning",
        "C. Inquiry-Based Learning",
        "D. Differentiated Instruction"
      ],
      correct: 2,
      explanation: "Inquiry-Based Learning prompts students to discover answers independently through project-based learning, research, and experiments."
    },
    {
      question: "What type of teaching method recreates real conditions using models when actual experimentation is too dangerous or expensive?",
      options: [
        "A. Field Studies",
        "B. Simulation",
        "C. Discussion",
        "D. Small Group Work"
      ],
      correct: 1,
      explanation: "Simulation recreates real-world conditions in a safe, controlled environment when actual testing is dangerous or costly (e.g. virtual labs)."
    },
    {
      question: "What is the primary role of an educational device in a classroom?",
      options: [
        "A. To completely replace the teacher's lesson procedure",
        "B. To act as a teaching aid that facilitates instruction and captures student attention",
        "C. To serve as the ultimate goal of the lesson",
        "D. Only to provide entertainment to students"
      ],
      correct: 1,
      explanation: "A device is a teaching aid/tool that facilitates instruction, captures attention, and aids comprehension. It is a means to an end, never a substitute for teaching."
    }
  ];

  // Deep-dive Modal content for 8 methods
  const METHOD_DETAILS = {
    'modal-lecture': {
      title: 'A. Lecture Method',
      badge: 'Direct Instruction',
      image: 'assets/images/img_slide_07_1.jpeg',
      description: 'An oral presentation by an expert designed to clarify information to a large group in a short period of time.',
      points: [
        'Resorts to tackling special topics requiring domain expertise.',
        'Efficient delivery for large audiences in limited time.',
        'Best paired with interactive follow-up Q&A sessions.'
      ]
    },
    'modal-demo': {
      title: 'B. Demonstration / Performance',
      badge: 'Skill Modeling',
      image: 'assets/images/img_slide_08_1.jpeg',
      description: 'The teacher illustrates a general principle using a concrete, real example, modeling the skill first before students practice.',
      points: [
        'Scaffolds learning through step-by-step physical or visual modeling.',
        'Encourages immediate hands-on performance by students.',
        'High retention rate through observation and direct practice.'
      ]
    },
    'modal-discussion': {
      title: 'C. Discussion Method',
      badge: 'Interactive Dialogue',
      image: 'assets/images/img_slide_09_1.png',
      description: 'A free, two-way exchange between teacher and students for exploring attitudes, interpretations, questions, and opinions.',
      points: [
        'Moves beyond one-way lectures into deep collaborative discourse.',
        'Helps uncover student perspectives, values, and critical thinking.',
        'Requires strong teacher moderation to keep discourse focused.'
      ]
    },
    'modal-casestudy': {
      title: 'D. Case Study',
      badge: 'Real-World Analysis',
      image: 'assets/images/img_slide_10_1.jpeg',
      description: 'An in-depth investigation of a single subject, group, organization, or event in its real-world context.',
      points: [
        'Aims at applying general principles to complex specific scenarios.',
        'Develops analytical, diagnostic, and decision-making skills.',
        'Widely used in business, science, social studies, and ethics.'
      ]
    },
    'modal-groupwork': {
      title: 'E. Pairs or Small Group Work',
      badge: 'Peer Collaboration',
      image: 'assets/images/img_slide_11_1.jpeg',
      description: 'Students work in pairs or small groups on problems of application and analysis.',
      points: [
        'Integrated into larger course structures to boost engagement.',
        'Promotes peer scaffolding and teamwork communication.',
        'Drives collective problem-solving and critical debate.'
      ]
    },
    'modal-fieldstudies': {
      title: 'F. Field Studies',
      badge: 'Out-of-Classroom',
      image: 'assets/images/img_slide_12_1.jpeg',
      description: 'Out-of-the-classroom activity intended to present concepts in the most realistic natural manner (e.g. Field Trips).',
      points: [
        'Qualitative research method collecting data in real-world settings.',
        'Bridges abstract textbook concepts with authentic physical reality.',
        'Enhances observational and qualitative recording skills.'
      ]
    },
    'modal-simulation': {
      title: 'G. Simulation',
      badge: 'Controlled Modeling',
      image: 'assets/images/img_slide_13_1.jpeg',
      description: 'Imitation of a real process or concept using mathematical or virtual models to recreate conditions and test outcomes.',
      points: [
        'Used when actual experimentation is too dangerous, costly, or impossible.',
        'Allows safe trial-and-error in virtual labs or gaming environments.',
        'Predicts outcomes under varied controlled conditions.'
      ]
    },
    'modal-roleplaying': {
      title: 'H. Role Playing',
      badge: 'Dramatic Enactment',
      image: 'assets/images/img_slide_14_1.jpeg',
      description: 'Action-filled enactment by students of learning episodes depicting real interpersonal or historical situations.',
      points: [
        'Builds deep emotional empathy and situational awareness.',
        'Engages visual, auditory, and kinesthetic learners.',
        'Provides memorable experiential learning opportunities.'
      ]
    }
  };

  // State Variables
  let currentQuizIndex = 0;
  let quizScore = 0;

  // DOM Content Loaded
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFilters();
    initModals();
    initAccordions();
    initTabs();
    initQuiz();
    initSearch();
    animateMetrics();
  });

  // Theme Switcher
  function initTheme() {
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
    });
  }

  // Filter Buttons for Methods Grid
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const methodCards = document.querySelectorAll('.method-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        methodCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || filter === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Method Detail Modals
  function initModals() {
    const detailModal = document.getElementById('detailModal');
    const modalBody = document.getElementById('detailModalBody');
    const btnClose = document.getElementById('btnCloseDetailModal');
    const actionBtns = document.querySelectorAll('.card-action-btn');

    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const modalKey = btn.getAttribute('data-modal');
        const data = METHOD_DETAILS[modalKey];

        if (data) {
          modalBody.innerHTML = `
            <div class="modal-detail-header" style="margin-bottom: 20px;">
              <span class="section-badge">${data.badge}</span>
              <h2 style="font-size: 1.8rem; margin-top: 6px;">${data.title}</h2>
            </div>
            <img src="${data.image}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;">
            <p style="font-size: 1rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${data.description}</p>
            <h4 style="font-size: 1rem; color: var(--primary-mint); margin-bottom: 10px;">Key Takeaways:</h4>
            <ul style="padding-left: 20px; color: var(--text-muted); font-size: 0.9rem;">
              ${data.points.map(p => `<li style="margin-bottom: 8px;">${p}</li>`).join('')}
            </ul>
          `;
          detailModal.classList.add('active');
        }
      });
    });

    btnClose.addEventListener('click', () => detailModal.classList.remove('active'));
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) detailModal.classList.remove('active');
    });
  }

  // Accordions
  function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
      });
    });
  }

  // Strategy Tabs
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
      });
    });
  }

  // Interactive Quiz Logic
  function initQuiz() {
    const quizQuestionNumber = document.getElementById('quizQuestionNumber');
    const quizScoreCount = document.getElementById('quizScoreCount');
    const quizQuestionText = document.getElementById('quizQuestionText');
    const quizOptionsList = document.getElementById('quizOptionsList');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizFeedbackTitle = document.getElementById('quizFeedbackTitle');
    const quizFeedbackText = document.getElementById('quizFeedbackText');
    const btnNextQuestion = document.getElementById('btnNextQuestion');
    const quizProgressFill = document.getElementById('quizProgressFill');
    const quizCard = document.getElementById('quizCard');
    const quizResultCard = document.getElementById('quizResultCard');
    const btnRestartQuiz = document.getElementById('btnRestartQuiz');

    function loadQuestion() {
      const q = QUIZ_QUESTIONS[currentQuizIndex];
      quizQuestionNumber.textContent = `Question ${currentQuizIndex + 1} of ${QUIZ_QUESTIONS.length}`;
      quizScoreCount.textContent = `Score: ${quizScore}`;
      quizQuestionText.textContent = q.question;

      quizProgressFill.style.width = `${((currentQuizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;

      quizOptionsList.innerHTML = '';
      quizFeedback.style.display = 'none';
      btnNextQuestion.style.display = 'none';

      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerHTML = `<span>${opt}</span>`;
        btn.addEventListener('click', () => selectAnswer(idx, q));
        quizOptionsList.appendChild(btn);
      });
    }

    function selectAnswer(selectedIndex, q) {
      const options = quizOptionsList.querySelectorAll('.quiz-option');
      options.forEach(opt => opt.style.pointerEvents = 'none');

      if (selectedIndex === q.correct) {
        options[selectedIndex].classList.add('correct');
        quizScore++;
        quizFeedbackTitle.textContent = 'Correct!';
        quizFeedbackTitle.style.color = 'var(--primary-emerald)';
      } else {
        options[selectedIndex].classList.add('incorrect');
        options[q.correct].classList.add('correct');
        quizFeedbackTitle.textContent = 'Incorrect!';
        quizFeedbackTitle.style.color = '#ff4757';
      }

      quizFeedbackText.textContent = q.explanation;
      quizFeedback.style.display = 'block';
      btnNextQuestion.style.display = 'inline-flex';
      quizScoreCount.textContent = `Score: ${quizScore}`;
    }

    btnNextQuestion.addEventListener('click', () => {
      currentQuizIndex++;
      if (currentQuizIndex < QUIZ_QUESTIONS.length) {
        loadQuestion();
      } else {
        showResults();
      }
    });

    function showResults() {
      quizCard.style.display = 'none';
      quizResultCard.style.display = 'block';
      document.getElementById('resultScoreText').textContent = `You scored ${quizScore} out of ${QUIZ_QUESTIONS.length}`;
    }

    btnRestartQuiz.addEventListener('click', () => {
      currentQuizIndex = 0;
      quizScore = 0;
      quizResultCard.style.display = 'none';
      quizCard.style.display = 'block';
      loadQuestion();
    });

    loadQuestion();
  }

  // Global Search Dropdown
  function initSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const searchDropdown = document.getElementById('searchDropdown');

    const searchData = [
      { title: 'Lecture Method', sec: '#methods', snippet: 'Oral presentation by an expert to clarify information.' },
      { title: 'Demonstration / Performance', sec: '#methods', snippet: 'Modeling a skill first with real concrete examples.' },
      { title: 'Discussion Method', sec: '#methods', snippet: 'Two-way exchange of attitudes and opinions.' },
      { title: 'Case Study', sec: '#methods', snippet: 'In-depth real-world investigation of a subject.' },
      { title: 'Field Studies & Field Trips', sec: '#methods', snippet: 'Out-of-classroom qualitative research activity.' },
      { title: 'Simulation Games & Virtual Labs', sec: '#methods', snippet: 'Recreating real conditions in controlled environments.' },
      { title: 'Role Playing', sec: '#methods', snippet: 'Dramatic enactment of learning situations.' },
      { title: 'Question & Answer Technique', sec: '#techniques', snippet: 'Knowledge-focused general technique.' },
      { title: 'Drill Method Technique', sec: '#techniques', snippet: 'Skill & habit reinforcement technique.' },
      { title: 'Direct Instruction', sec: '#strategies', snippet: 'Explicit teaching, think-alouds, and guided practice.' },
      { title: 'Collaborative Learning', sec: '#strategies', snippet: 'Think-Pair-Share, jigsaw, and group projects.' },
      { title: 'Inquiry-Based Learning', sec: '#strategies', snippet: 'Student-driven exploration and Socratic seminars.' },
      { title: 'Differentiated Instruction', sec: '#strategies', snippet: 'Tiered assignments and choice boards.' },
      { title: 'Educational Devices & Tools', sec: '#devices', snippet: 'Material, mental, and electronic teaching aids.' }
    ];

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchDropdown.classList.remove('active');
        return;
      }

      const matches = searchData.filter(d => d.title.toLowerCase().includes(q) || d.snippet.toLowerCase().includes(q));

      if (matches.length === 0) {
        searchDropdown.innerHTML = `<div style="padding: 12px; font-size: 0.8rem; color: var(--text-muted); text-align: center;">No matches found</div>`;
      } else {
        searchDropdown.innerHTML = matches.map(m => `
          <div class="search-result-row" onclick="location.href='${m.sec}'">
            <h5>${m.title}</h5>
            <p>${m.snippet}</p>
          </div>
        `).join('');
      }

      searchDropdown.classList.add('active');
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('active');
      }
    });
  }

  // Metrics Animated Counters
  function animateMetrics() {
    const counters = document.querySelectorAll('.metric-num');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 20));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = current;
        }
      }, 50);
    });
  }

})();
