import React, { useEffect } from "react";
import HeroImg from "../assets/undraw_product_tour.svg";
import AOS from "aos";
const Hero = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh({ duration: 1000, once: true });
  }, []);
  return (
    <section class="career-section">
      <div class="container">
        <div data-aos="fade-up" class="row">
          <div class="col-sm-6 col-12" id="mob-apply">
            <h2 className="hero-heading">
              Join Our Team At <span>CODE</span>
            </h2>
            <p>Work at the most dynamic and successful club of BIET.</p>
            <div class="join-box" id="mob-apply">
              <button type="button" class="btn">
                Apply Now
              </button>
            </div>
          </div>
          <div class="col-sm-6 col-12">
            <img src={HeroImg} style={{ width: "100%" }} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
