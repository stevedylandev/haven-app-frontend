# Wallet Integration Implementation Plan

## Overview

Implement wallet integration requirement at 50 clips (FR-4.1.1) to enforce wallet connection for continued usage of the application.

## Technical Implementation

### 1. Storage Updates (storage.ts)

```typescript
// New constants
const WALLET_REQUIRED_KEY = "wallet_required";

// New utility functions
function isWalletRequired(): boolean;
function setWalletRequired(): void;

// Update storeClassification to check for 50 clip threshold
function storeClassification(): {
  shouldPromptWallet: boolean;
  shouldPromptBetting: boolean;
  isWalletRequired: boolean;
};
```

### 2. Hook Updates (useWalletPrompt.ts)

```typescript
// Extended hook interface
interface WalletPromptState {
  shouldShowPrompt: boolean;
  isRequired: boolean;
  blockNavigation: boolean;
}

// Updated hook implementation
function useWalletPrompt(isConnected: boolean): WalletPromptState;
```

### 3. Navigation Blocking

- Modify SwipeCard.tsx to integrate wallet requirement check
- Update useSwipeGesture.ts to handle navigation blocking
- Create BlockingDialog component for hard requirement messaging

### 4. UI Components

Create new WalletBlockModal.tsx:

- Display current clip count
- Show progress toward 50 clip threshold
- Clear messaging about wallet requirement
- Connection button and instructions

## Implementation Steps

1. **Storage Layer**

   - Add WALLET_REQUIRED_KEY constant
   - Implement isWalletRequired/setWalletRequired functions
   - Update storeClassification return type and logic
   - Add tests for new storage functions

2. **Hook Updates**

   - Extend useWalletPrompt state interface
   - Add wallet requirement check logic
   - Update hook to return new state shape
   - Add tests for extended hook functionality

3. **Navigation Changes**

   - Add wallet check to SwipeCard
   - Update gesture handling for blocked navigation
   - Implement blocking dialog component
   - Add tests for navigation blocking

4. **UI Implementation**
   - Create WalletBlockModal component
   - Add progress visualization
   - Implement error states
   - Add component tests

## Testing Considerations

- Unit tests for all new functions and components
- Integration tests for wallet requirement flow
- Edge case handling for clip count thresholds
- Mobile gesture handling tests
- Error state verification

## Technical Requirements

- Follow TypeScript best practices
- Use Tailwind for styling
- Implement lazy loading where appropriate
- Add comprehensive test coverage
- Use custom hooks for shared logic

## Success Criteria

1. Users cannot proceed past 50 clips without wallet
2. Clear user messaging about requirement
3. Smooth wallet connection experience
4. Proper state persistence
5. All tests passing
