import { WarehouseModel } from "./warehouse";

export interface LocationPointModel {
  id: string;
  name: string;
  description: string;
  warehouse_id: string;
  warehouse: WarehouseModel;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  zip_code: string;
  province_id: string;
  province: RegionalModel;
  regency: RegionalModel;
  regency_id: string;
  district_id: string;
  district: RegionalModel;
  village_id: string;
  village: RegionalModel;
}

interface RegionalModel {
  id: string;
  name: string;
}
