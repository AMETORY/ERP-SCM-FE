import { useContext, useEffect, useRef, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Label,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
  TextInput,
} from "flowbite-react";
import { LuFilter } from "react-icons/lu";
import Select from "react-select";
import {
  getDistricts,
  getProvinces,
  getRegencies,
  getVillages,
  searchLocation,
} from "../services/api/regionalApi";
import {
  createLocation,
  deleteLocation,
  getLocations,
} from "../services/api/locationApi";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { LocationData } from "../models/place";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LocationPointModel } from "../models/location_point";
import { PaginationResponse } from "../objects/pagination";
import { getPagination } from "../utils/helper";
import { useNavigate } from "react-router-dom";

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface LocationPageProps {}

const LocationPage: FC<LocationPageProps> = ({}) => {
  const timeout = useRef<number | null>(null);
  const { loading, setLoading } = useContext(LoadingContext);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [places, setPlaces] = useState<LocationData[]>([]);
  const [mounted, setMounted] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [locationType, setLocationType] = useState("WAREHOUSE");
  const nav = useNavigate();
  const [provinces, setProvinces] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProvince, setSelectedProvince] = useState<{
    label: string;
    value: string;
  }>();
  const [regencies, setRegencies] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedRegency, setSelectedRegency] = useState<{
    label: string;
    value: string;
  }>();
  const [districts, setDistricts] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedDistrict, setSelectedDistrict] = useState<{
    label: string;
    value: string;
  }>();
  const [villages, setVillages] = useState<{ label: string; value: string }[]>(
    []
  );
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: string;
  }>();

  const [locations, setLocations] = useState<LocationPointModel[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllLocations();
      getProvinces().then((resp: any) => {
        setProvinces(
          resp.data.map((p: any) => ({ label: p.name, value: p.id }))
        );
      });
    }
  }, [mounted]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat); // Update state with clicked position
        setLongitude(e.latlng.lng); // Update state with clicked position
      },
    });
    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} />
    ) : null; // Render marker on clicked position
  };

  const MapCenterUpdater: React.FC<{ center: [number, number] }> = ({
    center,
  }) => {
    const map = useMap();
    map.setView(center);
    map.setZoom(20);
    return null;
  };

  const getAllLocations = () => {
    getLocations({ page, size, search: "" }).then((resp: any) => {
      setPagination(getPagination(resp.data));
      setLocations(resp.data.items);
    });
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Location Point</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + Location
            </Button>
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {}}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table striped>
            <TableHead>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Address</TableHeadCell>
              <TableHeadCell></TableHeadCell>
            </TableHead>
            <TableBody>
              {locations.length == 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No locations found.
                  </TableCell>
                </TableRow>
              )}
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.type}</TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>
                    <a
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      onClick={() => {
                        nav(`/location/${location.id}`);
                      }}
                    >
                      View
                    </a>
                    <a
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete  ${location.name}?`
                          )
                        ) {
                          deleteLocation(location?.id!).then(() => {
                            getAllLocations();
                          });
                        }
                      }}
                    >
                      Delete
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <div className="text-2xl font-bold">Add Location</div>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Location Type</Label>
              <Select
                options={[
                  { value: "WAREHOUSE", label: "Warehouse" },
                  { value: "CHECK_POINT", label: "Check Point" },
                ]}
                value={{
                  value: locationType,
                  label:
                    locationType == "WAREHOUSE" ? "Warehouse" : "Check Point",
                }}
                onChange={(option) => setLocationType(option?.value!)}
              />
            </div>
            <div>
              <Label>Name</Label>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </div>
            <div>
              <Label>Latitude</Label>
              <TextInput
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(Number(e.target.value))}
                placeholder="Latitude"
              />
            </div>
            <div>
              <Label>Longitude</Label>
              <TextInput
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(Number(e.target.value))}
                placeholder="Longitude"
              />
            </div>
            <div>
              <Label>Search Location</Label>
              <TextInput
                onChange={(e) => {
                  if (timeout.current) {
                    window.clearTimeout(timeout.current);
                  }
                  timeout.current = window.setTimeout(() => {
                    searchLocation(e.target.value).then((e: any) =>
                      setPlaces(e.data.places)
                    );
                  }, 500);
                }}
                placeholder="Search Location"
              />
              {places.length > 0 && (
                <div className=" border rounded-lg">
                  {places?.map((p, i) => (
                    <div
                      className="cursor-pointer border-b last:border-b-0 py-2 px-4 hover:bg-gray-50 text-sm"
                      key={i}
                      onClick={() => {
                        setLatitude(p.location.latitude);
                        setLongitude(p.location.longitude);
                        setAddress(p.formattedAddress);
                        setPlaces([]);
                        setName(p.displayName?.text);
                      }}
                    >
                      <h3 className="font-semibold">{p.displayName?.text}</h3>
                      <address>{p.formattedAddress}</address>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {latitude && longitude && (
              <MapContainer
                center={[latitude, longitude]}
                zoom={20}
                scrollWheelZoom={false}
                style={{
                  minHeight: "300px",
                }}
                dragging
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <Marker position={[latitude, longitude]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker> */}
                <MapCenterUpdater center={[latitude, longitude]} />
                <MapClickHandler />
              </MapContainer>
            )}

            <div>
              <Label htmlFor="province">Province</Label>
              <Select
                required
                options={provinces}
                value={selectedProvince}
                onChange={(option) => {
                  setSelectedProvince(option!);
                  getRegencies(option!.value).then((resp: any) => {
                    setRegencies(
                      resp.data.map((s: any) => ({
                        value: s.id,
                        label: s.name,
                      }))
                    );
                  });
                }}
              />
            </div>
            <div>
              <Label htmlFor="regency">Regency</Label>
              <Select
                required
                options={regencies}
                value={selectedRegency}
                onChange={(option) => {
                  setSelectedRegency(option!);
                  getDistricts(option!.value).then((resp: any) => {
                    setDistricts(
                      resp.data.map((s: any) => ({
                        value: s.id,
                        label: s.name,
                      }))
                    );
                  });
                }}
              />
            </div>
            <div>
              <Label htmlFor="district">District</Label>
              <Select
                required
                options={districts}
                value={selectedDistrict}
                onChange={(option) => {
                  setSelectedDistrict(option!);
                  getVillages(option!.value).then((resp: any) => {
                    setVillages(
                      resp.data.map((s: any) => ({
                        value: s.id,
                        label: s.name,
                      }))
                    );
                  });
                }}
              />
            </div>
            <div>
              <Label htmlFor="village">Village</Label>
              <Select
                required
                options={villages}
                value={selectedVillage}
                onChange={(option) => {
                  setSelectedVillage(option!);
                }}
              />
            </div>
            <div>
              <Label htmlFor="zip_code">Zip Code</Label>
              <TextInput
                id="zip_code"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-row justify-end w-full">
            <Button
              onClick={async () => {
                // Add validation for regional
                const isValid =
                  selectedProvince &&
                  selectedRegency &&
                  selectedDistrict &&
                  selectedVillage;
                if (!isValid) {
                  // Handle invalid regional data, e.g. show an error message
                  toast.error("Invalid regional data");
                  return;
                }

                const isValidCoordinates = latitude && longitude;
                if (!isValidCoordinates) {
                  toast.error("Invalid coordinates");
                  return;
                }

                const isValidInfo = name && address
                const isValidDetails = name.trim() !== "" && address.trim() !== "";
                if (!isValidInfo || !isValidDetails) {
                  toast.error("Name and address cannot be empty");
                  return;
                }
                setLoading(true);
                try {
                  await createLocation({
                    type: locationType,
                    name,
                    description,
                    address,
                    latitude,
                    longitude,
                    province_id: selectedProvince?.value,
                    regency_id: selectedRegency?.value,
                    district_id: selectedDistrict?.value,
                    village_id: selectedVillage?.value,
                    zip_code: zipCode,
                  });

                  getAllLocations();
                  setShowModal(false);
                  setLocationType("");
                  setName("");
                  setDescription("");
                  setAddress("");
                  setLatitude(undefined);
                  setLongitude(undefined);
                  setSelectedProvince(undefined);
                  setSelectedRegency(undefined);
                  setSelectedDistrict(undefined);
                  setSelectedVillage(undefined);
                  setZipCode("");
                } catch (err: any) {
                  toast.error(`${err}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
export default LocationPage;
