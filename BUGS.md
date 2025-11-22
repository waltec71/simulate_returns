# Bug Tracking

This file tracks known bugs and issues in the Return Simulator application.

## Open Bugs

_No open bugs at this time._

---

## Resolved Bugs

### Bug #1: Manual Contribution Checkbox Cannot Be Unchecked
**Status:** Resolved  
**Priority:** Medium  
**Reported:** 2024-12-19  
**Resolved:** 2024-12-19

**Description:**
After checking the "Manual contribution per year" checkbox, it becomes impossible to uncheck it. The checkbox appears to be stuck in the checked state.

**Steps to Reproduce:**
1. Open a simulation card
2. Expand the "Advanced" section
3. Check the "Manual contribution per year" checkbox
4. Attempt to uncheck the checkbox
5. Observe that the checkbox remains checked

**Expected Behavior:**
The checkbox should be toggleable - users should be able to check and uncheck it freely.

**Actual Behavior:**
Once checked, the checkbox cannot be unchecked.

**Resolution:**
Fixed the checkbox onChange handler in `SimulationInputs.tsx` to explicitly set `manualContributionsEnabled` to `false` when unchecked, rather than relying on the `handleChange` function which may not have been properly updating the state. The fix ensures the state is updated in a single `onChange` call with both the checkbox state and the manual contributions array cleared when unchecked.

---

### Bug #2: Configuration Views Change Card Width
**Status:** Resolved  
**Priority:** Medium  
**Reported:** 2024-12-19  
**Resolved:** 2024-12-19

**Description:**
When opening configuration views (variance config or manual contributions), the simulation card width changes. The width appears to be based on the title/header text length, which causes inconsistent card sizing.

**Steps to Reproduce:**
1. Open a simulation card with a short name
2. Note the card width
3. Click "Configure" for variance method or manual contributions
4. Observe that the card width changes
5. Click back to main view
6. Observe that the card width may change again

**Expected Behavior:**
- The simulation card should maintain a consistent width regardless of which view is displayed
- Long names should be truncated with ellipsis (`...`) to maintain the fixed width
- Full name should be visible on hover (via tooltip or title attribute)

**Actual Behavior:**
- Card width changes based on the header text length
- This causes layout shifts and inconsistent appearance

**Resolution:**
Fixed by:
1. Changed card width from `min-w-[320px] max-w-[400px]` to fixed `w-[400px]` in all views (main, variance-config, manual-contributions)
2. Added `truncate` and `min-w-0` classes to the simulation name header to enable text truncation with ellipsis
3. Added `title` attribute to show full name on hover
4. Added proper flex container classes (`min-w-0`, `flex-1`) to header containers to ensure truncation works correctly
5. Applied same truncation fixes to configuration view headers

---

### Bug #3: Background Color Stops When Horizontal Scroll Appears
**Status:** Resolved  
**Priority:** Medium  
**Reported:** 2024-12-19  
**Resolved:** 2024-12-19

**Description:**
When multiple simulation cards are added to the page, causing the content width to exceed the viewport width, a horizontal scrollbar appears. However, the background color (gray-50) stops at the viewport edge instead of extending to cover all content. This creates a visual issue where the background transitions from gray to white beyond the initial viewport width.

**Steps to Reproduce:**
1. Add multiple simulation cards to the page (enough to cause horizontal scrolling)
2. Observe the background color
3. Scroll horizontally to view content beyond the viewport
4. Notice that the background color stops at the viewport edge and becomes white beyond that point

**Expected Behavior:**
- The background color should extend to cover all content, regardless of viewport width
- When horizontal scrolling is enabled, the background should remain consistent across the entire content width

**Actual Behavior:**
- Background color stops at the viewport width edge
- Content beyond the viewport appears on a white background instead of the intended gray background

**Resolution:**
Fixed by applying the background color to the `body` element in `src/index.css` instead of the container div. This ensures the background extends to cover all content width, even when horizontal scrolling is enabled, as the body element naturally extends with the page content.

---

### Bug #4: Number Input Fields Cannot Be Fully Cleared
**Status:** Resolved  
**Priority:** Medium  
**Reported:** 2024-12-19  
**Resolved:** 2024-12-19

**Description:**
All number input fields (Initial Investment, Time (Years), Return (%), Additional Contribution) do not allow users to fully clear the field. When attempting to delete all characters, the field immediately reverts to a default value (0 for most fields, 1 for Years). This prevents users from easily typing new values and creates a poor user experience.

**Steps to Reproduce:**
1. Open a simulation card
2. Click on any number input field (e.g., Initial Investment)
3. Select all text and delete it
4. Observe that the field immediately shows 0 (or 1 for Years field)
5. Attempt to type a new number - the field still contains the default value

**Expected Behavior:**
- Users should be able to fully clear number input fields
- Empty fields should remain empty until a value is entered
- When running a simulation with empty fields, defaults should be applied:
  - Empty fields should default to 0 (except Years, which should default to 1)
- After running a simulation, any default values that were used should be displayed in the input fields so users can see what values were actually used
- This should work for both individual simulation runs and "Run All Simulations"

**Actual Behavior:**
- Fields cannot be fully cleared - they immediately revert to default values (0 or 1)
- This prevents users from easily replacing values with new numbers
- Users must manually delete the default value character by character

**Resolution:**
Fixed by:
1. Updated `SimulationParameters` type to allow optional numbers for input fields
2. Modified `SimulationInputs.tsx` to store `undefined` when fields are empty, allowing fully cleared fields
3. Updated `useSimulation.ts` to normalize parameters before running simulations, applying defaults (0 for most fields, 1 for Years) only when the simulation is executed
4. Updated `useSimulation.ts` to update the simulation parameters with normalized values after running, so users can see what default values were used
5. Updated `calculations.ts` to handle optional parameter values with proper defaults

---

### Bug #5: Monte Carlo Return Variance Input Format Inconsistency
**Status:** Resolved  
**Priority:** Low  
**Reported:** 2024-12-19  
**Resolved:** 2024-12-19

**Description:**
The Monte Carlo Return Variance field is labeled with "%" (percentage), suggesting users should input values like "2" for 2%. However, the actual behavior may have been inconsistent with the Return Rate field, which accepts percentage values directly. The code was verified to correctly handle percentage input (dividing by 100), matching the behavior of the Return Rate field.

**Steps to Reproduce:**
1. Open a simulation card
2. Expand the "Advanced" section
3. Select "Monte Carlo" as the variance method
4. Click "Configure" to open Monte Carlo configuration
5. Observe the "Return Variance (%)" field label
6. Input a value (e.g., 2 for 2% standard deviation)

**Expected Behavior:**
- The field should accept percentage values directly (e.g., input "2" for 2%)
- This should match the behavior of the Return Rate field
- The label indicates percentage format, so the input should work consistently

**Actual Behavior:**
- The code was verified to correctly handle percentage input (dividing by 100 in `monteCarlo.ts`)
- The input format is consistent with Return Rate field behavior
- No changes were needed as the implementation was already correct

**Resolution:**
Verified that the Monte Carlo variance input correctly handles percentage values. The code in `monteCarlo.ts` divides the input by 100 (matching `returnRate` behavior), so inputting "2" for 2% works correctly. The implementation is consistent with the Return Rate field.

---

## Notes

- Bugs are tracked here for future reference
- Priority levels: Low, Medium, High, Critical
- Status: Open, In Progress, Resolved, Won't Fix

bug backlog ungroomed:

- if you select manual contribution, then run simulation, then select monte carlo (while leaving manual contribution selected), then run simulation again, it does not show the final amount percentiles or the percentiles on the graph.