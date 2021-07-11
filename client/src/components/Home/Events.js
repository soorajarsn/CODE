import React, { useEffect, useState, lazy } from "react";
import AOS from "aos";
import OwlCarousel from "react-owl-carousel";
import EventCard from "../EventCard/EventCard";
// const OwlCarousel = lazy(() => import("react-owl-carousel"));
import EventLoaderCard from "../EventCard/EventCardLoader";
// const EventCard = lazy(() => import("../EventCard/EventCard"));
// const EventLoaderCard = lazy(() => import("../EventCard/EventCardLoader"));
import { Container } from "reactstrap";
import axios from "axios";
const Events = (props) => {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/events")
      .then((res) => {
        setLoading(false);
        // console.log(res.data.events);
        setEventsData(res.data.events);
      })
      .catch((err) => {
        // console.log(err);
      });
  }, []);
  return (
    <>
      <section
        className="w3l-clients py-5 mb-5 mt-4"
        id="activities"
        data-aos="zoom-right"
        data-aos-delay="100"
        data-aos-once={true}
        data-aos-duration="1000"
      >
        <div className="container-fluid">
          <div
            className="title-main text-center mx-auto mb-5"
            style={{ maxWidth: "600px" }}
          >
            <p className="mt-2">our activities</p>
            <h3 className="title-style" style={{ textAlign: "center" }}>
              Some Recent{" "}
              <span style={{ fontSize: "inherit", fontWeight: 700 }}>
                Events
              </span>
            </h3>
          </div>
          <Container className="py-md-5 events-container">
            {eventsData.length && (
              <OwlCarousel
                items={3}
                autoplay={true}
                autoplayHoverPause={true}
                margin={50}
                responsive={{
                  0: { items: 1 },
                  1000: { items: 2 },
                  1400: { items: 3 },
                }}
                id="events"
                className="owl-theme mt-4 py-md-2"
                lazyLoad={true}
              >
                {eventsData.map((eventData) => (
                  <EventCard key={eventData._id} {...eventData} />
                ))}
              </OwlCarousel>
            )}
            {loading && (
              <OwlCarousel
                items={3}
                autoplay={true}
                autoplayHoverPause={true}
                margin={50}
                responsive={{
                  0: { items: 1 },
                  1000: { items: 2 },
                  1400: { items: 3 },
                }}
                id="events"
                className="owl-theme mt-4 py-md-2 mb-md-4"
              >
                <EventLoaderCard />
                <EventLoaderCard />
                <EventLoaderCard />
                <EventLoaderCard />
              </OwlCarousel>
            )}
          </Container>
        </div>
      </section>
    </>
  );
};
export default Events;
