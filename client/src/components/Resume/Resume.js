import React, { useEffect, useState, useContext } from "react";
import ResumeTemplate1 from "./ResumeTemplate1";
import ResumeTemplate2 from "./ResumeTemplate2";
import ResumeTemplate3 from "./ResumeTemplate3";
import SelectTemplate from "./SelectResumeTemplate";
import axios from "axios";
import DemoNavbar from "../Dashboard/DashboardHeaderNav";
import Sidebar from "../Dashboard/DashboardSidebar";
import Loader from "../Loader/Loader";
import Footer from "../Dashboard/DashboardFooter";
import { AuthContext, InfoContext } from "../../state/Store";
import {
  clearEverything,
  generateWarning,
  generateError,
} from "../../state/info/infoActions";
// import "./resume.scss";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Collapse,
  Container,
} from "reactstrap";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ReactToPdf from "react-to-pdf";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));
const currentDate = new Date();
const years = [""];
let yearGeneratingNum = 4;
while (yearGeneratingNum >= -12) {
  years.push(currentDate.getFullYear() + yearGeneratingNum);
  yearGeneratingNum -= 1;
}
const TakeData = ({ setLoading, setProfileImg, setDataTaken }) => {
  const classes = useStyles();
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [collegeCity, setCollegeCity] = useState("");
  const [objective, setObjective] = useState("");
  const info = useContext(InfoContext);
  const [academics, setAcademics] = useState([
    { year: "", degree: "", college: "", result: "", type: "GPA" },
    { year: "", degree: "", college: "", result: "", type: "GPA" },
    { year: "", degree: "", college: "", result: "", type: "GPA" },
  ]);
  const [achievements, setAchievements] = useState([""]);
  const addMore = () => {
    console.log("add more called");
    setAchievements((prev) => [...prev, ""]);
  };
  const isdisabled = () => {
    const last = achievements[achievements.length - 1];
    if (!last || !last.trim()) return true;
    else return false;
  };
  const setDefaultValues = (data) => {
    console.log(data);
    setProfileImg(data.profilePhoto || "");
    setDegree(data.degree || "");
    setCollege(data.college || "");
    setCollegeCity(data.collegeCity || "");
    setObjective(data.about || "");
    setAcademics((prev) => {
      if (data.academics && data.academics.length > 0) {
        return data.academics.map((item) => {
          delete item._id;
          if (item.result.percentage != 0) {
            item.result = item.result.percentage;
            item.type = "PERCENTAGE";
          } else {
            item.result = item.result.gpa;
            item.type = "GPA";
          }
          return item;
        });
      } else return prev;
    });
    setAchievements(
      data.achievements && data.achievements.length > 0
        ? data.achievements
        : [""]
    );
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/loadUser")
      .then((res) => {
        setDefaultValues(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    info.dispatch(clearEverything());
    let error = false;
    let reformedAcademics = [];
    if (!degree || !college || !collegeCity || !objective) {
      console.log("error occured: ", degree, college, collegeCity, objective);
      error = true;
    }
    for (var i = 0; i < 3; i++) {
      let passingYear = academics[i].year;
      let deg = academics[i].degree;
      let clg = academics[i].college;
      let reslt = academics[i].result;
      let type = academics[i].type;
      console.log(passingYear, deg, clg, reslt);
      if (!passingYear || !deg || !reslt || !clg) {
        console.log("error occured: breaking");
        error = true;
        break;
      } else {
        let gpa = 0;
        let percentage = 0;
        if (type == "GPA") gpa = reslt;
        else percentage = reslt;
        reformedAcademics.push({
          year: passingYear,
          degree: deg,
          college: clg,
          result: { gpa, percentage },
        });
      }
    }
    if (error) {
      window.scrollTo(0, 0);
      return info.dispatch(
        generateWarning(
          "All the fields under Basic Information and Academics section are required!"
        )
      );
    }
    const data = new FormData();
    data.append("degree", degree);
    data.append("college", college);
    data.append("city", collegeCity);
    data.append("objective", objective);
    data.append("academics", JSON.stringify(reformedAcademics));
    data.append("achievements", JSON.stringify(achievements));
    data.append("updatingFor", "RESUME");
    setLoading(true);
    axios
      .post("/post/updateProfile", data)
      .then((res) => {
        setLoading(false);
        setDataTaken(true);
        setDefaultValues(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errorMsg)
          info.dispatch(generateError(err.response.data.errorMsg));
        if (err.response && err.response.data && err.response.data.userData)
          setDefaultValues(err.response.data.userData);
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <>
      <Row>
        <Col>
          <Card className="card-user">
            <CardHeader>
              <CardTitle tag="h5">ADD/UPDATE RESUME DATA</CardTitle>
            </CardHeader>
            <CardBody>
              <form onSubmit={(e) => handleSubmit(e)}>
                <Accordion defaultExpanded style={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      Basic Information
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography style={{ width: "100%" }}>
                      <Row style={{ width: "100%" }}>
                        <Col md="4">
                          <FormGroup>
                            <label className="fontType" htmlFor="fullname">
                              Degree
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Degree(Eg. B.Tech)"
                              value={degree}
                              onChange={(e) => setDegree(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label className="fontType" htmlFor="mobile">
                              College
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="College(Eg. BIET)"
                              value={college}
                              onChange={(e) => setCollege(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <label className="fontType" htmlFor="whatsapp">
                              College City
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="College City"
                              value={collegeCity}
                              onChange={(e) => setCollegeCity(e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row style={{ width: "100%" }}>
                        <Col md="12">
                          <FormGroup>
                            <label className="fontType" htmlFor="github">
                              About/Objective
                            </label>
                            <textarea
                              className="form-control"
                              placeholder="About/Objective"
                              value={objective}
                              onChange={(e) => setObjective(e.target.value)}
                            ></textarea>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                {academics.map((acad, index) => {
                  return (
                    <>
                      <Accordion style={{ width: "100%" }} defaultExpanded>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className={classes.heading}>
                            {index == 0
                              ? "Most-Recent/Present Academics You're Enrolled In"
                              : "Academics-" + (index + 1)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography style={{ width: "100%" }}>
                            <Row style={{ width: "100%" }} key={index}>
                              <Col md="8">
                                <FormGroup>
                                  <label
                                    className="fontType"
                                    htmlFor={"college-" + index}
                                  >
                                    College
                                  </label>
                                  <input
                                    id={`college-${index}`}
                                    type="text"
                                    className="form-control"
                                    placeholder="College"
                                    value={acad.college}
                                    onChange={(e) =>
                                      setAcademics((prev) => {
                                        prev[index].college = e.target.value;
                                        return [...prev];
                                      })
                                    }
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <label
                                    className="fontType"
                                    htmlFor={"degree-" + index}
                                  >
                                    Degree
                                  </label>
                                  <input
                                    id={`degree-${index}`}
                                    type="text"
                                    className="form-control"
                                    placeholder="Degree(Eg. B.Tech/XII/X)"
                                    value={acad.degree}
                                    onChange={(e) =>
                                      setAcademics((prev) => {
                                        prev[index].degree = e.target.value;
                                        return [...prev];
                                      })
                                    }
                                  />
                                </FormGroup>
                              </Col>
                              <Col md="8">
                                <Row style={{ maxWidth: "100%", margin: 0 }}>
                                  <Col xs="8" style={{ paddingLeft: "0" }}>
                                    <FormGroup>
                                      <label
                                        className="fontType"
                                        htmlFor={"result-" + index}
                                      >
                                        GPA/Percentage
                                      </label>
                                      <input
                                        style={{ width: "99%" }}
                                        id={`result-${index}`}
                                        type="text"
                                        className="form-control"
                                        placeholder="GPA/Percentage"
                                        value={acad.result}
                                        onChange={(e) =>
                                          setAcademics((prev) => {
                                            prev[index].result = e.target.value;
                                            return [...prev];
                                          })
                                        }
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col xs="4" style={{ paddingRight: 0 }}>
                                    <label
                                      className="fontType"
                                      htmlFor={"result-type-" + index}
                                    >
                                      Type
                                    </label>
                                    <select
                                      id={"result-type-" + index}
                                      className="form-control"
                                      value={acad.type}
                                      onChange={(e) =>
                                        setAcademics((prev) => {
                                          prev[index].type = e.target.value;
                                          return [...prev];
                                        })
                                      }
                                    >
                                      <option value="GPA">GPA</option>
                                      <option value="PERCENTAGE">
                                        Percentage
                                      </option>
                                    </select>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md="4">
                                <FormGroup>
                                  <label
                                    className="fontType"
                                    htmlFor={"year-" + index}
                                  >
                                    Passing/Expected Passing Year
                                  </label>
                                  <select
                                    id={`year-${index}`}
                                    type="text"
                                    className="form-control"
                                    placeholder="Passing Year"
                                    value={acad.year}
                                    onChange={(e) =>
                                      setAcademics((prev) => {
                                        prev[index].year = e.target.value;
                                        return [...prev];
                                      })
                                    }
                                  >
                                    {years.map((year) => {
                                      return (
                                        <option key={year} value={year}>
                                          {year || "Year"}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </FormGroup>
                              </Col>
                            </Row>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  );
                })}
                <Accordion style={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      Achievements
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography style={{ width: "100%" }}>
                      {achievements.map((ach, index) => {
                        return (
                          <>
                            <Row style={{ width: "100%" }} key={index}>
                              <Col>
                                <FormGroup>
                                  <label
                                    className="fontType"
                                    htmlFor={"achievement-" + index}
                                  >{`Achievement-${index + 1}`}</label>
                                  <input
                                    id={`achievement-${index}`}
                                    type="text"
                                    className="form-control"
                                    placeholder={"Achievement - " + (index + 1)}
                                    value={ach}
                                    onChange={(e) =>
                                      setAchievements((prev) => {
                                        prev[index] = e.target.value;
                                        return [...prev];
                                      })
                                    }
                                    disabled={index < achievements.length - 1}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </>
                        );
                      })}
                      <Row>
                        <div className="update ml-auto mr-auto">
                          <div
                            className={
                              isdisabled()
                                ? "btn btn-success disabled"
                                : "btn btn-success"
                            }
                            style={{ margin: "0" }}
                            onClick={() => addMore()}
                          >
                            Add more
                          </div>
                        </div>
                      </Row>
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Row>
                  <div className="update ml-auto mr-auto">
                    <Button
                      className="submitBorder"
                      color="warning"
                      type="submit"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Proceed
                    </Button>
                  </div>
                </Row>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
const Resume = (props) => {
  const ref = React.createRef();
  const [template, setTemplate] = useState(0);
  const [profileImg, setProfileImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataTaken, setDataTaken] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [template]);
  return (
    <div className="wrapper dashboard-main-wrapper">
      <Sidebar bgColor="white" activeColor="info" profileImg={profileImg} />
      <div className="main-panel dashboard-main-panel">
        <DemoNavbar {...props} />
        <div className="content">
          <React.Fragment>
            {dataTaken && template != 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  padding: "0",
                  background: "transparent",
                  flexDirection: "column",
                }}
              >
                <div className="download-reset-button-container">
                  <ReactToPdf targetRef={ref} filename="userName_resume.pdf">
                    {({ toPdf }) => (
                      <button className="generate-pdf" onClick={toPdf}>
                        GENERATE PDF
                      </button>
                    )}
                  </ReactToPdf>
                  <button
                    className="generate-pdf reset-template"
                    onClick={() => setTemplate(0)}
                  >
                    RESET TEMPLATE
                  </button>
                </div>
                {template == 1 && (
                  <ResumeTemplate1 ref={ref} />
                )}
                {template == 2 && (
                  <ResumeTemplate2 ref={ref} />
                )}
                {template == 3 && (
                  <ResumeTemplate3 ref={ref} />
                )}
              </div>
            )}
            {dataTaken && !template && (
              <SelectTemplate setTemplate={setTemplate} />
            )}
            {!dataTaken && (
              <TakeData
                setLoading={setLoading}
                setDataTaken={setDataTaken}
                setProfileImg={setProfileImg}
              />
            )}
            <Footer fluid />
            {loading && <Loader />}
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};

export default Resume;
