# Fawredd Linktree Endpoints

## Project Overview

This project is a Next.js application designed to serve as a personalized "Linktree"-style service. It enables users to create and manage dynamic profiles, each featuring a collection of custom links and integrated social media connections. While the "Endpoints" in the name suggests a focus on data provision, the application is a full-stack solution, providing both a user interface and robust data management capabilities.

## Features

*   **Dynamic User Profiles:** Create unique, personalized profile pages accessible via custom slugs.
*   **Customizable Links:** Add and manage a variety of links associated with each profile.
*   **Social Media Integration:** Link profiles to various social media platforms.
*   **Database-Driven Content:** All profile, link, and social media data is stored and managed in a PostgreSQL database.
*   **Responsive Design:** Built with Tailwind CSS and Shadcn UI for a modern and adaptive user experience.

## Technologies Used

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI
*   **Database:** PostgreSQL
*   **ORM:** Drizzle ORM
*   **Package Manager:** PNPM
*   **Deployment:** Vercel
*   **Code Quality:** ESLint

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   PNPM (install globally: `npm install -g pnpm`)
*   PostgreSQL database instance

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd fawredd-linktree-endpoints
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Environment Variables

Create a `.env` file in the root of the project based on your database configuration. A typical `.env` file might look like this (adjust as per your Drizzle/PostgreSQL setup):

```
DATABASE_URL="postgresql://user:password@host:port/database_name"
# Add any other necessary environment variables here
```

### Database Setup

1.  Ensure your PostgreSQL database is running.
2.  Apply the SQL migration files located in the `services/` directory to set up the necessary tables and seed initial data. You might use a tool like `psql` or a database client to run these scripts in order:
    *   `services/001_create_profiles_table.sql`
    *   `services/001_create_services_table.sql`
    *   `services/003_create_social_links_table.sql`
    *   `services/003_seed_sample_services.sql`
    *   `services/004_seed_sample_data.sql`

    *Note: If you are using Drizzle Kit for migrations, you would typically run a command like `pnpm drizzle-kit push:pg` or similar, depending on your Drizzle configuration.*

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

*   `app/`: Main application routes and UI components.
    *   `[profileSlug]/`: Dynamic routing for individual user profiles.
*   `actions/`: Server actions for database interactions.
*   `components/`: Reusable React components, including Shadcn UI elements.
*   `lib/`: Utility functions and database connection setup.
*   `public/`: Static assets.
*   `services/`: SQL migration files for database schema and seeding.

## Deployment

This application is configured for deployment on [Vercel](https://vercel.com/). You can deploy your own instance by connecting your Git repository to Vercel.

## Testing

This project uses [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit and component testing.

To run the tests, use the following command:

```bash
pnpm test
```

---
