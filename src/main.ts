import { fetchCoordinates } from "./GoogleGeoAPI";
import { fetchTemperature } from "./SMHIAPI";

const form = document.getElementById("searchForm") as HTMLFormElement;
const input = document.getElementById("locationInput") as HTMLInputElement;
const result = document.getElementById("result") as HTMLParagraphElement;

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = input.value.trim();

    //console.log("Användaren sökte efter:", location); // Logga användarens sökning
    if (!location) {
        result.textContent = "Ange en giltig plats.";
        return;
    }

    result.textContent = "Hämtar data...";

    const coordinates = await fetchCoordinates(location);
    //console.log("Koordinater från Google API:", coordinates); // Logga koordinater

    if (coordinates) {
        const temperature = await fetchTemperature(coordinates.latitude, coordinates.longitude);
        console.log("Temperatur från SMHI API:", temperature); // Logga temperatur
        result.textContent = `Temperaturen i ${location} är ${temperature}.`;
    } else {
        console.error("Kunde inte hämta koordinater."); // Logga fel vid koordinathämtning
        result.textContent = "Kunde inte hitta platsen. Försök igen.";
    }
});

function initAutocomplete() {
    const input = document.getElementById("locationInput") as HTMLInputElement;

    // Skapa en ny Google Autocomplete-instans
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ["geocode"], // Begränsa till adresser och geografiska platser
        componentRestrictions: { country: "se" }, // Begränsa till Sverige
    });

    // Lyssna på när användaren väljer en plats
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log("Plats vald:", place);

        const selectedAddress = place.formatted_address || place.name || "";
        console.log("Vald adress:", selectedAddress);

        input.value = selectedAddress; // Uppdatera fältet med den valda adressen
    });
}

// Initiera autocomplete när sidan är redo
document.addEventListener("DOMContentLoaded", () => {
    initAutocomplete();
});


