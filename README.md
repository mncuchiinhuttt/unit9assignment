# Unit 9 Assignment

A modern desktop application built with Svelte and Tauri that integrates with Google AI API for enhanced functionality.

## Features

- **Google AI Integration**: Utilize Google's advanced AI capabilities through API integration
- **Secure API Key Management**: Safely store and manage your Google AI API keys
- **Cross-Platform**: Works on Windows, macOS, and Linux thanks to Tauri
- **Modern UI**: Built with Svelte, TailwindCSS, and shadcn components
- **Offline Capability**: Core features work without an internet connection
- **Data Export**: Export data to Excel format

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Rust](https://www.rust-lang.org/tools/install)
- [pnpm](https://pnpm.io/installation)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mncuchiinhuttt/unit9assignment.git
   cd unit9assignment
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm tauri dev
   ```

4. Build for production:
   ```bash
   pnpm tauri build
   ```

## Google AI API Setup

This application requires a Google AI API key for AI functionality:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google AI/Gemini API for your project
4. Create an API key from the [Credentials page](https://console.cloud.google.com/apis/credentials)
5. Add your API key in the application settings

## Configuration

Configure your application settings in the Settings page:

- Add and manage Google AI API keys
- Select your preferred API key for AI operations
- Adjust application preferences

## Development

### Tech Stack

- **Frontend**: Svelte 5, TailwindCSS 4
- **Desktop Framework**: Tauri 2
- **UI Components**: shadcn-svelte
- **AI Integration**: Google Generative AI
- **Database**: Local storage with Tauri's filesystem API

### Project Structure

- `/src`: Svelte application code
- `/src-tauri`: Tauri backend code
- `/static`: Static assets
- `/src/lib`: Reusable components and utilities
- `/src/routes`: Application pages and routes

### Commands

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm check`: Type-check the codebase
- `pnpm lint`: Lint the codebase
- `pnpm format`: Format code with Prettier
- `pnpm tauri dev`: Run Tauri development build
- `pnpm tauri build`: Create production Tauri build

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- [Vo Minh Long](https://github.com/mncuchiinhuttt)
