//Importerar typer för SMHI:s API-data
import { SMHIResponse, TimeSeries, Parameter } from "../datatypes/SMHITypes";

//Funktion för att hämta aktuell temperatur från SMHI API
export async function fetchTemperature(lat: number, lon: number): Promise<string> {
    //Begränsar antal decimaler till 6 för att säkerställa korrekt API-anrop
    const formattedLat = lat.toFixed(6);
    const formattedLon = lon.toFixed(6);

    //Skapar URL för att hämta väderdata från SMHI baserat på latitud och longitud
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${formattedLon}/lat/${formattedLat}/data.json`;
    console.log("Anropar SMHI API med formaterade koordinater:", url);

    try {
        //Anropar SMHI API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fel vid hämtning av data: ${response.status}`);
        }

        //Konverterar API-svaret till JSON och typas som `SMHIResponse`
        const data: SMHIResponse = await response.json();
        console.log("Svar från SMHI API:", data);

        //Hittar första tidsserien och letar efter temperaturparametern ("t")
        const temperature = data.timeSeries[0]?.parameters.find((param) => param.name === "t")?.values[0];

        //Returnerar temperaturen om den finns, annars visas ett felmeddelande
        return temperature !== undefined ? `${temperature}°C` : "Temperaturdata saknas.";
    } catch (error) {
        console.error("Ett fel inträffade vid hämtning av temperatur:", error);
        return "Fel vid hämtning av temperatur.";
    }
}

//Funktion för att hämta en prognos för 1 eller 10 dagar från SMHI API
export async function fetchWeatherForecast(lat: number, lon: number, days: number): Promise<{ date: string; temperature: string }[]> {
    //Begränsar decimaler för att säkerställa korrekt API-anrop
    const formattedLat = lat.toFixed(6);
    const formattedLon = lon.toFixed(6);

    //Skapar URL för att hämta prognosdata från SMHI
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${formattedLon}/lat/${formattedLat}/data.json`;

    try {
        //Anropar API
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fel vid hämtning av prognos: ${response.status}`);

        //Konverterar svaret till JSON och typas som `SMHIResponse`
        const data: SMHIResponse = await response.json();

        //Begränsar mängden data beroende på hur många dagar som efterfrågas
        const timeSeries: TimeSeries[] = data.timeSeries.slice(0, days * 24); //Tar 1 dag (24 timmar) eller 10 dagar (240 timmar)

        //Loopar igenom tidsserien och extraherar datum och temperatur
        return timeSeries.map((entry: TimeSeries) => ({
            date: entry.validTime.split("T")[0], //Tar endast datumdelen från `validTime`
            temperature: (entry.parameters.find((p: Parameter) => p.name === "t")?.values[0] ?? "Okänt") + "°C", //Hämtar temperatur eller visar "Okänt" om data saknas
        }));
    } catch (error) {
        console.error("Ett fel uppstod:", error);
        return []; //Returnerar en tom array om något går fel
    }
}
