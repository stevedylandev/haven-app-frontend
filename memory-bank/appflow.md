# Detailed Application Flow

## 1. Overview

This document outlines the flow of the decentralized video labeling and verification platform. It is based on the project requirements and details the interactions between the core system, web interface, backend services, blockchain integration, and future enhancements.

## 2. User Management Flow

- **Registration**:
  - Users register using a unique Solana wallet address.
  - Upon registration, the user is assigned the role _human_labeler_.
- **Points Tracking**:
  - The system tracks points based on contributions (e.g., labeling actions).
- **Transaction History**:
  - Users can view a detailed history of points earned and spent.
- **Wallet Prompts**:
  - After 25 video clips, users are prompted to log in via their wallet.
  - After 50 clips, users must link their Solana wallet to submit bets.
- **Transaction Signing**:
  - Each batch of human verification rounds requires a signed Solana wallet transaction.

## 3. Action Labeling and Verification Flow

- **Action Labeling**:
  - Users label actions in video clips using a predefined list.
- **Verification Rounds**:
  - Labeled actions undergo verification rounds.
  - Verification rounds are grouped into batches.
- **Logging**:
  - The system logs dwell times, verification results, and confidence scores for each action.

## 4. Points and Transactions Flow

- **Point Accumulation**:
  - Points are awarded for accurate labeling, verification, and betting outcomes.
- **Transaction Logging**:
  - All point transactions are logged with descriptions and associated entities (e.g., VideoClip, VideoClipAction).
- **Signature Verification**:
  - Every batch of transactions requires a valid signature from the user's Solana wallet.

## 5. Bet Settlement Flow

- **Bet Placement**:
  - Users must place a bet on their classification of a video clip's label before moving on.
- **Bet Evaluation**:
  - Bets are settled by comparing the user’s classification with the consensus vote (wisdom of crowds).
- **Rewards and Penalties**:
  - Correct bets reward users with points.
  - Incorrect bets penalize users.
- **Immediate Feedback**:
  - A visual confetti effect is shown when a bet is settled in the user's favor.
- **Bet Logging**:
  - All bet settlements are recorded with detailed logs.

## 6. Intelligent Video Selection Flow

- **Personalized Selection**:
  - Video clips are selected based on user preferences, last viewed clips, and contribution history.
- **Avoidance of Repetition**:
  - The system avoids showing users clips they have already verified, ensuring variety.

## 7. Quality Validation Flow

- **Consensus Voting**:
  - User-generated labels are validated using consensus from other human labelers.
- **Quality Promotion**:
  - Users whose labels consistently align with consensus are promoted to quality labelers.

## 8. Web Application Flow

- **Dashboard Interface**:
  - Displays user points, transaction history, and contributions.
- **Labeling Interface**:
  - Provides tools for users to label and verify actions in video clips.
- **Betting Interface**:
  - Supports bet placement and shows immediate visual notifications (e.g., confetti effect).
- **Navigation**:
  - Implements a swipe left/right interface for seamless video clip browsing.

## 9. Backend & Database Flow

- **Data Storage**:
  - All user data and transactions are stored in a PostgreSQL database.
- **IPFS Integration**:
  - Videos are stored and retrieved from IPFS.
- **Asynchronous Processing**:
  - Bet settlements are processed asynchronously with real-time notifications to users.

## 10. Blockchain Integration Flow

- **Wallet Integration**:
  - Users link their Solana wallet after a set number of interactions.
- **Transaction Signing & Verification**:
  - Transactions are signed by the user’s wallet and verified on the backend.
- **Token Conversion**:
  - Users can convert points to Solana SLP tokens and perform withdrawals.

## 11. Non-Functional & Future Enhancements Flow

- **Scalability & Performance**:
  - The system adheres to serverless best practices to support up to 100,000 concurrent users.
  - Designed to scale horizontally as user numbers increase.
- **Security**:
  - End-to-end encryption is used for all data transmissions.
  - Secure key management practices are applied for both database and blockchain keys.
- **Decentralization**:
  - The system is designed for potential migration to self-managed infrastructures.
- **Future Video Management Enhancements**:
  - **Video Upload**:
    - Users can upload videos by minting NFTs on the Solana blockchain.
  - **Clip Segmentation**:
    - Videos are automatically segmented into clips with metadata (e.g., IPFS CID).
  - **Status Tracking & DAO Transfer**:
    - Video processing status is tracked and NFTs are transferred to a DAO post-minting.

## 12. Error Handling and Notifications

- **Robust Logging**:
  - All significant actions and errors are logged for audit and troubleshooting.
- **User Feedback**:
  - Immediate UI notifications provide real-time feedback on transactions, errors, and bet outcomes.

## 13. Summary

This document provides a comprehensive overview of the application flow, ensuring that all aspects—from user registration to blockchain integration and future enhancements—are clearly mapped out. The detailed flows are designed to meet the core, web, backend, and non-functional requirements of the decentralized video labeling and verification platform.
