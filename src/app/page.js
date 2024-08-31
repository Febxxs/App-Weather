"use client";
import axios from "axios";
import { useState } from "react";
import Loading from "./loading";

export default function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [forecast, setForecast] = useState([]);

  const getHour =
    forecast[0] &&
    Array.isArray(forecast[0].hour) &&
    forecast[0].hour.length > 0
      ? forecast[0].hour
      : [];
  const indices = [5, 8, 11, 14, 19, 23];
  const selectedHour = getHour.filter((_, index) => indices.includes(index));

  const getWeather = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
      );
      setForecast(res.data.forecast.forecastday);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const timeFormatter = (time) => {
    let epochTime = time;
    let date = new Date(epochTime * 1000); // epoch time in milliseconds

    // Ambil jam dan menit
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");

    // Format jam
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
      {loading ? (
        <Loading />
      ) : (
        <>
          <header className="text-center my-10">
            <h1 className="text-4xl font-bold">Weather App</h1>
            <p className="text-lg">Get the latest weather updates</p>
          </header>

          <form
            onSubmit={getWeather}
            className="flex flex-col items-center w-full max-w-md p-4 bg-white bg-opacity-10 rounded-lg"
          >
            <input
              type="text"
              placeholder="Enter city"
              className="w-full p-3 text-black rounded-md outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 w-full py-2 bg-blue-700 hover:bg-blue-800 rounded-md transition duration-300"
            >
              Get Weather
            </button>
          </form>

          <div className="mt-10 w-full max-w-7xl">
            <h2 className="text-2xl font-bold text-center">Lokasi</h2>
            <p className="text-center mb-2">{city}</p>

            {/*  menampilkan data dari array pertama */}
            <div
              className={`${
                selectedHour.length > 0 ? "block" : "hidden"
              } bg-white bg-opacity-10 rounded-lg mb-6 p-4`}
            >
              {forecast.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <p>Today</p>
                    <p>{forecast[0].date}</p>
                  </div>
                  <div className="flex flex-col items-center ">
                    <img
                      src={forecast[0].day.condition.icon}
                      alt={forecast[0].day.condition.text}
                      className="w-20 h-20"
                    />

                    <div className="flex sm:gap-4 gap-2 justify-center  items-center flex-col sm:flex-row mb-2 ">
                      <p>{forecast[0].day.condition.text}</p>
                      <p>
                        <span className="font-bold">
                          {forecast[0].day.mintemp_c}-
                          {forecast[0].day.maxtemp_c}
                        </span>
                        °C
                      </p>
                      <p>
                        <span className="font-bold">
                          {forecast[0].day.mintemp_f}-
                          {forecast[0].day.maxtemp_f}
                        </span>
                        °F
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-center gap-4 flex-wrap">
                {selectedHour.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col  justify-center items-center"
                  >
                    <img src={item.condition.icon} className="w-10 h-10" />
                    <div className="text-center">
                      <p>{timeFormatter(item.time_epoch)}</p>
                      <small>
                        {item.temp_c}°C/{item.temp_f}°F
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Display data starting from index 1 */}
            <div className="grid sm:grid-cols-3 gap-4">
              {forecast.slice(1).map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white bg-opacity-10 rounded-lg"
                >
                  <p className="text-lg font-bold">{item.date}</p>
                  <img
                    src={item.day.condition.icon}
                    alt={item.day.condition.text}
                    className="w-16 h-16"
                  />
                  <p>{item.day.condition.text}</p>
                  <p>
                    <span className="font-bold">
                      {item.day.mintemp_c}-{item.day.maxtemp_c}
                    </span>
                    °C
                  </p>
                  <p>
                    <span className="font-bold">
                      {item.day.mintemp_f}-{item.day.maxtemp_f}
                    </span>
                    °F
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
