> This project is still in progress and not yet complete. Contributions and feedback are welcome!

# Zip4You (File Distributor)

![Backed categories page overview](git_images/backend_categories.png)


This is an open-source file distributor designed to facilitate file sharing among users without requiring account creation. It’s a simple solution for distributing files quickly and efficiently.

### Frontend

<div style="display:flex;">
<!-- Main -->
<!-- Nextjs -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Next JS&color=000000&logo=Next.js&logoColor=white&style=flat">
<!-- Typescript -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Typescript&color=2F74C0&logo=Typescript&logoColor=white&style=flat">
<!-- tRPC -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=tRPC&color=3788C5&logo=TRPC&logoColor=white&style=flat">

<!-- Styling -->
<!-- Tailwind -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Tailwind&color=38BDF8&logo=TailwindCSS&logoColor=white&style=flat">
<!-- Radix -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Radix&color=000000&logo=Radixui&logoColor=white&style=flat">
<!-- Shadcn -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Shadcn&color=000000&logo=Shadcnui&logoColor=white&style=flat">
<!-- Lucide -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Lucide&color=F56A6A&logo=Lucide&logoColor=white&style=flat">

<!-- Other -->
<!-- Zod -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Zod&color=274D82&logo=zod&logoColor=white&style=flat">
</div>


### Backend

<div style="display:flex;">
<!-- Main -->
<!-- Nextjs -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Next JS&color=000000&logo=Next.js&logoColor=white&style=flat">
<!-- Drizzle -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Drizzle&color=BFEF4D&logo=Drizzle&logoColor=white&style=flat">

<!-- Other -->
<!-- Zod -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Zod&color=274D82&logo=zod&logoColor=white&style=flat">
</div>


### Databases

<div style="display:flex;">
<!-- Postgresql -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Postgres SQL&color=31648C&logo=Postgresql&logoColor=white&style=flat">
<!-- Redis -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Upstash Redis&color=00C389&logo=Upstash&logoColor=white&style=flat">
</div>

### Authentication

<div style="display:flex;">
<!-- Clerk -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Clerk&color=6E4BFF&logo=Clerk&logoColor=white&style=flat">
</div>

### Deployment & Tools

<div style="display:flex;">
<!-- Vercel -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Vercel&color=0F0F12&logo=vercel&logoColor=white&style=flat">
</div>

### Features

- Simple Layout: User-friendly interface for easy file access.
- Admin File Uploads: Admins can upload files for public download.
- Temporary File Storage: All files are automatically deleted after 24 hours.
- Low Spec Requirements: Designed to be cost-effective and efficient.
- Heavy Caching: Optimized for speed and reduced costs.

### Getting Started

Clone the repository:
```bash
git clone https://github.com/webdevkaleem/zip4you.git
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory and add the following variables:
```bash
# Postgres (Database)
DATABASE_URL=""

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# Uploadthing (File Storage)
UPLOADTHING_TOKEN=""
```

Setting up the database:
```bash
npm run db:generate
```
```bash
npm run db:migrate
```

Run the project locally:
```bash
npm run dev
```


### License
[MIT](https://choosealicense.com/licenses/mit/)

