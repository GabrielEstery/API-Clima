const apiKey = 'ce5adebcc8125ef189070038b7a111fd';

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Cidade não encontrada!');
      }
      return response.json();
    })
    .then(data => {
      const { name, main, weather, wind, sys, clouds, rain, visibility } = data;
      const country = sys.country;
      displayWeather(name, country, main.temp, weather[0].description, weather[0].icon, wind.speed, main.pressure, wind.deg, clouds.all, rain?.['1h'], visibility);
      clearError();
    })
    .catch(error => {
      console.error('Erro ao buscar dados:', error);
      displayError(error.message);
    });
}

function displayWeather(city, country, temp, weatherDesc, icon, windSpd, atmPressure, windDir, cloudCover, rainAmt, visibilityRange) {
  const weatherSection = document.getElementById('weatherInfo');
  weatherSection.dataset.city = city;
  weatherSection.dataset.country = country;
  weatherSection.dataset.temp = temp.toFixed(1);
  weatherSection.dataset.weatherDesc = weatherDesc;
  weatherSection.dataset.icon = icon;
  weatherSection.dataset.windSpd = windSpd;
  weatherSection.dataset.atmPressure = atmPressure;
  weatherSection.dataset.windDir = windDir;
  weatherSection.dataset.rainAmt = rainAmt ? rainAmt : '0';
  weatherSection.dataset.visibilityRange = visibilityRange;
  
  displayInfo('temperature');
}

function displayInfo(infoType) {
  const weatherSection = document.getElementById('weatherInfo');
  weatherSection.innerHTML = '';

  const cityCountry = document.createElement('h2');
  cityCountry.textContent = `${weatherSection.dataset.city}, ${weatherSection.dataset.country}`;
  weatherSection.appendChild(cityCountry);

  let infoElement;
  switch(infoType) {
    case 'temperature':
      infoElement = document.createElement('p');
      infoElement.textContent = `Temperatura: ${weatherSection.dataset.temp}°C`;
      break;
    case 'weather':
      infoElement = document.createElement('p');
      infoElement.textContent = `Clima: ${weatherSection.dataset.weatherDesc}`;
      const weatherIcon = document.createElement('img');
      weatherIcon.src = `http://openweathermap.org/img/wn/${weatherSection.dataset.icon}@2x.png`;
      weatherIcon.alt = weatherSection.dataset.weatherDesc;
      weatherSection.appendChild(weatherIcon);
      break;
    case 'windSpeed':
      infoElement = document.createElement('p');
      infoElement.textContent = `Velocidade do vento: ${weatherSection.dataset.windSpd} m/s`;
      break;
    case 'windDirection':
      infoElement = document.createElement('p');
      infoElement.textContent = `Direção do vento: ${weatherSection.dataset.windDir}°`;
      break;
    case 'rainVolume':
      infoElement = document.createElement('p');
      infoElement.textContent = `Volume de chuva na última hora: ${weatherSection.dataset.rainAmt} mm`;
      break;
  }
  
  weatherSection.appendChild(infoElement);
}

function displayError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
}

function clearError() {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = '';
}

document.getElementById('searchButton').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if (city) {
    getWeather(city);
  } else {
    displayError('Digite o nome da Cidade');
  }
});
