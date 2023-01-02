// Setup

const username = "Joe";

function setTime() {
  const day_sp = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
  const month_sp = { 0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December" };
  const date = new Date();
  const hrs = date.getHours();
  const mins = date.getMinutes();
  const type = date.getDay();
  const day = date.getDate();
  const month = date.getMonth();
  let greeting = "Good evening";
  if (hrs >= 5 && hrs < 12) {
    greeting = "Good morning";
  } else if (hrs >= 12 && hrs < 18) {
    greeting = "Good afternoon";
  }
  document.getElementById("clock").innerHTML = `${hrs > 12 ? hrs - 12 : hrs}:${mins < 10 ? "0" + mins : mins}`;
  document.getElementById("date").innerHTML = `${day_sp[type]}, ${month_sp[month]} ${day}`;
  document.getElementById("greet").innerHTML = `${greeting}, ${username}`;
}

function getLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(setWeather, error, options);
}

async function setWeather(pos) {
  const crd = pos.coords;
  const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=f2a20b7d5d99c4399e3d24634dd76f80`);
  const data = await resp.json();

  const desc = data.weather[0].description;
  const temp = Math.round(data.main.temp - 273.15);

  const exceptions = ["03", "04", "13", "50"];
  let icon = data.weather[0].icon;
  if (exceptions.includes(icon.slice(0, 2))) {
    icon = icon.slice(0, 2);
  }

  document.getElementById("current").innerHTML = `${desc.charAt(0).toUpperCase() + desc.slice(1)} | ${temp}°`;
  document.getElementById("weatherIcon").src = `assets/weather/${icon}.svg`;
}

async function setQuote() {
  try {
    const resp = await fetch("https://api.quotable.io/random?tags=wisdom");
    const data = await resp.json();
    document.getElementById("content").innerHTML = `"${data.content}"`;
    document.getElementById("author").innerHTML = `––– ${data.author}`;
  } catch (error) {
    console.log(error);
  }
}

window.onload = () => {
  setTime();
  getLocation();
  setQuote();
};
setInterval(setTime, 1000);

//Setting Sidebar
let shown = false;
const showSettings = document.getElementById("showSettings");
const toggleSettings = document.getElementById("toggleSettings");
const settings = document.getElementById("settings");
toggleSettings.addEventListener("click", () => {
  if (!shown) {
    showSettings.classList.add("shown");
    settings.classList.add("shown");
    shown = true;
  } else {
    showSettings.classList.remove("shown");
    settings.classList.remove("shown");
    shown = false;
  }
});

function ISODateString(d) {
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()) + "T" + pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + "Z";
}

chrome.identity.getAuthToken({ interactive: true }, async function (token) {
  const date = new Date();
  const now = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const then = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  console.log(now);
  console.log(then);
  const init = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const resp = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${new URLSearchParams({
      timeMin: ISODateString(now),
      timeMax: ISODateString(then),
      singleEvents: true,
      orderBy: "startTime",
    })}`,
    init
  );
  const data = await resp.json();
  const events = data.items;
  events.forEach((event) => {
    console.log(event.summary);
  });
});
