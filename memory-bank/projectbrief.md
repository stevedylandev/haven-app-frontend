# Project Brief

Project Brief
Project Overview
This project aims to develop a decentralized video labeling and verification platform integrated with the Solana blockchain. The platform will enable users to label actions in video clips, verify labels through consensus voting, earn points for accurate contributions, and place bets on label classifications. The system will leverage blockchain technology for secure transactions and decentralized data management.
Core Objectives
User Management: Implement a user registration system linked to Solana wallets, track user contributions, and manage points and transactions.
Action Labeling and Verification: Allow users to label actions in video clips and verify labels through consensus voting.
Points and Transactions: Track user points, log transactions, and enable betting on label classifications.
Intelligent Video Selection: Select video clips based on user preferences and contribution history to ensure variety and effectiveness.
Quality Validation: Validate user-generated labels using consensus votes and promote quality labelers.
Blockchain Integration: Integrate Solana wallets for secure transactions and decentralized data management.
Key Features
User Management
Users can register with a unique Solana wallet address.
Users are assigned a role (human_labeler) during registration.
User points are tracked and updated based on contributions.
Users can view their transaction history and points earned or spent.
Action Labeling and Verification
Users can label actions in video clips.
Verification rounds are supported, tracking dwell time and results.
Users can select actions from a predefined list during verification rounds.
Verification results, including confidence scores, are logged.
Points and Transactions
User points are tracked and transactions related to video clips and actions are logged.
Users must sign transactions with their Solana wallet for each batch of verification rounds.
Users can earn points by betting on the outcomes of video clip label classifications.
Bet Settlement
Users can place bets on their classification of video clip label actions.
Bets are settled by comparing user classifications with consensus votes.
Users are rewarded with points for correct bets and penalized for incorrect bets.
Users are notified immediately when a bet is settled in their favor.
Intelligent Video Selection
Video clips are selected based on user preferences, last viewed clips, and contribution history.
The system avoids showing users clips they have already verified.
Quality Validation
User-generated labels are validated using consensus votes from other labelers.
Users are promoted to quality labelers based on their alignment with consensus votes.
Web Application Requirements
User Interface
A dashboard for users to view their points, transaction history, and contributions.
An interface for selecting and labeling actions in video clips.
An interface for placing bets on video clip label actions.
Immediate notification when a bet is settled in the user's favor.
Video Clip Display
A swipe left/right interface to move onto the next video clip.
Backend Requirements
Database Management
Store all user-generated data in a PostgreSQL database.
Store and retrieve all videos from IPFS.
Bet Settlement and Notification
Asynchronously settle bets by comparing user classifications with consensus votes.
Notify users immediately when a bet is settled in their favor.
Blockchain Integration
Solana Wallet Integration
Users must link their Solana wallet to their account after their first 50 clips.
Allow conversion and withdrawal from points to Solana SLP tokens.
Signature Verification
Users must sign transactions with their Solana wallet for each batch of verification rounds.
Verify the validity of signatures on the backend to ensure they match the associated Solana wallet address.
Non-Functional Requirements
Performance
The system should scale to support 100,000 concurrent users by following serverless best practices.
Scalability
The system should scale horizontally to support an increasing number of users.
Security
Implement end-to-end encryption for all data transmissions.
Securely manage database credentials and blockchain-related keys.
Follow zero-trust security practices for withdrawal serverless functions.
Decentralization
Design components to be migratable to self-managed systems.
Verify software dependencies have self-managed alternatives.
Future Functional Requirements
Video and Clip Management
Allow users to upload videos by minting NFTs on the Solana blockchain.
Automatically segment videos into clips with associated metadata.
Track the status of videos (new, processing, completed) and update asynchronously.
Assign points to video clips based on complexity or contribution value.
Transfer the NFT representing the video to a DAO after minting.
Project Evolution
This project brief is a living document and will be updated as the project evolves. As new requirements and features are identified, they will be incorporated into the project scope to ensure the platform remains aligned with user needs and technological advancements.
