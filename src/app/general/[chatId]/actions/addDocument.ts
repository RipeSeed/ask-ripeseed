"use server";

import { createId } from "@paralleldrive/cuid2";
import { UploadedFile } from "../_components/UploadDocument";
import { vectorize } from "@/services/chat/chat";

export const addDocument = async (formData: FormData) => {
  const indexId = createId();
  const files = formData.getAll("file") as UploadedFile[];
  const apiKey = formData.get("apiKey");
  const file = files[0];

  const res = await vectorize(
    indexId as string,
    file as File,
    apiKey as string,
  );

  return res;
};
