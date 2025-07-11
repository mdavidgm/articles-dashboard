# Articles Dashboard

A full-stack web application featuring a modern React frontend (built with Vite and TypeScript) and a robust Node.js backend (built with Express). This project serves as a comprehensive dashboard for viewing and managing articles, with a strong emphasis on code quality and a complete testing suite.

---

## Technology Stack

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express
* **ORM:** Prisma
* **Database:** SQLite (for simple, file-based setup without external dependencies)
* **Testing:** Jest

### **Frontend**
* **Framework:** React (v18+) with TypeScript
* **Build Tool:** Vite
* **UI Library:** Material-UI (MUI)
* **Unit Testing:** Vitest & React Testing Library
* **E2E Testing:** Playwright
* **Code Quality:** ESLint

Code: https://github.com/mdavidgm/articles-dashboard#
---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or later) and [npm](https://www.npmjs.com/) installed on your system.

### Installation

1.  Clone the project repository to your local machine:
    ```bash
    git clone git@github.com:mdavidgm/articles-dashboard.git
    cd articles-dashboard
    ```

2.  You will need to run the server and the client in **two separate terminal windows**.

---

### Backend Server Setup

Follow these steps in your first terminal.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install all dependencies:**
    ```bash
    npm install
    ```

3.  **Sync the database schema:**
    This command reads the `schema.prisma` file and sets up the local SQLite database.
    ```bash
    npx prisma db push
    ```

4.  **IMPORTANT: It is a data generator**

    Summaries are empty for each article. Each time that some user clicks to generate an articlesummary I save it in the database. To come back to the original state execute this command. It restores db data.

    ```bash
    npm run prisma:seed
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    > The server will now be running on **`http://localhost:4000`**.

---

### Frontend Client Setup

Open a **new terminal window** and follow these steps.

1.  **Navigate to the client directory** (from the project root):
    ```bash
    cd client
    ```

2.  **Install all dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development client:**
    ```bash
    npm run dev
    ```
    > The application will be available at **`http://localhost:5173/`**.

---

## Testing

This project is fully tested with **100% code coverage** for both the client and server, ensuring code reliability and maintainability.

### **Server Testing**

From the `/server` directory, run the following command to execute all Jest tests:
```bash
npm test
```
It fills a test database which generated each time that nom test is esecuted and pass tests with coverage report:

![alt text](image.png)

### **Client Testing**

Run all tests (Unit + E2E):
```bash
npm test
```
Run only Unit Tests:
```bash
npm run test:unit
```

![alt text](image-1.png)

Run only End-to-End Tests:
```bash
npm run test:e2e
```
