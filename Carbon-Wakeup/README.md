
# 🌱 CarbonWakeUp - Carbon Footprint Calculator

CarbonWakeUp is an interactive web application designed to increase awareness of global CO₂ emissions by empowering users to track their carbon footprint, compare country-level emissions, and take actionable steps toward sustainability—all in one platform.

## ✨ Features
### Global Emissions Comparison Tool
- **Interactive Graph**: Visualize CO₂ emissions by country with color-coded metrics.
- **Comparison Tool:** Compare emissions across countries (e.g., Canada vs. USA).
- **Historical Trends:** View changes in emissions over time.

### Personalized Carbon Footprint Calculator
- **Lifestyle Inputs:** Calculate emissions based on:
    - 🚗 Transportation (car mileage, flights)
    - 🏠 Home energy usage
    - 🍽 Diet (meat consumption, food waste)
- **Real-Time Estimates:** Instant footprint results in kgCO2e/year.

- **Suggestions:** If your carbon footprint is high, personalized suggestions are given to lower your overall carbon footprint.

- **Data Saving**: Save your carbon footprint calculations to see how much of an impact you are making.

### Non-Profit Organization Donations (simulated)
- **Support Climate Organizations:** Simulate donating to vetted nonprofits and view your donation history.

- **Impact Tracking:** See how donations translate to real-world outcomes (e.g., "Your $50 = 10 trees planted").



## 🛠 Tech Stack

**Frontend:** React, Vite

**Backend:** Node.js + Express, PostgreSQL

**Deployment & Infrastructure:** Docker, Microsoft Azure


## Installation
### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (v14+ recommended) 
- Docker
- Microsoft Azure account (for database deployment)

### 🔧 Local Development Setup
First, clone the repository
```bash
git clone https://github.com/SSaif-13/CPSC_471_Project
cd my-project
```
Install dependencies in your root directory for the project:
```bash
npm install my-project
```

Then, install dependencies in the server directory:
```bash
cd ../server
npm install
```

Setup the Azure database using the *setup.sql* script provided in the server directory. Use an external tool such as psql CLI, and run the following command:

```psql
psql \
  --host=<your-server-name>.postgres.database.azure.com \
  --username=<admin-username>@<your-server-name> \
  --dbname=postgres \
  -a -f setup.sql
```

You will also need to setup an .env file which needs to be placed in your project's root directory. It should look something like this:
```env
DB_HOST=<your-server-name>.postgres.database.azure.com
DB_PORT=5432
DB_USER=<your-database-user>
DB_PASSWORD=<your-password>
DB_NAME=<your-database-name>
```

### 🐳 Docker Deployment
Run the following command to build and run the app's container:
```bash
docker-compose up --build
```

To stop the app's container, either use Docker desktop or run the following command:
```bash
docker-compose down
```

If everything succeeds, you should see the following messages in the logs:
- Frontend:
    ```
    Local:   http://localhost:5173/
    Network: http://(your network IP):5173/
    ```
- Backend:
    ```
    Available databases: [ '(your available databases)' ]
    Connected to database: (database you are connected to)
    Connected as user: (your user)
    Server running on port 5000
    Test endpoint available at http://localhost:5000/api/test⁠
    API routes available under http://localhost:5000/api⁠
    ```

## Authors

- [@SSaif-13](https://github.com/SSaif-13)
- [@brandonn3883](https://github.com/brandonn3883)
- [@akib-almahi](https://github.com/akib-almahi)


## License

[MIT](https://choosealicense.com/licenses/mit/)

