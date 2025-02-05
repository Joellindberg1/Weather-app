import { fetchCoordinates } from "./GoogleGeoAPI";
import { fetchTemperature } from "./SMHIAPI";
import { getState, setSearchResults, clearSearch, updateCityData, CityData,toggleFavorite, addCityToState } from "./State"; //

// Rendera städer
const renderCities = () => {
    const container = document.getElementById("cityContainer") as HTMLDivElement;
    container.innerHTML = ""; // Rensa tidigare innehåll

    const { cities, favorites, searchResults, isSearching } = getState();

    if (isSearching) {
        // 🔹 Visa endast sökresultaten när en sökning är aktiv
        searchResults.forEach((city: CityData) => {
            const cityElement = createCityCard(city);
            container.appendChild(cityElement);
        });
    } else {
        // 🔹 Visa standardstäder men filtrera bort de som är favoriter
        cities
            .filter(city => !city.isFavorite) // 🔹 Dölj favoriter från vanliga listan
            .forEach((city: CityData) => {
                const cityElement = createCityCard(city);
                container.appendChild(cityElement);
            });
    }

    // 🔹 Favoriter ska alltid visas
    favorites.forEach((favorite: CityData) => {
        const favoriteElement = createCityCard(favorite, true);
        container.appendChild(favoriteElement);
    });
};



// Skapa kort
const createCityCard = (city: CityData, isFavorite: boolean = false): HTMLElement => {
    const cityElement = document.createElement("div");
    cityElement.className = `city ${isFavorite ? "favorite" : ""}`;

    cityElement.innerHTML = `
        <h3>${city.name}</h3>
        <p>Temperatur: ${city.temperature ?? "Laddar..."}</p> <!-- 🔹 Fix: Temperatur visas korrekt -->
        ${isFavorite ? `<p>Favorit</p>` : ""}
        <button data-city="${city.name}" class="favorite-btn">
            ${city.isFavorite ? "Ta bort från favoriter" : "Lägg till i favoriter"}
        </button>
    `;

    return cityElement;
};


// Hämta väderdata
const fetchWeatherData = async () => {
    const { cities } = getState();

    await Promise.all(
        cities.map(async (city: CityData) => {
            try {
                const coordinates = {
                    Stockholm: { lat: 59.3293, lon: 18.0686 },
                    Göteborg: { lat: 57.7089, lon: 11.9746 },
                    Malmö: { lat: 55.6050, lon: 13.0038 },
                    Uppsala: { lat: 59.8586, lon: 17.6389 },
                };

                const { lat, lon } = coordinates[city.name as "Stockholm" | "Göteborg" | "Malmö" | "Uppsala"];
                const temperature = await fetchTemperature(lat, lon);
                updateCityData(city.name, { temperature });
            } catch (error) {
                console.error(`Kunde inte hämta temperatur för ${city.name}:`, error);
                updateCityData(city.name, { temperature: "Fel vid hämtning" });
            }
        })
    );

    renderCities();
};

// Hantera sökning
const form = document.getElementById("searchForm") as HTMLFormElement;
const input = document.getElementById("locationInput") as HTMLInputElement;

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = input.value.trim();

    if (!location) return;

    try {
        const coordinates = await fetchCoordinates(location);
        if (coordinates) {
            const temperature = await fetchTemperature(coordinates.latitude, coordinates.longitude);

            // 🔹 Lägg till staden i state om den inte finns
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
        }
    } catch (error) {
        console.error("Ett fel inträffade vid sökningen:", error);
    }
});




// Rensa sökning
const clearSearchButton = document.getElementById("clearSearch") as HTMLButtonElement;
clearSearchButton.addEventListener("click", () => {
    clearSearch();
    renderCities();
});

// Initiera
document.addEventListener("DOMContentLoaded", () => {
    renderCities();
    fetchWeatherData();
});

function initAutocomplete() {
    const input = document.getElementById("locationInput") as HTMLInputElement;

    // 🔹 Vänta på att Google Maps API är redo
    if (typeof google === "undefined" || !google.maps) {
        console.error("Google Maps API är inte tillgängligt. Försöker igen...");
        setTimeout(initAutocomplete, 500); // 🟢 Försök igen efter 500ms
        return;
    }

    // 🟢 Om API:et finns, initiera autocomplete
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["geocode"],
        componentRestrictions: { country: "se" }, // Begränsa till Sverige
    });

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error("Ingen geometri hittades för platsen.");
            return;
        }

        console.log("Plats vald:", place);
        input.value = place.formatted_address || place.name || "";
    });
}

// 🟢 Kör initAutocomplete() EFTER att Google API har laddats
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initAutocomplete, 1000); // 🔹 Vänta 1 sekund för säkerhet
});




input.addEventListener("blur", () => {
    if (!input.value.trim()) {
        input.value = "";
        console.log("Inget värde inskrivet.");
    }
});

document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains("favorite-btn")) {
        const cityName = target.getAttribute("data-city");

        if (cityName) {
            await toggleFavorite(cityName); // 🔹 Vänta på att favoritstatus uppdateras
            renderCities(); // 🔹 Uppdatera UI efter ändringen
        }
    }
});




document.addEventListener("DOMContentLoaded", () => {
    const clearSearchButton = document.getElementById("clearSearch") as HTMLButtonElement | null;

    if (!clearSearchButton) {
        console.error("Elementet 'clearSearchButton' hittades inte i DOM.");
        return;
    }

    clearSearchButton.addEventListener("click", () => {
        clearSearch();
        renderCities();
    });

    initAutocomplete(); // Flytta hit så att autocomplete inte körs innan Google Maps är redo.
});
