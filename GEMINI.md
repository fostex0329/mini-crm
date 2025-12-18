# Gemini Coder Assistant Context: Mini-CRM

This document provides context for the AI assistant to understand the mini-CRM project. It has been updated to reflect the project's current structure and progress.

## Project Overview

This repository contains the "mini-CRM" application (a portfolio project) and its underlying UI component library, "Yohaku". The primary goal is to build the CRM application pages and features using the components provided by the Yohaku library.

The project specifications are detailed in the `.reference` directory.

## Project Structure

This repository is structured as a monorepo containing two main parts: the component library and the application.

*   `src/components/yohaku/`: The **Yohaku component library**. This contains a set of reusable UI components (Button, Table, etc.) built upon `shadcn/ui` and customized for this project's design system.
*   `src/app/`: The **Next.js application**. This is where the actual CRM pages (routes), application logic, and page-specific components are located.
*   `src/lib/`: Shared utilities, such as the `cn()` function for class names.
*   `.reference/`: Contains the high-level project documentation, specifications, and user persona details.

## Implemented Features & Key Files

As of now, the initial setup of the Next.js environment is complete, and the first feature, the **Deals List Page**, has been implemented.

### Deals List Page (`src/app/deals/`)

*   `page.tsx`: The main page component for the Deals List. It fetches data and renders the data table.
*   `columns.tsx`: Contains the column definitions for the deals data table, including custom renderers for currency (¥) and status (using `YohakuBadge`).
*   `data.ts`: Provides mock data for the `deals` table to allow for frontend development without a backend.

### Core Component Refactoring

To implement the Deals List page, core data table components from the Yohaku library were refactored to be more generic and reusable:

*   `src/components/yohaku/dashboard/data-table.tsx`: The main data table component. It was modified to accept filter and search configurations as props.
*   `src/components/yohaku/dashboard/data-table-toolbar.tsx`: The toolbar component. It was refactored to dynamically render filters based on props, rather than using hardcoded values. This makes it adaptable for displaying deals, tasks, or other data types.

## Building and Running

The project environment has been set up with the necessary configuration files and dependencies.

*   `package.json`: Defines project scripts and dependencies.
*   `tsconfig.json`: Configures TypeScript, including the crucial `@/*` path alias.
*   `node_modules/`: Dependencies have been installed via `npm install`.

### Common Commands

*   **Run development server**: `npm run dev`
    *   The Deals List page is available at `http://localhost:3000/deals`.
*   **Create a production build**: `npm run build`
*   **Start the production server**: `npm run start`
*   **Lint the code**: `npm run lint`

## Development Conventions

*   **Application Development**: All new CRM pages and application-specific components should be created within the `src/app` directory.
*   **Component Usage**: Application components should always import and use the `yohaku` components from `src/components/yohaku` for UI elements to maintain design consistency.
*   **Styling**: Styling is managed via Tailwind CSS. Use the `cn()` utility in `src/lib/utils.ts` for conditional class application.