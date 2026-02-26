# AREV Consultancy Survey App

A React Native Expo application for collecting and analyzing auto driver survey data in Chennai.

## Project Structure

- `/mobile-app`: React Native Expo frontend.
- `/backend`: Node.js Express server with MongoDB Atlas integration.

## Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and add your MongoDB Atlas URI.
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup

1. Navigate to the mobile-app directory:
   ```bash
   cd mobile-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Important**: Update the `API_URL` in `src/screens/SurveyFormScreen.jsx` and `src/screens/ViewSurveysScreen.jsx` to match your computer's local IP address if testing on a physical device.
4. Start the Expo project:
   ```bash
   npx expo start
   ```

## Features

- **Splash Screen**: Professional entry point.
- **Dynamic Login**: Simple City and Person ID based login.
- **Language Toggle**: Support for English and Tamil across the entire app.
- **Automated Profit Calculation**: Calculates monthly profit based on vehicle type (Own/Rent).
- **Survey History**: View previous surveys and statistical summaries (Total Count, Avg Profit).
- **MongoDB Integration**: Stores survey data securely in Atlas.

## Technical Stack

- **Frontend**: React Native, Expo, React Navigation, Axios.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB Atlas.
