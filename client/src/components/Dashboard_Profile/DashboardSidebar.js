import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Nav, Collapse } from "reactstrap";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
function Sidebar(props) {
  const sidebar = React.useRef();
  const location = useLocation();
  const [articleSubmenuOpen, setArticleSubmenOpen] = useState(
    location.pathname == "/articles" || location.pathname == "/suggestions"
  );
  const toggleArticleSubmenu = () => {
    setArticleSubmenOpen((prev) => !prev);
  };
  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo p-5">
        {!props.profileImg && <AccountCircleIcon style={{ fontSize: "140" }} />}
        {props.profileImg && (
          <img className="profile-img" src={props.profileImg} alt="" />
        )}
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <Nav>
          <li className={location.pathname == "/dashboard" ? "active" : ""}>
            <NavLink
              to="/dashboard"
              className="btn btn-default "
              activeClassName="active"
            >
              <p>EDIT PROFILE</p>
            </NavLink>
          </li>
          <li onClick={toggleArticleSubmenu} className="article-collapse-btn">
            <p>ARTICLES</p>
          </li>
          <Collapse isOpen={articleSubmenuOpen}>
            <li className={location.pathname == "/articles" ? "active" : ""}>
              <NavLink
                to="/articles"
                className="btn btn-default "
                activeClassName="active"
              >
                <p>Your Articles</p>
              </NavLink>
            </li>
            <li className={location.pathname == "/suggestions" ? "active" : ""}>
              <NavLink
                to="/suggestions"
                className="btn btn-default "
                activeClassName="active"
              >
                <p>Suggestions</p>
              </NavLink>
            </li>
          </Collapse>
          <li className={location.pathname == "/user-projects" ? "active" : ""}>
            <NavLink
              to="/user-projects"
              className="btn btn-default "
              activeClassName="active"
            >
              <p>PROJECTS</p>
            </NavLink>
          </li>
          <li className={location.pathname == "/competitions" ? "active" : ""}>
            <NavLink
              to="/competitions"
              className="btn btn-default "
              activeClassName="active"
            >
              <p>COMPETITIONS</p>
            </NavLink>
          </li>
          <li className={location.pathname == "/logout" ? "active" : ""}>
            <NavLink
              to="/logout"
              className="btn btn-default "
              activeClassName="active"
            >
              <p>LOGOUT</p>
            </NavLink>
          </li>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
