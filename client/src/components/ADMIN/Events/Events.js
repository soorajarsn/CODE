import React, { useEffect, useState, useContext, lazy } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  DeleteForeverRounded,
  EditTwoTone,
  PeopleAltTwoTone,
} from "@material-ui/icons";
import { InfoContext } from "../../../state/Store";
import {
  generateSuccess,
  generateError,
} from "../../../state/info/infoActions";
// import EventCard from "../../EventCard/EventCard";
// import DashboardLayout from "../Dashboard/DashboardLayout";
// import ContentLoaderSvg from "../../EventCard/EventCardLoader";
// import Pagination from "../../Pagination/Pagination";
// import ConfirmDeletion from "./ConfirmDeletion";
import eventRoutes from "./eventRoutes";
const DashboardLayout = lazy(() => import("../Dashboard/DashboardLayout"));
const EventCard = lazy(() => import("../../EventCard/EventCard"));
const ContentLoaderSvg = lazy(() => import("../../EventCard/EventCardLoader"));
const Pagination = lazy(() => import("../../Pagination/Pagination"));
const ConfirmDeletion = lazy(() => import("./ConfirmDeletion"));
const FilterComponent = ({ filter, setFilter, setPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const changeFilter = (newFilter) => {
    setPage(1);
    setFilter(newFilter);
  };
  return (
    <Card>
      <CardBody
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "15px",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", margin: 0, padding: 0 }}>Filters</h2>
        <Dropdown
          isOpen={dropdownOpen}
          toggle={() => setDropdownOpen((prev) => !prev)}
        >
          <DropdownToggle caret>{filter}</DropdownToggle>
          <DropdownMenu right style={{ zIndex: "1200" }}>
            <DropdownItem onClick={() => changeFilter("All")}>All</DropdownItem>
            <DropdownItem onClick={() => changeFilter("Upcoming")}>
              Upcoming
            </DropdownItem>
            <DropdownItem onClick={() => changeFilter("Last Week")}>
              Last Week
            </DropdownItem>
            <DropdownItem onClick={() => changeFilter("Last Month")}>
              Last Month
            </DropdownItem>
            <DropdownItem onClick={() => changeFilter("Last 3 Months")}>
              Last 3 Months
            </DropdownItem>
            <DropdownItem onClick={() => changeFilter("Last 6 Months")}>
              Last 6 Months
            </DropdownItem>
            <DropdownItem onClick={() => changeFilter("Last 1 Year")}>
              Last 1 Year
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardBody>
    </Card>
  );
};
const getFilters = (filter) => {
  if (filter == "All") return "";
  else if (filter == "Upcoming") return "gt=" + new Date(Date.now());
  else if (filter == "Last Week")
    return (
      "gt=" +
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) +
      "&lt=" +
      new Date(new Date(Date.now()))
    );
  else if (filter == "Last Month")
    return (
      "gt=" +
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) +
      "&lt=" +
      new Date(new Date(Date.now()))
    );
  else if (filter == "Last 3 Months")
    return (
      "gt=" +
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3) +
      "&lt=" +
      new Date(new Date(Date.now()))
    );
  else if (filter == "Last 6 Months")
    return (
      "gt=" +
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6) +
      "&lt=" +
      new Date(new Date(Date.now()))
    );
  else if (filter == "Last 1 Year")
    return (
      "gt=" +
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 12) +
      "&lt=" +
      new Date(new Date(Date.now()))
    );
};
const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteCofirmationModalOpen] =
    useState(false);
  const [eventIdToBeDeleted, setEventIdToBeDeleted] = useState("");
  const info = useContext(InfoContext);
  //managing pagination -- start
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(6);
  const [limit, setLimit] = useState(6);
  //managing pagination -- end
  //filters
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    setLoading(true);
    //scroll to top when mounted;
    const queryString = getFilters(filter);
    // console.log(queryString);
    window.scrollTo(0, 0);
    axios
      .get(`/api/events/?limit=${limit}&page=${currentPage - 1}&${queryString}`)
      .then((res) => {
        setLoading(false);
        setTotalItems(res.data.totalItems);
        setEvents(res.data.events);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [currentPage, filter]);

  const handleDelete = (id) => {
    setDeleteCofirmationModalOpen(false);
    setLoading(true);
    axios
      .delete(`/delete/event/${id}`)
      .then((res) => {
        // console.log(res.data.events);
        setLoading(false);
        setEvents(res.data.events);
        info.dispatch(generateSuccess("Delete Successfully!"));
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data) {
          info.dispatch(generateError(err.response.data));
        } else {
          info.dispatch(generateError("Something went wrong!"));
        }
      });
  };
  const handlePageChange = (page) => {
    // console.log(page);
    setCurrentPage(page);
  };
  const changeEventIdToBeDeleted = (id) => {
    setEventIdToBeDeleted(id);
    setDeleteCofirmationModalOpen((prev) => !prev);
  };
  return (
    <DashboardLayout routes={eventRoutes}>
      <FilterComponent
        filter={filter}
        setFilter={setFilter}
        setPage={setCurrentPage}
      />
      <Row style={{ width: "100%", margin: "0" }}>
        <Col style={{ display: "flex", flexWrap: "wrap" }}>
          {!loading &&
            events.map((event) => {
              return (
                <div className="event-card-container">
                  <EventCard key={event._id} {...event} />
                  <div className="update-remove-button-container">
                    <Link to={`/admin/events/${event._id}/registrations`}>
                      <button>
                        <PeopleAltTwoTone />
                      </button>
                    </Link>
                    <Link to={"/admin/events/update/" + event._id}>
                      <button>
                        <EditTwoTone />
                      </button>
                    </Link>
                    <button
                      className="remove-button"
                      onClick={() => changeEventIdToBeDeleted(event._id)}
                    >
                      <DeleteForeverRounded />
                    </button>
                  </div>
                </div>
              );
            })}
          {loading && (
            <>
              <div className="event-card-container">
                <ContentLoaderSvg />
              </div>
              <div className="event-card-container">
                <ContentLoaderSvg />
              </div>
              <div className="event-card-container">
                <ContentLoaderSvg />
              </div>
              <div className="event-card-container">
                <ContentLoaderSvg />
              </div>
              <div className="event-card-container">
                <ContentLoaderSvg />
              </div>
              <div className="event-card-container">
                <ContentLoaderSvg />
              </div>
            </>
          )}
        </Col>
      </Row>

      <ConfirmDeletion
        modalOpen={deleteConfirmationModalOpen}
        setModalOpen={setDeleteCofirmationModalOpen}
        handleDelete={handleDelete}
        id={eventIdToBeDeleted}
      />
      {totalItems > limit && (
        <Pagination
          totalItems={totalItems}
          pageSize={limit}
          handlePageChange={handlePageChange}
        />
      )}
    </DashboardLayout>
  );
};
export default Events;
