/*
  Warnings:

  - Added the required column `updatedAt` to the `CatProfile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CatProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" REAL,
    "gender" TEXT,
    "allergies" TEXT,
    "activityLevel" TEXT,
    "furType" TEXT,
    "size" TEXT,
    "lifeStage" TEXT,
    "neutered" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CatProfile" ("activityLevel", "age", "allergies", "createdAt", "furType", "gender", "id", "lifeStage", "name", "neutered", "size", "weight") SELECT "activityLevel", "age", "allergies", "createdAt", "furType", "gender", "id", "lifeStage", "name", "neutered", "size", "weight" FROM "CatProfile";
DROP TABLE "CatProfile";
ALTER TABLE "new_CatProfile" RENAME TO "CatProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PoopLog_catId_date_idx" ON "PoopLog"("catId", "date");
