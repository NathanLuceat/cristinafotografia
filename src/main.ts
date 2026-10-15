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
  Smile,
  Mail,
  ExternalLink
} from 'lucide';
import { portfolioPhotos } from './data/photos';

// 1. Render Portfolio Swiper Slides (Sem nomes/rótulos, fotos maiores e em ordem desde a 1ª)
function renderPortfolioSlides() {
  const wrapper = document.getElementById('swiper-portfolio-wrapper');
  if (!wrapper) return;

  const slidesHtml = portfolioPhotos.map((photo) => {
    return `
      <div class="swiper-slide p-1 sm:p-2">
        <div class="photo-passepartout w-full h-[480px] sm:h-[580px] md:h-[640px] lg:h-[700px] flex items-center justify-center rounded-2xl group relative overflow-hidden bg-white border border-cf-beige/50 p-2 sm:p-3">
          <a
            href="${photo.fullSrc}"
            data-pswp-width="${photo.width}"
            data-pswp-height="${photo.height}"
            target="_blank"
            rel="noreferrer"
            class="block relative w-full h-full overflow-hidden rounded-xl cursor-zoom-in bg-cf-lightgray/40"
            aria-label="Abrir fotografia em tela cheia com alta resolução"
          >
            <img
              src="${photo.thumbSrc}"
              alt="${photo.alt}"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            />
            <div class="absolute inset-0 bg-cf-graphite/0 group-hover:bg-cf-graphite/15 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span class="inline-flex items-center gap-2 px-4 py-2 bg-cf-white/95 backdrop-blur-md text-cf-graphite text-xs font-medium rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <i data-lucide="maximize-2" class="w-4 h-4 text-cf-graphite"></i>
                Ver em tela cheia
              </span>
            </div>
          </a>
        </div>
      </div>
    `;
  }).join('');

  wrapper.innerHTML = slidesHtml;
}

// 2. Initialize Swiper Carousel (Partindo da 1ª foto, fotos ampliadas e navegação elegante)
function initSwiper() {
  const counterEl = document.getElementById('current-slide-number');

  const swiper = new Swiper('#portfolio-swiper', {
    modules: [Navigation, Pagination, Keyboard, Autoplay],
    slidesPerView: 1.08,
    spaceBetween: 16,
    initialSlide: 0,
    centeredSlides: false,
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    autoplay: {
      delay: 5000,
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
      640: {
        slidesPerView: 1.35,
        spaceBetween: 22,
      },
      1024: {
        slidesPerView: 1.85,
        spaceBetween: 28,
      },
      1440: {
        slidesPerView: 2.1,
        spaceBetween: 32,
      },
    },
    on: {
      init: function (s) {
        if (counterEl) {
          counterEl.textContent = String(s.realIndex + 1).padStart(2, '0');
        }
      },
      slideChange: function (s) {
        if (counterEl) {
          counterEl.textContent = String(s.realIndex + 1).padStart(2, '0');
        }
      },
    },
  });

  return swiper;
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
      Smile,
      Mail,
      ExternalLink
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

