import { PaginationRequest } from "../../objects/pagination";
import { customFetch } from "./baseApi";

export const createLocation = async (data: any) => {
  return await customFetch('api/v1/storage/location/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};



export const getLocations = async (req: PaginationRequest) => {
  const queryParams = new URLSearchParams();
  queryParams.set("page", String(req.page));
  queryParams.set("size", String(req.size));
  if (req.search) queryParams.set("search", req.search);
  return await customFetch(
    `api/v1/storage/location/list?${queryParams}`,
    {
      method: "GET",
    }
  );
};


export const deleteLocation = async (locationId: string) => {
    return await customFetch(`api/v1/storage/location/${locationId}`, {
        method: "DELETE",
    });
};

export const getLocation = async (locationId: string) => {
    return await customFetch(`api/v1/storage/location/${locationId}`, {
        method: "GET",
    });
};
