-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "logoUrl" TEXT,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);
