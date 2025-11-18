# finance-system-frontend

This project is a simple, client-side financial management application. It allows users to register, log in, and track their income and expenses.

## Application Flow

Here is a breakdown of the application's structure and logic to help new developers get started.

### 1. Authentication and Page Protection

-   **User Storage**: User registration and login details (username and password) are stored in the browser's **`localStorage`**. The data is stored in a key named `users`.
-   **Registration (`register.html`) and Login (`login.html`)**: The authentication pages have been redesigned for a modern and clean user experience. They feature a centered, card-based layout that is consistent with the application's overall design.
-   **Page Protection**: The main application pages (`index.html` and `performance.html`) are protected. The `auth.js` script checks if `loggedInUser` exists in `sessionStorage`. If not, it redirects the user to the login page (`login.html`).
-   **Logout**: The "Sair" (Logout) button in the vertical navigation bar removes the `loggedInUser` from `sessionStorage` and redirects the user back to the login page.

### 2. Main Application (`index.html`)

-   **Layout**: The main page features a modern two-column layout with a fixed vertical navigation bar on the left and a main content area on the right.
-   **Quick Links**: A new header bar in the main content area provides quick access to other pages, such as the "Ver Desempenho" page.
-   **Data Storage**: All financial data (transactions) is stored in **`localStorage`**. The data is specific to each user and is stored under a dynamic key: `finance_data_{username}`.
-   **Data Structure**: The financial data is organized by month. It's a JSON object where each key is a month in `YYYY-MM` format, and the value is an array of transaction objects.
-   **Transaction Object**: Each transaction has the following properties:
    -   `desc`: Description of the transaction.
    -   `amount`: The transaction amount.
    -   `type`: "Entrada" (Income) or "Saída" (Expense).
    -   `paid`: A boolean indicating the status of the transaction.
-   **Core Functionality**:
    -   **Adding Transactions**: Users can add new income or expense transactions through the form. The transaction is saved to the current month's data in `localStorage`.
    -   **Viewing Transactions**: Transactions are displayed in a table, grouped by month. A dropdown menu allows users to switch between different months.
    -   **Deleting Transactions**: Users can delete transactions, which removes them from `localStorage`.
    -   **Updating Status**: Users can mark transactions as "paid" using a checkbox, and the status is updated in `localStorage`.
    -   **Resume**: The top section of the page displays a summary of total income, expenses, and the balance for the selected month.

### 3. Financial Performance Page (`performance.html`)

-   This dedicated page provides a visual representation of the user's financial evolution over time.
-   It displays a line chart showing monthly income and expenses, allowing users to track their financial progress and identify trends.

### 4. Scripts

-   **`auth.js`**: Handles all authentication-related logic: registration, login, and logout. It is loaded on the `login.html` and `register.html` pages.
-   **`main.js`**: Contains the core application logic for the financial management page (`index.html`). It handles adding, deleting, and displaying transactions, as well as calculating the summary.
-   **`performance.js`**: Contains the logic for rendering the financial evolution chart on the `performance.html` page.

## Vercel Deployment Instructions

To deploy this project to Vercel, follow these steps:

1.  **Install the Vercel CLI:**
    If you don't have it installed globally, open your terminal or command prompt and run:
    ```bash
    npm install -g vercel
    ```

2.  **Login to your Vercel account:**
    Run the following command and follow the prompts to log in with your Vercel account:
    ```bash
    vercel login
    ```

3.  **Deploy the project:**
    Navigate to the root directory of this project in your terminal (where `vercel.json` is located) and execute the deploy command:
    ```bash
    vercel
    ```
    The Vercel CLI will guide you through the deployment process, asking for details like the project name and the organization. The `vercel.json` file in this project will automatically configure the deployment settings.

After a successful deployment, the Vercel CLI will provide you with a URL where your live project can be accessed.