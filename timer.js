function format_2 (x) {
  let y = Math.floor(x);
  if (y < 10) {
    return "0" + y;
  } else  {
    return y;
  }
}


function timer(where, when) {
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

    setTimeout(timer, 1000, where, when);
  } else {
    where.innerHTML = "[Timer done!]";
  }
}


function startTimer() {
  timer (document.getElementById("counter"), moment().add (30, 'minutes'));
}
