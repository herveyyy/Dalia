"use server";

import { postCreateWorkspace } from "../queries/post/post-create-workspace.query";

export async function createWorkspaceAction(data: { name: string; adminEmail: string }) {
  // Call the database query function
  const newWorkspace = await postCreateWorkspace({
    name: data.name,
  });

  if (!newWorkspace) {
    throw new Error("Failed to create workspace: No workspace returned from database.");
  }

  return {
    id: newWorkspace.id,
    name: newWorkspace.name,
    adminEmail: data.adminEmail,
    isFirm: false,
  };
}
