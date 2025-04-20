import { asyncStorage } from "../../utils/async_storage";
import { LOCAL_STORAGE_COMPANY_ID, LOCAL_STORAGE_DATERANGE, LOCAL_STORAGE_TOKEN } from "../../utils/constants";

export const customFetch = async <T>(url: string, options: RequestInit & { isBlob?: boolean, isMultipart? :boolean } = {}): Promise<T> => {
  let token = await asyncStorage.getItem(LOCAL_STORAGE_TOKEN);
  let dateRange = await asyncStorage.getItem(LOCAL_STORAGE_DATERANGE)
  let startDate: any = null;
  let endDate: any = null;
  if (dateRange) {
    dateRange = JSON.parse(dateRange);
    startDate = dateRange[0];
    endDate = dateRange[1];
  }
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
    ...options,
    headers: {
      // 'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
      "start-date": startDate,
      "end-date": endDate,
      ...options.headers,
    },
  });

  let data;
  if (options.isBlob) {
    data = await response.blob();
  } else {
    data = await response.json();
  }


  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Something went wrong');
    // @ts-ignore
    error.response = response;
    throw error;
  }

  return data;
};
