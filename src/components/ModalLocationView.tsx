import { Label, Modal } from "flowbite-react";
import type { FC } from "react";
import { LocationPointModel } from "../models/location_point";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface ModalLocationViewProps {
  show: boolean;
  setShow: (show: boolean) => void;
  location: LocationPointModel;
}

const ModalLocationView: FC<ModalLocationViewProps> = ({
  show,
  setShow,
  location,
}) => {
  return (
    <Modal show={show} onClose={() => setShow(false)}>
      <Modal.Header>{location.name}</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Name</Label>
            <div>{location?.name}</div>
          </div>
          <div>
            <Label>Description</Label>
            <div>{location?.description}</div>
          </div>
          <div>
            <Label>Type</Label>
            <div>{location?.type}</div>
          </div>
          {location?.type == "WAREHOUSE" && (
            <div>
              <Label>Warehouse</Label>
              <div>{location?.warehouse?.name}</div>
            </div>
          )}
          <div>
            <Label>Address</Label>
            <div>
              {location?.address} {location?.zip_code}
            </div>
          </div>
          <div>
            <Label>Province</Label>
            <div>{location?.province?.name}</div>
          </div>
          <div>
            <Label>Regency</Label>
            <div>{location?.regency?.name}</div>
          </div>
          <div>
            <Label>District</Label>
            <div>{location?.district?.name}</div>
          </div>
          <div>
            <Label>Village</Label>
            <div>{location?.village?.name}</div>
          </div>
          {location?.latitude && location?.longitude && (
            <MapContainer
              center={[location?.latitude, location?.longitude]}
              zoom={20}
              scrollWheelZoom={false}
              style={{
                minHeight: "450px",
              }}
              dragging
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location?.latitude, location?.longitude]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ModalLocationView;
