
# simple-markdown-blog

XpresDeals – MVP web platform for halal promotions in Long Island. Built with Next.js (App Router), Prisma + Neon, NextAuth.js, and Cloudinary. Features include public promotions feed, location-based filtering, and admin access for Visioad team.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

##  MVP Goal

- Public users can view halal promotions by area.  
- Visioad team can create, edit, and manage promotions .  
- Designed to be fast, lightweight, and easy to maintain.  

---

## Tech Stack Overview

| Layer        | Technology         | Notes                                           |
|--------------|--------------------|------------------------------------------------|
| **Frontend** | Next.js (App Router) | SEO-friendly, fast routing, public content     |
| **Backend**  | Next.js API Routes | Lightweight CRUD backend                       |
| **Database** | PostgreSQL + Prisma | Structured data, reliable for promotions       |
| **Auth**     | NextAuth.js        | Email/password login for Visioad staff only    |
| **Storage**  | Cloudinary         | Secure image hosting for promotions            |
| **Hosting**  | Vercel             | Frontend + API deployment                      |
| **Email**    | None (MVP)         | Future option: alerts/newsletters              |
| **Payment**  | None               | Not required for MVP                           |

---

## Core Features

### 1. Public Promotions View
- Homepage shows latest halal deals.  
- Each promotion includes:
  - Title  
  - Image  
  - Description  
  - Area (tag)  
  - Expiration date  
- Location-based filtering (e.g. Holbrook, Queens, Brentwood).  

### 2. Admin access
- Restricted login (Visioad staff only).  
- Buttons for:
  - Creating promotions  
  - Editing promotions  
  - Deleting promotions  
- Promotion fields:
  - Title, description, image, area tag, expiration date.  
- List view with quick actions.  

---

## Database Schema (Simplified)

**User**  
- id  
- name  
- email 
- emailVerified 
- password  
- role (admin only)  
- image         
- createdAt     
- accounts      
- comments      
- likes         
- posts         
- sessions      

**PromotionPost**  
- id  
- title
- content  
- slug  
- tags
- published
- description  
- imageUrl  
- areaTag  
- expiresOn  
- createdAt  
- updatedAt
- author
- comments
- likes  
- authorId (relation to User = creator)   

---

##  API Endpoints

| Method | Endpoint                    | Description                 |
|--------|-----------------------------|-----------------------------|
| GET    | `/api/posts`                | Public: list all promotions |
| GET    | `/api/posts-by-slug/[slug]` | Public: promotion details   |
| POST   | `/api/posts`                | Admin: create promotion     |
| PUT    | `/api/posts/[id]`           | Admin: update promotion     |
| DELETE | `/api/posts/[id]`           | Admin: delete promotion     |
| POST   | `/api/auth/[nextauth]`      | Admin login                 |

---

##  Testing Plan

- **Form validation**: `react-hook-form` + `zod`  
- **API testing**: Postman or Thunder Client  
- **Security**: Role-based access, protected routes  
- **Optional**: UI smoke testing with Cypress  

---

##  MVP Timeline (4 Weeks)

| Week | Tasks |
|------|---------------------------------------------------------|
| 1    | Project setup, database schema, public homepage layout  |
| 2    | Promotion detail page + location filter                 |
| 3    | Admin access, promotion editor                          |
| 4    | Cloudinary integration, UI polish, deployment           |



### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/simple-markdown-blog.git
cd simple-markdown-blog 

