import { DistributionEventModel } from "./distribution_event";
import { LocationPointModel } from "./location_point";
import { ProductModel } from "./product";
import { UnitModel } from "./unit";
import { UserModel } from "./user";

export interface ShipmentModel {
  id?: string;
  distribution_event?: DistributionEventModel;
  distribution_event_id?: string;
  code?: string;
  status?: string;
  shipment_date?: Date;
  expected_finish_at?: Date;
  notes?: string;
  from_location?: LocationPointModel;
  from_location_id?: string;
  to_location?: LocationPointModel;
  to_location_id?: string;
  items: ShipmentItemModel[];
  shipment_legs: ShipmentLegModel[];
  current_shipment_leg?: ShipmentLegModel;
}

export interface ShipmentItemModel {
  id: string;
  shipment_id: string;
  item_name: string;
  quantity: number;
  product_id: string;
  product?: ProductModel;
  unit_id: string;
  unit?: UnitModel;
}

export interface ShipmentLegModel {
  id: string;
  seq_number: number;
  shipment_id: string;
  from_location: LocationPointModel;
  from_location_id: string;
  to_location: LocationPointModel;
  to_location_id: string;
  transport_mode: string;
  number_plate: string;
  driver_name: string;
  vehicle_info: string;
  status: string;
  shipped_by_id: string;
  shipped_by: UserModel;
  arrived_by_id: string;
  arrived_by: UserModel;
  tracking_events: ShipmentTrackingEventModel[];
}


export interface ShipmentTrackingEventModel {
  id: string;
  seq_number: string;
  shipment_leg_id: string;
  status: string;
  location_name: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  notes: string;
}