import { ShipmentModel } from "./shipment";

export interface DistributionEventModel {
  id?: string;
  name?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  shipments: ShipmentModel[];
}


export interface DistributionEventReport {
  id?: string;
  distribution_event_id: string;
  total_shipments: number;
  total_destinations: number;
  total_items: number;
  lost_items: number;
  damaged_items: number;
  delayed_shipments: number;
  finished_shipments: number;
  processing_shipments: number;
  ready_to_ship: number;
  feedback_count: number;
}
