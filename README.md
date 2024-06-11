# Real Estate Admin

This project is a Real Estate Admin panel built with Next.js v13. It uses TanStack React Query for state management and follows a modular directory structure. Below, you will find the project structure and instructions for setting up and running the project.

## Project Structure

The directory structure of the project is as follows:

```
.real-estate-admin/
├── .next/
├── app/
├── common/
├── components/
├── data/
├── hooks/
├── layouts/
├── node_modules/
├── public/
├── routes/
├── styles/
├── sub-components/
├── widgets/
├── .env
├── .eslintrc.json
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
└── README.md
```

### Folder Descriptions

- **.next/**: Automatically generated folder by Next.js for the build output.
- **app/**: Main application entry point and higher-order components.
- **common/**: Common utilities and constants used across the project.
- **components/**: Reusable React components.
- **data/**: Static data or API request handlers.
- **hooks/**: Custom React hooks.
- **layouts/**: Layout components for different pages.
- **node_modules/**: Installed npm packages.
- **public/**: Static files like images, fonts, etc.
- **routes/**: Route handlers and API routes.
- **styles/**: Global and component-specific styles.
- **sub-components/**: Smaller reusable components that are part of larger components.
- **widgets/**: Specific UI widgets used within the project.

### File Descriptions

- **.env**: Environment variables.
- **.eslintrc.json**: ESLint configuration file.
- **.gitignore**: Specifies which files and directories to ignore in version control.
- **jsconfig.json**: Configuration for JavaScript and TypeScript setup.
- **next.config.js**: Configuration file for Next.js.
- **package.json**: Dependencies and scripts for the project.
- **README.md**: Project documentation file (this file).

## Getting Started

### Prerequisites

- Node.js (version 14.x or later)
- npm (version 6.x or later) or yarn (version 1.x or later)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ict-teamso/real-estate-admin.git
   ```

2. Navigate to the project directory:

   ```bash
   cd real-estate-admin
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

   Or if you prefer using yarn:

   ```bash
   yarn install
   ```

### Running the Project

To start the development server, run:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the project for production, run:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

### Running the Production Build

To start the production server, run:

```bash
npm run dev
```

Or with yarn:

```bash
yarn run dev
```

## Contributing

This project is private and contributions are restricted to team members only. To contribute, please follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ict-teamso/real-estate-admin.git
   ```

2. Create a new branch with a descriptive name:

   ```bash
   git checkout -b your-branch-name
   ```

3. Make your changes.
4. Commit and push your changes:

   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin your-branch-name
   ```

5. Create a pull request on the repository.

## License

This project is licensed under the MIT License.
