$(".grid").imagesLoaded(function() {
    $(".grid").masonry({
      itemSelector: ".grid-item"
    });
  });

const title = document.getElementById('music-title'),
artist = document.getElementById('artist-title'),
currentTimeEl = document.getElementById('current-time'),
durationEl = document.getElementById('duration'),
progress = document.getElementById('progress'),
playerProgress = document.getElementById('player-progress'),
prevBtn = document.getElementById('prev'),
nextBtn = document.getElementById('next'),
playBtn = document.getElementById('play');


const music = new Audio();

const songs = [
    {
        path: 'assets/All U V6.mp3',
        displayName: 'All U',
        artist: "casha"
    },
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic(){
    isPlaying = true;
    //Change play button icon to pause
    playBtn.classList.replace('bx-play', 'bx-pause');

    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic(){
    isPlaying = false;
    //Change pause button to play
    playBtn.classList.replace('bx-pause', 'bx-play');

    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    //Ensure duration is updated correctly after metadata is loaded
    music.addEventListener('loadedmetadata', () => {
        updateProgressBar();
    });
}

function changeMusic(direction){
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar(){
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    if (duration) {
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    }
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`; 

}

function setProgressBar (e) {
    const width = playerProgress. clientWidth;
    const clickX = e.offsetX;
    const duration = music.duration;
    music.currentTime = (clickX / width) + music.duration;
}

async function logPlay(song) {
    await fetch('http://localhost:5000/api/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ song: song.displayName })
    });
}

function playMusic(){
    isPlaying = true;
    playBtn.classList.replace('bx-play', 'bx-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
    logPlay(songs[musicIndex]); // Log the play
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]); 

