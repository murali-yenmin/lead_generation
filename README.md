# SocialAutoPost - Lead Generation Toolkit

SocialAutoPost is a powerful web application built with Next.js that provides a suite of tools designed to streamline and automate lead generation marketing tasks. From crafting compelling LinkedIn posts to generating optimized Google Ads, this toolkit helps marketers save time and improve their campaign performance.

## Tech Stack

This project is built with a modern and robust technology stack:

- **Framework**: [Next.js](https://nextjs.org/) (v15) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **API Requests**: [Axios](https://axios-http.com/) & native `fetch`
- **Workflow Automation**: [n8n](https://n8n.io/) (via webhooks)

## Features

- **LinkedIn Tools**:
  - **Keyword Generator**: Generate relevant keywords and hashtags for your LinkedIn profile and content by integrating with an n8n webhook.
  - **Post Generator**: Create engaging LinkedIn posts from a topic and a desired vibe (professional, casual, etc.).
  - **Custom Post Composer**: Manually craft your own posts with an image upload option.

- **Google Ads Generator**:
  - **Search Campaign Ads**: Generate multiple compelling text ad variations (headlines and descriptions) based on your product, audience, and keywords.
  - **Display Ad Images**: Create eye-catching images for display campaigns.
  - **Video (YouTube) Ads**: (Coming Soon) A placeholder for future video ad generation capabilities.

- **Email Composer**:
  - A rich text editor to craft emails.
  - Manage recipient lists by adding emails manually or uploading a CSV file.

- **Authentication**:
  - A complete set of UI screens for Login, Register, and Forgot Password flows.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```sh
   git clone <your-repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd leadgen-ui
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```

### Running the Application

To run the development server, execute the following command:

```sh
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified in your `.env.development` file).

## Available Scripts

In the `package.json` file, you will find the following scripts:

- `dev`: Starts the Next.js development server with Webpack.
- `build`: Creates a production build of the application.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for code quality.
- `typecheck`: Runs the TypeScript compiler to check for type errors.

## Folder Structure

The project follows a standard Next.js App Router structure with some additional directories for organization:

- `src/app`: Contains all the pages and layouts of the application.
- `src/components`: Houses reusable UI components, including ShadCN components.
- `src/store`: Holds all Redux Toolkit setup, including slices, async thunks, and the main store configuration.
- `src/helpers`: Contains helper functions, such as API integration logic.
- `public`: Stores static assets like images and fonts.

## Environment Variables

The project uses `.env` files to manage environment variables.

- `.env.development`: For development-specific variables (e.g., `PORT`).
- `.env.production`: For production-specific variables.

Create these files in the root of the project as needed.
