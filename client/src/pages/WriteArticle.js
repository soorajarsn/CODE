import React, { lazy, Suspense } from "react";
import Loader from "../components/Loader/Loader";
const WriteArticle = lazy(() =>
  import("../components/WriteArticle/WriteArticle")
);
const Nav = lazy(() => import("../components/Navbar/Nav"));
const Footer = lazy(() => import("../components/Footer/Footer"));
// import WriteArticle from "../components/WriteArticle/WriteArticle";
const WriteArticlePage = (props) => {
  return (
    <Suspense fallback={<Loader />}>
      <Nav />
      <WriteArticle {...props} />
      <Footer />
    </Suspense>
  );
};
export default WriteArticlePage;
