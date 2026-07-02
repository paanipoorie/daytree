# Contributing to DayTree

Thank you for your interest in contributing to DayTree! As an open-source productivity app, we appreciate any and all contributions—from bug fixes to documentation updates.

Please follow these guidelines to ensure a smooth contribution process.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (detailed in `CODE_OF_CONDUCT.md`).

## 🛠 Getting Started

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone Locally**: Clone your fork to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/daytree.git
   cd daytree
   ```
3. **Set Up the Project**: Install dependencies and initialize backend:
   ```bash
   # Root (Frontend)
   npm install
   
   # Backend
   cd backend
   npm install
   cp .env.example .env
   ```
4. **Create a Branch**: Create a descriptive branch name for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Code Quality & Conventions

* **Linting**: Ensure all changes pass the linter before committing:
  ```bash
  npm run lint
  ```
* **Testing**: Run integration test suites to prevent regressions:
  ```bash
  cd backend
  npm test
  ```
* **Git Hygiene**: Commit messages should be concise and describe *what* and *why* changes were made.

## 📥 Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of the original repository.
3. Complete the PR template, referencing any related open issues.
4. Wait for code review and feedback!
