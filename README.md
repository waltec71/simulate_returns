# Return Simulator

A web-based investment return simulator that enables users to model and compare different investment scenarios with customizable parameters, including variance modeling through Monte Carlo simulations.

## Features

- Simulate investment returns with customizable parameters
- Compare multiple simulations side-by-side
- Monte Carlo variance simulation
- Interactive graphs with hover tooltips
- Responsive design for desktop and tablet

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or >=22.12.0 recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
simulate_returns/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Core calculation logic
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── tests/             # Test files
└── public/            # Static assets
```

## Technologies

- React 18
- TypeScript 5
- Vite 5
- Recharts 2
- Tailwind CSS 3

## License

ISC

