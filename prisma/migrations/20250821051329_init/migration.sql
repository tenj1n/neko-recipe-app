-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CatProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" REAL,
    "gender" TEXT,
    "allergy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CatProfile" ("age", "createdAt", "id", "name", "weight") SELECT "age", "createdAt", "id", "name", "weight" FROM "CatProfile";
DROP TABLE "CatProfile";
ALTER TABLE "new_CatProfile" RENAME TO "CatProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
