"use server";

import { eq } from "drizzle-orm";
import { db } from "../../db";
import { user, account } from "../../db/schema";

export async function getUserByEmail(email: string) {
  try {
    const foundUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (!foundUser || foundUser.length === 0) {
      return null;
    }

    return foundUser[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

export const updateProfileName = async (userId: string, newName: string) => {
  try {
    await db.update(user).set({ name: newName }).where(eq(user.id, userId));
  } catch {
    throw new Error("An error occurred while trying to update profile name");
  }
};

export const deleteAccount = async (userId: string) => {
  try {
    await db.delete(user).where(eq(user.id, userId));
  } catch {
    throw new Error("Failed to delete account");
  }
};

export const getUserProvider = async (userId: string) => {
  try {
    // Query the accounts table to get the provider for the user
    const userAccount = await db
      .select({
        providerId: account.providerId,
      })
      .from(account)
      .where(eq(account.userId, userId))
      .limit(1);

    return userAccount.length > 0 ? userAccount[0].providerId : null;
  } catch (err) {
    console.error("Error fetching user provider:", err);
    return null;
  }
};
