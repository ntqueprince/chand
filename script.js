// ====== Your Links (Article 6 + Human Diseases) ======
let linksData = [
  {
    title: "Article 6",
    url: "https://ntqueprince.github.io/article-6/",
    code: "A6"
  },
  {
    title: "Human Diseases",
    url: "https://ntqueprince.github.io/human-diseases",
    code: "HD"
  },
   {
    title: "bhagti-andolan",
    url: "https://ntqueprince.github.io/bhagti-andolan",
    code: "HD"
  }
];

// ====== Elements ======
const cardsGrid = document.getElementById("cardsGrid");
const totalLinks = document.getElementById("totalLinks");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

const addNewBtn = document.getElementById("addNewBtn");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");

const titleInput = document.getElementById("titleInput");
const urlInput = document.getElementById("urlInput");
const codeInput = document.getElementById("codeInput");
const saveBtn = document.getElementById("saveBtn");

const homeBtn = document.getElementById("homeBtn");
const topBtn = document.getElementById("topBtn");

// ====== LocalStorage Save/Load ======
function loadFromStorage(){
  const saved = localStorage.getItem("chand_links");
  if(saved){
    try{
      linksData = JSON.parse(saved);
    }catch(e){
      // ignore
    }
  }
}

function saveToStorage(){
  localStorage.setItem("chand_links", JSON.stringify(linksData));
}

// ====== Render Cards ======
function renderCards(filterText = ""){
  cardsGrid.innerHTML = "";

  const text = filterText.trim().toLowerCase();

  const filtered = linksData.filter(item => {
    return item.title.toLowerCase().includes(text) || item.url.toLowerCase().includes(text);
  });

  totalLinks.textContent = filtered.length;

  if(filtered.length === 0){
    emptyState.style.display = "block";
    return;
  }else{
    emptyState.style.display = "none";
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.addEventListener("click", () => {
      window.open(item.url, "_blank");
    });

    card.innerHTML = `
      <div class="iconCircle">${item.code || "🔗"}</div>
      <h3>${item.title}</h3>
      <p>${item.url}</p>

      <div class="actions">
        <button class="miniBtn open">🚀 Open</button>
        <button class="miniBtn copy">📋 Copy</button>
      </div>
    `;

    const openBtn = card.querySelector(".miniBtn.open");
    const copyBtn = card.querySelector(".miniBtn.copy");

    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.open(item.url, "_blank");
    });

    copyBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      try{
        await navigator.clipboard.writeText(item.url);
        copyBtn.innerHTML = "✅ Copied";
        setTimeout(() => copyBtn.innerHTML = "📋 Copy", 900);
      }catch(err){
        alert("Copy failed! Please copy manually.");
      }
    });

    cardsGrid.appendChild(card);
  });
}

// ====== Modal Open/Close ======
function openModal(){
  modalBackdrop.style.display = "flex";
  titleInput.value = "";
  urlInput.value = "";
  codeInput.value = "";
  titleInput.focus();
}

function closeModal(){
  modalBackdrop.style.display = "none";
}

addNewBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", (e) => {
  if(e.target === modalBackdrop) closeModal();
});

// ====== Save New Link ======
saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const url = urlInput.value.trim();
  const code = codeInput.value.trim().toUpperCase();

  if(!title || !url){
    alert("Please fill Title and URL");
    return;
  }

  let finalUrl = url;
  if(!finalUrl.startsWith("http")){
    finalUrl = "https://" + finalUrl;
  }

  linksData.unshift({
    title,
    url: finalUrl,
    code: code || title.slice(0,2).toUpperCase()
  });

  saveToStorage();
  renderCards(searchInput.value);
  closeModal();
});

// ====== Search ======
searchInput.addEventListener("input", () => {
  renderCards(searchInput.value);
});

// ====== Bottom Nav Buttons ======
homeBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderCards("");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ====== Start ======
loadFromStorage();
renderCards();
