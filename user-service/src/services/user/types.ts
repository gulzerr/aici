import type { Prisma } from "@prisma/client";

export interface UserInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  uuid?: string;
  tx?: Prisma.TransactionClient;
}
