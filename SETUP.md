# Project Setup Guide

## 📋 Table of Contents

  - [Installation](#installation)
    - [1. Environment Variables Setup (.env)](#1-environment-variables-setup-env)
    - [2. Google API Setup](#2-google-api-setup)
    - [3. JWT Secret Generation](#3-jwt-secret-generation)
    - [4. Running the Application](#4-running-the-application)

---

## Installation

To get the project running, you first need to create an environment variables file. Copy `.sample.env` and rename it to `.env`.

### 1. Environment Variables Setup (.env)

Your `.env` file should look something like this:

```env
POSTGRES_DB=vanemarendaja_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD={Your password}

SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/vanemarendaja_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD={Your password}

GOOGLE_CLIENT_ID={Your Google Client ID}
GOOGLE_CLIENT_SECRET={Your Google Client Secret}

JWT_SECRET={Your generated JWT secret}
```

---

### 2. Google API Setup

To obtain `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, follow these instructions:

- **Get ID:** [Google Developer Console](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#get_your_google_api_client_id)
- **Auth Platform:** When creating a new one, select **External**, not Internal.
- **Configuration:** Once the Client ID is created, click on it and fill in the following fields:
  - **Authorized JavaScript origins:**
    - `http://localhost`
    - `http://localhost:3000` (or your port if different)
  - **Authorized redirect URIs:**
    - `http://localhost:8080/login/oauth2/code/google`
- **Secret:** `GOOGLE_CLIENT_SECRET` is located in the same place as the Client ID.

---

### 3. JWT Secret Generation

For `JWT_SECRET`, you need Node.js. Run this command in your terminal and copy the output to the `.env` file:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 4. Running the Application

1. **Backend & Database:** Once `.env` is ready, start Docker Engine (e.g., Docker Desktop). In the project root directory, run:

   ```bash
   docker compose up
   ```

2. **Frontend:** Once Docker is up, go to the `frontend` directory and install required packages:

   ```bash
   npm i
   ```

3. **Start:** Run the frontend application:
   ```bash
   npm run dev
   ```

If everything went well, you'll see a message in the console:
`Local: http://localhost:3000`

Select Taltech organisation in order to have sample data ready in DB