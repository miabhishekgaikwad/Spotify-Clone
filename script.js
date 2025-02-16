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
      songs.push(element.href);
    }
  }
  return songs;
}

async function main() {
  // get songs list
  let songs = await getSongs();
  console.log(songs);

  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + song;
  }

  //   play audio
  var audio = new Audio(songs[0]);
  // audio.play();

  const audioElement = new Audio(songs[0]);
  audioElement.addEventListener("loadeddata", () => {
    let duration = audioElement.duration;
    // The duration variable now holds the duration (in seconds) of the audio clip

    setInterval(() => {
      console.log(audio.duration, audio.currentSrc, audio.currentTime);
    }, 1000);
  });
}

main();
