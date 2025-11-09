# Project Plan: Return Simulator

## Project Overview
**Brief Description:**
This project will build a tool that allows an end user to simulate the returns of an investment portfolio while controlling various variables. The tool will allow users to compare multiple simulations at once.

**Goal:**
Create a web-based investment return simulator that enables users to model and compare different investment scenarios with customizable parameters, including variance modeling through Monte Carlo simulations.

---

## Requirements

### Functional Requirements
- user can update the following top level basic variables for a simulation: initial_investment, time (years), return (%), additional contribution (per year)
- user can click an "> Advanced" button to expand/collapse advanced variables section (hidden by default)
- user can update the following advanced variables for simulation: variance simulation method (None, Monte Carlo, Historical), return variance, additional contribution details (allow user to manually select the contribution per year for however many years are selected)
- user can select variance simulation method (None, Monte Carlo, Historical) and click to configure method-specific variables in a nested popout
- for Monte Carlo variance method: user can configure iterations (number of simulation runs per variance calculation, default: 1,000, min: 100, max: 10,000) and return variance in the configuration popout
- for Historical variance method: user can configure historical variance parameters in the configuration popout (specific parameters TBD)
- user can enable "Manual contribution per year" mode and click to open a nested popout to configure contributions for each year individually
- user can click a button to add an additional simulation column to the page. each simulation will take up a vertical column. Option to copy existing or create blank. Copy functionality must include all basic variables, advanced variables, and all nested sub-variables. (later support to create from template). Maximum of 10 simulation columns allowed.
- user can name each simulation in the comparison.
- user can click a button to run the simulations. Below the setup variables for each one, system will show a graph of dollar total over the years in the simulation, and the final amount. mouse hover should allow user to see value at each year.
- for variance simulations, graph should show the 10, 25, 50, 75, and 90 percentile dollar totals. these should also be printed to read.

### Non-Functional Requirements
- System should run on frontend code so I can use localhost. Project can later be deployed on the web but this is not an initial concern.
- Responsive design to work on desktop and tablet devices
- Fast calculation performance (simulations should complete within reasonable time, < 2 seconds for typical scenarios)
- No backend required - all calculations run client-side
- Browser compatibility with modern browsers (Chrome, Firefox, Safari, Edge)
- Maximum of 10 simulation columns can be created (system limit) - reasonable for side-by-side comparison

---

## Technologies & Languages

### Programming Languages
- TypeScript - Primary language for type safety and modern JavaScript features

### Frameworks & Libraries
- React - UI framework for building interactive components (recommended: excellent ecosystem, strong TypeScript support, ideal for interactive dashboards)
- Recharts - Charting library for React (recommended: React-native, TypeScript-friendly, good performance, easy to customize)
- Vite - Build tool and development server for fast localhost development
- Tailwind CSS - Utility-first CSS framework (recommended: fast development, responsive design, modern styling)

### Tools & Infrastructure
- npm or yarn - Package manager
- Git - Version control
- ESLint - Code linting
- Prettier (optional) - Code formatting

### External Services/APIs
- None required - fully client-side application

---

## Considerations

### Technical Considerations
- Monte Carlo simulation implementation: Number of iterations is user-configurable (default: 1,000, max: 10,000). Performance estimates:
  - 1,000 iterations: ~100-200ms (very fast, good for quick comparisons)
  - 5,000 iterations: ~500ms-1s (balanced accuracy/performance)
  - 10,000 iterations: ~1-2s (higher accuracy, still acceptable)
- Performance: Large simulations (many years + variance + high iteration counts) may require optimization or web workers to avoid blocking UI
- State management: Consider using React Context or a state management library if state becomes complex (up to 10 simulation columns)
- Data persistence: Consider localStorage to save user's simulation configurations
- Calculation accuracy: Ensure proper handling of compound interest calculations and floating-point precision
- Maximum simulation columns limit: System should enforce 10 simulation column limit and provide user feedback when approaching/at limit

### Design Considerations
- UI layout: Horizontal scrolling or responsive grid for multiple simulation columns
- Advanced configuration UI: Collapsible sections with clear visual indicators (chevrons/arrows), nested popouts for complex configurations
- Popout design: Consistent styling and positioning for nested popouts, proper z-index management, click-outside-to-close functionality
- Graph visualization: Clear distinction between percentile lines, color coding, and legend
- Input validation: Ensure all numeric inputs are validated (positive numbers, reasonable ranges)
- User experience: Clear visual feedback when simulations are running, loading states, intuitive expansion/collapse interactions
- Accessibility: Proper labels, keyboard navigation, screen reader support, ARIA attributes for collapsible sections and popouts

### Security Considerations
- Input sanitization: Validate all user inputs to prevent injection or invalid calculations
- No sensitive data: Since it's client-side only, no data storage concerns initially

### Performance Considerations
- Lazy calculation: Only run simulations when user clicks "Run" button
- Memoization: Cache calculation results when inputs haven't changed
- Web Workers: Consider offloading heavy Monte Carlo calculations to web workers to keep UI responsive
- Chart rendering: Optimize chart updates to avoid re-rendering entire graph on small changes

### Other Considerations
- Future extensibility: Design architecture to support additional variance methods beyond Monte Carlo
- Export functionality: Consider adding ability to export results as CSV or image
- Print-friendly: Consider print stylesheet for saving/printing results

---

## Project Structure
```
simulate_returns/
├── src/
│   ├── components/
│   │   ├── SimulationCard.tsx          # Individual simulation column component
│   │   ├── SimulationInputs.tsx        # Input fields for simulation parameters
│   │   ├── SimulationGraph.tsx        # Chart component for displaying results
│   │   ├── SimulationResults.tsx      # Results display (percentiles, final amount)
│   │   ├── AddSimulationButton.tsx    # Button to add new simulations
│   │   ├── AdvancedSection.tsx        # Collapsible advanced variables section
│   │   ├── VarianceMethodSelector.tsx  # Variance method selector (None/Monte Carlo/Historical)
│   │   ├── VarianceConfigPopout.tsx   # Nested popout for variance method configuration
│   │   ├── MonteCarloConfig.tsx       # Monte Carlo-specific configuration inputs
│   │   ├── HistoricalConfig.tsx       # Historical variance configuration inputs (placeholder)
│   │   ├── ManualContributionsConfig.tsx # Manual per-year contributions configuration popout
│   │   └── Popout.tsx                 # Reusable popout component wrapper
│   ├── lib/
│   │   ├── calculations.ts            # Core calculation logic (compound interest)
│   │   ├── monteCarlo.ts              # Monte Carlo simulation implementation
│   │   ├── historical.ts             # Historical variance simulation (future)
│   │   └── types.ts                   # TypeScript type definitions
│   ├── hooks/
│   │   └── useSimulation.ts           # Custom hook for simulation state/logic
│   ├── utils/
│   │   ├── validation.ts              # Input validation utilities
│   │   └── formatters.ts             # Number/currency formatting utilities
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Global styles
├── public/
│   └── index.html
├── tests/
│   ├── unit/
│   │   ├── calculations.test.ts
│   │   └── monteCarlo.test.ts
│   └── integration/
│       └── simulation.test.tsx
├── docs/
│   └── (future documentation)
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Implementation Tasks

### Phase 1: Setup & Foundation
- [x] **Task 1.1:** Project initialization and setup
  - Subtask 1.1.1: Initialize Vite + React + TypeScript project
  - Subtask 1.1.2: Install and configure dependencies (charting library, etc.)
  - Subtask 1.1.3: Set up project structure (folders, basic files)
  - Subtask 1.1.4: Configure ESLint, Prettier (if used), and TypeScript config
- [x] **Task 1.2:** Core calculation engine
  - Subtask 1.2.1: Implement basic compound interest calculation function
  - Subtask 1.2.2: Create TypeScript types/interfaces for simulation parameters
  - Subtask 1.2.3: Write unit tests for calculation functions
  - Subtask 1.2.4: Implement input validation utilities

### Phase 2: Single Simulation with Basic Features
- [x] **Task 2.1:** Single simulation UI components
  - Subtask 2.1.1: Create SimulationInputs component (basic variables: initial_investment, years, return %, contribution/year)
  - Subtask 2.1.2: Create SimulationGraph component with charting library integration
  - Subtask 2.1.3: Create SimulationResults component to display final amount
  - Subtask 2.1.4: Implement hover tooltip functionality for graph data points
- [x] **Task 2.2:** Single simulation functionality
  - Subtask 2.2.1: Connect inputs to calculation engine
  - Subtask 2.2.2: Implement "Run Simulation" button and handler
  - Subtask 2.2.3: Display graph with dollar total over years
  - Subtask 2.2.4: Display final amount result
  - Subtask 2.2.5: Add basic styling and layout

### Phase 3: Multiple Simulations Support
- [x] **Task 3.1:** Multi-simulation architecture
  - Subtask 3.1.1: Create SimulationCard component to wrap individual simulations
  - Subtask 3.1.2: Implement state management for multiple simulations (array of simulation configs)
  - Subtask 3.1.3: Create AddSimulationButton component
  - Subtask 3.1.4: Implement "Add Simulation" functionality (blank and copy existing - copy must include all basic variables, advanced variables, and nested sub-variables)
  - Subtask 3.1.5: Enforce 10 simulation column limit with user feedback when limit reached
- [x] **Task 3.2:** Simulation naming and layout
  - Subtask 3.2.1: Add name input field to each simulation
  - Subtask 3.2.2: Implement vertical column layout for multiple simulations
  - Subtask 3.2.3: Add responsive design for multiple columns
  - Subtask 3.2.4: Implement "Run All Simulations" functionality

### Phase 4: Advanced Configuration UI
- [x] **Task 4.1:** Collapsible advanced variables section
  - Subtask 4.1.1: Create collapsible "> Advanced" button/header component (dropdown or popout style)
  - Subtask 4.1.2: Implement show/hide toggle functionality for advanced variables section
  - Subtask 4.1.3: Add visual indicator (chevron/arrow) that rotates/updates based on expanded state
  - Subtask 4.1.4: Style advanced section with appropriate spacing and visual hierarchy
  - Subtask 4.1.5: Ensure advanced section is hidden by default on new simulations
- [x] **Task 4.2:** Variance simulation method selector
  - Subtask 4.2.1: Create variance simulation method selector dropdown/radio group (options: None, Monte Carlo, Historical)
  - Subtask 4.2.2: Add clickable area/button to configure selected variance method (opens nested popout)
  - Subtask 4.2.3: Create nested popout component for variance method configuration
  - Subtask 4.2.4: Implement conditional rendering of configuration popout based on selected method
  - Subtask 4.2.5: Add visual indicator (icon/button) to show configuration popout is available
  - Subtask 4.2.6: Style nested popout with appropriate positioning and z-index management
- [x] **Task 4.3:** Manual contribution per year configuration
  - Subtask 4.3.1: Add toggle/checkbox to enable "Manual contribution per year" mode
  - Subtask 4.3.2: Create clickable area/button to open contribution configuration popout
  - Subtask 4.3.3: Implement nested popout component for per-year contribution inputs
  - Subtask 4.3.4: Create dynamic year input fields based on simulation time (years) parameter
  - Subtask 4.3.5: Implement input validation for per-year contributions (positive numbers, reasonable ranges)
  - Subtask 4.3.6: Add ability to bulk-set contributions (e.g., "Set all years to X")
  - Subtask 4.3.7: Update calculation engine to handle variable contributions per year
  - Subtask 4.3.8: Ensure contribution popout updates dynamically when simulation years change
- [x] **Task 4.4:** Variance method-specific configuration popouts
  - Subtask 4.4.1: Create Monte Carlo configuration popout component
    - Input for iterations (default: 1,000, min: 100, max: 10,000)
    - Input for return variance (standard deviation or variance value)
    - Input validation and error messaging
  - Subtask 4.4.2: Create Historical configuration popout component (placeholder for future implementation)
    - Structure for historical data inputs (to be defined)
    - Input validation framework
  - Subtask 4.4.3: Create "None" variance state (no additional configuration needed)
  - Subtask 4.4.4: Implement state management for variance method-specific configurations
  - Subtask 4.4.5: Add input validation for Monte Carlo iterations (min: 100, max: 10,000, default: 1,000)
- [x] **Task 4.5:** Update copy simulation functionality
  - Subtask 4.5.1: Update copy simulation logic to include all advanced variables
  - Subtask 4.5.2: Update copy simulation logic to include variance method selection and configuration
  - Subtask 4.5.3: Update copy simulation logic to include manual contribution per year settings and values
  - Subtask 4.5.4: Test copy functionality preserves all nested configurations correctly
  - Subtask 4.5.5: Ensure copied simulations maintain expanded/collapsed state appropriately

### Phase 5: Variance Simulation Implementation
- [x] **Task 5.1:** Monte Carlo variance simulation
  - Subtask 5.1.1: Implement Monte Carlo simulation algorithm with configurable iterations
  - Subtask 5.1.2: Integrate return variance parameter into Monte Carlo calculations
  - Subtask 5.1.3: Calculate percentile results (10, 25, 50, 75, 90) from Monte Carlo runs
  - Subtask 5.1.4: Update calculation engine to handle Monte Carlo variance mode
  - Subtask 5.1.5: Optimize performance (consider web workers for heavy calculations with high iteration counts)
  - Subtask 5.1.6: Add progress feedback for long-running Monte Carlo simulations
- [x] **Task 5.2:** Graph visualization for variance simulations
  - Subtask 5.2.1: Update graph component to display percentile lines (10, 25, 50, 75, 90)
  - Subtask 5.2.2: Implement color coding and legend for percentile lines
  - Subtask 5.2.3: Update hover tooltips to show percentile values at each year
  - Subtask 5.2.4: Ensure graph handles both single-line (no variance) and multi-line (variance) modes
- [x] **Task 5.3:** Results display for variance simulations
  - Subtask 5.3.1: Update SimulationResults component to display percentile values in readable format
  - Subtask 5.3.2: Format percentile results with appropriate currency/number formatting
  - Subtask 5.3.3: Show final amount for each percentile (10, 25, 50, 75, 90)
  - Subtask 5.3.4: Add visual distinction between median (50th percentile) and other percentiles


---

## Dependencies

### Required Dependencies
- react - ^18.x - UI framework for building components
- react-dom - ^18.x - React DOM rendering
- typescript - ^5.x - Type safety and modern JavaScript features
- vite - ^5.x - Build tool and dev server
- recharts - ^2.x - Charting library for React (React-native, TypeScript-friendly)
- tailwindcss - ^3.x - Utility-first CSS framework for styling
- @types/react - ^18.x - TypeScript types for React
- @types/react-dom - ^18.x - TypeScript types for React DOM

### Optional Dependencies
- eslint - Code linting
- prettier - Code formatting
- @testing-library/react - Testing utilities for React components
- @testing-library/jest-dom - Additional Jest matchers
- vitest - Unit testing framework (Vite-native)
- @vitejs/plugin-react - Vite plugin for React

---

## Testing Strategy

### Unit Tests
- Calculation functions (compound interest, with/without contributions)
- Monte Carlo simulation algorithm and percentile calculations
- Input validation utilities
- Number/currency formatting utilities
- Edge cases: zero values, negative inputs, very large numbers, very long time periods

### Integration Tests
- Simulation input → calculation → graph display flow
- Multiple simulations state management
- Add/copy/delete simulation functionality
- localStorage persistence (save/load simulations)

### End-to-End Tests
- Complete user workflow: create simulation, set parameters, run, view results
- Multiple simulation comparison workflow
- Advanced features workflow (variance, manual contributions)
- UI interactions: hover tooltips, button clicks, input changes

---

## Deployment & Distribution

### Deployment Environment
- **Development:** Localhost via Vite dev server (`npm run dev`)
- **Production (Future):** Static hosting (Vercel, Netlify, GitHub Pages, or similar)
- **Build Output:** Static files (HTML, CSS, JS) - no server required

### Deployment Steps
- [ ] Build production bundle: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy static files to hosting service (when ready)
- [ ] Configure custom domain (optional, future)

---

## Success Criteria
- [x] User can create and run a single simulation with basic variables (initial investment, years, return %, contribution/year)
- [x] User can create multiple simulations and compare them side-by-side
- [x] User can name each simulation for easy identification
- [x] Graphs display correctly with hover tooltips showing values at each year
- [x] Advanced variables section is hidden by default and can be expanded/collapsed via "> Advanced" button
- [x] User can select variance simulation method (None, Monte Carlo, Historical) and configure method-specific variables in nested popouts
- [x] User can enable manual contribution per year mode and configure individual year contributions in a nested popout
- [x] Monte Carlo simulations calculate and display percentile results (10, 25, 50, 75, 90)
- [x] Advanced features work: variance simulation, manual per-year contributions, user-configurable Monte Carlo iterations
- [x] User can adjust Monte Carlo iteration count (default: 1,000, min: 100, max: 10,000) and see impact on calculation accuracy/performance
- [x] Copy simulation functionality includes all basic variables, advanced variables, variance method configurations, and manual contribution settings
- [x] System enforces 10 simulation column limit with appropriate user feedback
- [x] All calculations are accurate and match expected financial formulas
- [x] Application runs smoothly on localhost without performance issues
- [x] UI is responsive and usable on desktop/tablet devices

---

## Notes & Additional Information

### Calculation Formulas
- **Compound Interest:** `A = P(1 + r)^t + C * (((1 + r)^t - 1) / r)` where:
  - A = final amount
  - P = principal (initial investment)
  - r = annual return rate (as decimal)
  - t = time in years
  - C = annual contribution

### Monte Carlo Simulation
- Use normal distribution for return variance
- Number of iterations is user-configurable (default: 1,000, max: 10,000, min: 100)
- Each iteration simulates returns with random variance around the mean return rate
- User can adjust iteration count based on desired accuracy vs. performance trade-off
- Performance estimates (typical 30-year simulation on modern computer):
  - 1,000 iterations: ~100-200ms (very fast, good for quick comparisons)
  - 5,000 iterations: ~500ms-1s (balanced accuracy/performance)
  - 10,000 iterations: ~1-2s (higher accuracy, still acceptable)

### Technology Decisions
1. **UI Framework:** React - Excellent ecosystem, strong TypeScript support, ideal for interactive dashboards
2. **Charting Library:** Recharts - React-native, TypeScript-friendly, good performance, easy to customize
3. **Styling:** Tailwind CSS - Fast development, responsive design, modern styling approach
4. **Monte Carlo Iterations:** User-configurable variable (default: 1,000, max: 10,000)
5. **Maximum Simulation Columns:** 10 columns limit enforced (reasonable for side-by-side comparison)

### Future Enhancements (Not in Initial Scope)
- Template-based simulation creation
- Export results to CSV/PDF
- Additional variance methods beyond Monte Carlo
- Historical data integration
- Comparison charts across simulations
- Print-friendly views

---

## Changelog
- 2024-12-19 - Initial plan created and completed
- 2024-12-19 - Technology decisions finalized: React, Recharts, Tailwind CSS
- 2024-12-19 - Monte Carlo iterations made user-configurable (default: 1,000, max: 10,000)
- 2024-12-19 - Maximum simulation columns limit set to 10 (reasonable for comparison)
- 2024-12-19 - Added performance estimates for Monte Carlo iterations
- 2024-12-19 - Phase 4 split into two phases: Phase 4 (Advanced Configuration UI) and Phase 5 (Variance Simulation Implementation)
- 2024-12-19 - Added detailed specifications for collapsible advanced variables section with "> Advanced" button
- 2024-12-19 - Added variance simulation method selector (None, Monte Carlo, Historical) with nested configuration popouts
- 2024-12-19 - Added manual contribution per year configuration with nested popout for per-year inputs
- 2024-12-19 - Updated copy simulation functionality to include all advanced variables and nested sub-variables
- 2024-12-19 - Updated project structure to include new components for advanced configuration UI (popouts, collapsible sections)

# future improvements - backlog

## 1. Add Tooltips to Variance Simulation Methods - DONE
**Description:** Add informational tooltips or help icons next to the variance simulation method selector to provide users with context about each method without requiring them to click "Configure" first.

**Implementation Tasks:**
- Add an info icon (question mark or info icon) next to the "Variance Simulation Method" label in `VarianceMethodSelector.tsx`
- Implement a tooltip component or use a library (e.g., React Tooltip) that displays on hover/click
- Extract and reuse the descriptions currently shown in the configuration views:
  - **None:** "No variance simulation - uses fixed return rate for all years"
  - **Monte Carlo:** "Simulates multiple scenarios with random return variations based on variance. Shows percentile ranges of possible outcomes."
  - **Historical:** "Uses historical market data patterns to simulate returns (not yet implemented)"
- For Monte Carlo method specifically, add an enhanced description below the "Return Variance (%)" input field in `MonteCarloConfig.tsx` that explains:
  - How Monte Carlo simulation works (runs multiple iterations with random variations)
  - What the variance parameter represents (standard deviation of annual returns)
  - How the percentiles are calculated and what they mean
  - The relationship between iteration count and accuracy/performance
- Ensure tooltips are accessible (keyboard navigable, screen reader friendly)
- Style tooltips consistently with the application design

**Files to Modify:**
- `src/components/VarianceMethodSelector.tsx` - Add tooltip/info icon
- `src/components/MonteCarloConfig.tsx` - Add enhanced description below variance input
- Potentially create `src/components/Tooltip.tsx` if reusable tooltip component is needed

---

## 2. Display Total Cash Contributions - DONE
**Description:** Add a display section that shows the total amount of cash contributions made over the entire simulation period, displayed below the final amount in the results section.

**Implementation Tasks:**
- Create a function to calculate total contributions:
  - If `manualContributionsEnabled` is true and `manualContributions` array exists: sum all values in the array (handle undefined values by using `additionalContribution` as fallback)
  - Otherwise: multiply `additionalContribution` by `years`
  - Handle edge cases: zero contributions, undefined values, partial manual contribution arrays
- Add the total contributions display to `SimulationResults.tsx`:
  - Display below the final amount (or final percentiles for Monte Carlo)
  - Format as currency using existing `formatCurrency` utility
  - Label clearly as "Total Cash Contributions" or "Total Contributions"
  - Style consistently with the results section (similar to the "After X years" text)
  - Show for both standard results and Monte Carlo results (display once, not per percentile)
- Update the component to receive contribution data:
  - Pass `parameters` or calculated total contributions to `SimulationResults` component
  - Or calculate within the component if parameters are already available
- Ensure the calculation handles all contribution scenarios:
  - Fixed annual contribution
  - Manual per-year contributions (with some years potentially undefined)
  - Zero contributions
  - Mixed scenarios

**Files to Modify:**
- `src/components/SimulationResults.tsx` - Add total contributions display
- `src/components/SimulationCard.tsx` - Pass contribution data to SimulationResults
- Potentially add utility function in `src/utils/calculations.ts` or `src/lib/calculations.ts` for calculating total contributions

---

## 3. Close Configuration Menus on "Run All Simulations" - DONE
**Description:** When the user clicks "Run All Simulations", automatically close any open configuration popouts (variance configuration and manual contributions configuration) and return all simulation cards to their main view.

**Implementation Tasks:**
- Add state management to track which simulation cards have open configuration views:
  - Option A: Add a `viewMode` state at the App level or use a ref/context to track open views
  - Option B: Add a callback prop to `SimulationCard` that allows parent to reset view mode
  - Option C: Use a ref in `SimulationCard` to expose a method to reset view mode, and store refs in App
- Modify `SimulationCard.tsx`:
  - Expose a method (via ref or callback) to programmatically set `viewMode` back to `'main'`
  - Ensure the method properly closes any open popouts
- Modify `App.tsx`:
  - Before or after calling `runAllSimulations()`, iterate through all simulation cards and reset their view modes
  - If using refs, create refs for each simulation card and call reset method
  - If using callbacks, pass a reset function that gets called from App
- Ensure the reset happens smoothly:
  - Close popouts before or simultaneously with running simulations
  - Consider animation/transition if popouts have close animations
  - Don't interrupt any in-progress user interactions unnecessarily
- Test edge cases:
  - Multiple cards with different open views
  - Cards with no open views (should not error)
  - Rapid clicking of "Run All Simulations"

**Files to Modify:**
- `src/components/SimulationCard.tsx` - Add method to reset view mode, potentially use `useImperativeHandle` with ref or expose via callback
- `src/App.tsx` - Add logic to reset all card view modes when "Run All Simulations" is clicked
- Potentially update `src/hooks/useSimulation.ts` if state management approach requires it

---

## 4. Annual Contribution Increase Rate
**Description:** Allow users to set an annual percentage increase rate for contributions, enabling modeling of salary raises, automatic contribution escalations, or planned contribution increases over time.

**Implementation Tasks:**
- Add `contributionIncreaseRate` field to `SimulationParameters` type (as percentage, e.g., 3% = 3.0)
- Add input field in `SimulationInputs.tsx` for contribution increase rate (% per year)
  - Place in basic or advanced section (suggest advanced section)
  - Default: 0% (no increase)
  - Allow negative values for decreasing contributions
  - Add tooltip explaining compound contribution increases
- Update `calculateYearlyResults()` in `calculations.ts` to apply annual increase:
  - Year 1: use base contribution
  - Year 2+: multiply previous year's contribution by (1 + increaseRate/100)
  - Ensure it works with both fixed annual contributions and manual contributions mode
- Update calculation logic to handle contribution increases:
  - If manual contributions are enabled, apply increase rate to each manual contribution value
  - If fixed contribution is used, calculate increasing contributions year by year
- Add validation: reasonable range (e.g., -50% to 100% per year)
- Update copy simulation functionality to include contribution increase rate
- Display contribution schedule in results or add tooltip showing contribution amounts per year

**Files to Modify:**
- `src/lib/types.ts` - Add `contributionIncreaseRate?: number` to `SimulationParameters`
- `src/components/SimulationInputs.tsx` - Add input field for contribution increase rate
- `src/lib/calculations.ts` - Update `calculateYearlyResults()` to apply annual increases
- `src/components/SimulationCard.tsx` - Include contribution increase rate in copy functionality

---

## 5. Target Amount Calculator (Reverse Calculation)
**Status:** Interesting feature, but would be a large lift. Keeping in backlog for future consideration.

**Description:** Add a "goal-based" mode where users can specify a target final amount and the tool calculates the required annual contribution to reach that goal, or calculates the required return rate.

**Implementation Tasks:**
- Add calculation mode selector: "Forward" (current) vs "Goal-Based"
- Add target amount input field
- Create reverse calculation functions:
  - Calculate required annual contribution given: initial investment, years, return rate, target amount
  - Calculate required return rate given: initial investment, years, contribution, target amount
  - Calculate required years given: initial investment, return rate, contribution, target amount
- Add UI for goal-based mode:
  - Toggle or radio button to switch between forward and goal-based calculation
  - Input for target amount
  - Display calculated required parameter (contribution, return rate, or years)
  - Show "impossible" scenarios (e.g., target too high for given parameters)
- Update simulation results to highlight when target is reached
- Add visual indicator on graph showing target amount line
- Handle edge cases: negative returns, zero contributions, unrealistic targets

**Files to Modify:**
- `src/lib/calculations.ts` - Add reverse calculation functions
- `src/components/SimulationInputs.tsx` - Add goal-based mode UI
- `src/components/SimulationResults.tsx` - Display target achievement status
- `src/components/SimulationGraph.tsx` - Add target amount reference line
- `src/lib/types.ts` - Add goal-based calculation fields

---

## 6. Time-Based Return Rate Changes
**Status:** This should be handled by another option for variance in the advanced menu. Consider implementing as a new variance method option rather than a separate feature.

**Description:** Allow users to specify different return rates for different time periods, enabling modeling of changing market conditions, different investment strategies over time, or expected return reductions as portfolios become more conservative.

**Note:** This could be implemented as a new variance method option (e.g., "Period-Based" or "Time-Varying Returns") in the variance method selector, rather than a standalone feature.

---

## 7. Export Functionality (CSV)
**Status:** Good idea. Focus on CSV export route.

**Description:** Allow users to export simulation results and configurations to CSV format for sharing, reporting, or further analysis.

**Implementation Tasks:**
- Add export button/menu to each simulation card or global export
- Implement CSV export:
  - Export yearly results data (year, total amount, contributions)
  - Include all parameters and configuration as metadata
  - Export comparison data if multiple simulations
  - For Monte Carlo: export percentile data per year
- Add export options:
  - Select what to export (single simulation, all simulations)
  - Include/exclude options (parameters, results, percentiles)
- Add download functionality with appropriate file names (e.g., "simulation_results_2024-12-19.csv")
- Consider future enhancements: PDF or image export if needed

**Files to Modify:**
- Create `src/utils/export.ts` - CSV export utility functions
- `src/components/SimulationCard.tsx` - Add export button
- `src/App.tsx` - Add global export functionality
- Potentially create `src/components/ExportDialog.tsx` for export options


---

## 8. Save/Load Simulation Configurations
**Description:** Persist simulation configurations to browser localStorage, allowing users to save their work and reload it later without losing their setup.

**Implementation Tasks:**
- Create save/load utility functions:
  - `saveSimulationsToStorage(simulations: SimulationConfig[])`
  - `loadSimulationsFromStorage(): SimulationConfig[] | null`
  - Handle versioning for future schema changes
- Add UI controls:
  - "Save" button to save current state
  - "Load" button with file picker or saved configurations list
  - "Clear" button to reset
  - Auto-save option (save on changes)
- Add configuration management:
  - Save multiple named configurations
  - List of saved configurations
  - Delete saved configurations
  - Import/export as JSON file
- Handle edge cases:
  - Storage quota exceeded
  - Invalid/corrupted data
  - Migration from old format
- Add visual feedback: "Saved" indicator, last saved timestamp

**Files to Modify:**
- Create `src/utils/storage.ts` - localStorage utilities
- `src/App.tsx` - Add save/load UI and functionality
- `src/hooks/useSimulation.ts` - Potentially integrate auto-save
- Potentially create `src/components/SaveLoadDialog.tsx`

---

## 9. Preset Scenarios/Templates
**Status:** Good idea, will need to work out the details later.
**Description:** Provide quick-start templates for common investment scenarios (Conservative, Moderate, Aggressive) to help users get started quickly and understand different investment strategies.

**Implementation Tasks:**
- Create preset templates:
  - **Conservative:** Lower return (4-5%), lower variance, longer time horizon
  - **Moderate:** Balanced return (6-7%), moderate variance
  - **Aggressive:** Higher return (8-10%), higher variance
  - **Retirement Planning:** 30-year accumulation, moderate return
  - **Early Retirement:** Aggressive growth, shorter timeline
- Add template selector in "Add Simulation" flow:
  - Option to create from template vs blank
  - Preview of template parameters
- Store templates in configuration file or constants
- Allow users to create custom templates from existing simulations
- Display template descriptions and use cases
- Update copy simulation to optionally save as template

**Files to Modify:**
- Create `src/lib/templates.ts` - Template definitions
- `src/components/AddSimulationButton.tsx` - Add template selection UI
- `src/App.tsx` - Integrate template creation
- Potentially create `src/components/TemplateSelector.tsx`

---

## 10. Improve Manual Contributions User Experience
**Status:** Contribution pause/resume scenarios can be modeled in manual contributions. Focus on making the manual contribution page more user-friendly.

**Description:** Enhance the manual contributions configuration interface to make it easier to model scenarios like contribution pauses, variable contributions, and other real-life planning scenarios.

**Implementation Tasks:**
- Review current manual contributions UI (`ManualContributionsView.tsx`)
- Add bulk operations:
  - "Set all years to X" button
  - "Fill years Y-Z with X" for ranges
  - "Copy year X to all" functionality
- Add preset patterns:
  - "Pause years X-Y" (set to 0 for specific years)
  - "Increase by X% per year starting from year Y"
  - "Decrease by X% per year starting from year Y"
- Improve visual feedback:
  - Highlight years with zero contributions
  - Show contribution trend/graph
  - Color-code contributions (high/medium/low)
- Add keyboard shortcuts for faster data entry
- Consider adding a "contribution schedule" view showing all years at once
- Add validation and helpful error messages
- Improve mobile/tablet experience for manual entry

**Files to Modify:**
- `src/components/ManualContributionsView.tsx` - Enhance UI and add bulk operations
- `src/components/ManualContributionsConfig.tsx` - Add preset patterns and improved UX
- Potentially create helper utilities for common contribution patterns


## 11. remove monte carlo iterations variable 
 - users probably don't know or care about choosing the number of iterations. 
 - may make sense to just select 10000 for everyone since it seems to run smooth. 
 - this would make the interface cleaner by removing a variable from the ui.

## 12. update 'set all' button for manual contributions
 - the current experience of the browser alert input is not cohesive with the rest of the user experience
 - should find a way to make this input in the normal ui.
 - could combine this with backlog item #4. set all could be a little ui popup that lets you select the first year amount, and an annual increase, and maybe any other parameters. these params would only be used to help update the contribution values per year. 

## 13. monte carlo returns
 - include a way for the end user to see what the actual yearly and total average returns were over the period for each percentile. 