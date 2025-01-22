export async function fetchTemperature(lat: number, lon: number): Promise<string> {
    // Begränsa antal decimaler till 6
    //Google api ger för många decimaler för SMHI APIt att läsa och då fungerar ej URL:en
    const formattedLat = lat.toFixed(6);
    const formattedLon = lon.toFixed(6);

    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${formattedLon}/lat/${formattedLat}/data.json`;
    console.log("Anropar SMHI API med formaterade koordinater:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Fel vid hämtning av data: ${response.status}`);
        }

        const data = await response.json();
        console.log("Svar från SMHI API:", data);

        const temperature = data.timeSeries[0]?.parameters.find((param: any) => param.name === "t")?.values[0];
        return temperature !== undefined ? `${temperature}°C` : "Temperaturdata saknas.";
    } catch (error) {
        console.error("Ett fel inträffade vid hämtning av temperatur:", error);
        return "Fel vid hämtning av temperatur.";
    }
}
