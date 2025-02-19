# CSEJnU Mobile App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](CODE_OF_CONDUCT.md)

A comprehensive mobile application for the CSE Department of Jagannath University, built with React Native and Expo. This app serves as a central platform for students and faculty to stay connected and access department resources.

## Features

### 👥 Contact Management
- Complete directory of students and faculty
- Advanced filtering and search capabilities
- Detailed profiles with academic and contact information
- Quick access to social media profiles
- Grid and list view options

### 📝 Blog System
- Access to department news and announcements
- Category-based article filtering
- Interactive comments system
- Rich media support
- Responsive article layouts

### 🎥 YouTube Integration
- Stream department-related videos
- Carousel of recent uploads
- Video categorization
- Seamless video playback

### 🎨 Additional Features
- Dark/Light theme support
- Birthday notifications
- User authentication
- Profile management
- Responsive design

## Project Structure

```
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation
│   ├── contact/           # Contact-related screens
│   ├── post/              # Blog post screens
│   └── profile/           # User profile screens
├── assets/                # Static assets
├── components/            # Reusable components
├── context/               # React Context providers
├── services/              # API and service integrations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Expo CLI (optional, but recommended)
  ```bash
  npm install -g expo-cli
  ```

### Installation

1. Clone the repository
```bash
git clone https://github.com/asfi50/CSEJnU-Mobile-App.git
cd CSEJnU
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npx expo start
# or
yarn expo start
```

4. Build for production (using EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure your project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Tech Stack

- React Native
- Expo
- TailwindCSS (NativeWind)
- WordPress REST API
- YouTube API
- AsyncStorage

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## Security

For details about our security policy and how to report security vulnerabilities, please see our [Security Policy](SECURITY.md).

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you need help or have questions, please:
- Open an issue
- Check our [Contributing Guide](CONTRIBUTING.md)
- Join our community discussions
