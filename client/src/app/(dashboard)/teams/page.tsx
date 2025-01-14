"use client";
import { useGetTeamsQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import ModalNewTeam from "@/components/ModalNewTeam";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  {
    field: "productOwner",
    headerName: "Product Owner",
    width: 200,
    renderCell: (params) => {
      return params.value.fullName || "Unassigned";
    },
  },
  {
    field: "projectManager",
    headerName: "Project Manager",
    width: 200,
    renderCell: (params) => {
      return params.value.fullName || "Unassigned";
    },
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewTeamOpen, setIsModalNewTeamOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <ModalNewTeam
        isOpen={isModalNewTeamOpen}
        onClose={() => setIsModalNewTeamOpen(false)}
      />
      <Header
        name="Teams"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTeamOpen(true)}
          >
            Add Team
          </button>
        }
      />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={teams || []}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Teams;
