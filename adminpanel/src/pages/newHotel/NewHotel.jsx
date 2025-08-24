import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";


const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([])
  const { data, loading, error } = useFetch("/api/rooms/getallrooms")


  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value)
    setRooms(value)
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const list = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData()
          data.append("file", file)
          data.append("upload_preset", "upload")
          const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dykd0movr/image/upload",
            data)
          const { url } = uploadRes.data
          return url
        }),
      )

      const newhotel = {
        ...info,
        rooms,
        photos:list
      }

      await axios.post("/hotels", newhotel)

      console.log("created")
    } catch (error) {
      console.error("Error adding hotel:", error);
    }
  };

  console.log(files)
  console.log(rooms)
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              {/* Upload image */}
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  multiple
                  id="file"
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {/* Dynamic inputs */}
              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

              <div className="formInput" >
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectRooms" >
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleSelect}>
                  {loading ? "loading" : data && data.map(rooms => (
                    <option key={rooms._id} value={rooms._id}>{rooms.title}</option>
                  ))}
                </select>
              </div>

              {/* Button aligned properly */}
              <div className="formInput fullWidth">
                <button onClick={handleClick} type="submit">Send</button>
              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
}

export default NewHotel;
