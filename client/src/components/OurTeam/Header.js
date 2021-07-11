import React from "react";
import header_img from "../assets/OurTeamheader.svg";
function Header() {
  return (
    <div className="banner">
      <div className="content">
        <h1 className="leader">Club Of DEvelopers</h1>
        <p>
          Fuelled by the passion to learn, build and innovate, we are a family
          of 450+ active members. Harnessing the energy of young minds, we have
          3 executive members responsible for plan execution. There are 11
          operating members, 10 members in assistance and 20 dedicated mentors
          for the technical guidance.
        </p>
      </div>
      <img src={header_img} className="image" alt="" />
    </div>
  );
}
export default Header;
