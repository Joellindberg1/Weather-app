// SMHITypes.ts

export interface Geometry {
    type: string; // Exempel: "Point"
    coordinates: number[][]; // En array av koordinater (latitud, longitud)
}

export interface Parameter {
    name: string; // Namn på parametern, t.ex. "t" för temperatur
    levelType: string; // Typ av nivå, t.ex. "hl" (höjd över marken)
    level: number; // Höjd eller annan nivå
    unit: string; // Enhet, t.ex. "Cel" för Celsius
    values: number[]; // Värden (ofta en array med ett enda värde)
}

export interface TimeSeries {
    validTime: string; // Datum och tid då värdena gäller
    parameters: Parameter[]; // En lista med väderparametrar
}

export interface SMHIResponse {
    approvedTime: string; // Tidpunkt då datan godkändes
    referenceTime: string; // Referenstid för prognosen
    geometry: Geometry; // Geometrisk information (punkt med koordinater)
    timeSeries: TimeSeries[]; // En lista med tidsserier
}
