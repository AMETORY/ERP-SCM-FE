import { useContext, useEffect, useState, type FC } from "react";
import { Toaster } from "react-hot-toast";
import { RiFolderForbidLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CollapsedContext } from "../../contexts/CollapsedContext";
import {
  ActiveCompanyContext,
  CompaniesContext,
  CompanyIDContext,
} from "../../contexts/CompanyContext";
import { LoadingContext } from "../../contexts/LoadingContext";
import { MemberContext, ProfileContext } from "../../contexts/ProfileContext";
import { WebsocketContext } from "../../contexts/WebsocketContext";
import { getProfile } from "../../services/api/authApi";
import { getSetting } from "../../services/api/commonApi";
import { asyncStorage } from "../../utils/async_storage";
import {
  LOCAL_STORAGE_COMPANY_ID,
  LOCAL_STORAGE_TOKEN,
} from "../../utils/constants";
import Loading from "../Loading";
import Sidebar from "../sidebar";
import Topnav from "../topnav";

interface AdminLayoutProps {
  children: React.ReactNode;
  isCooperative?: boolean;
  permission?: string;
}

const AdminLayout: FC<AdminLayoutProps> = ({
  children,
  isCooperative,
  permission,
}) => {
  const { activeCompany, setActiveCompany } = useContext(ActiveCompanyContext);
  const { profile, setProfile } = useContext(ProfileContext);
  const { member, setMember } = useContext(MemberContext);
  const { pathname } = useLocation();
  const { isWsConnected, setWsConnected, wsMsg, setWsMsg } =
    useContext(WebsocketContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [socketUrl, setSocketUrl] = useState(``);
  const { collapsed, setCollapsed } = useContext(CollapsedContext);
  const { companyID, setCompanyID } = useContext(CompanyIDContext);
  const { companies, setCompanies } = useContext(CompaniesContext);
  const [token, setToken] = useState("");
  const nav = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { sendMessage, sendJsonMessage, lastMessage, readyState } =
    useWebSocket(socketUrl, {
      onMessage(event) {
        // console.log("Received message:", event.data);
        setWsMsg(JSON.parse(event.data));
      },
      onOpen() {
        console.log("Connected to the web socket");
        setWsConnected(true);
      },
      onClose() {
        console.log("Disconnected from the web socket");
        setWsConnected(false);
      },
      queryParams: {
        token: token,
      },
    });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    getProfile().then((res: any) => {
      setProfile(res.user);
      setCompanies(res.user.companies);
      setMember(res.member);
    });
    getSetting()
      .then((val: any) => setActiveCompany(val.data))
      .catch((err) => {});
    asyncStorage.getItem(LOCAL_STORAGE_TOKEN).then((token) => {
      setToken(token);
      asyncStorage.getItem(LOCAL_STORAGE_COMPANY_ID).then((id) => {
        if (!id) return;
        let url = `${process.env.REACT_APP_BASE_WS_URL}/api/v1/ws/${id}`;
        setSocketUrl(url);
      });
    });
  }, [mounted]);

  const checkPermission = () => {
   
    if (!permission) return true;
    if (profile?.role?.permission_names) {
      return profile?.role.permission_names.includes(permission);
    }
    return false;
  };

  return (
    <div className="w-screen h-screen  flex flex-col">
      {loading && <Loading />}
      <Toaster position="bottom-left" reverseOrder={false} />
      <Topnav />
      <div className="flex flex-row flex-1">
        <aside
          style={{
            width: collapsed ? 65 : 300,
            top: 65,
            height: "calc(100% - 65px)",
          }}
          className=" bg-red-50 h-full fixed left-0 "
        >
          <Sidebar />
        </aside>

        <div
          style={{
            width: collapsed ? "calc(100% - 65px)" : "calc(100% - 300px)",
            height: "calc(100% - 65px)",
            left: collapsed ? 65 : 300,
            top: 65,
          }}
          className=" fixed  "
        >
          {checkPermission() ? (
            children
          ) : (
            <div className="flex flex-col space-y-4 items-center justify-center h-full   w-full">
              {/* {JSON.stringify(profile?.roles![0].permission_names)} */}
              <RiFolderForbidLine className="w-12 h-12 text-gray-600" />
              <span>You don't have permission to access this page</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
