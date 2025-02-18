//=== Här är hämtar vi information från Google Geo API för att hämta koordinater från plats som är angiven från grundstäderna, favorieserad stad eller sökt stad. ===//

export async function fetchCoordinates(location: string): Promise<{ latitude: number, longitude: number } | null> {
    //API-nyckel för att använda Google Geocoding API (måste vara aktiv i Google Cloud Console)
    //Lagt nyckeln i en .env fil för att dölja den på github. 
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    //Slår ihop URL och nyckel
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
        //Skickar ett API-anrop till Google Geocoding API
        const response = await fetch(url);

        //Om svaret inte är OK, visa error meddelande
        if (!response.ok) {
            throw new Error(`Fel vid hämtning av data: ${response.status}`);
        }

        const data = await response.json();

        //Kontrollera om API-svaret innehåller några resultat
        if (data.results && data.results.length > 0) {
            //Extraherar latitud och longitud från det första resultatet
            const location = data.results[0].geometry.location;
            console.log("Hämtade koordinater:", location); //Loggar koordinater i consolelog för felsökning
            return { latitude: location.lat, longitude: location.lng }; //Returnerar koordinaterna
        } else {
            console.error("Ingen plats hittades för angiven adress.");
            return null; //Returnerar null om ingen plats hittas
        }
    } catch (error) {
        //Fångar fel vid hämtning av data och loggar dem
        console.error("Ett fel inträffade vid hämtning av koordinater:", error);
        return null;
    }
}
