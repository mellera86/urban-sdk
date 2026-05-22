import { ObjectValues } from "@/app/utils/types";

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export type HttpMethods = ObjectValues<typeof HTTP_METHODS>;
