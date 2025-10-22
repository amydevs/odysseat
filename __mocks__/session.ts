import type { Session, User } from "better-auth";
import type { db as serverDb } from "~/server/db";
import { user, session } from "~/server/db/schema/auth-schema";

type SessionWrapper = {
  session: Session;
  user: User & { role: "user" | "admin" };
};

export function createSessionMock(): SessionWrapper {
  const userId = "mockeduser";
  return {
    session: {
      userId,
      id: "mockedusersession",
      createdAt: new Date(0),
      updatedAt: new Date(0),
      expiresAt: new Date("4000-12-31T00:00:00Z"),
      token: "mockedtoken",
      ipAddress: "127.0.0.1",
    },
    user: {
      id: userId,
      role: "user",
      email: "mockeduser@gmail.com",
      emailVerified: true,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      name: "Mocked User",
    },
  };
}

export async function insertSessionDb(db: typeof serverDb, s: SessionWrapper) {
  await db.transaction(async (tx) => {
    await tx.insert(user).values(s.user).onConflictDoNothing();
    await tx.insert(session).values(s.session);
  });
}
