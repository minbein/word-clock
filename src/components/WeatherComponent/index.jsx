import { useState, useEffect } from "react";
import axios from "axios";

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [cityList, setCityList] = useState([]);

  const fetchWeatherData = async (selectedCity) => {
    const API_KEY = "1e2d8127ee394bc9b8f221902230512";

    try {
      const responseWeatherAPI = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${selectedCity}&lang=pt`
      );
      console.log(responseWeatherAPI);
      setWeatherData(responseWeatherAPI.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCityList = async () => {
    try {
      const response = await axios.get(
        "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
      );
      setCityList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCityList();
    fetchWeatherData("Brasília"); // Fetch weather data for Brasília initially
  }, []);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleCitySelection = (selectedCity) => {
    setCity(selectedCity);
    fetchWeatherData(selectedCity);
  };

  const filteredCities = cityList.filter((cityItem) =>
    cityItem.nome.toLowerCase().includes(city.toLowerCase())
  );

  const displayCityData = weatherData || {
    location: { localtime: new Date().toLocaleTimeString() },
    current: { temp_c: "N/A", humidity: "N/A", condition: { text: "N/A" } },
  };

  return (
    <div>
      <h1>Selecione uma cidade</h1>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Digite o nome de uma cidade"
      />
      {city && (
        <ul>
          {filteredCities.map((cityItem) => (
            <li
              key={cityItem.id}
              onClick={() => handleCitySelection(cityItem.nome)}
            >
              {cityItem.nome}, {cityItem.microrregiao.mesorregiao.UF.sigla}
            </li>
          ))}
        </ul>
      )}

      <div>
        <h2>Dados meteorológicos de {city || "Brasília"}</h2>
        <p>Temperatura: {displayCityData.current.temp_c} °C</p>
        <p>Umidade: {displayCityData.current.humidity}%</p>
        <p>
          Horário local:{" "}
          {new Date(displayCityData.location.localtime).toLocaleTimeString()}
        </p>
        <p>Condição: {displayCityData.current.condition.text}</p>
      </div>
    </div>
  );
};

export default WeatherComponent;
