import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js"
import api from "../../utils/axios";

const Datatable = ({columns}) => {
  const location =  useLocation();
  const path = location.pathname.split("/")[1]
  const endpoint =
  path === "users"
    ? "/api/auth/users/get"
    : path === "hotels"
    ? "/api/hotels"
    : path === "rooms"
    ? "/api/rooms/getallrooms"
    : ""

  const [list,setList] = useState([])
  const {data, loading, error} = useFetch(endpoint)
  console.log(data)

  useEffect(() => {
    setList(data)
  }, [data])

  const handleDelete = async (id) => {
    try {
      
        let deleteUrl = "";
        if (path === "users") {
          deleteUrl = `/api/auth/${id}`;
        } else if (path === "hotels") {
          deleteUrl = `/api/hotels/${id}`;
        }
      await api.delete(deleteUrl);
      setList(list.filter((item) => item._id !== id));
      
    } catch (err) {
      console.log(err);
    } 

  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New {path}
        <Link to="users/test" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={row => row._id}
      />
    </div>
  );
};

export default Datatable;
