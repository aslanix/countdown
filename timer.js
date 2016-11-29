let duration_min = 30;

let when = moment().add (duration_min, 'minutes');

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
    where.innerHTML = "[Timer done!]";
  }
}


function startTimer() {
  timer (document.getElementById("counter") );
}

function reset(x)  {
  duration_min = x
  when = moment().add(duration_min,'minutes');
}
