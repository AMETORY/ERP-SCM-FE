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
export const deleteDistributionEvent = async (id: string) => {
  return await customFetch(`api/v1/logistic/distribution-event/${id}`, {
    method: "DELETE",
  });
};
export const reportDistributionEvent = async (id: string) => {
  return await customFetch(`api/v1/logistic/distribution-event/${id}/report`, {
  });
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


export const createShipment = async (data: any) => {
  return await customFetch("api/v1/logistic/create-shipment", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
export const getShipment = async (id: any) => {
  return await customFetch(`api/v1/logistic/shipment/${id}`, {
  });
};
export const addItemShipment = async (id: any, data: any) => {
  return await customFetch(`api/v1/logistic/shipment/${id}/add-item`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const updateShipmentStatus = async (id: any, data: any) => {
  return await customFetch(`api/v1/logistic/shipment/${id}/update-status`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
export const deleteItemShipment = async (id: any, itemId: any) => {
  return await customFetch(`api/v1/logistic/shipment/${id}/delete-item/${itemId}`, {
    method: "DELETE",
  });
};
export const deleteShipment = async (id: string) => {
  return await customFetch(`api/v1/logistic/delete-shipment/${id}`, {
    method: "DELETE",
  });
};

export const createShipmentLeg = async (data: any) => {
  return await customFetch("api/v1/logistic/create-shipment-leg", {
    method: "POST",
    body: JSON.stringify(data),
  });
};


export const startShipmentLeg = async (id: string, data: any) => {
  return await customFetch(`api/v1/logistic/start-shipment-leg/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const arrivedShipmentLeg = async (id: string, data: any) => {
  return await customFetch(`api/v1/logistic/arrived-shipment-leg/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


export const addTrackingEvent = async (legId: string, data: any) => {
  return await customFetch(`api/v1/logistic/add-tracking-event/${legId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};


