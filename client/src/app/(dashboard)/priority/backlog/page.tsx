import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/shared/models";

const Backlog = () => {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
};

export default Backlog;
