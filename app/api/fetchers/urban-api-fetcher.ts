"use server";

import { HttpMethods } from "./http";

const BASE_URL = process.env.URBAN_API_BASE_URL;

export type UrbanApiResponse<T> = { data?: T; error?: ApiError };

type ApiError = {
  status?: number | string;
  message?: string;
  code?: number;
  method?: string;
  url?: string;
};

const urbanApiFetch = async <T>(
  requestUrl: string,
  options?: FetchOptions,
): Promise<UrbanApiResponse<T>> => {
  try {
    const { method, body } = {
      ...(options || {}),
    };

    const url = requestUrl.includes(BASE_URL!)
      ? requestUrl
      : `${BASE_URL}${requestUrl}`;

    const res = await fetch(url, {
      method,
      body,
    });

    const data = await res.json();

    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `${res.status} error for: ${method} ${url}`;
      return { error: message };
    }

    return { data: data as T };
  } catch (error: any) {
    return { error };
  }
};

type FetchOptions = {
  method?: HttpMethods;
  body?: any;
};

export { urbanApiFetch };
