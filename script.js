 // DOM Elements creation
const time = document.querySelector('.time'),
  date = document.querySelector('.date'),
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus'),
  months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'],
  days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
  baseUrl = './assets/images/',
  images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'],
  btnImage = document.querySelector('.btn-image'),
  blockquote = document.querySelector('blockquote'),
  figcaption = document.querySelector('figcaption'),
  btnQuote = document.querySelector('.btn-quote'),
  weatherIcon = document.querySelector('.weather-icon'),
  temperature = document.querySelector('.temperature'),
  humidity = document.querySelector('.humidity'),
  windSpeed = document.querySelector('.wind-speed'),
  city = document.querySelector('.city');

let i = 0,
  timeOfDay;

// Show Time
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  // Output Time
  time.innerHTML = `<span>${hour}</span><span class='divider'>:
    </span><span>${addZero(min)}</span><span class='divider'>:
    </span><span>${addZero(sec)}</span>`;

  if(hour === 0 && min === 0 && sec === 0) {
    showDate();
  }

  if(min === 0) {
    getImage();
  }

  setTimeout(showTime, 1000);
}

function showDate() {
  let today = new Date(),
    month = today.getMonth(),
    day = today.getDay(),
    dayOfMonth = today.getDate();

  // Output date
  date.innerHTML = `${days[day]}, ${dayOfMonth} ${months[month]}`;
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function viewBgImage(data) {
  const body = document.querySelector('body');
  const src = data;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {      
    body.style.backgroundImage = `url(${src})`;
  }; 
}

function getImage() {
  const index = i % images.length;
  const imageSrc = `${baseUrl}${timeOfDay}/${images[index]}`;
  viewBgImage(imageSrc);
  i++;
  btnImage.disabled = true;
  setTimeout(function() {
    btnImage.disabled = false
  }, 1000);
} 

// Set Background and Greeting
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours();

  if (hour > 6 && hour < 12) {
    // Morning
    document.body.style.backgroundImage = "url('./assets/images/morning/01.jpg')";
    greeting.textContent = 'Good Morning, ';
    timeOfDay = 'morning';
  } else if (hour > 12 && hour < 18) {
    // Afternoon
    document.body.style.backgroundImage = "url('./assets/images/day/01.jpg')";
    greeting.textContent = 'Good Afternoon, ';
    timeOfDay = 'afternoon';
  } else if (hour > 18 && hour <= 23) {
    // Evening
    document.body.style.backgroundImage = "url('./assets/images/evening/01.jpg')";
    greeting.textContent = 'Good Evening, ';
    document.body.style.color = 'white';
    timeOfDay = 'evening';  
  } else {
    document.body.style.backgroundImage = "url('./assets/images/night/01.jpg')";
    greeting.textContent = 'Good Night, ';
    document.body.style.color = 'white';
    timeOfDay = 'night';
  }
}

// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
  return name.textContent;
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if(e.target.innerText.trim() !== '') {
        localStorage.setItem('name', e.target.innerText);
        name.blur();
      } else {
        localStorage.setItem('name', getName());
        name.blur();
      }      
    }
  } else {
    if(e.target.innerText.trim() !== '') {
        localStorage.setItem('name', e.target.innerText);
      } else {
        localStorage.setItem('name', getName());
      }
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
  return focus.textContent;
}

// Set Focus
function setFocus(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if(e.target.innerText.trim() !== '') {
        localStorage.setItem('focus', e.target.innerText);
        focus.blur();
      } else {
        localStorage.setItem('focus', getFocus());
        focus.blur();
      }
    }
  } else {
    if(e.target.innerText.trim() !== '') {
        localStorage.setItem('focus', e.target.innerText);
      } else {
        localStorage.setItem('focus', getFocus());
      }
  }
}

async function getQuote() {  
  const url = 'https://quote-garden.herokuapp.com/api/v2/quotes/random';
  const res = await fetch(url);
  const data = await res.json(); 
  blockquote.textContent = data.quote.quoteText;
  figcaption.textContent = data.quote.quoteAuthor;
}

function getCity() {
  if (localStorage.getItem('city') === null) {
    city.textContent = '[Enter City]';
  } else {
    city.textContent = localStorage.getItem('city');
  }
  return city.textContent;
}

function setCity(e) {
  if (e.code === 'Enter') {
    if(e.target.innerText.trim() !== '') {
      localStorage.setItem('city', e.target.innerText);
      city.blur();
    } else {
      localStorage.setItem('city', getCity());
      city.blur();
    }
    getWeather();
  }
}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${getCity()}&lang=ru&appid=2ed99464218b11bf51cab8dc29e50875&units=metric`;
  const res = await fetch(url);
  if(res.status !== 200) {
    city.textContent = 'Введено неккоректное значение';
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    humidity.textContent = '';
    windSpeed.textContent = '';
    return;
  }
  const data = await res.json();
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp}°C`;
  humidity.textContent = `${data.main.humidity} %`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
}

document.addEventListener('DOMContentLoaded', getQuote);
btnQuote.addEventListener('click', getQuote);
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', (e) => {
  e.target.innerText = '';
})
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', (e) => {
  e.target.innerText = '';
})
btnImage.addEventListener('click', getImage);
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('click', (e) => {
  e.target.innerText = '';
})

// Run
showDate();
showTime();
setBgGreet();
getName();
getFocus();
getWeather();

