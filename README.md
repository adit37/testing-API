<p align="center">
  <img src="https://res.cloudinary.com/dyg5rtwwe/image/upload/v1733753082/rhwrs4hfyeifxivof3oy.png" alt="FontFound API">
</p>

<h1 align="center">FontFound API</h1>

FontFound API is a backend service built using **TypeScript**, **NestJS**, and **Prisma**, designed to power the FontFound application. This repository provides a fully containerized environment using **Docker** and an automated CI/CD pipeline with **GitHub Actions** for deployment to **Google Cloud Run**.

---

## Features

- **NestJS Framework**: Modular and efficient API architecture.
- **Prisma ORM**: Powerful database interaction with schema-based type safety.
- **Docker Support**: Consistent and portable containerized deployments.
- **GitHub Actions**: Streamlined CI/CD for automated testing and deployment.
- **Google Cloud Run**: Serverless application hosting with scalable infrastructure.

---

## Prerequisites

To set up the project locally or for deployment, ensure the following tools are installed:

1. **Node.js** (v16 or higher)  
   - [Download Node.js](https://nodejs.org/)
   
2. **Docker**  
   - [Install Docker](https://www.docker.com/get-started)
   
3. **Google Cloud SDK**  
   - [Install Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
   
4. **Git**  
   - [Install Git](https://git-scm.com/)

---

## Environment Variables

To configure the project, create a `.env` file in the root directory. Add the following environment variables:

```env
# Database connection URL
DATABASE_URL=your_database_connection_url

# Google Cloud Project credentials
PROJECT_ID=your_google_cloud_project_id
PRIVATE_KEY="your_google_cloud_service_account_private_key"
CLIENT_EMAIL=your_google_cloud_service_account_email

# Google Cloud Storage
STORAGE_MEDIA_BUCKET=your_google_cloud_storage_bucket_name
```

---

## Local Development
1. Clone the Repository
```bash
git clone https://github.com/your-username/fontfound-api.git
cd fontfound-api
```

2. Install Dependencies
```bash
npm install
```

3. Run Database Migrations
```bash
npx prisma migrate dev
```

4. Start the Development Server
```bash
npm run start:dev
```

5. Access the API Open your browser or API client at:
```bash
http://localhost:<your port>
```

---


### License
```markdown
## License

This project is licensed under the MIT License.

MIT License
-----------
Copyright (c) 2024 FontFound

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
