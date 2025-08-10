import type { User } from "$lib/server/users"

export type filesAndUserID = {
  files: file[],
  currentUser: UUID
}

declare global {
  namespace App {
    interface Locals {
      user: User | null,
      session: Session | null
    }
  }
}

export {};