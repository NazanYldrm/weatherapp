const form = document.querySelector("section.weather-banner form");
const input = document.querySelector(".weather-container input");
const msg = document.querySelector("span.weather-msg");
const list = document.querySelector(".weather-results ul.weather-cities");


form.addEventListener("submit", (event) => {
  event.preventDefault(); 
  getWeatherDataFromApi(); 
});

const getWeatherDataFromApi = async () => {
  const API_KEY = "0fe1c7abc76487b06150a5ed3ac40ed0";
  const inputValue = input.value;
  const units = "metric";
  const lang = "tr";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${API_KEY}&lang=${lang}&units=${units}`;

  try {
    const response = await axios(url);
    console.log(response);

    const { main, sys, name, weather, } = response.data; 

    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    const cityNameSpans = list.querySelectorAll(".weather-city span");
    const cityNameSpansArray = Array.from(cityNameSpans);
    if (cityNameSpansArray.length > 0) {
      const filteredArray = cityNameSpansArray.filter(
        (item) => item.innerText == name
      );
      console.log(filteredArray);
      if (filteredArray.length > 0) {
        msg.innerText = `Zaten ${name} şehri için hava durumunu biliyorsunuz, lütfen başka bir şehir arayın 😉`;
        setTimeout(() => {
          msg.innerText = "";
        }, 5000);
        form.reset();
        return;
      }
    }
 
    const createdLi = document.createElement("li");
    createdLi.classList.add("weather-city");
    createdLi.innerHTML = `
        <i class="fa-solid fa-circle-xmark"></i>
        <h2 class="weather-city-name">
        <span>${name}</span>
        <sup>${sys.country}</sup>
        </h2>
        <div class="weather-city-temp">
        ${Math.round(main.temp)}    
        <sup>°C</sup>
        </div>
        <figure>
        <img src="${iconUrl}" class="weather-city-icon" alt="" />
        <figcaption>${weather[0].description}</figcaption>
        </figure>
    `;
    const closeButton = createdLi.querySelector('.fa-circle-xmark');

    closeButton.addEventListener('click' , function () {
      createdLi.remove();
    })
    
    list.prepend(createdLi);
  } catch (error) {
    console.log(error);
    msg.innerText = `404 (Şehir Bulunamadı)`;
    setTimeout(() => {
      msg.innerText = "";
    }, 5000);
  }

  form.reset(); 
};

