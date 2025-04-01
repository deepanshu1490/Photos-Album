/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02
const speedDrag = -0.1

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index - active) / $items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress / 100 * ($items.length - 1))

  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i / $items.length) * 100 + 10
    animate()
  })
})

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
  const wheelProgress = e.deltaY * speedWheel
  progress = progress + wheelProgress
  animate()
}

const handleMouseMove = (e) => {
  // Handle cursor movement on desktop
  if (e.type === 'mousemove' && window.innerWidth > 768) {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  
  if (!isDown) return
  
  // Get the correct client position for both mouse and touch events
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
  
  // Prevent default on touch devices to avoid scrolling while dragging
  if (e.touches) {
    e.preventDefault()
  }
}

const handleMouseDown = e => {
  isDown = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
  isDown = false
}


function togglePlay() {
  const video = document.getElementById('videoPlayer');
  const playButton = document.getElementById('playButton');

  if (video.style.display === 'none') {
    video.style.display = 'block'; // Show video
    playButton.style.display = 'none'; // Hide button
    video.src += "?autoplay=1"; // Autoplay video
  }
}

/*--------------------
Background Music
--------------------*/
let isMusicPlaying = false;
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
const backgroundMusic = document.getElementById('background-music');

// Set up YouTube as audio source using iframe API
function setupYoutubeAudio(videoId) {
  // Create a hidden YouTube iframe
  const musicContainer = document.getElementById('music-container');
  musicContainer.innerHTML = `
    <iframe id="youtube-player" width="1" height="1" 
      src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&autoplay=0&mute=1" 
      style="visibility:hidden;position:absolute"
      allow="autoplay"></iframe>
  `;
  
  // Keep the audio element for control purposes
  backgroundMusic.volume = 0.3;
}

// Extract YouTube ID from URL
function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Initialize with your YouTube URL
const youtubeUrl = "https://music.youtube.com/watch?v=7cjp8Rv9QCc&feature=shared"; // Your song URL
const youtubeId = getYoutubeId(youtubeUrl);

if (youtubeId) {
  setupYoutubeAudio(youtubeId);
}

// Function to play/pause music
function toggleMusic() {
  const iframe = document.getElementById('youtube-player');
  
  if (!iframe) return;
  
  if (!isMusicPlaying) {
    // Unmute and play the YouTube iframe
    iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    musicIcon.textContent = "🔊";
    isMusicPlaying = true;
  } else {
    // Mute but don't stop (to maintain position)
    iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
    musicIcon.textContent = "🔇";
    isMusicPlaying = false;
  }
}

// Auto-play music on first interaction with the document
function initialPlay() {
  // Slight delay to ensure iframe is loaded
  setTimeout(() => {
    toggleMusic();
  }, 1000);
  
  // Remove the event listeners after first interaction
  document.removeEventListener('click', initialPlay);
  document.removeEventListener('touchstart', initialPlay);
}

// Set up event listeners for initial play
document.addEventListener('click', initialPlay, { once: true });
document.addEventListener('touchstart', initialPlay, { once: true });

// Toggle button
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent initialPlay from firing
  toggleMusic();
});

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)

/*--------------------
Floating Hearts
--------------------*/
function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.innerHTML = '❤️';
  
  // Random horizontal position
  heart.style.left = Math.random() * 100 + 'vw';
  
  // Random animation duration
  const duration = 10 + Math.random() * 15;
  heart.style.animationDuration = duration + 's';
  
  // Random size
  const size = 0.5 + Math.random() * 1;
  heart.style.transform = `scale(${size})`;
  
  // Add to the body
  document.body.appendChild(heart);
  
  // Remove after animation completes
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

// Create hearts periodically
function startHearts() {
  console.log("Starting hearts animation");
  
  // Create hearts immediately
  for (let i = 0; i < 15; i++) {
    createHeart();
  }
  
  // Continue creating hearts continuously
  setInterval(() => {
    for (let i = 0; i < 3; i++) {
      createHeart();
    }
  }, 1000);
}

// Download button functionality
function downloadRepl() {
  // Create a zip file with JSZip (would need to be implemented)
  // For now, direct to the manual download URL
  const currentUrl = window.location.href;
  const baseUrl = currentUrl.split('?')[0].replace(/\/$/, '');
  const downloadUrl = `${baseUrl}/zip`;
  
  // Open in new tab
  window.open(downloadUrl, '_blank');
}

// Add event listener to download button
document.addEventListener('DOMContentLoaded', function() {
  startHearts();
  
  // Set up download button
  const downloadButton = document.getElementById('download-button');
  if (downloadButton) {
    downloadButton.addEventListener('click', downloadRepl);
  }
});

// Also try on window load as a fallback
window.addEventListener('load', startHearts);
