import { HR, Tooltip } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { LuMapPin, LuPin, LuPowerOff, LuWarehouse } from "react-icons/lu";
import { RiShoppingBagLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { CollapsedContext } from "../contexts/CollapsedContext";
import { ActiveCompanyContext } from "../contexts/CompanyContext";
import { MemberContext, ProfileContext } from "../contexts/ProfileContext";
import { asyncStorage } from "../utils/async_storage";
import {
  LOCAL_STORAGE_COMPANIES,
  LOCAL_STORAGE_COMPANY_ID,
  LOCAL_STORAGE_TOKEN,
} from "../utils/constants";
import Logo from "./logo";
import { BsTruck } from "react-icons/bs";

interface SidebarProps {}

const Sidebar: FC<SidebarProps> = ({}) => {
  const { member } = useContext(MemberContext);
  const { profile } = useContext(ProfileContext);
  const { collapsed } = useContext(CollapsedContext);
  const [mounted, setMounted] = useState(false);
  const [inboxUnreadCount, setInboxUnreadCount] = useState(0);
  const [sentUnreadCount, setSentUnreadCount] = useState(0);
  const [indexUnreadChat, setIndexUnreadChat] = useState(0);
  const [waUnreadChat, setWaUnreadChat] = useState(0);
  const { activeCompany } = useContext(ActiveCompanyContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nav = useNavigate();

  useEffect(() => {
    if (mounted) {
      // getInboxMessagesCount()
      //   .then((resp: any) => setInboxUnreadCount(resp.data))
      //   .catch(console.error);
      // getSentMessagesCount()
      //   .then((resp: any) => setSentUnreadCount(resp.data))
      //   .catch(console.error);
    }
  }, [mounted]);

  const handleNavigation =
    (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      nav(path);
    };

  const checkPermission = (permission: string) => {
    if (profile?.role?.permission_names) {
      return profile?.role?.permission_names.includes(permission);
    }
    return false;
  };
  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col border-r">
      <Logo collapsed={collapsed} />
      <div className="mb-4"></div>
      <ul className="space-y-2 font-medium flex-1 h-[calc(100vh-100px)] overflow-y-auto">
        <>
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/")}
            >
              <Tooltip content="Dashboard">
                <AiOutlineDashboard />
              </Tooltip>
              {!collapsed && <span className="ms-3">Dashboard</span>}
            </span>
          </li>
        </>
        <>
          <HR />
          <li
            className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
            style={{
              width: collapsed ? 50 : "fit-content",
            }}
          >
            Feature
          </li>
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/distribution-event")}
            >
              <Tooltip content="Distribution Event">
                <BsTruck />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Distribution Event
                </span>
              )}
            </span>
          </li>
        </>

        <>
          <HR />
          <li
            className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
            style={{
              width: collapsed ? 50 : "fit-content",
            }}
          >
            Inventory
          </li>
        </>
        <li className=" cursor-pointer" style={{}}>
          <span
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
            onClick={handleNavigation("/goods")}
          >
            <Tooltip content="Goods">
              <RiShoppingBagLine />
            </Tooltip>
            {!collapsed && (
              <span className="flex-1 ms-3 whitespace-nowrap">Goods</span>
            )}
          </span>
        </li>
        {checkPermission("inventory:warehouse:read") && (
          <li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/storage")}
            >
              <Tooltip content="storage">
                <LuWarehouse />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Storage</span>
              )}
            </span>
          </li>
        )}

<li className=" cursor-pointer" style={{}}>
            <span
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              onClick={handleNavigation("/location")}
            >
              <Tooltip content="Location">
                <LuMapPin />
              </Tooltip>
              {!collapsed && (
                <span className="flex-1 ms-3 whitespace-nowrap">Location</span>
              )}
            </span>
          </li>

        {/* {activeCompany?.is_cooperation && (
          <>
            <HR />
            <li
              className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
              style={{
                width: collapsed ? 50 : "fit-content",
              }}
            >
              Cooperative{" "}
            </li>
            {member && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/activities")}
                >
                  <Tooltip content=" My Activities">
                    <BsActivity />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      My Activities
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:cooperative_member:invite") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/member")}
                >
                  <Tooltip content="Member">
                    <BsPeople />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Member
                    </span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("cooperative:loan_application:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/loan")}
                >
                  <Tooltip content="Loan ">
                    <BsBank />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">Loan</span>
                  )}
                </span>
              </li>
            )}

            {checkPermission("cooperative:saving:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/saving")}
                >
                  <Tooltip content="Saving">
                    <MdOutlineSavings />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Saving
                    </span>
                  )}
                </span>
              </li>
            )}

            {checkPermission("cooperative:net_surplus:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/cooperative/net-surplus")}
                >
                  <Tooltip content="Net Surplus">
                    <HiOutlineChartPie />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Net Surplus
                    </span>
                  )}
                </span>
              </li>
            )}
          </>
        )}
        {checkPermission("menu:admin:preferences") && (
          <>
            <HR />

            <li
              className="text-xs text-gray-300 truncate !-mt-2 bg-gray-50 w-fit pr-2"
              style={{
                width: collapsed ? 50 : "fit-content",
              }}
            >
              Preferences
            </li>
            {checkPermission("finance:tax:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/tax")}
                >
                  <Tooltip content="Tax">
                    <HiOutlineReceiptPercent />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">Tax</span>
                  )}
                </span>
              </li>
            )}
            {checkPermission("contact:all:read") && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/contact")}
                >
                  <Tooltip content="Contact">
                    <LuContact2 />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Contact
                    </span>
                  )}
                </span>
              </li>
            )}
            {profile?.roles && profile?.roles[0].is_super_admin && (
              <li className=" cursor-pointer" style={{}}>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                  onClick={handleNavigation("/setting")}
                >
                  <Tooltip content="Setting">
                    <BsGear />
                  </Tooltip>
                  {!collapsed && (
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Setting
                    </span>
                  )}
                </span>
              </li>
            )}
          </>
        )} */}
      </ul>
      <div
        className="flex flex-row gap-2 items-center cursor-pointer hover:font-bold px-2 mt-4"
        onClick={async () => {
          await asyncStorage.removeItem(LOCAL_STORAGE_TOKEN);
          await asyncStorage.removeItem(LOCAL_STORAGE_COMPANIES);
          await asyncStorage.removeItem(LOCAL_STORAGE_COMPANY_ID);
          window.location.reload();
        }}
      >
        <Tooltip content="Logout">
          <LuPowerOff />
        </Tooltip>
        {!collapsed && <span>Logout</span>}
      </div>
    </div>
  );
};
export default Sidebar;
