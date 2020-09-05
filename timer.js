// let duration_min;
let when;
let timer_done = false;
let is_full_screen = false;
let showing_when = false;
const noTime = "--:--:--"

let mouseDownGuard;

function mouseDown () {  
  if (is_full_screen) {
    let r = Math.random()    
    mouseDownGuard = r;
    setTimeout(()=> {
      if (mouseDownGuard == r) {
        document.getElementById("counter").innerHTML = "until " + when.format ("HH:mm")
        showing_when = true;
      }
    },500)
  }
}

function mouseUp () {
  mouseDownGuard = null;
  if (showing_when) {
    showing_when = false;   
    render ();
  }  
}


let altGuard = null;

let add_multiplier = 1 

function setNegativeAdditions() {
  let now = moment ()
  function w()  {
    return (moment(when))
  }
  document.getElementById("add_5sec").innerHTML = "{-05 sec}"
  if (w().subtract(5, 's').isBefore(now)) {
    document.getElementById("add_5sec").href=""
  }
  document.getElementById("add_30sec").innerHTML = "{-30 sec}"
  if (w().subtract(30, 's').isBefore(now)) {
    document.getElementById("add_30sec").style.pointerEvents = "none"
  }
  document.getElementById("add_1min").innerHTML = "{-01 min}"
  if (w().subtract(1, 'm').isBefore(now)) {
    document.getElementById("add_1min").style.pointerEvents = "none"
  }
  document.getElementById("add_5min").innerHTML = "{-05 min}"
  if (w().subtract(5, 'm').isBefore(now)) {
    document.getElementById("add_5min").style.pointerEvents = "none"
  }
  document.getElementById("add_15min").innerHTML = "{-15 min}"
  if (w().subtract(15, 'm').isBefore(now)) {
    document.getElementById("add_15min").style.pointerEvents = "none"
  }
  document.getElementById("add_60min").innerHTML = "{-60 min}"
  if (w().subtract(1, 'h').isBefore(now)) {
    document.getElementById("add_60min").style.pointerEvents = "none"
  }
}

function keyDown(event) {
  if (event.altKey) {
    altGuard = true
    add_multiplier = -1
    

    
    setNegativeAdditions()
  }
}

function keyUp() {
  if (altGuard) {
    console.log ("alt key")
    document.getElementById("add_5sec").innerHTML = "{+05 sec}"
    document.getElementById("add_5sec").style.pointerEvents = "auto"
    document.getElementById("add_30sec").innerHTML = "{+30 sec}"
    document.getElementById("add_30sec").style.pointerEvents = "auto"
    document.getElementById("add_1min").innerHTML = "{+01 min}"
    document.getElementById("add_1min").style.pointerEvents = "auto"
    document.getElementById("add_5min").innerHTML = "{+05 min}"
    document.getElementById("add_5min").style.pointerEvents = "auto"
    document.getElementById("add_15min").innerHTML = "{+15 min}"
    document.getElementById("add_15min").style.pointerEvents = "auto"
    document.getElementById("add_60min").innerHTML = "{+60 min}"
    document.getElementById("add_60min").style.pointerEvents = "auto"
    add_multiplier = 1;
  }
  altGuard = false;
}


function log_ (y) {
  let x = moment().format() + ': ' + y;
  let l_ = localStorage.getItem("logMessages");
  if (l_) {
    l_ = "<p>" + x + "</p>" + l_;
  } else {
    l_ = "<p>" + x + "</p>" ;
  }

  try {
    localStorage.setItem("logMessages", l_);
  } catch (err) {
    console.log (err);
  }
  document.getElementById("log").innerHTML = l_;
}

function displayCurrent() {
  document.getElementById("when_display").innerHTML = `The countdown ends at ${when.format('HH:mm:ss')}`
}

function persistWhen (){
  try {    
    localStorage.setItem("when", when.unix());
    var duration = moment.duration(when.diff (moment()));
    
    log_ ( "Duration set to " + duration.humanize() + " until " + when.format('LTS') );    
    displayCurrent()
    render()
  } catch (err) {
    console.log (err);
  }  
}

function setWhen (x) {
  when = x;
  persistWhen();  
}


function reset(x)  {
  if (x < 1) {    
    setWhen (moment().add(x*100, 'seconds'));
  } else {    
    setWhen ( moment().add(x,'minutes'));
  }
  timer_done = false;
}

function add(x) {
  
  x = x * add_multiplier;
  if ( Math.abs(x)< 1) {
    setWhen (when.add(x * 100, 'seconds'))
  } else {
    // duration_min += x
    setWhen (when.add(x, 'minutes'))
  }  
  timer_done = when.isBefore (moment())
  if (x < 1) {
    setNegativeAdditions()
  }
}

function pad(y) {
  if (!timer_done && when.seconds() > 0) {
    if (y) {
      when.add (60 - when.seconds(), 'seconds')
    } else {
      when.subtract (when.seconds(), 'seconds')
    }
    persistWhen()
  }  
}

function setExact(i) {
  setWhen (moment(exactTimeStamps[i]))
  timer_done = false;  
}


function format_2 (x) {
  let y = Math.floor(x);
  if (y < 10) {
    return "0" + y;
  } else  {
    return y;
  }
}

function render (check = false) {
  if (mouseDownGuard) return
  let now = moment();
  if (check || now.isBefore(when)) {
    var diff = when.diff (now);
    let seconds = (diff / 1000) % 60;
    let minutes = (diff / 60000) % 60;
    let hours   = (diff / (60000*60) ) % 60;

    document.getElementById("counter").innerHTML =
      format_2 (hours)   + ':' +
      format_2 (minutes) + ':' +
      format_2 (seconds);    
  }
}


function first(x) {
  let activityString = localStorage.getItem("activity")
  if (activityString) {
    document.getElementById ("activity_hr").style.display="block";
    document.getElementById ("activity_banner").innerHTML = activityString ;
    document.getElementById ("activity_banner").style.display = "block";    
    document.getElementById ("activityInput").value = activityString;
  }
  log_ ("Page loaded " + moment().format());
  reset (x);
}



function clearlog () {
  try {
    localStorage.setItem("logMessages", "");
  } catch (err) {
    console.log(err);
  }
  document.getElementById("log").innerHTML = "";
}


function setActivity() {
  let activityString = document.getElementById("activityInput").value;
  if (activityString) {
    document.getElementById ("activity_hr").style.display="block";
    document.getElementById ("activity_banner").innerHTML = activityString ;
    document.getElementById ("activity_banner").style.display = "block";
    log_ ("Activity set to " + activityString);

    try {
      localStorage.setItem ("activity", activityString);
    } catch (err) {
      console.log (err);
    }
  }
}


function showPrevious( ) {
  let l_ = localStorage.getItem("logMessages");
  let a_ = localStorage.getItem("activity");
  if (l_) {
    document.getElementById("log").innerHTML = l_;
  }
  if (a_) {
    document.getElementById ("activity_hr").style.display="block";
    document.getElementById ("activity_banner").innerHTML =  a_ ;
    document.getElementById ("activity_banner").style.display = "block";
    document.getElementById ("activityInput").value = a_;
  }
}

let exactElements = [] 
let n_exact = 5;
let exactTimeStamps = new Array(n_exact)
function annotateExacts() {
  let now = moment ();
  let next = moment (now);  
  let minute = now.minute(); 
  next.seconds(0)
  next.milliseconds(0)

  if (minute < 15) {
    next.minute (15)
  } else if (minute < 30) {
    next.minute (30) 
  } else if (minute < 45) {
    next.minute (45)
  } else {
    next.minute (0)
    next.add(1, 'h');
  }
  
  
  exactTimeStamps[0] = next;
  for (let i = 1; i < n_exact; i++) {    
    exactTimeStamps [i] = moment (exactTimeStamps[i-1])    
    exactTimeStamps[i].add(15, 'm');  
  } 

  for (let i = 0; i < n_exact; i++) {
    exactElements[i].innerHTML = exactTimeStamps[i].format("HH:mm")
  }

    
}


function clearactivity () {
  document.getElementById ("activity_hr").style.display="none";
  document.getElementById ("activity_banner").innerHTML = '';
  document.getElementById ("activity_banner").style.display = "none";
  document.getElementById ("activityInput").value = ""
  try {
    localStorage.setItem ("activity", "");
  } catch (err) {
    console.log (err)
  }
  log_ ("Activity cleared");
}


let bg_audio ;
function playBGAudio() {
  if (!bg_audio) {
    bg_audio = new Audio('media/45min_april_rainstorm.mp3');
    bg_audio.loop = "loop";
    bg_audio.volume = 0.5;
  }
  bg_audio.play();

}

function pauseBGAudio() {
  if (bg_audio)  {
    bg_audio.pause();
  }
}


function lowerBGAudioVolume()  {
  if (bg_audio ) {
    if (bg_audio.volume > 0.1) {
      bg_audio.volume = bg_audio.volume - 0.1
    } else {
      bg_audio.volume = 0
    }
    
  }

}


function raiseBGAudioVolume() {
  if (bg_audio) {
    if (bg_audio.volume < 0.9) {
      bg_audio.volume = bg_audio.volume + 0.1
    } else {
      bg_audio.volume = 1
    }    
  }
}


function toggleControls () {
  let controls = document.getElementById("controls")
  let jumbo = document.getElementById("grayJumbotron")
  let container = document.getElementById ("theContainer")
  if (!is_full_screen) {
    controls.style.display = "none"
    let btn = document.getElementById("btnToggleControls")
    btn.style.display = "none"        
    jumbo.className = "presentationMode"
    container.className  = "presentationMode"
    document.getElementById("activity_banner").className = "presentationMode"
    document.getElementById("counter").className= "presentationMode"
    document.getElementById("shortcuts_info").style.display="none"
    is_full_screen = true;
  } else {
    controls.style.display = "block"    
    document.getElementById("shortcuts_info").style.display="block"
    jumbo.className = "jumbotron"
    container.className = "container"
    document.getElementById("activity_banner").className = ""
    document.getElementById("counter").className= ""
    is_full_screen = false;
  }
}

function showBtnToggle(e) {  
  let btn = document.getElementById('btnToggleControls');
  let controls = document.getElementById("controls")
  let jumboRect = document.getElementById('grayJumbotron').getBoundingClientRect()
  if (btn.style.display == "none") {
    const isCloseX = Math.abs (jumboRect.x + jumboRect.width - e.clientX) < 120
    const isCloseY = Math.abs (jumboRect.y + jumboRect.height - e.clientY) < 120
    if (isCloseX // && isCloseY
      ) {
      btn.style.display = 'block'
      setTimeout(()=> {
        if (controls.style.display == "none") {
          btn.style.display = 'none'
        }
      },2000)
    }    
  }  
} 

function togglePanel (panelName, toggleName) {
  let elem = document.getElementById(panelName);
  if (elem.style.display != "none") {
    elem.style.display = "none"
    document.getElementById(toggleName).innerHTML = "[Show]";
  } else {
    elem.style.display = "block";
    document.getElementById(toggleName).innerHTML = "[Hide]";
  }
}

function toggleActivity() {
  togglePanel ("panelActivity", "activityToggle");
}


function toggleLog() {
  togglePanel ("panelLog", "logToggle");
}

function toggleAdjust() {
  togglePanel ("panelAdjust", "adjustToggle");
}

function timer() {
  let now = moment();
  
  if (now.isBefore(when)) {
    render(true)
  } else {
    if (!timer_done) {
      let bell_audio = new Audio('media/ShipBrassBell.mp3');
      bell_audio.play();
    }
    timer_done = true;
    document.getElementById("counter").innerHTML = noTime;  
    pauseBGAudio()
  }

  if (now.minute() % 15 == 0) {
    annotateExacts()
  }

  setTimeout(timer, 1000);
}


function startTimer() {
  let run_first = false;
  try {
    let when_ = moment.unix(localStorage.getItem("when"));
    
    let now_ = moment();

    if (now_.isBefore(when_)) {
      when = when_;
      displayCurrent()

    } else {
      run_first = true;
    }

  } catch (err) {
    console.log(err);
    run_first = true;
  }


  if (run_first) {
    first(15);
  } else {
    showPrevious ()
  }

  const container = 
    document.getElementById("theContainer");
  container.addEventListener('mousemove',showBtnToggle);

  document.addEventListener('keydown',keyDown)
  document.addEventListener('keyup',keyUp)

  for (let i = 0; i < n_exact; i++) {
    exactElements.push (document.getElementById("exact" + i));
  }
  annotateExacts()

  timer();

}
