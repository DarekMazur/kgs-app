# Korona Gór Świętokrzyskich
![KGS Logo](https://res.cloudinary.com/ddyqnp7pp/image/upload/v1731279976/logoFullW_lylrnm.png)
## Hiking mobile app

Welcome to the KGS Mobile App documentation! This React Native application helps users earn the Korona Gór Świętokrzyskich badge, issued by the PTTK Kielce. The app supports tracking peak visits, sharing achievements, and includes an administrative module for managing users and posts.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Scripts](#scripts)
5. [Project Structure](#project-structure)
6. [Community Features](#community-features)
7. [Administrative Module](#administrative-module)
8. [Development Tools](#development-tools)
9. [Contributing](#contributing)

## Features
* Peak Tracking: Log your hikes and progress towards earning the badge.
* Community Sharing: Share your completed peaks with photos.
* Admin Module: Manage users and posts efficiently.
* Cross-Platform: Runs seamlessly on Android, iOS, and the web.

## Tech Stack
### Frontend:
* React Native: Core framework for building the app.
* Expo: Simplifies development and testing.
* NativeWind (TailwindCSS for RN): For consistent and flexible styling.
* React Navigation: For smooth and dynamic routing.
* Jest: Testing library.

### Backend:
* Node.js: Server-side runtime for API endpoints.
* PostgreSQL: Database for storing user and peak data.

## Getting Started
### Prerequisites
* Node.js (v16 or higher recommended)
* Expo CLI (npm install -g expo-cli)
* A connected emulator or device (Android/iOS)

### Installation
1. Clone the repository:
  ```bash
  git clone https://github.com/DarekMazur/kgs-app.git
  cd kgs-app
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Start the app:
  ```bash
     npm start
  ```
4. Choose the desired platform:
   * Press a for Android
   * Press i for iOS
   * Press w for Web

## Scripts
Below are available scripts defined in `package.json`:

| Script                   | Description                                     |
|--------------------------|-------------------------------------------------|
| `npm start`	             | Starts the Expo development server.             |
| `npm run android`	       | Runs the app on an Android emulator/device.     |
| `npm run ios`	           | Runs the app on an iOS simulator/device.        |
| `npm run web`	           | Runs the app in a web browser.                  |
| `npm test`               | Executes unit tests using Jest.                 |
| `npm run lint`           | Runs lint checks on the project.                |

## Project Structure
Most important app elements:
```
kgs/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable UI components
├── mocks/               # Mock data (with Mock Service Workers)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── app/                 # Application structure
├── app/index.tsx        # Main app entry point
└── package.json         # Project metadata and dependencies
```

## Community Features
Users can:

1. Log Peaks: Track climbed peaks with timestamps.
2. Upload Photos: Share photos of completed hikes.
3. Browse Community Feed: View posts from other hikers.

## Administrative Module
The administrative module provides:

1. User Management: Add, edit, or deactivate users.
2. Post Moderation: Manage user posts (hide, edit, delete).
3. Activity Logs: Track admin and user activities.

## Development Tools
### Linting and Formatting
* ESLint (Airbnb + TypeScript rules)
* Prettier (Integrated for consistent code formatting)
  
### TailwindCSS
For styling, use classes like in TailwindCSS:
```javascript
<Text className="text-lg font-bold text-primary">
  Welcome to KGS!
</Text>
```

## Contributing
To contribute:

Fork the repository.
1. Create a feature branch (git checkout -b feature-name).
2. Commit your changes (git commit -m "Add feature").
3. Push to your branch (git push origin feature-name).
4. Create a pull request.
