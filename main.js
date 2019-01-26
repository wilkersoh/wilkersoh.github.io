(function mobilenav(){
    const m = document.querySelector('.menu-toggle');
    const n = document.querySelector(".nav");
    m.addEventListener("click", function(){
     n.classList.toggle("toggle");
    })

    // Scroll Nav
    const nav = document.querySelector('.nav');
    const navTop = nav.offsetTop;
    
    window.addEventListener('scroll', stickyNavigation);

    function stickyNavigation() {
    //   console.log('navTop = ' + navTop);
    //   console.log('scrollY = ' + window.scrollY);   
      if (window.scrollY > navTop) {
        nav.classList.add('fixed');
      } else {
        nav.classList.remove('fixed');
      }
    }


    
})();