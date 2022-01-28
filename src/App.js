import { useState } from 'react';
import './App.css';


function App() {
  const [state, setstate] = useState('notready')
  const [timeCount, setTime] = useState('00:00')
  const [redOne,setRedOne]=useState('')
  const [hasYellow,setYellow]=useState(false)
  const playGames =() => {
    const loadImage = () => {
      const players = [
        'Aubameyang',
        'Elneny',
        'Gabriel',
        'Holding',
        'Lacazette',
        'Leno',
        'Lokonga',
        'Martinelli',
        'Nketiah',
        'Odegaard',
        'Pepe',
        'Ramsdale',
        'Saka',
        'SmithRowe',
        'Thomas',
        'Tomi',
        'White',
        'Xhaka'
      ]
      let imgs = players.map(player => {
        let img = document.createElement('img')
        img.classList.add('playerImage')
        img.src = `${player}.jpg`
        img.dataset.name = player

        return img
        //return <img src={`${player}.jpg`} data-name={player} className='playerImage'></img>
      })
      return imgs
    }
    let audio = document.getElementById('song')
    let whistle=document.getElementById('whistle')
    audio.play()
    let space = 240
    const playerImages = loadImage()
    const playBox = document.querySelector('.playBox')
    //playBox.style.top=-document.body.clientHeight*10+'px'
    const ImageHeight = document.body.clientWidth / 100 * 33.3 / 1100 * 693
    let timerList = []
    let insertTimer = setInterval(() => {
      let num = Math.round(Math.random() * 17);
      let track = Math.round(Math.random() * 2);
      let isXhaka = Math.round(Math.random() * 4 + 1) % 4 === 0
      let img = playerImages[isXhaka ? 17 : num].cloneNode(true)
      let imgWrapper = document.createElement('div')
      imgWrapper.classList.add('imgWrapper')
      imgWrapper.style.height = ImageHeight + 'px'
      imgWrapper.dataset.name=img.dataset.name
      imgWrapper.appendChild(img)
      img.ontouchstart = () => {
        img.style.display = 'none'
        img.parentNode.dataset.isClear = "true"
      }
      if (img.dataset.name === 'Xhaka') {
        img.ontouchstart = () => {
          timerList.map(t => {
            clearInterval(t)
          })
          audio.pause()
          setstate('gameover')
          whistle.play()
          setRedOne('Xhaka')
          playBox.classList.add('paused')
        }
      }

      playBox.appendChild(imgWrapper)
      img.style.display = 'block'
      img.style.left = `${track * 33.3}vw`

    }, space);
    timerList.push(insertTimer)
    let yr={}
    let detectTimer = setInterval(() => {
      [...document.querySelectorAll('.imgWrapper')].map(w => {
        if (w.getBoundingClientRect().top > window.innerHeight+ImageHeight) {
          if(w.dataset.name==="Xhaka"){
            console.log('xhaka out')
          }else if(w.dataset.isClear !== "true"){
 
          let hasRed= Object.keys(yr).some(p=>{
            if(yr[p]===2){
              setRedOne(p)
              return true
            }
            
           })
           console.log(yr);
            if(hasRed){
              timerList.map(t => {
                clearInterval(t)
              })
              playBox.classList.add('paused')
              audio.pause()
              setstate('gameover')
            }else{
             
              if(w.dataset.ischecked!=='true'){
                whistle.play()
                setYellow(true)
                setTimeout(() => {
                  setYellow(false)
                }, 390);
                w.dataset.ischecked='true'
                if(yr[w.dataset.name]){
                  yr[w.dataset.name]++
                }else{
                  yr[w.dataset.name]=1
                }
              }
            
            }
          
          }
   

        }

      });
      timerList.push(detectTimer)

      //  console.log(playBox.childNodes);
    }, 90);
    let playTime = 0
    let gameTimer = setInterval(() => {
      playTime += 50
      let min = parseInt(playTime * 90 / 1000 / 60)
      let sec = parseInt((playTime * 90 / 1000) % 60)
      let timeString = `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
      setTime(timeString)
    }, 50);
    timerList.push(gameTimer)
  }
  return (
    <div className="App">
      <audio id='song' loop={true} src="bgm.mp3" style={{ display: "none" }}></audio>
      <audio id='whistle' src="getcard.mp3" style={{ display: "none" }}></audio>
      <div className={`startBox ${state === 'notready' ? '' : 'hide'}`}>
        <div >
          Your target is to keep Arsenal
        </div>
        <div className='target'>
          NO MORE RED
        </div>
        <div className='startBtn bounceBtn' onClick={async () => {
          setstate('beginplay')

          playGames()

        }}>
          start game
        </div>

      </div>
      <div className={`playBox ${state === 'beginplay'||state==="gameover" ? '' : 'hide'}`}>
      </div>
      <div className='gameTime'>{timeCount}</div>
      <div className={`ggBox ${state==='gameover'?'':'hide'}`}>
        <div>ooooooops!</div>
        <div><text style={{fontWeight:"900",fontSize:"large",color:"#e4e5e6"}}>{redOne} </text>got red card  </div>
        <div>at <text style={{fontWeight:"900",fontSize:"large",color:"#e4e5e6"}}> {timeCount} </text>of the pitch</div>

        <div className='retryBtn bounceBtn' onClick={()=>{
          let playBox= document.querySelector('.playBox')
          playBox.innerHTML=''
          playBox.classList.remove('paused')
          playBox.style.display="none"
          setstate('beginplay')
          setYellow(false)
          setRedOne('')
          setTime('00:00')
          setTimeout(() => {
            playBox.style.display="flex"
            playGames()  
          }, 0);
          
        }}>retry?</div>
      </div>
      <div className={'cardBox '+`${hasYellow?'':'hide'}`}>
      </div>
    </div>

  );
}

export default App;
