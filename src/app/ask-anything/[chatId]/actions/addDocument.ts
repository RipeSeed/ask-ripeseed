"use server";

import { vectorize } from "@/services/chat/chat";
import { createId } from "@paralleldrive/cuid2";
import { UploadedFile } from "../_components/UploadDocument";
import { validateReq } from "../utils/validateDocReq";

export const addDocument = async (formData: FormData) => {
  const indexId = createId();
  const file = formData.get("file") as UploadedFile;
  const apiKey = formData.get("apiKey") as string | null;

  const { isValid, msg } = validateReq(file, apiKey);
  if (!isValid) {
    throw new Error(msg);
  }

  await vectorize(indexId as string, file as File, apiKey as string);

  return { indexId };
};
