"use server";

import { vectorize } from "@/services/chat/chat";
import { createId } from "@paralleldrive/cuid2";
import { UploadedFile } from "../_components/UploadDocument";

export const addDocument = async (formData: FormData) => {
  const indexId = createId();
  const files = formData.getAll("file") as UploadedFile[];
  const apiKey = formData.get("apiKey");
  const file = files[0];

  await vectorize(indexId as string, file as File, apiKey as string);

  return { indexId };
};
