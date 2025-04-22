import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useNavigate, useParams } from "react-router-dom";
import {
  createShipment,
  deleteDistributionEvent,
  deleteShipment,
  getDistributionEventDetail,
  reportDistributionEvent,
} from "../services/api/logisticApi";
import {
  DistributionEventModel,
  DistributionEventReport,
} from "../models/distribution_event";
import Moment from "react-moment";
import {
  Badge,
  Button,
  Datepicker,
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
import { LocationPointModel } from "../models/location_point";
import { getLocation, getLocations } from "../services/api/locationApi";
import Select from "react-select";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import ModalLocationView from "../components/ModalLocationView";

interface DistributionEventDetailProps {}

const DistributionEventDetail: FC<DistributionEventDetailProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const nav = useNavigate();
  const { distributionId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DistributionEventModel>();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date());
  const [expectedAt, setExpectedAt] = useState<Date | null>(null);
  const [locations, setLocations] = useState<LocationPointModel[]>([]);
  const [distributionReport, setDistributionReport] =
    useState<DistributionEventReport>();
  const [notes, setNotes] = useState("");
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
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted) {
      getDetail();
      getLocations({ page: 1, size: 10, search: "" }).then((res: any) => {
        setLocations(res.data.items);
      });
    }
  }, [mounted]);

  const getReport = (id: string) => {
    setLoading(true);
    reportDistributionEvent(id)
      .then((res: any) => {
        setDistributionReport(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDetail = () => {
    getDistributionEventDetail(distributionId!).then((res: any) => {
      setData(res.data);
      getReport(res.data.id);
    });
  };
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Distribution Event Detail</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <table className="w-full">
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Event Name</td>
                <td className="px-2 py-1">{data?.name}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Date</td>
                <td className="px-2 py-1">
                  <Moment format="DD MMM YYYY">{data?.start_date}</Moment>{" "}
                  {data?.end_date && (
                    <span>
                      {" "}
                      s/d <Moment format="DD MMM YYYY">{data?.end_date}</Moment>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Description</td>
                <td className="px-2 py-1">{data?.description}</td>
              </tr>
            </table>
          </div>
          <div className="border rounded-lg p-4">
            <table className="w-full">
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Report</td>
                <td className="px-2 py-1 text-right" >
                  <div className="flex justify-end">
                  <Button
                    color="gray"
                    size="xs"
                    onClick={() => {
                      getReport(distributionId!);
                    }}
                  >
                    Refresh
                  </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">
                  Total Shipments
                </td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.total_shipments}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">
                  Total Destinations
                </td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.total_destinations}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Total Items</td>
                <td className="px-4 py-1 text-right">{distributionReport?.total_items}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Lost Items</td>
                <td className="px-4 py-1 text-right">{distributionReport?.lost_items}</td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Damaged Items</td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.damaged_items}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">
                  Delayed Shipments
                </td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.delayed_shipments}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">
                  Finished Shipments
                </td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.finished_shipments}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">
                  Processing Shipments
                </td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.processing_shipments}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Ready to Ship</td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.ready_to_ship}
                </td>
              </tr>
              <tr>
                <td className="w-1/2 font-semibold px-2 py-1">Feedback</td>
                <td className="px-4 py-1 text-right">
                  {distributionReport?.feedback_count}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Shipments</h1>
            <Button color="gray" size="sm" onClick={() => setShowModal(true)}>
              + Shipment
            </Button>
          </div>
          <div className="overflow-x-auto mt-4">
            <Table striped>
              <TableHead>
                <TableHeadCell>Shipment ID</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Expected Arrival Date</TableHeadCell>
                <TableHeadCell>From Location</TableHeadCell>
                <TableHeadCell>To Location</TableHeadCell>
                <TableHeadCell>Notes</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell></TableHeadCell>
              </TableHead>
              <TableBody>
                {(data?.shipments ?? []).length == 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No Data
                    </TableCell>
                  </TableRow>
                )}
                {(data?.shipments ?? []).map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>{shipment.code}</TableCell>
                    <TableCell>
                      <Moment format="DD MMM YYYY">
                        {shipment.shipment_date}
                      </Moment>
                    </TableCell>
                    <TableCell>
                      <Moment format="DD MMM YYYY">
                        {shipment.expected_finish_at}
                      </Moment>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer hover:underline"
                      onClick={() =>
                        setSelectedLocation(shipment.from_location)
                      }
                    >
                      {shipment.from_location?.name}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer hover:underline"
                      onClick={() => setSelectedLocation(shipment.to_location)}
                    >
                      {shipment.to_location?.name}
                    </TableCell>
                    <TableCell>{shipment.notes}</TableCell>
                    <TableCell>
                      <div className="w-fit">
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
                    </TableCell>
                    <TableCell>
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                        onClick={() => {
                          nav(`/shipment/${shipment.id}`);
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
                              `Are you sure you want to delete  ${shipment.code}?`
                            )
                          ) {
                            deleteShipment(shipment?.id!).then(() => {
                              getDetail();
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
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create Shipment</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4 pb-32">
            <div className="mb-2 block">
              <Label htmlFor="date" value="Date" />
              <Datepicker value={date} onChange={setDate} />
            </div>
            <div className="mb-2 block">
              <Label htmlFor="date" value="Expected Arrival Date" />
              <Datepicker
                value={expectedAt}
                onChange={setExpectedAt}
                placeholder="Expected Arrival Date"
              />
            </div>
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
            <div className="mb-2 block">
              <Label htmlFor="location" value="Notes" />
              <Textarea
                rows={7}
                placeholder="Notes"
                id="notes"
                value={notes}
                onChange={(val) => setNotes(val.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              onClick={async () => {
                try {
                  if (!fromLocation || !toLocation) {
                    toast.error("Please select from and to location");
                    return;
                  }

                  setLoading(true);
                  const res: any = await createShipment({
                    code: `SHIPMENT-${String(
                      Math.floor(Math.random() * 100000)
                    ).padStart(5, "0")}/${(new Date().getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}/${new Date().getFullYear()}`,
                    shipment_date: date,
                    expected_finish_at: expectedAt,
                    notes,
                    from_location_id: fromLocation?.value,
                    to_location_id: toLocation?.value,
                    distribution_event_id: distributionId!,
                  });
                  nav(`/shipment/${res.data.id}`);
                  getDetail();
                } catch (error) {
                  console.error(error);
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
export default DistributionEventDetail;
