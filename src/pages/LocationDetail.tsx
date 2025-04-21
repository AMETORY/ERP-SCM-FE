import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useParams } from "react-router-dom";
import { getLocation } from "../services/api/locationApi";
import { LocationPointModel } from "../models/location_point";
import { Label } from "flowbite-react";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface LocationDetailProps {}

const LocationDetail: FC<LocationDetailProps> = ({}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { locationId } = useParams();
  const [data, setData] = useState<LocationPointModel>();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);
  useEffect(() => {
    if (mounted) {
      getDetail();
    }
  }, [mounted]);
  const getDetail = () => {
    setLoading(true);
    getLocation(locationId!)
      .then((res: any) => {
        setData(res.data);
      })
      .catch((err: any) => {
        toast.error(`${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AdminLayout>
      <div className="h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-8 flex flex-col space-y-4 ">
          <h1 className="text-2xl font-bold">Location Detail</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4 p-4 border rounded-lg">
              <div>
                <Label>Name</Label>
                <div>{data?.name}</div>
              </div>
              <div>
                <Label>Description</Label>
                <div>{data?.description}</div>
              </div>
              <div>
                <Label>Type</Label>
                <div>{data?.type}</div>
              </div>
              {data?.type == "WAREHOUSE" && (
                <div>
                  <Label>Warehouse</Label>
                  <div>{data?.warehouse?.name}</div>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-4 p-4 border rounded-lg">
              <div>
                <Label>Address</Label>
                <div>
                  {data?.address} {data?.zip_code}
                </div>
              </div>
              <div>
                <Label>Province</Label>
                <div>{data?.province?.name}</div>
              </div>
              <div>
                <Label>Regency</Label>
                <div>{data?.regency?.name}</div>
              </div>
              <div>
                <Label>District</Label>
                <div>{data?.district?.name}</div>
              </div>
              <div>
                <Label>Village</Label>
                <div>{data?.village?.name}</div>
              </div>
            </div>
          </div>
          {data?.latitude && data?.longitude && (
            <MapContainer
              center={[data?.latitude, data?.longitude]}
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
              <Marker position={[data?.latitude, data?.longitude]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default LocationDetail;
