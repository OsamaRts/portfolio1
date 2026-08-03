(function(){
  var translations = window.translations || {};

  function applyLang(lang){
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', lang === 'ar');

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var entry = translations[key];
      if(!entry) return;

      var val = entry[lang] || entry.en;
      if(val.indexOf('<b>') !== -1){
        el.innerHTML = val;
      } else {
        el.textContent = val;
        if(el.classList.contains('glitch')){
          el.setAttribute('data-text', val);
        }
      }
    });

    document.querySelectorAll('#langtoggle span').forEach(function(s){
      s.classList.toggle('active', s.getAttribute('data-lang') === lang);
    });
  }

  var langToggle = document.getElementById('langtoggle');
  if(langToggle){
    langToggle.addEventListener('click', function(e){
      var target = e.target.closest('[data-lang]');
      if(!target) return;
      applyLang(target.getAttribute('data-lang'));
    });
  }

  (function(){
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var boot = document.getElementById('boot');
    if(!boot) return;
    if(reduced){
      boot.style.display = 'none';
      return;
    }

    var lines = [
      document.getElementById('b1'),
      document.getElementById('b2'),
      document.getElementById('b3')
    ];

    lines.forEach(function(l, i){
      if(!l) return;
      setTimeout(function(){
        l.style.transition = 'opacity .2s';
        l.style.opacity = '1';
      }, 250 * i + 150);
    });

    setTimeout(function(){
      boot.classList.add('hide');
    }, 1500);

    setTimeout(function(){
      if(boot.parentNode){
        boot.remove();
      }
      var hud = document.getElementById('hud-status');
      if(hud){
        hud.classList.add('show');
      }
    }, 2100);
  })();

  var els = document.querySelectorAll('.reveal, .skill-card');
  if('IntersectionObserver' in window && els.length){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
        }
      });
    }, {threshold:0.2});

    els.forEach(function(el){
      obs.observe(el);
    });
  } else {
    els.forEach(function(el){
      el.classList.add('visible');
    });
  }
})();
