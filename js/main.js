(function(){
  var translations = window.translations || {};

  function getCurrentLang(){
    try {
      return localStorage.getItem('preferred_lang') || 'en';
    } catch(e){
      return 'en';
    }
  }

  function applyLang(lang){
    if(lang !== 'ar' && lang !== 'en'){
      lang = 'en';
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', lang === 'ar');

    try {
      localStorage.setItem('preferred_lang', lang);
    } catch(e){}

    if(translations.pageTitle && translations.pageTitle[lang]){
      document.title = translations.pageTitle[lang];
    }

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var entry = translations[key];
      if(!entry) return;

      var val = entry[lang] || entry.en;
      if(val.indexOf('<b>') !== -1 || val.indexOf('<strong>') !== -1){
        el.innerHTML = val;
      } else {
        el.textContent = val;
        if(el.classList.contains('glitch')){
          el.setAttribute('data-text', val);
        }
      }
    });

    document.querySelectorAll('#langtoggle [data-lang]').forEach(function(s){
      var isActive = s.getAttribute('data-lang') === lang;
      s.classList.toggle('active', isActive);
      s.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // Initialize Language
  applyLang(getCurrentLang());

  // Language switcher listeners
  var langToggle = document.getElementById('langtoggle');
  if(langToggle){
    langToggle.addEventListener('click', function(e){
      var target = e.target.closest('[data-lang]');
      if(!target) return;
      applyLang(target.getAttribute('data-lang'));
    });
    langToggle.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        var target = e.target.closest('[data-lang]');
        if(target){
          e.preventDefault();
          applyLang(target.getAttribute('data-lang'));
        }
      }
    });
  }

  // Mobile navigation menu toggle
  var menuBtn = document.getElementById('mobile-menu-btn');
  var navLinks = document.querySelector('.navlinks');
  if(menuBtn && navLinks){
    menuBtn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = navLinks.classList.toggle('open');
      menuBtn.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        navLinks.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function(e){
      if(!navLinks.contains(e.target) && !menuBtn.contains(e.target)){
        navLinks.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Navbar scrolled appearance & Back to top button
  var navbar = document.querySelector('nav');
  var backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function(){
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if(navbar){
      navbar.classList.toggle('scrolled', scrollY > 40);
    }
    if(backToTop){
      backToTop.classList.toggle('visible', scrollY > 450);
    }
  }, {passive:true});

  if(backToTop){
    backToTop.addEventListener('click', function(){
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // ScrollSpy active link tracking
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.navlinks a[href^="#"]');

  if('IntersectionObserver' in window && sections.length && navAnchors.length){
    var spyObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function(a){
            var match = a.getAttribute('href') === '#' + id;
            a.classList.toggle('active', match);
          });
        }
      });
    }, {rootMargin: '-20% 0px -70% 0px'});

    sections.forEach(function(sec){
      spyObserver.observe(sec);
    });
  }

  // Toast Notification System
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function showToast(message){
    if(!toastEl) return;
    toastEl.querySelector('.toast-msg').textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){
      toastEl.classList.remove('show');
    }, 2800);
  }

  // Copy Email Functionality
  var copyBtn = document.getElementById('copy-email-btn');
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      var email = 'osama.jafar.dev@gmail.com';
      var lang = getCurrentLang();
      var msg = (translations.toastEmailCopied && translations.toastEmailCopied[lang])
                ? translations.toastEmailCopied[lang]
                : 'Email copied to clipboard!';

      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(email).then(function(){
          showToast(msg);
        }).catch(function(){
          fallbackCopyText(email, msg);
        });
      } else {
        fallbackCopyText(email, msg);
      }
    });
  }

  function fallbackCopyText(text, msg){
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(msg);
    } catch(err){}
    document.body.removeChild(textArea);
  }

  // Boot sequence animation
  (function(){
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var boot = document.getElementById('boot');
    if(!boot) return;

    var alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem('boot_shown') === 'true';
    } catch(e){}

    var hud = document.getElementById('hud-status');

    function finishBootImmediately(){
      if(boot && boot.parentNode){
        boot.remove();
      }
      if(hud){
        hud.classList.add('show');
      }
      try {
        sessionStorage.setItem('boot_shown', 'true');
      } catch(e){}
    }

    if(reduced || alreadyShown){
      finishBootImmediately();
      return;
    }

    boot.addEventListener('click', finishBootImmediately);
    window.addEventListener('keydown', function(e){
      if(boot && boot.parentNode && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')){
        finishBootImmediately();
      }
    }, {once: true});

    var lines = [
      document.getElementById('b1'),
      document.getElementById('b2'),
      document.getElementById('b3')
    ];

    lines.forEach(function(l, i){
      if(!l) return;
      setTimeout(function(){
        l.style.transition = 'opacity .25s ease';
        l.style.opacity = '1';
      }, 250 * i + 150);
    });

    setTimeout(function(){
      if(boot) boot.classList.add('hide');
    }, 1500);

    setTimeout(function(){
      finishBootImmediately();
    }, 2000);
  })();

  // Intersection Observer for scroll animations
  var els = document.querySelectorAll('.reveal, .skill-card');
  if('IntersectionObserver' in window && els.length){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
        }
      });
    }, {threshold: 0.12});

    els.forEach(function(el){
      obs.observe(el);
    });
  } else {
    els.forEach(function(el){
      el.classList.add('visible');
    });
  }
})();
