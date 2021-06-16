import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Button,
} from "reactstrap";
import Tags from "@yaireo/tagify/dist/react.tagify";
import axios from "axios";
const AddUpdateSuggestionModal = ({
  modalOpen,
  setModalOpen,
  setAlert = () => "",
  setSuggestions = () => "",
  defaultTitle = "",
  defaultCardImgUrl = "",
  defaultTags = [],
  updating = false,
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [cardImgUrl, setCardImgUrl] = useState(defaultCardImgUrl);
  const [tags, setTags] = useState(defaultTags);
  const cardImgRef = React.createRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => setError("");
  }, []);
  useEffect(() => {
    setError("");
  }, [title]);
  const toggle = () => {
    setModalOpen((prev) => !prev);
  };
  const handleTagChange = (values) => {
    let parsedValues = [];
    if (values) parsedValues = JSON.parse(values);
    parsedValues = parsedValues.map((tagObj) => tagObj.value);
    console.log(parsedValues);
    setTags(parsedValues);
  };
  const handleAddSuggestion = () => {
    if (!title || !cardImgRef.current.files[0])
      return setError("Title and Card Image both are required!");
    const data = new FormData();
    data.append("title", title);
    data.append("tags", JSON.stringify(tags));
    data.append("cardImg", cardImgRef.current.files[0]);
    setLoading(true);
    axios
      .post("/post/blogs/addSuggestion", data)
      .then((res) => {
        setLoading(false);
        setSuggestions(res.data.suggestions);
        setAlert({ type: "success", msg: "Successfully added the Suggestion" });
        setModalOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data) {
          setError(err.response.data.errorMsg);
        } else setError("Something went wrong!");
      });
  };
  const handleUpdateSuggestion = () => {
    if (!title || (!cardImgRef.current.files[0] && !cardImgUrl))
      return setError("Title and card Image both are required");
    const data = new FormData();
    data.append("title", title);
    data.append("tags", JSON.stringify(tags));
    data.append("cardImg", cardImgRef.current.files[0]);
    setLoading(true);
    axios
      .patch("/patch/blogs/updateSuggestion", data)
      .then((res) => {
        setLoading(false);
        setAlert({
          type: "success",
          msg: "Successfully updated the Suggestion",
        });
        setModalOpen(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data) {
          setError(err.response.data.errorMsg);
        } else setError("Something went wrong!");
      });
  };
  const handleSubmit = () => {
    setError("");
    if (!updating) {
      return handleAddSuggestion();
    } else {
      return handleUpdateSuggestion();
    }
  };
  return (
    <Modal isOpen={modalOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Add Suggestion
        {loading && <div className="scroller"></div>}
      </ModalHeader>
      <ModalBody>
        {error && (
          <p style={{ marginBottom: "1rem", color: "red", fontWeight: "600" }}>
            {error}
          </p>
        )}
        <FormGroup>
          <label htmlFor="title" className="fontType">
            Title
          </label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="tags" className="fontType">
            Tags
          </label>
          <Tags
            id="tags"
            placeholder="Enter tag and press enter"
            className="form-control"
            value={tags.join(", ")}
            onChange={(e) => handleTagChange(e.detail.value)}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="card-img" className="fontType">
            Card Image
          </label>
          <input
            id="card-img"
            className="form-control"
            type="file"
            ref={cardImgRef}
          />
          {cardImgUrl && (
            <span>
              <a href={cardImg}>Card Image </a>
            </span>
          )}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={() => handleSubmit()}>
          {updating ? "Update" : "Add"}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddUpdateSuggestionModal;