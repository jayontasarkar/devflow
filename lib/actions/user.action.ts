"use server";

import { connectToDatabase } from "@/database/connection";
import User from "@/database/models/user.model";

export async function getUserByClerkId(params: any) {
  try {
    connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });

    return user;
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
}