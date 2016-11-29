let duration_min;
let when;


function showLog( ) {
  let l_ = localStorage.getItem("logMessages");
  document.getElementById("log").innerHTML = l_;
}


function log_ (y) {
  let x = moment().format() + ': ' + y;

  // console.log (x);

  let l_ = localStorage.getItem("logMessages");
  l_ = "<p>" + x + "</p>" + l_;

  localStorage.setItem("logMessages", l_);
  document.getElementById("log").innerHTML = l_;
}


function reset(x)  {
  if (x < 1) {
    duration_min = 0;
    when = moment().add(x*100, 'seconds');
  } else {
    duration_min = x
    when = moment().add(duration_min,'minutes');
  }

  localStorage.setItem("duration_min", duration_min);
  localStorage.setItem("when", when.unix());
  log_ ( "duration set to " + x + " min until " + when.format() );
}


function format_2 (x) {
  let y = Math.floor(x);
  if (y < 10) {
    return "0" + y;
  } else  {
    return y;
  }
}


function timer(where) {
  let now = moment();
  if (now.isBefore(when)) {
    var diff = when.diff (now);

    let seconds = (diff / 1000) % 60;
    let minutes = (diff / 60000) % 60;
    let hours   = (diff / (60000*60) ) % 60;

    where.innerHTML =
      format_2 (hours)   + ':' +
      format_2 (minutes) + ':' +
      format_2 (seconds);

    setTimeout(timer, 1000, where);
  } else {
    where.innerHTML = "[TIMER DONE]";
    let audio = new Audio('media/ZenTempleBell.mp3');
    audio.play();
  }
}


function first(x) {
  log_ ("First run at " + moment().format());
  reset (x);
}


function clearlog () {

  localStorage.setItem("logMessages", "");

  document.getElementById("log").innerHTML = "";
}


function startTimer() {
  let run_first = false;
  try {
    let when_ = moment.unix(localStorage.getItem("when"));
    let now_ = moment();

    if (now_.isBefore(when_)) {
        when = when_;

    } else {
      run_first = true;
    }

  } catch (err) {
    console.log(err);
    run_first = true;
  }


  if (run_first) {
    first(30);
  } else {
    showLog ()
  }

  timer(document.getElementById("counter"));

}
