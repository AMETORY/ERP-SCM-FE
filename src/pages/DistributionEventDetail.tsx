import { useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useParams } from "react-router-dom";
import { getDistributionEventDetail } from "../services/api/logisticApi";
import { DistributionEventModel } from "../models/distribution_event";
import Moment from "react-moment";
import { Button } from "flowbite-react";

interface DistributionEventDetailProps {}

const DistributionEventDetail: FC<DistributionEventDetailProps> = ({}) => {
  const { distributionId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DistributionEventModel>();

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
    getDistributionEventDetail(distributionId!).then((res: any) => {
      setData(res.data);
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
          <div className="border rounded-lg p-4"></div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Shipments</h1>
            <Button color="gray" size="sm">
              + Shipment
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default DistributionEventDetail;
