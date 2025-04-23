import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { ShipmentModel } from "../models/shipment";
import { useNavigate } from "react-router-dom";
import { deleteShipment, getShipments } from "../services/api/logisticApi";
import { getPagination } from "../utils/helper";
import {
  Badge,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Moment from "react-moment";
import { LocationPointModel } from "../models/location_point";
import ModalLocationView from "../components/ModalLocationView";

interface ShipmentPageProps {}

const ShipmentPage: FC<ShipmentPageProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const [showModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [shipments, setShipments] = useState<ShipmentModel[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationPointModel>();

  const nav = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllShipments();
    }

    return () => {};
  }, [mounted]);

  const getAllShipments = () => {
    getShipments({ page: page, size: size, search: "" }).then((res: any) => {
      setPagination(getPagination(res.data));
      setShipments(res.data.items);
    });
  };
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold ">Shipment Management</h1>
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
              {(shipments ?? []).length == 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
              {(shipments ?? []).map((shipment) => (
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
                    onClick={() => setSelectedLocation(shipment.from_location)}
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
                        {shipment?.status?.replaceAll("_", " ")}
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
                            getAllShipments();
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
        <Pagination
          className="mt-4"
          currentPage={page}
          totalPages={pagination?.total_pages ?? 0}
          onPageChange={(val) => {
            setPage(val);
          }}
          showIcons
        />
      </div>
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
export default ShipmentPage;
