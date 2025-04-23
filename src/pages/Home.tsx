import { Button, Card, Dropdown, Tabs } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import { asyncStorage } from "../utils/async_storage";
import {
  LOCAL_STORAGE_TOKEN,
  THIS_MONTH,
  THIS_WEEK,
  TIMERANGE_OPTIONS,
} from "../utils/constants";
import AdminLayout from "../components/layouts/admin";
import {
  getCashBankSum,
  getMonthlyPurchase,
  getMonthlySales,
  getMonthlySalesPurchase,
  getNetWorth,
  getPopularProducts,
  getPurchaseTimeRange,
  getSalesPurchaseList,
  getSalesTimeRange,
  getWeeklySalesPurchase,
} from "../services/api/analyticApi";
import moment from "moment";
import Chart from "react-google-charts";
import SalesPurchaseChart from "../components/analytic/SalesPurchaseChart";
import ProductPopular from "../components/analytic/ProductPopular";
import ProductPopularChart from "../components/analytic/ProductPopular";
import { money } from "../utils/helper";
import { ProfitLossModel } from "../models/report";
import { TbFileInvoice } from "react-icons/tb";
import { BsCartCheck } from "react-icons/bs";
import { SalesPurchase } from "../models/misc";
import { useNavigate } from "react-router-dom";

interface HomeProps {}

const Home: FC<HomeProps> = ({}) => {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month());
  const [timeRange, setTimeRange] = useState(THIS_MONTH);
  const [salesAmount, setSalesAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [netWorth, setNetWorth] = useState<ProfitLossModel>();
  const [cashBank, setCashBank] = useState(0);
  const [sales, setSales] = useState<SalesPurchase[]>([]);
  const [purchases, setPurchases] = useState<SalesPurchase[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // getSalesTimeRange(timeRange).then((resp: any) => {
      //   setSalesAmount(resp.data);
      // });
      // getPurchaseTimeRange(timeRange).then((resp: any) => {
      //   setPurchaseAmount(resp.data);
      // });
      // getNetWorth().then((resp: any) => {
      //   setNetWorth(resp.data);
      // });
      // getCashBankSum().then((resp: any) => {
      //   setCashBank(resp.data);
      // });
      // getSalesPurchaseList().then((resp: any) => {
      //   setSales(resp.data.sales);
      //   setPurchases(resp.data.purchase);
      // });
    }
  }, [mounted, timeRange]);

  type ChartData = [string, ...any[]][];

  const shipmentData: ChartData = [
    ["Bulan", "Jumlah Pengiriman"],
    ["Jan", 120],
    ["Feb", 150],
    ["Mar", 170],
    ["Apr", 130],
    ["Mei", 190],
  ];

  const incidentData: ChartData = [
    ["Status", "Jumlah"],
    ["Normal", 95],
    ["Hilang", 3],
    ["Rusak", 2],
  ];

  const shipmentByRegionData: ChartData = [
    ["Wilayah", "Jumlah Pengiriman"],
    ["Jakarta", 70],
    ["Jawa Barat", 50],
    ["Jawa Tengah", 40],
    ["Jawa Timur", 60],
  ];

  const feedbackRatingData: ChartData = [
    ["Rating", "Jumlah"],
    ["5", 60],
    ["4", 25],
    ["3", 10],
    ["2", 3],
    ["1", 2],
  ];

  const warehouseUtilizationData: ChartData = [
    ["Gudang", "Kapasitas Digunakan (%)"],
    ["Gudang A", 80],
    ["Gudang B", 65],
    ["Gudang C", 90],
  ];

  const activeShipments = [
    {
      id: "SHP001",
      tujuan: "Bandung",
      status: "Dalam Pengiriman",
      tanggal: "2025-04-21",
    },
    {
      id: "SHP002",
      tujuan: "Surabaya",
      status: "Transit di Gudang B",
      tanggal: "2025-04-20",
    },
    {
      id: "SHP003",
      tujuan: "Medan",
      status: "Dalam Pengiriman",
      tanggal: "2025-04-22",
    },
  ];
  return (
    <AdminLayout>
      <div className="h-[calc(100vh-80px)] overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 px-4 pt-4">
          <Card>
            <p className="text-lg font-semibold">
              Total Shipment Bulan Ini
            </p>
            <p className="text-2xl font-semibold text-right">190</p>
          </Card>
          <Card>
            <p className="text-lg font-semibold">
              🗺️ Jumlah Lokasi Tujuan
            </p>
            <p className="text-2xl font-semibold text-right">4</p>
          </Card>
          <Card>
            <p className="text-lg font-semibold">
              🔄 Rata-rata Hari Pengiriman
            </p>
            <p className="text-2xl font-semibold text-right">2.3 Hari</p>
          </Card>
          <Card>
            <p className="text-lg font-semibold">
              💥 Insiden Bulan Ini
            </p>
            <p className="text-2xl font-semibold text-right">5</p>
          </Card>
          <Card>
            <p className="text-lg font-semibold">
              🌟 Rata-rata Feedback
            </p>
            <p className="text-2xl font-semibold text-right">4.5</p>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          <Card className="col-span-2">
            <h2 className="text-xl font-semibold mb-2">
              Jumlah Pengiriman / Bulan
            </h2>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={shipmentData}
              options={{
                colors: ["#4f46e5"],
                legend: { position: "none" },
                hAxis: { title: "Bulan" },
                vAxis: { title: "Jumlah Pengiriman" },
              }}
            />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-2">Insiden Distribusi</h2>
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={incidentData}
              options={{
                colors: ["#10b981", "#ef4444", "#f59e0b"],
                pieHole: 0.4,
                legend: { position: "bottom" },
              }}
            />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-2">
              Pengiriman per Wilayah
            </h2>
            <Chart
              chartType="BarChart"
              width="100%"
              height="300px"
              data={shipmentByRegionData}
              options={{
                colors: ["#6366f1"],
                hAxis: { title: "Jumlah Pengiriman" },
              }}
            />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-2">
              Rating Feedback Pengiriman
            </h2>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={feedbackRatingData}
              options={{
                colors: ["#facc15"],
                legend: { position: "none" },
                hAxis: { title: "Rating" },
                vAxis: { title: "Jumlah" },
              }}
            />
          </Card>

          {/* <Card>
          <h2 className="text-xl font-semibold mb-2">Utilisasi Gudang</h2>
          <Chart
            chartType="BarChart"
            width="100%"
            height="300px"
            data={warehouseUtilizationData}
            options={{
              colors: ["#0ea5e9"],
              hAxis: { title: "Kapasitas (%)" },
            }}
          />
        </Card> */}
          <Card className="">
            <div className="justify-start items-start flex flex-col h-full w-full">
              <h2 className="text-xl font-semibold mb-2">Pengiriman Aktif</h2>
              <ul className=" w-full">
                {activeShipments.map((shipment) => (
                  <li
                    key={shipment.id}
                    className="flex justify-between items-center border-b last:border-b-0 m-0 p-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">
                        {shipment.id} - {shipment.tujuan}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {shipment.status}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {shipment.tanggal}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
export default Home;
