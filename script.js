let curruntSong = new Audio();

async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
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
  curruntSong.src = "/songs/" + track;
  if (!pause) {
    curruntSong.play();
    play.src = "/img/pause.svg";
  }
  document.getElementById("songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function main() {
  // get songs list
  let songs = await getSongs();
  playMusic(songs[0], true);
  // show all the songs in the playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

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
  // return songs

  // attach  an event listner to play, next and previous buttons

  play.addEventListener("click", () => {
    if (curruntSong.paused) {
      curruntSong.play();
      play.src = "/img/pause.svg";
    } else {
      curruntSong.pause();
      play.src = "/img/play.svg";
    }
  });

  // listen for time update event
  curruntSong.addEventListener("timeupdate", () => {
    console.log(curruntSong.currentTime, curruntSong.duration);
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      curruntSong.currentTime
    )} / ${secondsToMinutesSeconds(curruntSong.duration)}`;
  });
}

main();
