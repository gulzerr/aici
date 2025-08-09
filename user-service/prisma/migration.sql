-- CreateTable
CREATE TABLE "public"."Users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_pwd" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_uuid_key" ON "public"."Users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_user_email_key" ON "public"."Users"("user_email");

-- CreateTable
CREATE TABLE "public"."Todos" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todos_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "fk_user_uuid" FOREIGN KEY ("user_uuid") REFERENCES "Users"("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Todos_uuid_key" ON "public"."Todos"("uuid");