import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const getDistributionEvents = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/logistic/list-distribution-event?${queryParams}`,
    {
      method: "GET",
    }
  );
};


export const getDistributionEventDetail = async (id: string) => {
  return await customFetch(`api/v1/logistic/distribution-event/${id}`, {
    method: "GET",
  });
};
export const createDistributionEvent = async (data: any) => {
  return await customFetch("api/v1/logistic/create-distribution-event", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
