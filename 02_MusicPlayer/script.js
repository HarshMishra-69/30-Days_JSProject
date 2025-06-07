// JavaScript
const songs = [

    {
        title: "Mortal Funk",
        artist: "Warriyo",
        source: "songs/mortal_funk.mp3",
        cover: "images/sonngs.jpg"
    },
    {
        title: "Apollo On The Run",
        artist: "Immy Oden",
        source: "songs/apollo.mp3",
        cover: "images/sonngs1.jpg"
    },
    {
        title: "Enna Sona",
        artist: "Arijit Singh",
        source: "songs/enna_sona.mp3",
        cover: "images/ok-jaanu-2017-250.jpg"
    },
    {
        title: "Tum Hi Ho",
        artist: "Arijit Singh",
        source: "songs/tum_hi_ho.mp3",
        cover: "images/128Tum Hi Ho - Aashiqui 2 128 Kbps.jpg"
    },
    {
        title: "Raabta",
        artist: "Arijit Singh",
        source: "songs/raabta.mp3",
        cover: "images/128Raabta - Agent Vinod 128 Kbps.jpg"
    },
    {
        title: "Kesariya",
        artist: "Arijit Singh, Pritam",
        source: "songs/kesariya.mp3",
        cover: "images/kesariya-brahmastra-500-500.jpg"
    },
    {
        title: "Zara Sa",
        artist: "KK",
        source: "songs/zara_sa.mp3",
        cover: "images/Zara-Sa-Jannat-Original-Motion-Picture-Soundtrack-500-500.jpg"
    },
    {
        title: "Tu Hi Meri Shab Hai",
        artist: "KK",
        source: "songs/tu_hi_meri_shab.mp3",
        cover: "images/24UMGIM73418_T1_cvrart.webp"
    },
    {
        title: "Dil Ibadat",
        artist: "KK, Pritam",
        source: "songs/dil_ibadat.mp3",
        cover: "images/128Dil Ibaadat - Tum Mile 128 Kbps.jpg"
    },
    {
        title: "Bheegi Bheegi",
        artist: "KK, Pritam",
        source: "songs/bheegi_bheegi.mp3",
        cover: "images/128Bheegi Bheegi - Gangster 128 Kbps.jpg"
    },
    {
        title: "52 Bars",
        artist: "Karan Aujla",
        source: "songs/52_bars.mp3",
        cover: "images/four-you-karan-aujla.webp"
    },
    {
        title: "Softly",
        artist: "Karan Aujla",
        source: "songs/softly.mp3",
        cover: "images/Softly.jpg"
    }
];

let currentSongIndex = 0;
const progress = document.getElementById("progress");
const song = document.getElementById("song");
const ctrlIcon = document.getElementById("ctrlIcon");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const songImg = document.querySelector(".song-img");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const playlistElement = document.getElementById("playlist");
const playlistItems = document.querySelectorAll("#playlist li");

// Initialize player
function loadSong(index) {
    const currentSong = songs[index];
    songTitle.textContent = currentSong.title;
    artistName.textContent = currentSong.artist;
    songImg.src = currentSong.cover;
    song.src = currentSong.source;
    
    // Update active state in playlist
    playlistItems.forEach(item => item.classList.remove("active"));
    playlistItems[index].classList.add("active");
    
    song.addEventListener("loadedmetadata", function() {
        progress.max = song.duration;
        durationDisplay.textContent = formatTime(song.duration);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Play/pause toggle
function togglePlayPause() {
    if (song.paused) {
        song.play();
        ctrlIcon.classList.replace("fa-play", "fa-pause");
        document.querySelector(".album-art").classList.add("playing");
    } else {
        song.pause();
        ctrlIcon.classList.replace("fa-pause", "fa-play");
        document.querySelector(".album-art").classList.remove("playing");
    }
}

// Update progress bar
song.addEventListener("timeupdate", function() {
    progress.value = song.currentTime;
    currentTimeDisplay.textContent = formatTime(song.currentTime);
});

// Seek functionality
progress.addEventListener("input", function() {
    song.currentTime = progress.value;
});

// Song ends
song.addEventListener("ended", function() {
    nextSong();
});

// Play specific song from playlist
function playSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    song.play();
    ctrlIcon.classList.replace("fa-play", "fa-pause");
    document.querySelector(".album-art").classList.add("playing");
    hidePlaylist();
}

// Next song
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    song.play();
    ctrlIcon.classList.replace("fa-play", "fa-pause");
    document.querySelector(".album-art").classList.add("playing");
}

// Previous song
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    song.play();
    ctrlIcon.classList.replace("fa-play", "fa-pause");
    document.querySelector(".album-art").classList.add("playing");
}

// Show playlist
function showPlaylist() {
    playlistElement.classList.add("show");
}

// Hide playlist
function hidePlaylist() {
    playlistElement.classList.remove("show");
}

// Go back (placeholder)
function goBack() {
    // Could be used for navigation in a larger app
    console.log("Back button clicked");
}

// Show menu (placeholder)
function showMenu() {
    // Could be used for additional options
    console.log("Menu button clicked");
}

// Keyboard controls
document.addEventListener("keydown", function(e) {
    switch(e.code) {
        case "Space":
            togglePlayPause();
            e.preventDefault();
            break;
        case "ArrowRight":
            nextSong();
            break;
        case "ArrowLeft":
            prevSong();
            break;
    }
});

// Initialize first song
loadSong(currentSongIndex);