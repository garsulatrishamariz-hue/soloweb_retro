// ===== Default Configuration =====
const defaultConfig = {
  gallery_title: "My Photo Gallery",
  story_text: "Share your story here... Tell us about these beautiful memories!",
  music_title: "Now Playing",
};

let config = { ...defaultConfig };
let currentTheme = "pink";
let currentSlide = 0;
let totalSlides = 6;
let isAutoPlaying = false;
let autoplayInterval = null;

// ===== Theme Toggle =====
const themeToggle = document.getElementById("theme-toggle");
const container = document.querySelector(".gallery-container");
const header = document.querySelector("header");

themeToggle.addEventListener("click", () => {
  if (currentTheme === "pink") {
    container.classList.replace("theme-pink", "theme-cyan");
    header.className = "w-full p-6 text-center bg-gradient-to-r from-cyan-100 to-cyan-200 border-b-4 border-cyan-300";
    header.querySelector("h1").className = "text-5xl font-bold text-cyan-800 mb-2";
    header.querySelector("p").className = "text-cyan-600 text-lg";
    themeToggle.textContent = "🎨 Switch to Pink";
    currentTheme = "cyan";
  } else {
    container.classList.replace("theme-cyan", "theme-pink");
    header.className = "w-full p-6 text-center bg-gradient-to-r from-pink-100 to-pink-200 border-b-4 border-pink-300";
    header.querySelector("h1").className = "text-5xl font-bold text-pink-800 mb-2";
    header.querySelector("p").className = "text-pink-600 text-lg";
    themeToggle.textContent = "🎨 Switch Theme";
    currentTheme = "pink";
  }
});

// ===== Music Player =====
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");
const volumeDisplay = document.getElementById("volume-display");
const progressFill = document.getElementById("progress-fill");
const progressThumb = document.getElementById("progress-thumb");
const progressBar = document.querySelector(".progress-bar");
const musicTitle = document.getElementById("music-title");

let isPlaying = false;
let isDragging = false;
let currentSongIndex = 0;

// Audio element
const audio = new Audio();

// Songs list
const songs = [
  { title: "After Dark lofi", artist: "Mr.kitty", src: "music/after dark.mp3" },
  { title: "And So It Begins", artist: "Artist 2", src: "music/and so it begins.mp3" },
  { title: "Space Aquarium lofi", artist: "Artist 3", src: "music/space aquarium.mp3" }
];

// Load a song and update title/artist automatically
function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  musicTitle.textContent = song.artist ? `${song.title} - ${song.artist}` : song.title;
  audio.load();
}

// Play / Pause toggle
function togglePlay() {
  if (isPlaying) audio.pause();
  else audio.play();
}

// Next / Previous song
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
}

// Volume control
volumeSlider.addEventListener("input", e => {
  audio.volume = e.target.value / 100;
  volumeDisplay.textContent = e.target.value;
});

// Play / Pause buttons
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Audio events
audio.addEventListener("play", () => {
  isPlaying = true;
  playBtn.textContent = "⏸️";
});

audio.addEventListener("timeupdate", () => {
  if (!isDragging && audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    progressThumb.style.left = percent + "%"; // dot moves with the fill
  }
});

// Auto-advance when song ends
audio.addEventListener("ended", nextSong);

// Update progress bar
function updateProgress(e, seekAudio = false) {
  const rect = progressBar.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;
  offsetX = Math.max(0, Math.min(offsetX, rect.width));
  const percent = offsetX / rect.width;

  progressFill.style.width = percent * 100 + "%";
  progressThumb.style.left = percent * 100 + "%";

  if (seekAudio && audio.duration) {
    audio.currentTime = percent * audio.duration;
  }
}

// Drag events
progressThumb.addEventListener("mousedown", () => isDragging = true);
document.addEventListener("mouseup", e => {
  if (isDragging) {
    updateProgress(e, true);
    isDragging = false;
  }
});
document.addEventListener("mousemove", e => {
  if (isDragging) updateProgress(e);
});

// Click on progress bar
progressBar.addEventListener("click", e => updateProgress(e, true));

// Update while playing
audio.addEventListener("timeupdate", () => {
  if (!isDragging && audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    progressThumb.style.left = percent + "%";
  }
});

// Initialize music
loadSong(currentSongIndex);
audio.volume = 0.7;
volumeSlider.value = 70;
volumeDisplay.textContent = 70;

// ===== Slideshow =====
const slideshowTrack = document.getElementById("slideshow-track");
const prevSlideBtn = document.getElementById("prev-slide");
const nextSlideBtn = document.getElementById("next-slide");
const autoplayToggle = document.getElementById("autoplay-toggle");
const currentSlideDisplay = document.getElementById("current-slide");
const totalSlidesDisplay = document.getElementById("total-slides");
const thumbnailBtns = document.querySelectorAll(".thumbnail-btn");

function updateSlideshow() {
  slideshowTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  currentSlideDisplay.textContent = currentSlide + 1;
  thumbnailBtns.forEach((btn, index) =>
    btn.classList.toggle("active-thumb", index === currentSlide)
  );
}

function nextSlide() {
  currentSlide = (currentSlide - 1) % totalSlides;
  updateSlideshow();
}

function prevSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlideshow();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlideshow();
}

function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(nextSlide, 3000);
  isAutoPlaying = true;
  autoplayToggle.textContent = "⏸️ Stop Auto";
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
  autoplayInterval = null;
  isAutoPlaying = false;
  autoplayToggle.textContent = "▶️ Auto Play";
}

// Slideshow Listeners
nextSlideBtn.addEventListener("click", () => {
  nextSlide();
  if (isAutoPlaying) { stopAutoplay(); startAutoplay(); }
});
prevSlideBtn.addEventListener("click", () => {
  prevSlide();
  if (isAutoPlaying) { stopAutoplay(); startAutoplay(); }
});
autoplayToggle.addEventListener("click", () =>
  isAutoPlaying ? stopAutoplay() : startAutoplay()
);
thumbnailBtns.forEach((btn, i) =>
  btn.addEventListener("click", () => {
    goToSlide(i);
    if (isAutoPlaying) { stopAutoplay(); startAutoplay(); }
  })
);

totalSlidesDisplay.textContent = totalSlides;
updateSlideshow();

// ===== Auto-resize Textarea =====
const storyTextarea = document.getElementById("story-text");
storyTextarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.max(128, this.scrollHeight) + "px";
});

// ===== Element SDK =====
async function onConfigChange(newConfig) {
  config = { ...config, ...newConfig };
  document.getElementById("gallery-title").textContent =
    config.gallery_title || defaultConfig.gallery_title;
  document.getElementById("story-text").value =
    config.story_text || defaultConfig.story_text;
  document.getElementById("music-title").textContent =
    config.music_title || defaultConfig.music_title;
}

function mapToCapabilities(config) {
  return { recolorables: [], borderables: [], fontEditable: undefined, fontSizeable: undefined };
}

function mapToEditPanelValues(config) {
  return new Map([
    ["gallery_title", config.gallery_title || defaultConfig.gallery_title],
    ["story_text", config.story_text || defaultConfig.story_text],
    ["music_title", config.music_title || defaultConfig.music_title],
  ]);
}

if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues,
  });
}

onConfigChange(defaultConfig);
