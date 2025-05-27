# Technical Documentation for AUDIT-NEXT-S3-N8N Project

## Project Overview

The `AUDIT-NEXT-S3-N8N` project is a web-based application that provides a frontend interface for document upload and management capabilities, and integrates with AWS S3 for secure file storage and n8n for workflow automation. The application is built using the Next.js framework and leverages modern web technologies to deliver a seamless user experience.

---

## Scope of the Project

### Key Objectives

1. **Document Management**: Enable clients to upload documents.
3. **Secure File Storage**: Utilize AWS S3 for secure and scalable file storage.
4. **Workflow Automation**: Integrate with n8n to automate workflows such as notifications, approvals, and data processing.

---

## System Architecture

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend
- **API**: Next.js API routes
- **File Storage**: AWS S3
- **Workflow Automation**: n8n (via webhooks)

---

## Getting Started

Follow these steps to run the app locally:

1. **Use the required Node version:**

   ```bash
   nvm use 18.20.6

2. **If you don't have this version installed, run:**

    ```bash
    nvm install 18.20.6

3. **Install dependencies:**

    ```bash
    npm install

4. **Add environment variables**

    ```bash
    AWS_REGION=your-aws-region
    AWS_ACCESS_KEY_ID=your-access-key-id
    AWS_SECRET_ACCESS_KEY=your-secret-access-key
    AWS_S3_BUCKET_NAME=your-s3-bucket-name


5. **Start the development server:**

    ```bash
    npm run dev


The app will now be running locally. Visit http://localhost:3000 (or the port specified in your project) to view it in your browser.
