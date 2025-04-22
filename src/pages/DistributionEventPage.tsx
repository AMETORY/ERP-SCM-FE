import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
  TextInput,
} from "flowbite-react";
import { PaginationResponse } from "../objects/pagination";
import {
  createDistributionEvent,
  deleteDistributionEvent,
  getDistributionEvents,
} from "../services/api/logisticApi";
import { getPagination } from "../utils/helper";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { DistributionEventModel } from "../models/distribution_event";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";

interface DistributionEventPageProps {}

const DistributionEventPage: FC<DistributionEventPageProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [distributions, setDistributions] = useState<DistributionEventModel[]>(
    []
  );

  const nav = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllDistributionEvents();
    }

    return () => {};
  }, [mounted]);

  const getAllDistributionEvents = () => {
    getDistributionEvents({ page: page, size: size, search: "" }).then(
      (res: any) => {
        setPagination(getPagination(res.data));
        setDistributions(res.data.items);
      }
    );
  };

  return (
    <AdminLayout>
      <div className="p-8 h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Distribution Event</h1>
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Create new distribution
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table striped>
            <TableHead>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Start Date</TableHeadCell>
              <TableHeadCell>End Date</TableHeadCell>
              <TableHeadCell></TableHeadCell>
            </TableHead>
            <TableBody>
              {distributions.length == 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              )}
              {distributions.map((distribution) => (
                <TableRow key={distribution.id}>
                  <TableCell>{distribution.name}</TableCell>
                  <TableCell>{distribution.description}</TableCell>
                  <TableCell>
                    <Moment format="DD MMM YYYY">
                      {distribution.start_date}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    {distribution.end_date && (
                      <Moment format="DD MMM YYYY">
                        {distribution.end_date}
                      </Moment>
                    )}
                  </TableCell>
                  <TableCell>
                    <a
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      onClick={() => {
                        nav(`/distribution-event/${distribution.id}`);
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
                            `Are you sure you want to delete  ${distribution.name}?`
                          )
                        ) {
                          deleteDistributionEvent(distribution?.id!).then(
                            () => {
                              getAllDistributionEvents()
                            }
                          );
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
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <h2 className="text-2xl font-bold ">Create new distribution</h2>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4 pb-32">
            <div>
              <Label>Name</Label>
              <TextInput
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Datepicker
                placeholder="Start Date"
                value={startDate}
                onChange={setStartDate}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Datepicker
                placeholder="End Date"
                value={endDate}
                onChange={setEndDate}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={7}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full space-x-2">
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  await createDistributionEvent({
                    name,
                    start_date: startDate,
                    end_date: endDate,
                    description,
                  });

                  getAllDistributionEvents();
                } catch (error) {
                  toast.error(`${error}`);
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
export default DistributionEventPage;
