import React, { useContext } from "react";
import { UserTypeContext } from "../App";
import CreateJobForm from "../sections/CreateJobForm";
import Header from "../sections/Header";
import { UserTypes } from "../types";

export default function Index() {
  const { user } = useContext(UserTypeContext);

  return (
    <>
      <Header />
      {user === UserTypes.Client && <div>CLIENT</div>}
      {user === UserTypes.Solicitor && <CreateJobForm />}
    </>
  );
}
