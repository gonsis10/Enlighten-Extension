function setTime() {
  const time = dayjs();
  document.getElementById("clock").innerHTML = time.format("h:mm");
  document.getElementById("date").innerHTML = time.format("dddd, MMMM D");
}
window.onload = setTime();
setInterval(setTime, 1000);
