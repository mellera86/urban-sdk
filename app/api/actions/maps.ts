import { Map } from "@models/maps";
import { urbanApiFetch, UrbanApiResponse } from "../fetchers/urban-api-fetcher";
import { HTTP_METHODS } from "../fetchers/http";

export type GET_MapsResponse = Map[];

export async function getMaps(): Promise<UrbanApiResponse<GET_MapsResponse>> {
  return await urbanApiFetch<GET_MapsResponse>(`/exampledata/samples.json`, {
    method: HTTP_METHODS.GET,
  });
}
