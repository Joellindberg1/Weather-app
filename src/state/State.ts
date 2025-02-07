// Definierar typen för en stad
export interface CityData {
    name: string; 
    temperature?: string; 
    precipitation?: string; 
    wind?: string; 
    isFavorite?: boolean; //Markerar om staden är favorit
    latitude?: number; 
    longitude?: number; 
}

//Definierar applikationens state - för att visa vad vi ska visa upp
const state: {
    cities: CityData[]; //Lista med alla städer
    favorites: CityData[]; //Lista med favoriter
    searchResults: CityData[]; //Lista med sökresultat
    isSearching: boolean; //Om en sökning är aktiv eller ej
} = {
    cities: [ //Standardstäder som alltid finns med i state
        { name: "Stockholm" },
        { name: "Göteborg" },
        { name: "Malmö" },
        { name: "Kiruna" },
    ],
    favorites: [], //Tom lista för favoriter
    searchResults: [], //Tom lista för sökresultat
    isSearching: false, //Sökning är inaktiv från start
};

//Nyckel för att spara state i localStorage
const STORAGE_KEY = "weather_app_state";

//Funktion för att spara state i localStorage
const saveState = (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); //Konverterar state till JSON och sparar i localStorage
};

//Funktion för att ladda state från localStorage vid sidladdning
const loadState = (): void => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
        const parsedState = JSON.parse(savedState);

        //Kontrollera om någon av standardstäderna saknas i localStorage och lägg till dem
        ["Stockholm", "Göteborg", "Malmö", "Kiruna"].forEach((cityName) => {
            if (!parsedState.cities.some((city: CityData) => city.name === cityName)) {
                parsedState.cities.push({ name: cityName });
            }
        });

        Object.assign(state, parsedState);
    }
};


//Ladda state vid start så att favoriter återställs
loadState();

//Funktion för att lägga till en ny stad i state
export const addCityToState = (cityData: CityData): void => {
    let city = state.cities.find((c) => c.name === cityData.name); //Kollar om staden redan finns i state

    if (!city) {
        state.cities.push(cityData); //Om staden inte finns, lägg till den
        saveState(); //Spara ändringen i localStorage
    }
};

//Funktion för att hämta nuvarande state
export const getState = () => state;

//Funktion för att uppdatera sökresultat
export const setSearchResults = (results: CityData[]): void => {
    state.searchResults = results; //Uppdaterar listan med sökresultat
    state.isSearching = results.length > 0; //Om sökresultat finns, aktivera sökning
};

//Funktion för att rensa sökning och återställa state
export const clearSearch = (): void => {
    state.searchResults = []; //Rensar sökresultaten
    state.isSearching = false; //Avaktiverar sökning

    //Endast behåll standardstäder och favoriter
    state.cities = state.cities.filter(city => city.isFavorite || ["Stockholm", "Göteborg", "Malmö", "Kiruna"].includes(city.name));
};

//Importera API-funktioner för att hämta temperatur och koordinater
import { fetchTemperature } from "../api/SMHIAPI";
import { fetchCoordinates } from "../api/GoogleGeoAPI";

//Funktion för att hantera favoriter
export const toggleFavorite = async (cityName: string): Promise<void> => {
    let city = state.cities.find((c) => c.name === cityName);

    //Om staden inte finns i state, hämta koordinater och skapa den
    if (!city) {
        const coordinates = await fetchCoordinates(cityName);
        if (!coordinates) {
            console.error(`Koordinater saknas för ${cityName}`);
            return;
        }

        //Hämta temperatur från SMHI API
        const temperature = await fetchTemperature(coordinates.latitude, coordinates.longitude);

        city = {
            name: cityName,
            temperature: temperature,
            isFavorite: true,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
        };

        state.cities.push(city);
    }

    //Växla favoritstatus
    city.isFavorite = !city.isFavorite;

    if (city.isFavorite) {
        state.favorites.push(city);
    } else {
        state.favorites = state.favorites.filter((fav) => fav.name !== cityName);

        //Om staden INTE är en av standardstäderna (Stockholm, Göteborg, Malmö, Kiruna), ta bort den från state
        if (!["Stockholm", "Göteborg", "Malmö", "Kiruna"].includes(cityName)) {
            state.cities = state.cities.filter((c) => c.name !== cityName);
        }
    }

    saveState(); //Spara ändringen i localStorage
};


//Funktion för att uppdatera en stadsdata (exempelvis temperatur)
export const updateCityData = (cityName: string, newData: Partial<CityData>): void => {
    const city = state.cities.find((c) => c.name === cityName); //Hitta staden i state
    if (city) {
        Object.assign(city, newData); //Uppdatera stadens data med ny information
    }
};
