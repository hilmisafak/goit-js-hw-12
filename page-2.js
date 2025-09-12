import"./assets/modulepreload-polyfill-B5Qt9EMX.js";/* empty css                      */import{S as b,i as r,a as w}from"./assets/vendor-U3v2eiL3.js";const E="52176910-9d30b506fbb06ea9df25b7e20",B="https://pixabay.com/api/",l=40,e={form:document.getElementById("search-form"),input:document.getElementById("search-input"),gallery:document.getElementById("gallery"),loader:document.getElementById("loader"),loadMoreBtn:document.getElementById("load-more"),endMessage:document.getElementById("end-message")};let L=new b(".gallery a",{captionsData:"alt",captionDelay:250}),i="",n=1,s=0;e.form.addEventListener("submit",S);e.loadMoreBtn.addEventListener("click",$);function d(){e.loader.setAttribute("aria-hidden","false"),e.loader.style.display="flex"}function c(){e.loader.setAttribute("aria-hidden","true"),e.loader.style.display="none"}function M(){e.gallery.innerHTML="",e.endMessage.hidden=!0}async function g(){const t=new URLSearchParams({key:E,q:i,image_type:"photo",orientation:"horizontal",safesearch:"true",per_page:String(l),page:String(n)}),a=`${B}?${t.toString()}`,{data:o}=await w.get(a);return o}async function S(t){if(t.preventDefault(),i=e.input.value.trim(),!!i){n=1,M(),e.loadMoreBtn.hidden=!0,d();try{const a=await g();if(s=a.totalHits,!a.hits.length){r.info({title:"No results",message:"Sorry, no images found. Please try again!",position:"topRight"});return}m(a.hits),s>l&&(e.loadMoreBtn.hidden=!1)}catch{r.error({title:"Error",message:"Something went wrong. Please try again.",position:"topRight"})}finally{c()}}}async function $(){n+=1,d();try{const t=await g();m(t.hits),n*l>=s&&(e.loadMoreBtn.hidden=!0,e.endMessage.hidden=!1),R()}catch{r.error({title:"Error",message:"Something went wrong while loading more images.",position:"topRight"})}finally{c()}}function m(t){const a=I(t);e.gallery.insertAdjacentHTML("beforeend",a),L.refresh()}function I(t){return t.map(({webformatURL:a,largeImageURL:o,tags:p,likes:u,views:h,comments:y,downloads:f})=>`
<li class="gallery-item">
  <a href="${o}" class="card-link">
    <img src="${a}" alt="${v(p)}" loading="lazy" />
    <div class="card-stats">
      <span><b>Likes</b> ${u}</span>
      <span><b>Views</b> ${h}</span>
      <span><b>Comments</b> ${y}</span>
      <span><b>Downloads</b> ${f}</span>
    </div>
  </a>
</li>`).join("")}function v(t){return t.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function R(){const{height:t}=e.gallery.firstElementChild.getBoundingClientRect();window.scrollBy({top:t*2,behavior:"smooth"})}
//# sourceMappingURL=page-2.js.map
