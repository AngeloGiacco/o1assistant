-- CreateTable
CREATE TABLE "messages" (
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "xata_updatedat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xata_id" TEXT NOT NULL DEFAULT ('rec_'::text || (xata_private.xid())::text),
    "xata_version" INTEGER NOT NULL DEFAULT 0,
    "xata_createdat" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "_pgroll_users_xata_id_key" ON "messages"("xata_id");
