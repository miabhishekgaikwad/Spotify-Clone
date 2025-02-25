let currentSong = new Audio();
let songs;
let currFolder;
async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}/`)[1]);
    }
  }
  // show all the songs in the playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUl.innerHTML = "";

  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `
    
                            <li>
                            <img class="invert" src="/img/music.svg" alt="" srcset="" />
                            <div class="songInfo">
                                <div class="songName">${song.replaceAll(
        "%20",
        " "
      )}</div>
                                <div class="songArtist">Abhishek Gaikwad</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="playSvg invert" src="/img/play.svg" alt="" srcset="" />
                            </div>
                        </li>`;
  }

  // attach an event lisner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(
        e.querySelector(".songInfo").firstElementChild.innerHTML.trim()
      );
    });
  });
}

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/img/pause.svg";
  }
  document.getElementById("songInfo").innerHTML = decodeURI(track).replace(
    ".mp3",
    " "
  );
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function diplayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let ancores = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(ancores);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];

      // get the metadata of the folder

      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();

      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="marathi" class="card">
            <div class="play">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="50" height="50" fill="none">
                <circle cx="16" cy="16" r="14" fill="#1fdf64" />
                <path d="M12 10L22 16L12 22V10Z" fill="black" />
              </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="Happy Hits!" />
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`;
    }

    //Load the playlist whenever card is click

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
      e.addEventListener("click", async (item) => {
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      });
    });
  }
}
async function main() {
  // get songs list
  await getSongs("songs/marathi");
  playMusic(songs[0], true);

  // display all the albums on the page
  diplayAlbums();
  // attach  an event listner to play, next and previous buttons

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
  });

  // listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // add an enevt listenr to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  // add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //add an event listener to previous
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index > 0) {
      playMusic(songs[index - 1]);
    }
  });
  //add an event listener to  next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
      document.querySelector(
        ".volumeLev"
      ).innerHTML = `${e.target.value} / 100`;
    });
}

main();
