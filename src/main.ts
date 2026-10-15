import './styles.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'photoswipe/style.css';

import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, Autoplay } from 'swiper/modules';
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
  Smile
} from 'lucide';
import { portfolioPhotos } from './data/photos';

// 1. Render Portfolio Swiper Slides
function renderPortfolioSlides() {
  const wrapper = document.getElementById('swiper-portfolio-wrapper');
  if (!wrapper) return;

  const slidesHtml = portfolioPhotos.map((photo, index) => {
    const isVertical = photo.aspectRatio < 1;
    return `
      <div class="swiper-slide p-2 sm:p-3">
        <div class="photo-passepartout w-full h-full flex flex-col justify-between rounded-xl group relative overflow-hidden bg-white border border-cf-beige/40">
          <a
            href="${photo.fullSrc}"
            data-pswp-width="${photo.width}"
            data-pswp-height="${photo.height}"
            target="_blank"
            rel="noreferrer"
            class="block relative w-full overflow-hidden rounded-lg cursor-zoom-in bg-cf-lightgray/50 aspect-[4/5] sm:aspect-[3/4]"
            aria-label="Abrir foto ${index + 1} em tela cheia"
          >
            <img
              src="${photo.thumbSrc}"
              alt="${photo.alt}"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-cf-graphite/0 group-hover:bg-cf-graphite/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cf-white/90 backdrop-blur-sm text-cf-graphite text-xs font-medium rounded-full shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <i data-lucide="maximize-2" class="w-3.5 h-3.5 text-cf-graphite"></i>
                Ampliar
              </span>
            </div>
          </a>
          <div class="pt-3 pb-1 px-1 flex items-center justify-between text-xs text-cf-warmgray">
            <span class="font-medium tracking-wide">Registro ${String(index + 1).padStart(2, '0')}</span>
            <span class="text-[11px] text-cf-warmgray/70">${isVertical ? 'Vertical' : 'Paisagem'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  wrapper.innerHTML = slidesHtml;
}

// 2. Initialize Swiper Carousel
function initSwiper() {
  new Swiper('#portfolio-swiper', {
    modules: [Navigation, Pagination, Keyboard, Autoplay],
    slidesPerView: 1.15,
    spaceBetween: 16,
    centeredSlides: false,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    autoplay: {
      delay: 4500,
      disableOnInteraction: true,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    breakpoints: {
      480: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2.3,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 28,
      },
      1280: {
        slidesPerView: 3.6,
        spaceBetween: 32,
      },
    },
  });
}

// 3. Initialize PhotoSwipe Lightbox
function initPhotoSwipe() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#swiper-portfolio-wrapper',
    children: 'a',
    pswpModule: () => import('photoswipe'),
    padding: { top: 30, bottom: 30, left: 20, right: 20 },
    bgOpacity: 0.94,
    showHideAnimationType: 'zoom',
  });

  lightbox.init();
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
      Smile
    },
  });
}

// Bootstrap
function initApp() {
  renderPortfolioSlides();
  initSwiper();
  initPhotoSwipe();
  initNavigation();
  initIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

