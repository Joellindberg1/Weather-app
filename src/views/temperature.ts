import { fetchWeatherForecast } from "../api/SMHIAPI";
import { getState } from "../state/State";
import "../../style/style.scss";

interface ForecastData {
    date: string;
    temperature: string;
}

// Funktion för att ladda väderdata för 1 dag eller 10 dagar
async function loadWeather(days: number) {
    const state = getState();
    const selectedCity = state.cities.find(city => city.isFavorite) || state.cities[0]; // Standardstad om ingen favorit finns

    if (!selectedCity || !selectedCity.latitude || !selectedCity.longitude) {
        console.error("Ingen stad vald eller saknar koordinater.");
        return;
    }

    const forecastData: ForecastData[] = await fetchWeatherForecast(selectedCity.latitude, selectedCity.longitude, days);

    const forecastContainer = document.getElementById("forecast");
    if (!forecastContainer) {
        console.error("Kunde inte hitta forecast-container i HTML.");
        return;
    }
    forecastContainer.innerHTML = ""; // Rensa tidigare prognoser

    forecastData.forEach((data: ForecastData) => {
        const element = document.createElement("p");
        element.textContent = `${data.date}: ${data.temperature}`;
        forecastContainer.appendChild(element);
    });
}

// Ladda 1-dagsprognos som standard
document.addEventListener("DOMContentLoaded", () => {
    loadWeather(1);
});

// Gör knapparna interaktiva
document.getElementById("one-day-btn")?.addEventListener("click", () => loadWeather(1));
document.getElementById("ten-day-btn")?.addEventListener("click", () => loadWeather(10));
