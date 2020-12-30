let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
    // Init controller
    controller = new ScrollMagic.Controller();
    // Select
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    // loop over each slide
    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');
        // GSAP
        const slideTl = gsap.timeline({
            // Defaults
            defaults: {
                duration: 1,
                ease: 'power2.inOut'
            }
        })

        // Timeline for hero image
        slideTl.fromTo(revealImg, {x: '0%'}, {x: '100%'});
        slideTl.fromTo(img, {scale: 2}, {scale: 1}, '-=1');

        // Timeline for hero text
        slideTl.fromTo(revealText, {x: '0%'}, {x: '100%'}, '-=0.75');

        // Create scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        })
        .setTween(slideTl)
        // .addIndicators({colorStart: 'White', colorTrigger: 'White', name: 'slide'})
        .addTo(controller);

        //new amination
        const pageTl = gsap.timeline();

        //make slides have a pause before moving to next slide
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, { y: '0%' }, { y:'50%' });

        //timeline for slide to fade away and bring new slide into view
        pageTl.fromTo(slide, {opacity: 1, scale: 1}, { opacity: 0, scale: 0.25})
        pageTl.fromTo(nextSlide, { y: '50%' }, { y:'0%' }, '-=0.5');

        // create new scene for pageTl
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        })
        .setPin(slide, {pushFollowers: false})
        .setTween(pageTl)
        // .addIndicators({colorStart: 'White', colorTrigger: 'White', name: 'page', indent: 200})
        .addTo(controller)
    });
}

let mouse = document.querySelector('.cursor');
let mouseTxt = mouse.querySelector('span');
const burger = document.querySelector('.burger');

function cursor(e) {
    mouse.style.top = e.pageY + 'px';
    mouse.style.left = e.pageX + 'px';
}
function activeCursor(e) {
    const item = e.target;
    if(item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add('nav-active');
    }else {
        mouse.classList.remove('nav-active');
    }
    if(item.classList.contains('explore')) {
        mouse.classList.add('explore-active');
        gsap.to('.title-swipe', 1, {y: '0%'});
        mouseTxt.innerText = 'Tap';
    }else {
        mouse.classList.remove('explore-active');
        mouseTxt.innerText = '';
        gsap.to('.title-swipe', 1, {y: '100%'});
    }
}
function navToggle(e) {
    if(!e.target.classList.contains('active')){

        e.target.classList.add('active')
        gsap.to('.line1', 0.5, { rotate: '45', y: '5', background: 'black' });
        gsap.to('.line2', 0.5, { rotate: '-45', y: '-5', background: 'black'});
        gsap.to('#logo', 1, {color: 'black'});
        gsap.to('.nav-bar', 1, {clipPath: 'circle(2500px at 100% -10%'});
        document.body.classList.add('hide');
    }else {
        
        e.target.classList.remove('active')
        gsap.to('.line1', 0.5, { rotate: '0', y: '0', background: 'white' });
        gsap.to('.line2', 0.5, { rotate: '0', y: '0', background: 'white'});
        gsap.to('#logo', 1, {color: 'white'});
        gsap.to('.nav-bar', 1, {clipPath: 'circle(50px at 100% -10%'});
        document.body.classList.remove('hide');
    }
}

// Barba page transitions
const logo = document.querySelector('#logo');
barba.init({
    // views is the pages you have
    views: [
        {
            namespace: 'home',
            beforeEnter(){
                animateSlides();
                // to update the link that we are going to a new page
                logo.href = './index.html';
            },
            beforeLeave(){
                sliderScene.destory();
                pageScene.destory();
                controller.destory();
            }
        },
        {
            namespace: 'fashion',
            beforeEnter(){
                // to update the link that we are going to a new page
                logo.href = '../index.html';
                detailAnimation();
            },
            beforeLeave(){
                detailScene.destory();
                controller.destory();
            }
        },
        {
            namespace: 'hike',
            beforeEnter(){
                // to update the link that we are going to a new page
                logo.href = '../index.html';
                detailAnimation();
            },
            beforeLeave(){
                detailScene.destory();
                controller.destory();
            }
        },
        {
            namespace: 'mountain',
            beforeEnter(){
                // to update the link that we are going to a new page
                logo.href = '../index.html';
                detailAnimation();
            },
            beforeLeave(){
                detailScene.destory();
                controller.destory();
            }
        }
    ],
    // transitions are the animations added to the pages change
    transitions: [
        {
            leave({current, next}){
                // to begin the barba lifecycle with the async hook
                let done = this.async();
                //animation
                const tl = gsap.timeline({ desfault: {ease: 'power2.inOut'} });
                // container comes from the html class added on the main tag, these are the things that will change
                tl.fromTo(current.container, 1, {opacity: 1}, {opacity: 0});
                tl.fromTo(".swipe", 0.75, { x: "-100%" }, { x: "0%", onComplete: done }, "-=0.5");
            },
            enter({current, next}){
                // to begin the barba lifecycle with the async hook
                let done = this.async();
                // scroll to top of page
                window.scrollTo(0,0);
               //animation
               const tl = gsap.timeline({ desfault: {ease: 'power2.inOut'} });
               tl.fromTo('.swipe', 1, {x: '0%'}, {x: '100%', stagger: 0.2, onComplete: done});
               tl.fromTo(next.container, 1, {opacity: 0}, {opacity: 1}); 
            }
        }
    ]
});

function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll(".detail-slide");
    slides.forEach((slide, index, slides) => {
      const slideTl = gsap.timeline({ defaults: { duration: 1 } });
      let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
      const nextImg = nextSlide.querySelector("img");
      slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
      slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
      slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
      //Scene
      detailScene = new ScrollMagic.Scene({
        triggerElement: slide,
        duration: "100%",
        triggerHook: 0
      })
        .setPin(slide, { pushFollowers: false })
        .setTween(slideTl)
        // .addIndicators({
        //   colorStart: "white",
        //   colorTrigger: "white",
        //   name: "detailScene"
        // })
        .addTo(controller);
    });
  }

// EventListeners
burger.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);

