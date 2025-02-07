# 🌦 SWAG the WeatherApp – Dynamic Weather Application  

**SWAG is a web-based weather application that allows users to:**  
✅ Search for cities and get updated temperature data  
✅ View current weather warnings from SMHI  
✅ Save and manage favorite cities  
✅ Retrieve geographic coordinates using Google Geocoding API  

## 🛠 Technologies & APIs  

### 🌍 Technologies
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
![SCSS](https://img.shields.io/badge/-SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)  
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)  

### ☁️ APIs for Weather & Coordinate Data
![Google](https://img.shields.io/badge/-Google-4285F4?style=for-the-badge&logo=google&logoColor=white)  
![SMHI](https://img.shields.io/badge/-SMHI-004098?style=for-the-badge&logoColor=white)

## 📌 How the Application Works  

### **🔹 User Features**
- **Search for a city:** Enter a city/address and get the current temperature.  
- **Favorite function:** Add a city to your favorites and see it saved on the page.  
- **Weather warnings:** Receive SMHI alerts for extreme weather conditions in Sweden.  
- **Dynamic UI updates:** Favorites and weather data are stored and displayed automatically.  

## 📥 Installation & Usage  

### **1️⃣ Clone the project from GitHub**
```sh
git clone https://github.com/YOUR-GITHUB-USERNAME/WeatherApp.git
cd WeatherApp
```
### **2️⃣ Install necessary dependencies**
```sh
npm install
```
### **3️⃣ Run the development server**
```sh
npm run dev
```

## 🌍 APIs Used
- **Google Geocoding API** - Converts city/address to latitude/longitude  
- **SMHI Forecast API** - Fetches temperature data for a specific location  
- **SMHI Warnings API** - Fetches current weather warnings  

## 📁 Project Structure
📦 WeatherApp  
 ┣ 📂 src  
 ┃ ┣ 📂 api         # API calls  
 ┃ ┃ ┣ 📜 GoogleGeoAPI.ts  
 ┃ ┃ ┣ 📜 SMHIAPI.ts  
 ┃ ┃ ┣ 📜 SMHIwarningsAPI.ts  
 ┃ ┣ 📂 datatypes         # Type definitions  
 ┃ ┃ ┣ 📜 SMHITypes.ts    
 ┃ ┣ 📂 state       # State management  
 ┃ ┃ ┣ 📜 State.ts  
 ┃ ┣ 📂 views       # UI logic  
 ┃ ┃ ┣ 📜 main.ts  
 ┃ ┃ ┣ 📜 temperature.ts    # Currently not used - will be for forecasts  
 ┣ 📂 style       # Modular SCSS structure  
 ┃ ┣ 📜 style.scss  
 ┃ ┣ 📜 variables.scss  
 ┃ ┣ 📜 mixins.scss  
 ┃ ┣ 📜 layout.scss  
 ┃ ┣ 📜 buttons.scss  
 ┃ ┣ 📜 citiesbackground.scss  
 ┃ ┣ 📜 sidebar.scss  
 ┣ 📜 index.html    # Homepage HTML  
 ┣ 📜 vite.config.ts # Vite configuration  
 ┣ 📜 package.json  # Dependencies  
 ┗ 📜 README.md     # Documentation  

## 📝 How the Code Works
### 🌡 **Fetching Temperature from SMHI API**

    1. The user searches for a city
    2. Google Geocoding API retrieves latitude and longitude
    3. These coordinates are used in the SMHI API to fetch current temperature
    4. The temperature is displayed in the UI and saved in state

## 🏗 How We Work with TypeScript & SCSS
### 📌 SCSS Structure & Concepts Used
|SCSS Concept       |Where and how we used it                                                |
|-------------------|------------------------------------------------------------------------|
|Variables          |Defines colors, padding, and spacing in `variables.scss`               |
|Mixins            |Reusable styles for buttons and cards in `mixins.scss`                  |
|@use / @forward   |Modularization of SCSS files in `style.scss`                            |
|Nesting           |Keeps SCSS structured, e.g. in .sidebar.scss nav ul { ... }                 |
|Grid & Flexbox    |Used in `layout.scss` to create a responsive design                     |

### 📌 TypeScript Structure

|File               |Function                                               |
|------------------|------------------------------------------------------|
|`State.ts`         |Manages the application's state and localStorage      |
|`GoogleGeoAPI.ts`  |Fetches latitude/longitude based on city/address      |
|`SMHIAPI.ts`       |Retrieves temperature data from SMHI                  |
|`SMHIWarningsAPI.ts`|Fetches current weather warnings from SMHI           |
|`main.ts`          |Handles UI logic, search functionality, and weather data rendering |

## 🚀 Future Improvements
✅ Support for more international cities  
✅ Implementation of wind and precipitation forecasts  
✅ Support for hourly forecasts  
✅ Support for 10-day forecasts  
✅ Dark mode (for better user experience)  
✅ Ability to display historical weather data  

## 🏆 Author

### 👤 Joel Lindberg
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:Joellindberg23@gmail.com)  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/YOUR-LINKEDIN/)  [![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Joellindberg1)
