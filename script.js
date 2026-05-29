document.addEventListener("DOMContentLoaded", (event) => {

// console.log("Javascript is Here")

let currentSong  //we are going to update this ongoingly
let songs // This is an array which will be updated ongoingly
let currentFolder // we are going to update this ongoingly when we want to load different songs from a folder
let currentSongTime , currentSongDuration // current time of a song which is playing , and total duration of it..
let seekBarFolderName ="Attack on Titan"
const mainPlayCircle= document.querySelector(".mainPlayCircle")

// to add animation so that viewer can read full song name even when container is small

const container = document.querySelector('.seekBarNameandFolderName');
const scrollText = document.querySelector('.seekBarSongName');

// Function to check if text overflows and if yes then the animation will be added 
function checkOverflow() {

 
  if (scrollText.offsetWidth > container.offsetWidth) {
    // Apply animation only if text overflows
    scrollText.style.animation = 'none';
    // Trigger a reflow/repaint so the browser re-applies the animation
    void scrollText.offsetWidth;
    // Apply the animation again
    scrollText.style.cssText = 'animation:marquee 10s linear 2s;animation-iteration-count:1;';
  } else {
    // Remove animation if no overflow
    scrollText.style.animation = 'none';
  }
}

// Check overflow on window resize
window.addEventListener('resize', checkOverflow);

// when someone clicks on container then also the animation will be added
container.addEventListener("click",checkOverflow)


// Used to convert duration in seconds(120) to minutes (2:00)
function SecondsToMinutes(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  if(seconds<10){
    return `${minutes}:0${seconds}`
  }
  else {
    return `${minutes}:${seconds}`
  }
}

function playNextSong(){
  
    // first find the index of the current song from the songs array
    let currentIndex = songs.indexOf(currentSong.src)
    currentSong.pause() //pause the currentSong
  
    // checking if currentIndex is less that songslength because if the index is last then there is no next element in array 
    if(currentIndex < songs.length-1){

    let PlayNextSong = songs[currentIndex+1].split("/").pop()    //getting next song

    playMusic(`${currentFolder}/${PlayNextSong}`) // calling playMusic
    applyWhiteBorder(songs[currentIndex+1]) //applying white border to the songBox 
     
    //updating pastSong 
    pastMusic = (songs[currentIndex+1]).split("/")[(songs[currentIndex+1]).split("/").length - 1].replaceAll("%20"," ")

    
    }
    //if currentIndex = songs.length-1 then we will play the first song from the songs array
    else{

      let PlayNextSong = songs[0].split("/").pop()    // playing first song from songs Array
      playMusic(`${currentFolder}/${PlayNextSong}`)
      applyWhiteBorder(songs[0])

      pastMusic = (songs[0]).split("/")[(songs[0]).split("/").length - 1].replaceAll("%20"," ")

    }
}

function playPreviousSong(){

  let currentIndex = songs.indexOf(currentSong.src)
      
  currentSong.pause()

  if(currentIndex==0){
    
  let PlayPreviousSong = songs[songs.length - 1].split("/").pop()
  playMusic(`${currentFolder}/${PlayPreviousSong}`)
  applyWhiteBorder(songs[songs.length - 1])
  pastMusic = (songs[songs.length - 1]).split("/")[(songs[songs.length - 1]).split("/").length - 1].replaceAll("%20"," ")

  }
  else{
   
    let PlayPreviousSong = songs[currentIndex-1].split("/").pop()
    playMusic(`${currentFolder}/${PlayPreviousSong}`)
    applyWhiteBorder(songs[currentIndex-1])
    pastMusic = (songs[currentIndex-1]).split("/")[(songs[currentIndex-1]).split("/").length - 1].replaceAll("%20"," ")

  }
}

//To apply white border to the songBox

function applyWhiteBorder(toThisSongBox) {
   
  let indexOfSong = songs.indexOf(toThisSongBox)
  Array.from(document.querySelectorAll(".songBox"))[indexOfSong].classList.add("redBorder")

}

//Adding songs to the songsList when clicking on a card . card is linked to a folder.


async function getSongs(folder){

  
   
     let data =await fetch(`./songs/${folder}/index.html`) //here index.html have songs 
    // let data =await fetch(`./songs/default/`) //here index.html have songs 
    let response = await data.text()
    // console.log(response)

    currentFolder = folder // updating currentFolder so that we can access it in other functions

    let div = document.createElement('div')
    div.innerHTML=response

    let as = div.getElementsByTagName('a')
    let songsList =[]
    
   

    Array.from(as).forEach((e)=>{
        if(e.href.endsWith(".mp3")){
            songsList.push(e.href)
        }
       
    }) 

    let UL = document.getElementsByClassName("songsList")[0]

    UL.innerHTML=`<div class="boxLine"></div>` //adding a line before adding songs

    songs = songsList // updated songs Array
    // console.log(songs)
    //updating/adding songs to songsList
    for (let index = 0; index < songsList.length; index++) {
      const name = songsList[index];
      
    
        UL.innerHTML+=`<li class="songBox flex border">
                <div class="musicIcon flex">
                  <img width="32" src="./songs/${folder}/cover.jpg" alt="" />
                </div>
                <div class="musicName">${decodeURI(name.split("/").pop())}</div>
                <div class="songPlayCircle"> 
                  <div class="playCircle flex">
                    <img class="playBtn normal" width="13" src="images/play.svg" alt="">
                  </div>
                </div>
              </li>
              <div class="boxLine"></div>`
       
       if(index == songsList.length-1){
        document.querySelectorAll(".boxLine")[index+1].style.cssText="margin-bottom:5cm;"
       }       
            
      
             
    }

    let pastMusic;
   
    //Attach EventLisner to each songBox when we click on songBox then the song will be played
  
    Array.from(document.getElementsByClassName("songBox")).forEach(e =>{
      
      
      e.addEventListener("click",()=>{
        
        //if someone again clicks on songBox then it means stop the song thats why comparing innerHTML of musicName with pastMusic
        if(e.querySelector(".musicName").innerHTML==pastMusic){
          currentSong.pause()
         
          e.classList.remove("redBorder")

          document.querySelector(".mainPlayBtn").src="images/play.svg"
          pastMusic=null //update the pastMusic to null
          
        }
       else{
       //otherwise play the song
        playMusic(`${currentFolder}/${e.querySelector(".musicName").innerHTML}`)

        e.classList.add("redBorder")
        
        document.querySelector(".mainPlayBtn").src="images/pause.svg"
        pastMusic=e.querySelector(".musicName").innerHTML //update the pastMusic to innerHTML of musicName
        
       }
      })
    }) 
}

//for PlayMusic
const mainPlayBtn=document.querySelector(".mainPlayBtn")
const seekBarSongName = document.querySelector(".seekBarSongName")
const seekBar =document.querySelector(".seekBar")
const seekFolderName =document.querySelector(".seekBarFolderName")
const seekBarImage =document.querySelector(".seekBarImage>img")

//PlayMusic 
const playMusic = (songname)=>{
  
  if(currentSong){
    currentSong.pause()
  }
  //removing white border 
  Array.from(document.querySelectorAll(".songBox")).forEach((e)=>{
    e.classList.remove("redBorder")
  })
  
  currentSong.src = `./songs/${songname}`
  
  currentSong.play()

  //updating src's and InnerHTML's after playing a song
  mainPlayBtn.src ="images/pause.svg"
  seekBarSongName.innerHTML=decodeURI(songname.split("/")[songname.split("/").length-1])
  seekBar.style.display="flex"
  seekFolderName.innerHTML =seekBarFolderName
  seekBarImage.src = `./songs/${currentFolder}/cover.jpg`

  checkOverflow() //checking overflow after playing a new song
}

//Function for displaying albums 

async function displayAlbums() {
  
  let data =await fetch(`./songs/index.html`) //here index.html have folderNames 
  let response = await data.text()

  let div = document.createElement('div')
  div.innerHTML=response

  let anchors = Array.from(div.getElementsByTagName("a"))

  let folderNumber = 0;

 for(let i=0;i<anchors.length;i++){
    let e=anchors[i]
    if(e.href.includes("songs/")){
      
      let folderName = e.href.split("/").slice(-1)[0] //getting the foldername 
      let data =await fetch(`./songs/${folderName}/info.json`) //here info.json have title and description for a card
      let response = await data.json()
 

      document.querySelector(".cardContainer").innerHTML+=`<div data-folder="${folderName}" class="card1 flex radius">
                <div class="image radius">
                  <div class="greenPlayCircle flex justify align">
                    <img class="playBtn invert"  src="images/play.svg" alt="">
                  </div>
                </div>
                <div class="title">${response.title}</div>
                <div class="description">${response.description}</div>
              </div>`
                  
      //updating background image of a card because we used image as a background
      document.querySelectorAll(".image")[folderNumber].style.cssText=`background-image: url("./songs/${folderName}/cover.jpg");
      background-repeat : no-repeat;
      background-size:cover;`

      folderNumber++;

    }
  }

}

async function main() {
   
   currentSong = new Audio() //creating audio object
   await displayAlbums() //calling displayAlbums to display the Cards
   await getSongs('aot') //initially calling getSongs with any folder name by default

    //Attaching evenlistner to pause and play the song
   mainPlayCircle.addEventListener("click",()=>{

      if(currentSong.paused){
        currentSong.play()
        //changed pastMusic here also because it will restart the song otherwise when we stop the song by click on songBox and play it by clicking on play button and then click on songBox for stopping it
        pastMusic=document.querySelector(".seekBarSongName").innerHTML
        mainPlayBtn.src="images/pause.svg"
        applyWhiteBorder(currentSong.src)

      }
      else{
        currentSong.pause()
        mainPlayBtn.src="images/play.svg"
      }
    })

    const startTime = document.querySelector(".startTime")
    const endTime = document.querySelector(".endTime")
    const greenBar =  document.querySelector(".greenBar")
    const sliderCircle = document.querySelector(".sliderCircle")
    // Important to update the current musicTime and Duration
    currentSong.addEventListener("timeupdate",()=>{
     
      if (!isNaN(currentSong.duration)) {

      currentSongTime=SecondsToMinutes(currentSong.currentTime)
      currentSongDuration= SecondsToMinutes(currentSong.duration)

      startTime.innerHTML = currentSongTime
      endTime.innerHTML =currentSongDuration

      //if currentSong ends then playing the next song automatically
      if(currentSongTime==currentSongDuration){
        playNextSong()
      }
     
     greenBar.style.width = `${(currentSong.currentTime/currentSong.duration)*100}%`
      sliderCircle.style.left = `${(currentSong.currentTime/currentSong.duration)*100}%`
    }})

    // to get the circle there and changing the current time of song when we click on any location of the playBar
    document.querySelector(".playBar").addEventListener("click",(e)=>{
  
      const playBar = e.currentTarget;
      const rect = playBar.getBoundingClientRect(); // Get playBar's bounding rectangle
      const clickPosition = e.clientX - rect.left; // Calculate click position relative to playBar
       
      // Calculate percentage
      const percentage = (clickPosition / rect.width) * 100;
    
      // Update greenBar and sliderCircle positions
      greenBar.style.width = `${percentage}%`;
      sliderCircle.style.left = `${percentage}%`;
      currentSong.currentTime = currentSong.duration * percentage /100

    })



   document.querySelector(".previousBtn").addEventListener("click",() => { playPreviousSong() })

   document.querySelector(".nextBtn").addEventListener("click",() => { playNextSong() })


   // Adding E listner to volumeRange for changing volume of currentSong 

   document.querySelector(".volumeRange").addEventListener("change",(e) => {
      
    currentSong.volume = parseInt(e.target.value)/100 //parsing because bydefault it is string
  
    if(currentSong.volume==0){
      document.querySelector(".volume img").src="images/mute.svg"
    }
    else{
      document.querySelector(".volume img").src="images/volume.svg"
    }
    
   }
   )

   const leftSection =  document.querySelector(".leftSection")

   Array.from(document.querySelectorAll(".card1")).forEach((e) => {
     
      e.addEventListener("click",async (item) => {
        
        //currentTarget = card1 because we only added eventListner to it, and if we click on image/title/desc
        //it will not cause any problem thats why currentTarget is used instead of Target
       
        seekBarFolderName = item.currentTarget.getElementsByClassName("title")[0].innerHTML
        // console.log("This is item ",seekBarFolderName)
        await getSongs(`${item.currentTarget.dataset.folder}`)
        leftSection.style.cssText=` transform: translateX(0); transition-duration: .5s;`
  
      }
      )

   }
   )

   let Muted = false;
   const volumeRange =  document.querySelector(".volumeRange")
   //Click on volume to mute the song
   document.querySelector(".volume img").addEventListener("click",(e) => {
     if(Muted){
      e.currentTarget.src = "images/volume.svg"
      Muted=false
      currentSong.volume = 20/100
      volumeRange.value = 20
 
    }
     else{
       e.currentTarget.src = "images/mute.svg"
       Muted=true
       currentSong.volume = 0;
       volumeRange.value = 0
     }
   }
   )

   //Click on hamburger to display the list of song i.e leftSection
   document.querySelector(".hamburger").addEventListener("click",(e) => {
    leftSection.style.cssText=` transform: translateX(0);transition-duration: .5s;`
   }
   )

   //Click on getBackLeftSection i.e leftArrow to move the leftSection to the left again on Tablet or mobile Devices
   document.querySelector(".getBackLeftSection").addEventListener("click",() => {
    leftSection.style.cssText=` transform: translateX(-110%);transition-duration: .5s;`
   }
  )

  let string;

  window.addEventListener("resize",(e) => {
    if(window.innerWidth>900){
      leftSection.style.cssText=` transform: translateX(0);transition-duration: .5s;`
    }
    else{
     leftSection.style.cssText=` transform: translateX(-110%);transition-duration: .5s;`
    }
  }
  )

  if(window.innerWidth<350){
    string = "padding-bottom: 5rem;"
  }else if (window.innerWidth<420){
   string ="padding-bottom: 8rem;"
  }

  
  let seekBarHidden = false
  const goBackSeekBar = document.querySelector(".goBackSeekBar")
  const seekBar = document.querySelector(".seekBar")
  goBackSeekBar.addEventListener("click",() => {
    if(seekBarHidden){

      goBackSeekBar.style.cssText=`transform:rotate(-90deg);`
      seekBar.style.cssText=`display:flex;transform:translateY(0);transition-duration: .5s;z-index:100;`
       seekBarHidden=false

      } 
    else{

    seekBar.style.cssText=`display:flex;transform:translateY(35%);transition-duration: .5s;z-index:100;`
    goBackSeekBar.style.cssText=`transform:rotate(90deg);`
    // console.log("Changed SeekBar")
    seekBarHidden=true

    }
  }
  )

  

}
main()
});