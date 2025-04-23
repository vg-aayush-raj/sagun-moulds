# VGPF Template Repo MFE

Welcome to the VGPF Template Repo MFE! This README will guide you through the steps required to set up, run, and contribute to this project.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Configuration](#configuration)
- [Feature Branch Workflow](#commit-message-guidelines)

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js 
- pnpm

## Installation
1. Clone the repository:
  ```sh
  git clone https://github.com/ValGenesis/vgpf-template-repo-mfe.git
  ```
2. Navigate to the project directory:
  ```sh
  cd vgpf-template-repo-mfe
  ```
3. Install the dependencies:
  ```sh
  pnpm install
  ```
4. To add new dependencies:
  ```sh
  pnpm add <dependency>
  ```
5. To add new devDependencies:
  ```sh
  pnpm add -D <dependency>
  ```
6. To remove devDependencies:
  ```sh
  pnpm remove <dependency>
  ```

## Running the App
To start the development server, run:
```sh
pnpm dev
```

## Configuration
You may need to update configuration files to match your application. Key files to consider:
- `.env`: Environment variables
- `vite.config.js`: Application-specific configurations

## Commit Message Guidelines
We follow a structured commit message format to maintain a clean and readable project history. Please adhere to the following guidelines when writing commit messages:

1. **Commit Message Format**:
   - feat: A new feature (e.g., 'feat: add user login functionality')"
   - fix: A bug fix (e.g., 'fix: resolve issue with user login')"
   - docs: Documentation only changes (e.g., 'docs: update README with new instructions')"
   - style: Changes that do not affect the meaning of the code (e.g., 'style: format code according to style guide')"
   - refactor: A code change that neither fixes a bug nor adds a feature (e.g., 'refactor: simplify login logic')"
   - perf: A code change that improves performance (e.g., 'perf: optimize login process')"
   - test: Adding missing tests or correcting existing tests (e.g., 'test: add tests for login functionality')"
   - chore: Changes to the build process or auxiliary tools (e.g., 'chore: update dependencies')"

By following these guidelines, we ensure that our commit history is easy to read and understand, making it easier for everyone to collaborate effectively.

