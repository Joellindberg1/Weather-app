// Typ för en stad
export interface CityData {
    name: string;
    temperature?: string;
    precipitation?: string;
    wind?: string;
    isFavorite?: boolean;
    latitude?: number;
    longitude?: number;
}

// State-struktur
const state: {
    cities: CityData[];
    favorites: CityData[];
    searchResults: CityData[];
    isSearching: boolean;
} = {
    cities: [
        { name: "Stockholm" },
        { name: "Göteborg" },
        { name: "Malmö" },
        { name: "Uppsala" },
    ],
    favorites: [],
    searchResults: [],
    isSearching: false,
};

const STORAGE_KEY = "weather_app_state";

// 🔹 Spara state i localStorage
const saveState = (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// 🔹 Ladda state från localStorage vid sidladdning
const loadState = (): void => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
        Object.assign(state, JSON.parse(savedState));
    }
};

// 🔹 Anropa `loadState()` vid start för att återställa tidigare favoriter
loadState();

export const addCityToState = (cityData: CityData): void => {
    // 🔹 Kontrollera om staden redan finns
    let city = state.cities.find((c) => c.name === cityData.name);
    
    if (!city) {
        state.cities.push(cityData); // 🔹 Lägg till ny stad i state
        saveState(); // 🔹 Spara ändringen i localStorage
    }
};



// Exportera funktioner för att hantera state
export const getState = () => state;
export const setSearchResults = (results: CityData[]): void => {
    state.searchResults = results;
    state.isSearching = results.length > 0;
};
export const clearSearch = (): void => {
    // 🔹 Endast behåll städer som fanns i original state ELLER som är favoriter
    state.searchResults = [];
    state.cities = state.cities.filter(city => city.isFavorite || ["Stockholm", "Göteborg", "Malmö", "Uppsala"].includes(city.name));
    state.isSearching = false;
};

import { fetchTemperature } from "./SMHIAPI";
import { fetchCoordinates } from "./GoogleGeoAPI";

export const toggleFavorite = async (cityName: string): Promise<void> => {
    let city = state.cities.find((c) => c.name === cityName);

    // 🔹 Om staden inte finns i state, hämta koordinater och skapa den
    if (!city) {
        const coordinates = await fetchCoordinates(cityName);
        if (!coordinates) {
            console.error(`Koordinater saknas för ${cityName}`);
            return;
        }

        // 🔹 Hämta temperatur från SMHI API
        const temperature = await fetchTemperature(coordinates.latitude, coordinates.longitude);

        city = {
            name: cityName,
            temperature: temperature, // 🔹 Sparar temperaturen
            isFavorite: true, // 🔹 Staden blir favorit
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        };

        state.cities.push(city); // 🔹 Lägg till staden i state
    }

    // 🔹 Växla favoritstatus
    city.isFavorite = !city.isFavorite;

    if (city.isFavorite) {
        state.favorites.push(city);
    } else {
        state.favorites = state.favorites.filter((fav) => fav.name !== cityName);

        // 🔹 Om staden INTE är en av grundstäderna, ta bort den från state
        if (!["Stockholm", "Göteborg", "Malmö", "Uppsala"].includes(cityName)) {
            state.cities = state.cities.filter((c) => c.name !== cityName);
        }
    }

    saveState(); // 🔹 Spara ändringen i localStorage
};








export const updateCityData = (cityName: string, newData: Partial<CityData>): void => {
    const city = state.cities.find((c) => c.name === cityName);
    if (city) {
        Object.assign(city, newData);
    }
};
