let curruntSong= new Audio();



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

const playMusic = (track)=>{
  // let audio =new Audio("/songs/" + track)
  // audio.play()
  curruntSong.src = "/songs/" + track;
  curruntSong.play()
  play.src = "/img/pause.svg"
  document.getElementById("songInfo").innerHTML =` Playing:- ${track.replace('.mp3',' ')}`;
  document.querySelector(".songTime").innerHTML ="00:00/00:00"
}

async function main() {

  // get songs list
  let songs = await getSongs();
  console.log(songs);
// show all the songs in the playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `
    
                            <li>
                            <img class="invert" src="/img/music.svg" alt="" srcset="" />
                            <div class="songInfo">
                                <div class="songName">${song.replaceAll("%20", " ")}</div>
                                <div class="songArtist">Abhishek Gaikwad</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="playSvg invert" src="/img/play.svg" alt="" srcset="" />
                            </div>
                        </li>`;
  }

  // attach an event lisner to each song 
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
    e.addEventListener("click", element=>{
      console.log(e.querySelector(".songInfo").firstElementChild.innerHTML)
      playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML.trim())
    })
  })

  // attach  an event listner to play, next and previous buttons

  play.addEventListener("click", ()=>{
    if(curruntSong.paused){
      curruntSong.play()
      play.src = "/img/pause.svg"
    }else{
      curruntSong.pause()
      play.src = "/img/play.svg"
    }
  })


}

main();
