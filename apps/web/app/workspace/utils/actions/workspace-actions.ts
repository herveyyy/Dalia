"use server";

import { postCreateWorkspace } from "../queries/post/post-create-workspace.query";

export async function createWorkspaceAction(data: { name: string; adminEmail: string }) {
  const newWorkspace = await postCreateWorkspace({
    name: data.name,
    adminEmail: data.adminEmail,
  });

  if (!newWorkspace) {
    throw new Error("Failed to create workspace: No workspace returned from database.");
  }

  return {
    id: newWorkspace.id,
    name: newWorkspace.name,
    adminEmail: newWorkspace.adminEmail || data.adminEmail,
    isFirm: false,
    adminHasLogin: false,
  };
}
