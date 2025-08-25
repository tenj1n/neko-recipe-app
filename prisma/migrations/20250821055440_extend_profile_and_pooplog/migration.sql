/*
  Warnings:

  - You are about to drop the column `allergy` on the `CatProfile` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PoopLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "catId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER,
    "note" TEXT,
    CONSTRAINT "PoopLog_catId_fkey" FOREIGN KEY ("catId") REFERENCES "CatProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CatProfile" ("age", "createdAt", "gender", "id", "name", "weight") SELECT "age", "createdAt", "gender", "id", "name", "weight" FROM "CatProfile";
DROP TABLE "CatProfile";
ALTER TABLE "new_CatProfile" RENAME TO "CatProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
