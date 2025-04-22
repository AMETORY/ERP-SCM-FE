import { useContext, useEffect, useRef, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Link, useParams } from "react-router-dom";
import {
  addItemShipment,
  addTrackingEvent,
  arrivedShipmentLeg,
  createShipmentLeg,
  deleteItemShipment,
  getShipment,
  startShipmentLeg,
  updateShipmentStatus,
} from "../services/api/logisticApi";
import { ShipmentLegModel, ShipmentModel } from "../models/shipment";
import Moment from "react-moment";
import { LocationPointModel } from "../models/location_point";
import ModalLocationView from "../components/ModalLocationView";
import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
  TextInput,
} from "flowbite-react";
import Select from "react-select";
import { ProductModel } from "../models/product";
import { getProducts } from "../services/api/productApi";
import { UnitModel } from "../models/unit";
import CurrencyInput from "react-currency-input-field";
import toast from "react-hot-toast";
import { LoadingContext } from "../contexts/LoadingContext";
import { getLocations } from "../services/api/locationApi";
import { TbTruck } from "react-icons/tb";
import {
  calculateZoom,
  generateGoogleMapsDirectionsURLByCoords,
  getDistanceInKm,
  getMidpoint,
  money,
} from "../utils/helper";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { searchLocation } from "../services/api/regionalApi";
import { LocationData } from "../models/place";
import moment from "moment";
import { BsClock } from "react-icons/bs";
import L from "leaflet";

interface ShipmentDetailProps {}

const ShipmentDetail: FC<ShipmentDetailProps> = ({}) => {
  const [places, setPlaces] = useState<LocationData[]>([]);
  const timeout = useRef<number | null>(null);
  const { loading, setLoading } = useContext(LoadingContext);
  const [selectedProduct, setSelectedProduct] = useState<{
    label: string;
    value: string;
    unit?: UnitModel;
  } | null>(null);
  const { shipmentId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [shipment, setShipment] = useState<ShipmentModel>();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [locations, setLocations] = useState<LocationPointModel[]>([]);
  const [transportMode, setTransportMode] = useState("TRUCK");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("IN_DELIVERY");
  const [showModalHops, setShowModalHops] = useState(false);
  const [unit, setUnit] = useState<UnitModel>();
  const [showModalLeg, setShowModalLeg] = useState(false);
  const [selectedLeg, setSelectedLeg] = useState<ShipmentLegModel>();
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showLegDetail, setShowLegDetail] = useState(false);
  const [centerLeg, setCenterLeg] = useState<{ lat: number; lng: number }>();
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [trackingDate, setTrackingDate] = useState<Date | null>(new Date());
  const [trackingNotes, setTrackingNotes] = useState("");
  const [searchName, setSearchName] = useState("");
  const [showArrivedModal, setShowArrivedModal] = useState(false);
  const [arrivedDate, setArrivedDate] = useState<Date | null>(new Date());
  const [arrivedNote, setArrivedNote] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationPointModel>();

  const [fromLocation, setFromLocation] = useState<{
    value: string;
    label: string;
  }>();
  const [toLocation, setToLocation] = useState<{
    value: string;
    label: string;
  }>();

  useEffect(() => {
    if (shipmentId) {
      getDetail();
      getLocations({ page: 1, size: 10, search: "" }).then((res: any) => {
        setLocations(res.data.items);
      });
    }
  }, [shipmentId]);

  const MapCenterUpdater: React.FC<{ center: [number, number] }> = ({
    center,
  }) => {
    const map = useMap();
    map.setView(center);
    map.setZoom(zoom);
    return null;
  };

  const getDetail = () => {
    getShipment(shipmentId).then((response: any) => {
      setShipment(response.data);
      if (selectedLeg) {
        let selected = response.data.shipment_legs.find(
          (e: any) => e.id === selectedLeg.id
        );
        setSelectedLeg(selected);
      }
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 h-[calc(100vh-80px)] overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Shipment Detail </h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <table className="w-full">
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">
                  Delivery Event
                </td>
                <td className="px-2 py-1">
                  <Link
                    to={`/distribution-event/${shipment?.distribution_event_id}`}
                  >
                    {shipment?.distribution_event?.name}
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Shipment Code</td>
                <td className="px-2 py-1">{shipment?.code}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Shipment Date</td>
                <td className="px-2 py-1">
                  <Moment format="DD MMM YYYY">
                    {shipment?.shipment_date}
                  </Moment>{" "}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">
                  Expected Arrival Date
                </td>
                <td className="px-2 py-1">
                  {shipment?.expected_finish_at && (
                    <span>
                      <Moment format="DD MMM YYYY">
                        {shipment?.expected_finish_at}
                      </Moment>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Notes</td>
                <td className="px-2 py-1">{shipment?.notes}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Update Status</td>
                <td className="px-2 py-1">
                  {shipment?.status == "PENDING" && (
                    <Button
                      size="xs"
                      onClick={() => {
                        updateShipmentStatus(shipment?.id, {
                          status: "READY_TO_SHIP",
                        }).then(() => {
                          getDetail();
                        });
                      }}
                    >
                      READY TO SHIP
                    </Button>
                  )}
                  {shipment?.status == "READY_TO_SHIP" && (
                    <Button
                      size="xs"
                      onClick={() => {
                        updateShipmentStatus(shipment?.id, {
                          status: "IN_DELIVERY",
                        }).then(() => {
                          getDetail();
                        });
                      }}
                    >
                      IN DELIVERY
                    </Button>
                  )}
                </td>
              </tr>
            </table>
          </div>
          <div className="border rounded-lg p-4">
            <table className="w-full">
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">From</td>
                <td
                  className="px-2 py-1 cursor-pointer hover:underline"
                  onClick={() => setSelectedLocation(shipment?.from_location)}
                >
                  {shipment?.from_location?.name}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">To</td>
                <td
                  className="px-2 py-1 cursor-pointer hover:underline"
                  onClick={() => setSelectedLocation(shipment?.to_location)}
                >
                  {shipment?.to_location?.name}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Status</td>
                <td className="px-2 py-1 cursor-pointer hover:underline">
                  <div className="flex">
                    <Badge
                      color={
                        shipment?.status === "PENDING"
                          ? "gray"
                          : shipment?.status === "IN_DELIVERY"
                          ? "success"
                          : shipment?.status === "REJECTED"
                          ? "danger"
                          : shipment?.status === "READY_TO_SHIP"
                          ? "blue"
                          : shipment?.status === "SETTLEMENT"
                          ? "indigo"
                          : "gray"
                      }
                    >
                      {shipment?.status}
                    </Badge>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Avg Distance</td>
                <td className="px-2 py-1">
                  {money(
                    getDistanceInKm(
                      {
                        lat: shipment?.from_location?.latitude,
                        lng: shipment?.from_location?.longitude,
                      },
                      {
                        lat: shipment?.to_location?.latitude,
                        lng: shipment?.to_location?.longitude,
                      }
                    )
                  )}{" "}
                  Km
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Active Hop</td>
                <td className="px-2 py-1">
                  {shipment?.current_shipment_leg && (
                    <div>
                      #{shipment?.current_shipment_leg?.seq_number} (
                      {shipment?.current_shipment_leg?.from_location?.name} -{" "}
                      {shipment?.current_shipment_leg?.to_location?.name})
                    </div>
                  )}
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div className="flex justify-between my-4 mt-8">
          <h2 className="text-2xl font-bold ">Shipment Items </h2>
          {shipment?.status == "PENDING" && (
            <Button color="gray" size="sm" onClick={() => setShowModal(true)}>
              + Shipment Items
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Item</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell className="w-16"></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {(shipment?.items ?? []).length == 0 && (
                <Table.Row>
                  <Table.Cell colSpan={3} className="text-center">
                    No items found.
                  </Table.Cell>
                </Table.Row>
              )}
              {(shipment?.items ?? []).map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.item_name}</Table.Cell>
                  <Table.Cell>
                    {item.quantity} {item.unit?.code}
                  </Table.Cell>
                  <Table.Cell>
                    {shipment?.status == "PENDING" && (
                      <a
                        className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            window.confirm(
                              `Are you sure you want to delete  ${item.item_name}?`
                            )
                          ) {
                            deleteItemShipment(shipment?.id!, item.id).then(
                              () => {
                                getDetail();
                              }
                            );
                          }
                        }}
                      >
                        Delete
                      </a>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex justify-between my-4 mt-8">
          <h2 className="text-2xl font-bold ">Shipment Hops </h2>
          <Button
            color="gray"
            size="sm"
            onClick={() => {
              setShowModalHops(true);

              let lastHops = shipment?.shipment_legs?.slice(-1)[0];
              if (lastHops) {
                setFromLocation({
                  value: lastHops?.to_location?.id!,
                  label: lastHops?.to_location?.name!,
                });
              } else {
                setFromLocation({
                  value: shipment?.from_location?.id!,
                  label: shipment?.from_location?.name!,
                });
              }
              setToLocation({
                value: shipment?.to_location?.id!,
                label: shipment?.to_location?.name!,
              });
            }}
          >
            + Hops
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Seq No.</Table.HeadCell>
              <Table.HeadCell>Transport Mode</Table.HeadCell>
              <Table.HeadCell className="w-100">Vehicle Info</Table.HeadCell>
              <Table.HeadCell>From</Table.HeadCell>
              <Table.HeadCell>To</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>

              <Table.HeadCell className="w-16"></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {(shipment?.shipment_legs ?? []).length == 0 && (
                <Table.Row>
                  <Table.Cell colSpan={3} className="text-center">
                    No shipment legs found.
                  </Table.Cell>
                </Table.Row>
              )}
              {(shipment?.shipment_legs ?? []).map((item, index) => {
                const hopeBefore = shipment?.shipment_legs?.[index - 1];

                return (
                  <Table.Row key={item.id}>
                    <Table.Cell>#{item.seq_number}</Table.Cell>
                    <Table.Cell>{item.transport_mode}</Table.Cell>
                    <Table.Cell>
                      {(item.transport_mode == "TRUCK" ||
                        item.transport_mode == "MOTORCYCLE") && (
                        <div>
                          <div>
                            <strong>Driver Name :</strong> {item.driver_name}
                          </div>
                          <div>
                            <strong>Number Plate :</strong> {item.number_plate}
                          </div>
                          <div>
                            <strong>Info :</strong> {item.vehicle_info}
                          </div>
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell
                      className="cursor-pointer hover:underline"
                      onClick={() => setSelectedLocation(item?.from_location)}
                    >
                      {item.from_location?.name}
                    </Table.Cell>
                    <Table.Cell
                      className="cursor-pointer hover:underline"
                      onClick={() => setSelectedLocation(item?.to_location)}
                    >
                      {item.to_location?.name}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex">
                        <Badge
                          color={
                            item?.status === "PENDING"
                              ? "gray"
                              : item?.status === "ARRIVED"
                              ? "success"
                              : item?.status === "REJECTED"
                              ? "danger"
                              : item?.status === "IN_DELIVERY"
                              ? "blue"
                              : item?.status === "SETTLEMENT"
                              ? "indigo"
                              : "gray"
                          }
                        >
                          {item?.status}
                        </Badge>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col items-center">
                        {item.status == "PENDING" &&
                          (!hopeBefore || hopeBefore?.status == "ARRIVED") && (
                            <Button
                              size="xs"
                              color="red"
                              onClick={() => {
                                setSelectedLeg(item);
                                setShowModalLeg(true);
                              }}
                            >
                              <TbTruck className="mr-1 h-3 w-3" />
                              Start
                            </Button>
                          )}

                        <a
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                          onClick={() => {
                            setSelectedLeg(item);
                            setShowLegDetail(true);
                            setZoom(
                              calculateZoom(
                                {
                                  lat: item.from_location.latitude,
                                  lng: item.from_location.longitude,
                                },
                                {
                                  lat: item.to_location.latitude,
                                  lng: item.to_location.longitude,
                                }
                              )
                            );
                            setCenterLeg(
                              getMidpoint(
                                {
                                  lat: item.from_location.latitude,
                                  lng: item.from_location.longitude,
                                },
                                {
                                  lat: item.to_location.latitude,
                                  lng: item.to_location.longitude,
                                }
                              )
                            );
                          }}
                        >
                          View
                        </a>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader>Add Item</ModalHeader>
        <ModalBody>
          <div className="flex flex-col space-y-4 pb-32">
            <div>
              <Label>Goods</Label>
              <Select
                options={products.map((product) => ({
                  label: product.display_name!,
                  value: product.id!,
                  unit: product.default_unit,
                }))}
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e)}
                onInputChange={(e) => {
                  getProducts({ page: 1, size: 10, search: e }).then(
                    (response: any) => {
                      setProducts(response.data.items);
                    }
                  );
                }}
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <div className="relative w-32">
                <CurrencyInput
                  className="rs-input !p-1.5 "
                  value={quantity ?? 0}
                  groupSeparator="."
                  decimalSeparator=","
                  onValueChange={(value, name, values) => {
                    setQuantity(values?.float ?? 0);
                  }}
                />
                <span className="text-gray-500 text-sm absolute top-1.5 right-2">
                  {selectedProduct?.unit?.code}
                </span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-end">
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  await addItemShipment(shipment?.id!, {
                    shipment_id: shipment?.id!,
                    item_name: selectedProduct?.label,
                    quantity,
                    product_id: selectedProduct?.value,
                    unit_id: selectedProduct?.unit?.id,
                  });
                  getDetail();
                  setShowModal(false);
                } catch (error) {
                  toast.error(`Failed to add item: ${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Add Item
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal show={showModalHops} onClose={() => setShowModalHops(false)}>
        <ModalHeader>Add Hops</ModalHeader>
        <ModalBody>
          <div className="flex space-y-4 flex-col pb-32">
            <div className="mb-2 block">
              <Label htmlFor="location" value="Transport Mode" />
              <Select
                options={[
                  { value: "TRUCK", label: "TRUCK" },
                  { value: "AIR", label: "AIR" },
                  { value: "BOAT", label: "BOAT" },
                  { value: "MOTORCYCLE", label: "MOTORCYCLE" },
                ]}
                value={{
                  value: transportMode,
                  label: transportMode,
                }}
                onChange={(val) => setTransportMode(val?.value!)}
              />
            </div>
            {(transportMode == "TRUCK" || transportMode == "MOTORCYCLE") && (
              <>
                <div className="mb-2 block">
                  <Label htmlFor="plate-number" value="Plate Number" />
                  <TextInput
                    id="plate-number"
                    type="text"
                    placeholder="Enter Plate Number"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    className="input-white"
                  />
                </div>
                <div className="mb-2 block">
                  <Label htmlFor="driver-name" value="Driver Name" />
                  <TextInput
                    id="driver-name"
                    type="text"
                    placeholder="Enter Driver Name"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="input-white"
                  />
                </div>
                <div className="mb-2 block">
                  <Label htmlFor="vehicle-type" value="Vehicle Info" />
                  <Textarea
                    value={vehicleInfo}
                    onChange={(e) => setVehicleInfo(e.target.value)}
                    className="input-white"
                    placeholder="Enter Vehicle Info"
                  />
                </div>
              </>
            )}

            <div className="mb-2 block">
              <Label htmlFor="location" value="From Location" />
              <Select
                value={fromLocation}
                onChange={(val) => setFromLocation(val!)}
                options={locations.map((location) => {
                  return {
                    value: location.id,
                    label: location.name,
                  };
                })}
                placeholder="Select Location"
                onInputChange={(val) => {
                  if (val) {
                    getLocations({ page: 1, size: 10, search: val }).then(
                      (res: any) => {
                        setLocations(res.data.items);
                      }
                    );
                  }
                }}
              />
            </div>
            <div className="mb-2 block">
              <Label htmlFor="location" value="To Location" />
              <Select
                value={toLocation}
                onChange={(val) => setToLocation(val!)}
                options={locations.map((location) => {
                  return {
                    value: location.id,
                    label: location.name,
                  };
                })}
                placeholder="Select Location"
                onInputChange={(val) => {
                  if (val) {
                    getLocations({ page: 1, size: 10, search: val }).then(
                      (res: any) => {
                        setLocations(res.data.items);
                      }
                    );
                  }
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full justify-end">
            <Button
              onClick={async () => {
                try {
                  if (!fromLocation || !toLocation) {
                    toast.error("Please select both From and To locations.");
                    return;
                  }

                  setLoading(true);
                  await createShipmentLeg({
                    shipment_id: shipment?.id!,
                    transport_mode: transportMode,
                    number_plate: plateNumber,
                    driver_name: driverName,
                    vehicle_info: vehicleInfo,
                    from_location_id: fromLocation?.value,
                    to_location_id: toLocation?.value,
                  });
                  getDetail();
                  setShowModalHops(false);
                  setFromLocation(undefined);
                  setToLocation(undefined);
                  setTransportMode("TRUCK");
                  setPlateNumber("");
                  setDriverName("");
                  setVehicleInfo("");
                } catch (error) {
                  toast.error(`Failed to add item: ${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Add Hops
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal show={showModalLeg} onClose={() => setShowModalLeg(false)}>
        <ModalHeader>Start Leg</ModalHeader>
        <ModalBody>
          <div className="flex flex-col space-y-4 pb-32">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div>
                  <Label>Seq Number</Label>
                  <div>#{selectedLeg?.seq_number}</div>
                </div>
                <div>
                  <Label>From</Label>
                  <div>{selectedLeg?.from_location?.name}</div>
                </div>
                <div>
                  <Label>To</Label>
                  <div>{selectedLeg?.to_location?.name}</div>
                </div>
              </div>
              <div>
                <div>
                  <Label>Transport Mode</Label>
                  <div>{selectedLeg?.transport_mode}</div>
                </div>
                <div>
                  <Label>Number Plate</Label>
                  <div>{selectedLeg?.number_plate}</div>
                </div>
                <div>
                  <Label>Driver Name</Label>
                  <div>{selectedLeg?.driver_name}</div>
                </div>
                <div>
                  <Label>Vehicle Info</Label>
                  <div>{selectedLeg?.vehicle_info}</div>
                </div>
              </div>
            </div>

            <div>
              <Label>Direction</Label>
              <div
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() =>
                  window.open(
                    generateGoogleMapsDirectionsURLByCoords(
                      {
                        lat: selectedLeg?.from_location?.latitude,
                        lng: selectedLeg?.from_location?.longitude,
                      },
                      {
                        lat: selectedLeg?.to_location?.latitude,
                        lng: selectedLeg?.to_location?.longitude,
                      }
                    )
                  )
                }
              >
                {generateGoogleMapsDirectionsURLByCoords(
                  {
                    lat: selectedLeg?.from_location?.latitude,
                    lng: selectedLeg?.from_location?.longitude,
                  },
                  {
                    lat: selectedLeg?.to_location?.latitude,
                    lng: selectedLeg?.to_location?.longitude,
                  }
                )}
              </div>
            </div>

            <div>
              <Label>Date</Label>
              <Datepicker
                value={date}
                onChange={(val) => {
                  if (val) {
                    setDate(val);
                  }
                }}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(val) => {
                  if (val) {
                    setNotes(val.target.value);
                  }
                }}
                placeholder="Notes"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-end">
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  await startShipmentLeg(selectedLeg!.id!, {
                    date: date,
                    notes: notes,
                  });
                  getDetail();
                  setShowModalLeg(false);
                } catch (error) {
                } finally {
                  setLoading(false);
                }
              }}
            >
              Start
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        size="4xl"
        show={showLegDetail}
        onClose={() => setShowLegDetail(false)}
      >
        <ModalHeader>
          Shipment Hops #{selectedLeg?.seq_number} (
          {selectedLeg?.from_location?.name} - {selectedLeg?.to_location?.name})
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col space-y-4">
            <Link
              className="text-blue-500 cursor-pointer hover:underline"
              target="_blank"
              to={generateGoogleMapsDirectionsURLByCoords(
                {
                  lat: selectedLeg?.from_location?.latitude,
                  lng: selectedLeg?.from_location?.longitude,
                },
                {
                  lat: selectedLeg?.to_location?.latitude,
                  lng: selectedLeg?.to_location?.longitude,
                }
              )}
            >
              {generateGoogleMapsDirectionsURLByCoords(
                {
                  lat: selectedLeg?.from_location?.latitude,
                  lng: selectedLeg?.from_location?.longitude,
                },
                {
                  lat: selectedLeg?.to_location?.latitude,
                  lng: selectedLeg?.to_location?.longitude,
                }
              )}
            </Link>
            <MapContainer
              center={[centerLeg?.lat!, centerLeg?.lng!]}
              zoom={zoom}
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
              <Marker
                position={[
                  selectedLeg?.from_location?.latitude!,
                  selectedLeg?.from_location?.longitude!,
                ]}
              >
                <Popup>{selectedLeg?.from_location?.name}</Popup>
              </Marker>
              <Marker
                position={[
                  selectedLeg?.to_location?.latitude!,
                  selectedLeg?.to_location?.longitude!,
                ]}
              >
                <Popup>{selectedLeg?.to_location?.name}</Popup>
              </Marker>
              {(selectedLeg?.tracking_events ?? []).map((event, index) => (
                <Marker
                  position={[event?.latitude!, event?.longitude!]}
                  icon={TruckPointerIcon}
                >
                  <Popup>
                    <strong>
                      #{event?.seq_number} {event?.location_name}
                    </strong>
                    <br /> {event?.notes}
                  </Popup>
                </Marker>
              ))}
              <MapCenterUpdater center={[centerLeg?.lat!, centerLeg?.lng!]} />
            </MapContainer>
            {selectedLeg?.status == "IN_DELIVERY" && (
              <div>
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold text-xl">Tracking</h3>
                  <Button
                    size="xs"
                    color="gray"
                    onClick={() => {
                      setShowTrackingModal(true);
                    }}
                  >
                    + Track
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table hoverable>
                    <TableHead>
                      <TableHeadCell>Seq No.</TableHeadCell>
                      <TableHeadCell>Location</TableHeadCell>
                      <TableHeadCell>Timestamp</TableHeadCell>
                      <TableHeadCell>Coordinate</TableHeadCell>
                      <TableHeadCell>Status</TableHeadCell>
                    </TableHead>
                    <TableBody>
                      {(selectedLeg?.tracking_events ?? []).length == 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No data
                          </TableCell>
                        </TableRow>
                      )}
                      {(selectedLeg?.tracking_events ?? []).map(
                        (event, index) => (
                          <TableRow key={index}>
                            <TableCell>{event.seq_number}</TableCell>
                            <TableCell>{event.location_name}</TableCell>
                            <TableCell>
                              <Moment format="DD/MM/YYYY HH:mm">
                                {event.timestamp}
                              </Moment>
                            </TableCell>
                            <TableCell
                              className="cursor-pointer"
                              onClick={() =>
                                setCenterLeg({
                                  lat: event.latitude,
                                  lng: event.longitude,
                                })
                              }
                            >
                              {event.latitude},{event.longitude}
                            </TableCell>
                            <TableCell>{event.status}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full justify-end">
            {selectedLeg?.status == "IN_DELIVERY" &&
              (selectedLeg?.tracking_events ?? []).length > 0 && (
                <Button onClick={() => setShowArrivedModal(true)}>
                  Arrived
                </Button>
              )}
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        show={showTrackingModal}
        onClose={() => setShowTrackingModal(false)}
      >
        <ModalHeader>Tracking</ModalHeader>
        <ModalBody>
          <div className="flex flex-col space-y-4 pb-32">
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
                        setPlaces([]);
                        setSearchName(p.displayName?.text);
                      }}
                    >
                      <h3 className="font-semibold">{p.displayName?.text}</h3>
                      <address>{p.formattedAddress}</address>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <Select
                options={[
                  { value: "IN_DELIVERY", label: "IN DELIVERY" },
                  { value: "IN_TRANSIT", label: "IN TRANSIT" },
                  { value: "ARRIVED", label: "ARRIVED" },
                ]}
                value={{
                  value: trackingStatus,
                  label: trackingStatus.replaceAll("_", " "),
                }}
                onChange={(option) => setTrackingStatus(option!.value!)}
              />
            </div>
            <div>
              <Label>Date</Label>
              <div className="grid grid-cols-2 gap-4">
                <Datepicker value={trackingDate} onChange={setTrackingDate} />
                <div className="flex">
                  <input
                    type="time"
                    id="time"
                    className="rounded-none rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={moment(trackingDate).format("HH:mm")}
                    onChange={(e) => {
                      setTrackingDate(
                        moment(
                          moment(trackingDate).format("YYYY-MM-DD") +
                            " " +
                            e.target.value
                        ).toDate()
                      );
                    }}
                  />
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-s-0 border-s-0 border-gray-300 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={trackingNotes}
                onChange={(val) => setTrackingNotes(val.target.value)}
                placeholder="Tracking Notes"
                rows={5}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-end">
            <Button
              onClick={async () => {
                try {
                  if (latitude === 0 || longitude === 0) {
                    toast.error("Latitude and Longitude are required");
                    return;
                  }

                  setLoading(true);
                  await addTrackingEvent(selectedLeg!.id!, {
                    shipment_leg_id: selectedLeg!.id!,
                    status: trackingStatus,
                    location_name: searchName,
                    latitude: latitude,
                    longitude: longitude,
                    timestamp: trackingDate,
                    notes: trackingNotes,
                  });
                  getDetail();
                  setShowTrackingModal(false);
                  setSearchName("");
                  setLatitude(0);
                  setLongitude(0);
                  setTrackingDate(new Date());
                  setTrackingNotes("");
                  setPlaces([]);
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Add Tracking
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal show={showArrivedModal} onClose={() => setShowArrivedModal(false)}>
        <ModalHeader>Arrived Confirmation</ModalHeader>
        <ModalBody>
          <div className="flex flex-col space-y-4">
            <div>Are you sure you want to mark this shipment as arrived?</div>
            <div>
              <Label>Date</Label>
              <div className="grid grid-cols-2 gap-4">
                <Datepicker value={arrivedDate} onChange={setArrivedDate} />
                <div className="flex">
                  <input
                    type="time"
                    id="time"
                    className="rounded-none rounded-s-lg bg-gray-50 border text-gray-900 leading-none focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={moment(arrivedDate).format("HH:mm")}
                    onChange={(e) => {
                      setArrivedDate(
                        moment(
                          moment(arrivedDate).format("YYYY-MM-DD") +
                            " " +
                            e.target.value
                        ).toDate()
                      );
                    }}
                  />
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-s-0 border-s-0 border-gray-300 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={arrivedNote}
                onChange={(val) => setArrivedNote(val.target.value)}
                rows={5}
                placeholder="Arrived Notes"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-end">
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  await arrivedShipmentLeg(selectedLeg!.id, {
                    date: arrivedDate,
                    notes: arrivedNote,
                  });
                  setShowArrivedModal(false);
                  setShowLegDetail(false);
                  setShowTrackingModal(false);
                  getDetail();
                  setArrivedDate(new Date());
                  setArrivedNote("");
                  toast.success("Arrived successfully");
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save Arrived
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      {selectedLocation && (
        <ModalLocationView
          show={selectedLocation != undefined}
          setShow={() => setSelectedLocation(undefined)}
          location={selectedLocation}
        />
      )}
    </AdminLayout>
  );
};
export default ShipmentDetail;

const PointerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

const TruckPointerIcon = L.icon({
  iconUrl: "/icon/truck.png",
  iconSize: [25, 25],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});

L.Marker.prototype.options.icon = PointerIcon;
