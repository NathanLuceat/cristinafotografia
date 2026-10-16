import './styles.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/a11y';
import 'photoswipe/style.css';

import Swiper from 'swiper';
import { Navigation, Keyboard, Autoplay, Thumbs, A11y } from 'swiper/modules';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import {
  createIcons,
  Camera,
  MapPin,
  Heart,
  Calendar,
  Phone,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  Menu,
  X,
  Clock,
  CheckCircle2,
  Smile,
  Mail,
  ExternalLink
} from 'lucide';
import { portfolioPhotos } from './data/photos';

const portfolioOrder = [1, 3, 4, 16, 2, 5, 6, 8, 9, 10, 11, 12, 13, 14, 17, 21, 18, 19];
const orderedPhotos = [...portfolioPhotos].sort((a, b) => {
  const position = (id: string) => {
    const index = portfolioOrder.indexOf(Number(id.replace('foto-', '')));
    return index === -1 ? portfolioOrder.length : index;
  };
  return position(a.id) - position(b.id);
});

// 1. Render the main slider and its thumbnail strip in the selected order.
function renderPortfolioSlides() {
  const wrapper = document.getElementById('swiper-portfolio-wrapper');
  const thumbs = document.getElementById('swiper-thumbs-wrapper');
  if (!wrapper || !thumbs) return;

  wrapper.innerHTML = orderedPhotos.map((photo) => `
    <div class="swiper-slide">
      <a href="${photo.fullSrc}" data-pswp-width="${photo.width}"
        data-pswp-height="${photo.height}" class="portfolio-photo"
        aria-label="Abrir fotografia em tela cheia">
        <img src="${photo.fullSrc}" alt="${photo.alt}"
          width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" />
      </a>
    </div>
  `).join('');

  thumbs.innerHTML = orderedPhotos.map((photo, index) => `
    <div class="swiper-slide">
      <button type="button" class="portfolio-thumb" data-photo-index="${index}"
        aria-label="Ver fotografia ${index + 1}" aria-controls="portfolio-main-swiper">
        <img src="${photo.thumbSrc}" alt="" width="${photo.width}"
          height="${photo.height}" loading="lazy" decoding="async" />
      </button>
    </div>
  `).join('');

  const total = document.getElementById('total-slide-number');
  if (total) total.textContent = String(portfolioPhotos.length).padStart(2, '0');
}

// 2. One photograph at a time, with synchronized thumbnails.
function initSwiper() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const counter = document.getElementById('current-slide-number');
  const autoplayButton = document.getElementById('btn-autoplay-toggle');
  const autoplayText = document.getElementById('autoplay-text');
  const thumbButtons = document.querySelectorAll<HTMLButtonElement>('.portfolio-thumb');
  const thumbs = new Swiper('#portfolio-thumbs-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 10,
    watchSlidesProgress: true,
    grabCursor: true,
  });

  function updateSlide(swiper: Swiper) {
    if (counter) counter.textContent = String(swiper.realIndex + 1).padStart(2, '0');
    thumbButtons.forEach((button, index) => {
      button.setAttribute('aria-current', String(index === swiper.realIndex));
    });
    swiper.slides.forEach((slide, index) => {
      slide.inert = index !== swiper.activeIndex;
    });
  }

  function updateAutoplay(swiper: Swiper) {
    const running = swiper.autoplay.running;
    if (autoplayText) autoplayText.textContent = running ? 'Pausar' : 'Reproduzir';
    autoplayButton?.setAttribute('aria-label', running ? 'Pausar apresentação automática' : 'Iniciar apresentação automática');
    autoplayButton?.setAttribute('aria-pressed', String(running));
  }

  const swiper = new Swiper('#portfolio-main-swiper', {
    modules: [Navigation, Keyboard, Autoplay, Thumbs, A11y],
    slidesPerView: 1,
    spaceBetween: 16,
    initialSlide: 0,
    speed: reducedMotion.matches ? 0 : 500,
    grabCursor: true,
    keyboard: { enabled: true, onlyInViewport: true, pageUpDown: false },
    thumbs: { swiper: thumbs, multipleActiveThumbs: false },
    navigation: {
      nextEl: '.swiper-button-next-main',
      prevEl: '.swiper-button-prev-main',
    },
    // Opt-in playback keeps the first photograph visible until the visitor navigates.
    autoplay: false,
    a11y: {
      containerMessage: 'Portfólio de fotografias',
      containerRoleDescriptionMessage: 'carrossel',
      prevSlideMessage: 'Foto anterior',
      nextSlideMessage: 'Próxima foto',
      slideLabelMessage: '{{index}} de {{slidesLength}}',
    },
    on: {
      init: updateSlide,
      slideChange: updateSlide,
      autoplayStart: updateAutoplay,
      autoplayStop: updateAutoplay,
    },
  });

  swiper.params.autoplay = { delay: 5000, disableOnInteraction: true, stopOnLastSlide: true, waitForTransition: true };

  thumbButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      swiper.autoplay.stop();
      swiper.slideTo(index);
    });
  });
  autoplayButton?.addEventListener('click', () => {
    if (swiper.autoplay.running) {
      swiper.autoplay.stop();
    } else {
      if (swiper.isEnd) swiper.slideTo(0);
      swiper.autoplay.start();
    }
  });
  document.getElementById('portfolio')?.addEventListener('focusin', (event) => {
    if (event.target !== autoplayButton) swiper.autoplay.stop();
  });
  reducedMotion.addEventListener('change', () => {
    swiper.params.speed = reducedMotion.matches ? 0 : 500;
    if (reducedMotion.matches) swiper.autoplay.stop();
  });
  updateAutoplay(swiper);
  return swiper;
}

// 3. Keep the full-screen viewer aligned with the selected photograph.
function initPhotoSwipe(swiper: Swiper) {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#swiper-portfolio-wrapper',
    children: 'a',
    pswpModule: () => import('photoswipe'),
    padding: { top: 30, bottom: 30, left: 20, right: 20 },
    bgOpacity: 0.94,
    showHideAnimationType: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'none' : 'zoom',
  });

  lightbox.on('beforeOpen', () => {
    swiper.autoplay.stop();
    swiper.keyboard.disable();
  });
  lightbox.on('change', () => {
    if (lightbox.pswp) swiper.slideTo(lightbox.pswp.currIndex, 0);
  });
  lightbox.on('destroy', () => swiper.keyboard.enable());
  lightbox.init();
  document.getElementById('btn-open-fullscreen')?.addEventListener('click', () => {
    const gallery = document.getElementById('swiper-portfolio-wrapper');
    if (gallery) lightbox.loadAndOpen(swiper.realIndex, { gallery });
  });
}

// 4. Initialize Mobile Navigation & Header Scroll State
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const header = document.getElementById('main-header');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header border / shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('bg-cf-cream/95', 'backdrop-blur-md', 'shadow-xs', 'border-cf-beige/50');
      header?.classList.remove('bg-transparent', 'border-transparent');
    } else {
      header?.classList.remove('bg-cf-cream/95', 'backdrop-blur-md', 'shadow-xs', 'border-cf-beige/50');
      header?.classList.add('bg-transparent', 'border-transparent');
    }
  }, { passive: true });
}

// 5. Initialize Lucide Icons
function initIcons() {
  createIcons({
    icons: {
      Camera,
      MapPin,
      Heart,
      Calendar,
      Phone,
      Sparkles,
      ArrowRight,
      ChevronLeft,
      ChevronRight,
      Maximize2,
      MessageCircle,
      Menu,
      X,
      Clock,
      CheckCircle2,
      Smile,
      Mail,
      ExternalLink
    },
  });
}

// Bootstrap
function initApp() {
  renderPortfolioSlides();
  const swiper = initSwiper();
  initPhotoSwipe(swiper);
  initNavigation();
  initIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

