Prisma

# Installation

- `npm install -D prisma`
- `npx prisma init` - initializes the schema.prisma file in prisma folder 

change schema.prisma 
change DATABASE_URL in .env

# step 1 : Create Database instance , remember to handle development environment

 import { PrismaClient } from "@prisma/client"
 
 declare global {
     var prisma : PrismaClient | undefined;
 }
 
 export const db = globalThis.prisma || new PrismaClient();
 
 if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

# step 2 : write schemas inside prisma/schema.prisma

 
model Course {
  id String @id @default(uuid())
  userId String
  title String @db.Text
  description String? @db.Text
  imageUrl String? @db.Text
  price Float?
  isPublished Boolean @default(false)

  categoryId String?
  category Category? @relation(fields: [categoryId], references: [id])

  attachments Attachment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([categoryId])
}

# step 3 : run command

- `npx prisma generate`

# step 4 : run command

- `npx prisma db push` - This will sync database with the prisma schema
