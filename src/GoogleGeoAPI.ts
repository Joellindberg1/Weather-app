export async function fetchCoordinates(location: string): Promise<{ latitude: number, longitude: number } | null> {
    const apiKey = "AIzaSyBjskXKp3vMxo8TAZD8j7XjH9p2KrVP5As";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
        console.log("Anropar Google Geocoding API med URL:", url); // Logga URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fel vid hämtning av data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Svar från Google API:", data); // Logga hela API-svaret

        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            console.log("Hämtade koordinater:", location); // Logga koordinater
            return { latitude: location.lat, longitude: location.lng };
        } else {
            console.error("Ingen plats hittades för angiven adress.");
            return null;
        }
    } catch (error) {
        console.error("Ett fel inträffade vid hämtning av koordinater:", error);
        return null;
    }
}
