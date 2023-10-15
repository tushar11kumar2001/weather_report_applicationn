const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables need..
let currentTab = userTab;
const API_KEY = "5aa1628f2baa9358cf13a1c87bf0867e";
currentTab.classList.add("current-tab");
getfromSessionStorage();

function renderWeatherInfo(weatherInfo) {
  //firstly fetch element
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");

  //fetch value from weatherInfo object and put it UI element
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144×108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText =` ${weatherInfo?.main?.temp}°C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${ weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  //API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    //homework what we do..
  }
}

function getfromSessionStorage() {
  //check if coordinates are already present in session storage..
  const localCoordinate = sessionStorage.getItem("user-coordinates");
  if (!localCoordinate) {
    //agar coordinates nhi mile toh grant access vli window ko visible kro..
    grantAccessContainer.classList.add("active");
  } else {
    //  console.log("local cordinates",localCoordinate);
    //  console.log("tyeof localcoordinate" , typeof localCoordinate);
    const coordinates = JSON.parse(localCoordinate);
    // console.log("cordinates",coordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

//function for switch the tab
function switchTab(clickedTab) {
  if (currentTab != clickedTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //jb hum your weather pr the or hum switch kiya search weather pr

      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //jb hum search weather pr the or humne switch kiya your weather pr

      userInfoContainer.classList.remove("active");
      searchForm.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

//addeventlistner
userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});











function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  // console.log("user" , userCoordinates);
  // console.log("type of user cordinates" , typeof userCoordinates);
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
   fetchUserWeatherInfo(userCoordinates);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //HW show an alert
  }
}

//grant access button se current coordinates find krne j

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);







async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {}
}

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  
  e.preventDefault();
  let cityName = searchInput.value;
  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});
