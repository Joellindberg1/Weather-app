// Importerar funktioner för API-anrop
import { fetchCoordinates } from "../api/GoogleGeoAPI"; // Hämtar koordinater från Google Geocoding API
import { fetchTemperature } from "../api/SMHIAPI"; // Hämtar temperatur från SMHI API
import { fetchWeatherWarnings } from "../api/SMHIwarningsAPI"; // Hämta vädervarningar från SMHI API

// Importerar state-hantering
import { 
    getState, setSearchResults, clearSearch, updateCityData, CityData, 
    toggleFavorite, addCityToState 
} from "../state/State"; // Hanterar state för favoriter, sökningar och uppdateringar

// Importerar SCSS-stil
import "../../style/style.scss"; // Laddar in SCSS-styling för att applicera stilar på UI

// Renderar städer och uppdaterar UI
const renderCities = () => {
    const container = document.getElementById("cityContainer") as HTMLDivElement;
    container.innerHTML = ""; // Rensar innehållet i container innan rendering

    const { cities, favorites, searchResults, isSearching } = getState(); // Hämtar aktuell state

    if (isSearching) {
        // Visa endast sökresultaten om en sökning är aktiv
        searchResults.forEach((city: CityData) => {
            const cityElement = createCityCard(city);
            container.appendChild(cityElement);
        });
    } else {
        // Visa endast standardstäder som inte redan är favoriter
        cities
            .filter(city => !city.isFavorite) // Dölj favoriter från standardlistan
            .forEach((city: CityData) => {
                const cityElement = createCityCard(city);
                container.appendChild(cityElement);
            });
    }

    // Favoriter ska alltid visas oavsett sökning
    favorites.forEach((favorite: CityData) => {
        const favoriteElement = createCityCard(favorite, true);
        container.appendChild(favoriteElement);
    });
};

//Funktion för att uppdatera visibiliteten av "Rensa sökning"-knappen
const updateClearSearchButton = () => {
    const clearSearchButton = document.getElementById("clearSearch") as HTMLButtonElement;
    
    //Om det finns sökresultat, visa knappen. Annars göm den.
    if (getState().isSearching) {
        clearSearchButton.style.display = "block"; // Visa knappen
    } else {
        clearSearchButton.style.display = "none"; // Dölj knappen
    }
};

//Modifiera befintliga funktioner för att anropa `updateClearSearchButton()`
const form = document.getElementById("searchForm") as HTMLFormElement;
const input = document.getElementById("locationInput") as HTMLInputElement;
const clearSearchButton = document.getElementById("clearSearch") as HTMLButtonElement;

//Hantera sökning
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = input.value.trim();

    if (!location) return;

    try {
        const coordinates = await fetchCoordinates(location);
        if (coordinates) {
            const temperature = await fetchTemperature(coordinates.latitude, coordinates.longitude);

            addCityToState({
                name: location,
                temperature: temperature,
                isFavorite: false,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            });

            setSearchResults([{ 
                name: location, 
                temperature: temperature, 
                isFavorite: false, 
                latitude: coordinates.latitude, 
                longitude: coordinates.longitude
            }]);

            renderCities();
            updateClearSearchButton(); //Uppdaterar knappen
        }
    } catch (error) {
        console.error("Ett fel inträffade vid sökningen:", error);
    }
});

//Hantera klick på "Rensa sökning"-knappen
clearSearchButton.addEventListener("click", () => {
    clearSearch(); //Rensar sökresultaten
    renderCities(); //Uppdaterar UI
    updateClearSearchButton(); //Dölj knappen igen
});

//Anropa funktionen vid sidladdning för att dölja knappen från start
document.addEventListener("DOMContentLoaded", () => {
    updateClearSearchButton();
});

// Funktion för att skapa ett stadskort (UI-komponent)
const createCityCard = (city: CityData, isFavorite: boolean = false): HTMLElement => {
    const cityElement = document.createElement("div");
    cityElement.className = `city ${isFavorite ? "favorite" : ""}`; // Om staden är favorit, lägg till "favorite"-klass

    cityElement.innerHTML = `
        <h3>${city.name}</h3>
        <p>Temperatur: ${city.temperature ?? "Laddar..."}</p> <!-- Visar temperatur, annars "Laddar..." -->
        <button data-city="${city.name}" class="favorite-btn">
            ${city.isFavorite ? "Ta bort från favoriter" : "Lägg till i favoriter"}
        </button>
    `;

    return cityElement;
};

// Hämtar temperaturdata och uppdaterar UI
const fetchWeatherData = async () => {
    const { cities } = getState(); // Hämtar state för alla städer

    await Promise.all(
        cities.map(async (city: CityData) => {
            try {
                //Om koordinater saknas, hämta dem från Google API
                if (!city.latitude || !city.longitude) {
                    const coordinates = await fetchCoordinates(city.name);
                    if (coordinates) {
                        city.latitude = coordinates.latitude;
                        city.longitude = coordinates.longitude;
                    } else {
                        console.error(`Koordinater saknas för ${city.name}`);
                        return;
                    }
                }

                //Hämta temperatur från SMHI API
                const temperature = await fetchTemperature(city.latitude, city.longitude);
                updateCityData(city.name, { temperature });
            } catch (error) {
                console.error(`Kunde inte hämta temperatur för ${city.name}:`, error);
                updateCityData(city.name, { temperature: "Fel vid hämtning" });
            }
        })
    );

    renderCities(); //Uppdaterar UI efter att temperaturer hämtats
};


// Initiera sidan vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
    renderCities(); // Rendera initiala städer
    fetchWeatherData(); // Hämta väderdata vid start
});

// Hantera favoritknapp
document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains("favorite-btn")) {
        const cityName = target.getAttribute("data-city");
        if (cityName) {
            await toggleFavorite(cityName); // Uppdatera favoritstatus
            renderCities(); // Uppdatera UI
        }
    }
});


//Fetch för vädervarningar hos SMHI 
async function loadWeatherWarnings() {
    const warnings = await fetchWeatherWarnings();
    const warningContainer = document.getElementById("weather-warnings") as HTMLDivElement;
    warningContainer.innerHTML = ""; 

    if (warnings.length === 0) {
        warningContainer.innerHTML = "<p>✅ Inga aktuella vädervarningar</p>";
        return;
    }

    warnings.forEach((warning) => {
        const warningElement = document.createElement("p");
        warningElement.textContent = `⚠️ ${warning.event}: ${warning.description}`;
        warningContainer.appendChild(warningElement);
    });
}

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (googleApiKey) {
    const script = document.getElementById("google-maps-script") as HTMLScriptElement;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
} else {
    console.error("Google API key is missing. Make sure .env file is configured correctly.");
}


// Kör vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
    loadWeatherWarnings(); // Hämta och visa vädervarningar
});
