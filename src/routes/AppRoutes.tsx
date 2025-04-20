import { useEffect, useState, type FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { CollapsedContext } from "../contexts/CollapsedContext";
import { CompanyModel } from "../models/company";
import {
  ActiveCompanyContext,
  CompaniesContext,
  CompanyIDContext,
} from "../contexts/CompanyContext";
import { asyncStorage } from "../utils/async_storage";
import {
  LOCAL_STORAGE_COLLAPSED,
  LOCAL_STORAGE_COMPANY_ID,
  LOCAL_STORAGE_DATERANGE,
  LOCAL_STORAGE_TOKEN,
} from "../utils/constants";
import { WebsocketContext } from "../contexts/WebsocketContext";
import { UserModel } from "../models/user";
import { MemberContext, ProfileContext } from "../contexts/ProfileContext";
import AcceptInvitation from "../pages/AcceptInvitation";
import { MemberModel } from "../models/member";
import { SearchContext } from "../contexts/SearchContext";

interface AppRoutesProps {
  token?: string | null;
}

const AppRoutes: FC<AppRoutesProps> = ({ token }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWsConnected, setWsConnected] = useState(false);
  const [wsMsg, setWsMsg] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [companyID, setCompanyID] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyModel[] | null>(null);
  const [profile, setProfile] = useState<UserModel | null>(null);
  const [member, setMember] = useState<MemberModel | null>(null);
  const [activeCompany, setActiveCompany] = useState<CompanyModel | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  useEffect(() => {
    // console.log("token", token);
    asyncStorage.getItem(LOCAL_STORAGE_COMPANY_ID).then((id) => {
      setCompanyID(id);
    });
    asyncStorage.getItem(LOCAL_STORAGE_COLLAPSED).then((collapsed) => {
      setCollapsed(collapsed === "true");
    });
    asyncStorage.getItem(LOCAL_STORAGE_DATERANGE).then((daterangeStr) => {
      if (daterangeStr) {
        let dateRangeParsed = JSON.parse(daterangeStr);
        setDateRange([
          new Date(dateRangeParsed[0]),
          new Date(dateRangeParsed[1]),
        ]);
      }
    });
  }, []);
  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (e.message.includes("ResizeObserver loop")) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
        console.error(e.message);
      }
    });
  }, []);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <CollapsedContext.Provider
        value={{
          collapsed,
          setCollapsed: (val) => {
            setCollapsed(val);
            asyncStorage.setItem(
              LOCAL_STORAGE_COLLAPSED,
              val ? "true" : "false"
            );
          },
        }}
      >
        <ProfileContext.Provider value={{ profile, setProfile }}>
          <MemberContext.Provider value={{ member, setMember }}>
            <CompaniesContext.Provider value={{ companies, setCompanies }}>
              <ActiveCompanyContext.Provider
                value={{ activeCompany, setActiveCompany }}
              >
                <CompanyIDContext.Provider
                  value={{
                    companyID,
                    setCompanyID: (val) => {
                      asyncStorage.setItem(LOCAL_STORAGE_COMPANY_ID, val);
                      setCompanyID(val);
                    },
                  }}
                >
                  <WebsocketContext.Provider
                    value={{ isWsConnected, setWsConnected, wsMsg, setWsMsg }}
                  >
                    <DateRangeContext.Provider
                      value={{
                        dateRange,
                        setDateRange: (val) => {
                          if (val) {
                            console.log(val)
                            setDateRange(val);
                            asyncStorage.setItem(
                              LOCAL_STORAGE_DATERANGE,
                              JSON.stringify([val[0].toISOString(), val[1].toISOString()])
                            );
                          }
                        },
                      }}
                    >
                      <SearchContext.Provider value={{ search, setSearch }}>
                        <BrowserRouter>
                          {token && <PrivateRoute />}
                          {!token && <PublicRoute />}
                        </BrowserRouter>
                      </SearchContext.Provider>
                    </DateRangeContext.Provider>
                  </WebsocketContext.Provider>
                </CompanyIDContext.Provider>
              </ActiveCompanyContext.Provider>
            </CompaniesContext.Provider>
          </MemberContext.Provider>
        </ProfileContext.Provider>
      </CollapsedContext.Provider>
    </LoadingContext.Provider>
  );
};
export default AppRoutes;
