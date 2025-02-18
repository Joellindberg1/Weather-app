//Definierar strukturen för en enskild tidsserie i SMHI:s API
export interface TimeSeries {
    validTime: string; //Datum och tid då prognosen gäller (format, "2024-03-05T12:00:00Z")
    parameters: Parameter[]; //en array med olika väderparametrar för denna tidpunkt
}

//Definierar strukturen för en väderparameter i SMHI:s API
export interface Parameter {
    name: string; //Namn på väderparametern (t.ex. "t" för temperatur, "ws" för vindhastighet)
    values: number[]; //En array med numeriska värden för denna parameter ( t ex antalet grader för "t"=tempratur )
}

//Definierar den övergripande svaret från SMHI:s API
export interface SMHIResponse {
    timeSeries: TimeSeries[]; //En array av tidsserier som innehåller prognosdata för flera tidpunkter
}
