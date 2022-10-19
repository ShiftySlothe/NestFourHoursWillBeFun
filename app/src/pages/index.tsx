import React, { useContext } from "react";
import { UserTypeContext } from "../App";
import AllJobs from "../sections/AllJobs";
import CreateJobForm from "../sections/CreateJobForm";
import Header from "../sections/Header";
import { UserTypes } from "../types";

export default function Index() {
  const { user } = useContext(UserTypeContext);

  return (
    <>
      <Header />
      {user === UserTypes.Client && <AllJobs />}
      {user === UserTypes.Solicitor && <CreateJobForm />}
    </>
  );
}
