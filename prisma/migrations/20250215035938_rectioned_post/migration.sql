/*
  Warnings:

  - Added the required column `value` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthorProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profilePhoto" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "qualifications" TEXT,
    "profession" TEXT NOT NULL,
    "expertise" JSONB NOT NULL,
    "socialLinks" JSONB,
    "workExperience" JSONB,
    "education" JSONB,
    "skills" JSONB,
    "publications" JSONB,
    "personalBrand" JSONB,
    "contactInfo" JSONB,
    "additionalInfo" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "email" TEXT,
    "reactionScore" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "AuthorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AuthorProfile" ("additionalInfo", "contactInfo", "createdAt", "education", "expertise", "fullName", "id", "personalBrand", "profession", "profilePhoto", "publications", "qualifications", "skills", "socialLinks", "tagline", "updatedAt", "userId", "workExperience") SELECT "additionalInfo", "contactInfo", "createdAt", "education", "expertise", "fullName", "id", "personalBrand", "profession", "profilePhoto", "publications", "qualifications", "skills", "socialLinks", "tagline", "updatedAt", "userId", "workExperience" FROM "AuthorProfile";
DROP TABLE "AuthorProfile";
ALTER TABLE "new_AuthorProfile" RENAME TO "AuthorProfile";
CREATE UNIQUE INDEX "AuthorProfile_userId_key" ON "AuthorProfile"("userId");
CREATE TABLE "new_Reaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reaction" ("createdAt", "id", "postId", "type", "updatedAt", "userId") SELECT "createdAt", "id", "postId", "type", "updatedAt", "userId" FROM "Reaction";
DROP TABLE "Reaction";
ALTER TABLE "new_Reaction" RENAME TO "Reaction";
CREATE INDEX "Reaction_postId_idx" ON "Reaction"("postId");
CREATE INDEX "Reaction_userId_idx" ON "Reaction"("userId");
CREATE UNIQUE INDEX "Reaction_postId_userId_type_key" ON "Reaction"("postId", "userId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
