# finance-system-frontend

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
