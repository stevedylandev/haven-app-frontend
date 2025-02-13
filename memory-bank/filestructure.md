# File Structure Documentation

This document provides an overview of the project’s file structure, explaining the purpose of each directory and key files within the repository. Clear organization facilitates maintainability, collaboration, and scalability.

---

## 1. Overview

The repository is organized to separate concerns and enhance workflow efficiency. The main directories represent different aspects of the system including frontend code, backend services, documentation, and configuration files.

---

## 2. Directory Layout

Below is an example of the repository’s directory structure:

```
haven-app-frontend/
├── .gitignore                   # Git exclusion file
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Exact versions of installed packages
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── index.html                   # Main HTML entry point
├── src/                         # Main source code directory
│   ├── App.tsx                  # Main React App component
│   ├── main.tsx                 # Entry point for React application
│   ├── components/              # Reusable React components
│   │   ├── lazy/                # Lazy-loaded components for optimization
│   │   ├── providers/           # Context and state management providers
│   │   ├── swipe-card/          # Components related to swipe interface
│   │   └── ui/                  # Basic UI components like buttons, cards, etc.
│   ├── context/                 # React Context definitions (global state)
│   ├── hooks/                   # Custom React hooks (e.g., useToast, useWalletConnection)
│   ├── lib/                     # Utility libraries and helper functions
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Miscellaneous utility functions (formatting, IPFS utils, etc.)
├── memory-bank/                 # Project documentation and context files
│   ├── activeContext.md         # Current active project context
│   ├── projectbrief.md          # Preliminary project brief
│   ├── productContext.md        # Context on the product’s vision and roadmap
│   ├── progress.md              # Project progress and milestones
│   ├── systemPatterns.md        # Overview of system design patterns
│   └── techContext.md           # Technical context and decisions documentation
├── README.md                    # Project overview and documentation
└── ...                          # Additional configuration or auxiliary files
```

---

## 3. Detailed Explanation of Key Directories and Files

### 3.1 Root Files

- **.gitignore:** Lists files and directories that Git should ignore.
- **package.json / package-lock.json:** Define project dependencies, scripts, and metadata.
- **tailwind.config.js / tsconfig.json / vite.config.ts:** Configuration files for styling, TypeScript, and build process.

### 3.2 `src/` Directory

- **App.tsx & main.tsx:** Entry points for the React application.
- **components/:** Contains modular, reusable UI components grouped by functionality.
- **context/:** Provides global state management via React Context.
- **hooks/:** Custom hooks to abstract common logic (e.g., data fetching, animations, notifications).
- **lib/ and utils/:** Contains helper functions, utility modules, and common logic reused across the application.
- **types/:** Hosts TypeScript interfaces and type definitions ensuring type-safe development.

### 3.3 `memory-bank/` Directory

- This directory serves as a repository for project documentation, including progress tracking, system designs, project briefs, and technical decisions.
- Files in this directory ensure that project context is well-documented and can be referenced for future development or archival purposes.

---

## 4. Best Practices

- **Consistency:** Maintain a uniform structure for new components and utilities.
- **Modularity:** Group related files together (e.g., all media handling logic in one folder) to ease navigation and updates.
- **Documentation:** Keep documentation files (inside `memory-bank/`) up-to-date with design decisions and project milestones.
- **Scalability:** As the project grows, consider creating subdirectories within `src/` (e.g., `services/` for API calls or state management slices) to retain clarity.

---

## 5. Conclusion

The current file structure is designed to promote clarity, modularity, and ease of collaboration. It is expected that as the project scales, this structure might evolve. Regularly reviewing and updating this documentation will help maintain an organized codebase.
