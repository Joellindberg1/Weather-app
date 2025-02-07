export async function fetchWeatherWarnings(): Promise<any[]> {
    const url = "https://opendata-download-warnings.smhi.se/api/version/1.0/alerts.json";

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fel vid hämtning av varningar: ${response.status}`);
        }

        const data = await response.json();
        return data.alert || []; // Returnera en lista med varningar
    } catch (error) {
        console.error("Ett fel inträffade vid hämtning av vädervarningar:", error);
        return [];
    }
}
