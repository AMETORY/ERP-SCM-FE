import React, { useContext, useEffect, useRef, useState } from "react";
import { CollapsedContext } from "../contexts/CollapsedContext";
import Logo from "./logo";
import { CompaniesContext, CompanyIDContext } from "../contexts/CompanyContext";
import { Avatar, Datepicker, Dropdown, Modal } from "flowbite-react";
import { ProfileContext } from "../contexts/ProfileContext";
import { initial } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { SearchContext } from "../contexts/SearchContext";
import Moment from "react-moment";
import { DateRangeContext } from "../contexts/LoadingContext";

interface TopnavProps {}

const Topnav: React.FC<TopnavProps> = () => {
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const { search, setSearch } = useContext(SearchContext);
  const { companies, setCompanies } = useContext(CompaniesContext);
  const { companyID, setCompanyID } = useContext(CompanyIDContext);
  const { collapsed, setCollapsed } = useContext(CollapsedContext);
  const [showModal, setShowModal] = useState(false);
  const { profile, setProfile } = useContext(ProfileContext);
  const [now, setNow] = useState<Date>(new Date());
  const nav = useNavigate();
  const timeout = useRef<number | null>(null);

  const updateNow = () => {
    setNow(new Date());
  };
  useEffect(() => {
    const id = setInterval(updateNow, 60000);
    return () => clearInterval(id);
  }, []);

  const searchBox = (
    <div className="relative w-full max-w-[300px] mr-6 focus-within:text-purple-500">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <HiMagnifyingGlass />
      </div>
      <input
        type="text"
        className="w-full py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
  return (
    <nav className="fixed top-0 z-20 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end  w-full">
            <button
              onClick={() => setCollapsed(!collapsed)}
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center p-2 text-sm mr-4 text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>
            <div className="flex  gap-4 w-full items-center min-w-[500px]">
         
              {dateRange && (
                <div
                  className="text-sm  px-4 py-2 hover:bg-gray-50 rounded-lg border cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <Moment format="DD/MM/YYYY">{dateRange[0]}</Moment> -{" "}
                  <Moment format="DD/MM/YYYY">{dateRange[1]}</Moment>
                </div>
              )}
                 <div>
              <Moment className="text-sm" format="dddd, D MMMM YYYY | HH:mm">
                {now}
              </Moment>
            </div>
              <div></div>
            </div>
          </div>
          <div className="flex items-center min-w-[800px] justify-end">
          {searchBox}
           
            <div className="flex items-center ms-3 gap-4">
              
              <Avatar
                size="xs"
                img={profile?.profile_picture?.url}
                rounded
                stacked
                placeholderInitials={initial(profile?.full_name)}
                className="cursor-pointer"
                onClick={() => nav("/profile")}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Accounting Period</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-2 gap-4">
            <Datepicker
              value={dateRange ? dateRange[0] : new Date()}
              onChange={(value) =>
                setDateRange([value!, dateRange ? dateRange?.[1] : new Date()])
              }
              style={{ backgroundColor: "white" }}
            />
            <Datepicker
              value={dateRange ? dateRange[1] : new Date()}
              onChange={(value) =>
                setDateRange([dateRange ? dateRange?.[0] : new Date(), value!])
              }
              style={{ backgroundColor: "white" }}
            />
          </div>
          <div className="min-h-64 mt-4">
            <ul className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => {
                const quarter = i + 1;
                const start = new Date(new Date().getFullYear(), (quarter - 1) * 3, 1);
                const end = new Date(new Date().getFullYear(), quarter * 3, 0);
                return (
                  <li key={i}>
                    <button
                      key={i}
                      className="rs-input clear-start text-center hover:font-semibold hover:bg-gray-50"
                      onClick={() => setDateRange([start, end])}
                    >
                      Q{quarter}
                    </button>
                  </li>
                );
              })}
             
              {[...Array(4)].map((_, i) => {
                const year = new Date().getFullYear() - (i === 0 ? 0 : i);
                return (
                  <li key={i}>
                    <button
                      key={i}
                      className="rs-input clear-start text-center hover:font-semibold hover:bg-gray-50"
                      onClick={() =>
                        setDateRange([
                          new Date(year, 0, 1),
                          new Date(year, 11, 31),
                        ])
                      }
                    >
                      {year == new Date().getFullYear() ? "This Year" : year}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </nav>
  );
};

export default Topnav;
