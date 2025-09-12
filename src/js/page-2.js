import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '52176910-9d30b506fbb06ea9df25b7e20';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

const refs = {
  form: document.getElementById('search-form'),
  input: document.getElementById('search-input'),
  gallery: document.getElementById('gallery'),
  loader: document.getElementById('loader'),
  loadMoreBtn: document.getElementById('load-more'),
  endMessage: document.getElementById('end-message'),
};

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let query = '';
let page = 1;
let totalHits = 0;

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function showLoader() {
  refs.loader.setAttribute('aria-hidden', 'false');
  refs.loader.style.display = 'flex';
}

function hideLoader() {
  refs.loader.setAttribute('aria-hidden', 'true');
  refs.loader.style.display = 'none';
}

function clearGallery() {
  refs.gallery.innerHTML = '';
  refs.endMessage.hidden = true;
}

async function fetchImages() {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: String(PER_PAGE),
    page: String(page),
  });

  const url = `${BASE_URL}?${params.toString()}`;
  const { data } = await axios.get(url);
  return data;
}

async function onSearch(e) {
  e.preventDefault();
  query = refs.input.value.trim();
  if (!query) return;

  page = 1;
  clearGallery();
  refs.loadMoreBtn.hidden = true;
  showLoader();

  try {
    const data = await fetchImages();
    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.info({
        title: 'No results',
        message: 'Sorry, no images found. Please try again!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);

    if (totalHits > PER_PAGE) {
      refs.loadMoreBtn.hidden = false;
    }
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  showLoader();

  try {
    const data = await fetchImages();
    renderGallery(data.hits);

    const totalLoaded = page * PER_PAGE;
    if (totalLoaded >= totalHits) {
      refs.loadMoreBtn.hidden = true;
      refs.endMessage.hidden = false;
    }

    smoothScroll();
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while loading more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function renderGallery(items) {
  const markup = buildGalleryMarkup(items);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function buildGalleryMarkup(items) {
  return items
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<li class="gallery-item">
  <a href="${largeImageURL}" class="card-link">
    <img src="${webformatURL}" alt="${escapeHtml(tags)}" loading="lazy" />
    <div class="card-stats">
      <span><b>Likes</b> ${likes}</span>
      <span><b>Views</b> ${views}</span>
      <span><b>Comments</b> ${comments}</span>
      <span><b>Downloads</b> ${downloads}</span>
    </div>
  </a>
</li>`
    )
    .join('');
}

function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    m =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[m])
  );
}

function smoothScroll() {
  const { height } = refs.gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
