import { Button, Dropdown, Tabs } from "flowbite-react";
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
      getSalesTimeRange(timeRange).then((resp: any) => {
        setSalesAmount(resp.data);
      });
      getPurchaseTimeRange(timeRange).then((resp: any) => {
        setPurchaseAmount(resp.data);
      });
      getNetWorth().then((resp: any) => {
        setNetWorth(resp.data);
      });
      getCashBankSum().then((resp: any) => {
        setCashBank(resp.data);
      });
      getSalesPurchaseList().then((resp: any) => {
        setSales(resp.data.sales);
        setPurchases(resp.data.purchase);
      });
    }
  }, [mounted, timeRange]);
  return (
    <AdminLayout>
      <div className=" bg-gray-50 h-[calc(100vh-60px)] overflow-y-auto">
      
      </div>
    </AdminLayout>
  );
};
export default Home;
