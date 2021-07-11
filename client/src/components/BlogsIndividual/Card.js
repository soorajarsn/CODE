import React from "react";
import date from "../assets/date.png";
import user from "../assets/user.png";
import like from "../assets/like.png";
import { Link } from "react-router-dom";
const CardItem = (props) => {
  return (
    <div className="cards__item" style={{ maxWidth: "28rem" }}>
      <Link className="cards__item__link" to={"/blogs/" + props.path}>
        <figure
          className="cards__item__pic-wrap"
          data-category={props.category}
          style={{ marginRight: 0, marginLeft: 0, marginTop: 0 }}
        >
          <img className="cards__item__img" alt="Image" src={props.src} />
        </figure>
        <div className="cards__item__info">
          <div className="info-icons">
            <div className=" icon-s">
              <img className="icon" src={user} />
              <span className="icon-name">{props.name}</span>
            </div>
            {/* <div className=" icon-s">
              <img className="icon" src={like} />
              <span className="icon-name">33 </span>
            </div> */}
            <div className=" icon-s">
              <img className="icon" src={date} />
              <span className="icon-name">
                {new Date(props.date).toDateString()}
              </span>
            </div>
          </div>
          <p className="cards__item__text" href={props.text}>
            {props.text}
          </p>
          <div className="tab">
            {props.tags.map((tag) => (
              <span className="round-tab">{tag}</span>
            ))}
          </div>
        </div>
        <div className="button default-btn">
          <button className="default-btn">Read more</button>
        </div>
      </Link>
    </div>
  );
};
const Card = ({ suggestedBlogs }) => {
  return (
    <>
      {suggestedBlogs.length > 0 && (
        <div className="card-container-blogsIndividual">
          <div className="card_main_cot">
            <div className="card_cot cot">
              <div className="post">
                <header className="header">
                  <h2 className="block_title h3" style={{ marginLeft: 10 }}>
                    You might also enjoy
                  </h2>
                </header>
                <div className="cards">
                  <div className="cards__container">
                    <div className="cards__wrapper">
                      <div className="cards__items">
                        {suggestedBlogs.map((blog) => (
                          <CardItem
                            src={blog.cardImg}
                            text={blog.title}
                            category={blog.category}
                            path={blog.url}
                            tags={blog.tags}
                            date={blog.postedAt}
                            name={blog.postedBy.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
export { CardItem };
