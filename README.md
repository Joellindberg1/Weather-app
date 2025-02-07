 # 🌦 SWAG the WeatherApp – Dynamisk väderapplikation  

**SWAG är en webbaserad väderapplikation som låter användare:**  
✅ Söka efter städer och få uppdaterad temperaturdata  
✅ Se aktuella vädervarningar från SMHI  
✅ Spara och hantera favoritstäder  
✅ Få geografiska koordinater genom Google Geocoding API  

🚀 **Byggd med:**  
- **TypeScript**  
- **SCSS & CSS Grid**  
- **Vite för snabb utveckling**  
- **SMHI & Google API:er för väder- och koordinatdata**  

---

## 📌 Hur fungerar applikationen?  

### **🔹 Användarfunktioner**
- **Sök efter en stad:** Skriv in en stad/adress och få dess aktuella temperatur.  
- **Favoritfunktion:** Lägg till en stad som favorit och se den sparad på sidan.  
- **Vädervarningar:** Få SMHI:s varningar för extrema väderförhållanden i Sverige.  
- **Dynamisk UI-uppdatering:** Favoriter och väderdata sparas och visas automatiskt.  

---

## 📥 Installation & användning  

### **1️⃣ Klona projektet från GitHub**
```sh
git clone https://github.com/DITT-GITHUB-NAMN/WeatherApp.git
cd WeatherApp
```
### **2️⃣ Installera nödvändiga beroenden**
```sh
npm install
```
### **3️⃣ Installera nödvändiga beroenden**
```sh
npm run dev
```
## 🌍 API:er som används
- **Google Geocoding API**	Konverterar stad/adress till latitud/longitud
- **SMHI Prognos-API**	Hämtar temperaturdata för en specifik plats
- **SMHI Varnings-API**	Hämtar aktuella vädervarningar

## 📁 Projektstruktur
📦 WeatherApp \
 ┣ 📂 src \
 ┃ ┣ 📂 api         # API-anrop \
 ┃ ┃ ┣ 📜 GoogleGeoAPI.ts \
 ┃ ┃ ┣ 📜 SMHIAPI.ts \
 ┃ ┃ ┣ 📜 SMHIwarningsAPI.ts \
 ┃ ┣ 📂 datatypes         # typning \
 ┃ ┃ ┣ 📜 SMHITypes.ts \  
 ┃ ┣ 📂 state       # State-hantering \
 ┃ ┃ ┣ 📜 State.ts \
 ┃ ┣ 📂 views       # UI-logik \
 ┃ ┃ ┣ 📜 main.ts \
 ┃ ┃ ┣ 📜 temperature.ts    # Avänds förnärvarande inte - kommer vara för prognoser \
 ┣ 📂 style       # Modulär SCSS-struktur \
 ┃ ┣ 📜 style.scss \
 ┃ ┣ 📜 variables.scss \
 ┃ ┣ 📜 mixins.scss \
 ┃ ┣ 📜 layout.scss \
 ┃ ┣ 📜 buttons.scss \
 ┃ ┣ 📜 citiesbackground.scss \
 ┃ ┣ 📜 sidebar.scss \
 ┣ 📜 index.html    # startsida-HTML \
 ┣ 📜 vite.config.ts # Vite-konfiguration \
 ┣ 📜 package.json  # Beroenden \
 ┗ 📜 README.md     # Dokumentation \

## 📝 Så fungerar koden
### 🌡 **Hämta temperatur från SMHI API**

    1. Användaren söker efter en stad
    2. Google Geocoding API hämtar latitud och longitud
    3. Dessa koordinater används i SMHI API för att få aktuell temperatur
    4. Temperaturen visas i UI och sparas i state

## 🏗 Hur vi arbetar med TypeScript och SCSS
### 📌 SCSS-struktur och koncept vi använder
|SCSS-koncept       |Var och hur har vi använt det?                                                 |
|-------------------|-------------------------------------------------------------------------------|
|Variabler          |Definierar färger, padding och spacing i variables.scss                        |
|Mixins             |Återanvändbara stilregler för knappar och kort i mixins.scss                   |
|@use / @forward    |Modularisering av SCSS-filer i style.scss                                      |
|Nesting            |Används för att hålla SCSS-koden strukturerad, t.ex. .sidebar nav ul { ... }   |
|Grid & Flexbox     |Används i layout.scss för att skapa en responsiv design                        |
|
### 📌 TypeScript-struktur

|Fil                |Funktion                                               |
|-------------------|-------------------------------------------------------------------------------|
|State.ts          |Hanterar applikationens state och localStorage                      |
|googlegeoAPI.ts           |Hämtar latitud/longitud baserat på stad/adress                   |
|SMHIAPI.ts    |Hämtar temperaturdata från SMHI                                      |
|SMHIWarningsAPI.ts          |Hämtar aktuella vädervarningar från SMHI   |
|main.ts     |UI-logik, hantering av sökning och rendering av väderdata                       |
|


## 🚀 Framtida förbättringar
✅ Stöd för fler internationella städer\
✅ Implementering av vind- och nederbördsprognos m.m.\
✅ Stöd för att visa dagen i timmar\
✅ Stöd för 10 dagars prognos\
✅ Mörkt läge (dark mode)\
✅ Möjlighet att visa historiska väderdata\

## 🏆 Författare

### 👤 Joel Lindberg
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:Joellindberg23@gmail.com)  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ditt-namn/)  [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Joellindberg1)
