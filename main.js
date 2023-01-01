function setTime() {
  const time = dayjs();
  document.getElementById('clock').innerHTML = time.format('h:mm');
  document.getElementById('date').innerHTML = time.format('dddd, MMMM D');
}

function setWeather() {
  null;
}

async function setQuote() {
  try {
    const resp = await fetch('https://api.quotable.io/random?tags=wisdom');
    const data = await resp.json();
    document.getElementById('content').innerHTML = `"${data.content}"`;
    document.getElementById('author').innerHTML = data.author;
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  setTime();
  setWeather();
  setQuote();
};
setInterval(setTime, 1000);
