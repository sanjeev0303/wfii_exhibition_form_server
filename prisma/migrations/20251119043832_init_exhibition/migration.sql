-- CreateTable
CREATE TABLE "exhibitions" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyDescription" TEXT NOT NULL,
    "companyPosterUrl" TEXT NOT NULL,
    "companyAbout" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "productAbout" TEXT NOT NULL,
    "productImages" TEXT[],
    "productVideoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exhibitions_pkey" PRIMARY KEY ("id")
);
