import React, { lazy, Suspense, useEffect } from "react";
const Dashboard_Suggestion = lazy(() =>
  import("../components/Dashboard_Suggestions/Suggestions")
);
// import Dashboard_Suggestion from "../components/Dashboard_Suggestions/Suggestions";
import Loader from "../components/Loader/Loader";
export default (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Suspense fallback={<Loader />}>
      <Dashboard_Suggestion {...props} />
    </Suspense>
  );
};
