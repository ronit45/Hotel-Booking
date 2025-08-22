import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./reserve.css"
import {  faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import useFetch from "../../hooks/useFetch"
import { useContext, useState } from "react"
import { SearchContext } from "../../context/SearchContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Reserve = ({setOpen, hotelId}) => {

    const {data, loading,error} = useFetch(`room/${hotelId}`)
    const [selectedRooms,setSelectedRooms] = useState([])
    const {dates} = useContext(SearchContext)

    const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    let date = new Date(start) // keep as Date object
    let list = []

    while (date <= end) {
        list.push(new Date(date).getTime()) // store a copy
        date.setDate(date.getDate() + 1) // move to next day
    }

    return list
}   
    


    const allDates =  getDatesInRange(dates[0].startDate,dates[0].endDate)
    console.log(allDates)
    
    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some(date => 
            allDates.includes(new Date(date).getTime())
        )
    return !isFound
    }
    const navigate = useNavigate()
    const handleSelect  = (e) => {
        const checked = e.target.checked
        const value = e.target.value
        setSelectedRooms(
            checked ?
            [...selectedRooms, value] : selectedRooms.filter((item) => item !== value)) 

    }
    const handleClick = async () => {
        try{
            await Promise.all(
                
                selectedRooms.map((roomId)  => {
                const res = axios.put(`/rooms/availability/${roomId}`,
                     {dates : allDates})
                return res.data  
                }
            ))
        setOpen(false)
        navigate("/")
        }
        catch(error){

        }
    }

    console.log(selectedRooms)
    return (
        <div className="reserve">
            <div className="rContainer">
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="rClose"
                    onClick={() => setOpen(false)}
                />
                <span>Select your Rooms :</span>
                {data.map(item => (
                    <div className="rItem" key= {item._id}>
                        <div className="rItemInfo">
                            <div className="rTitle">{item.title}</div>
                            <div className="rDesc">{item.desc}</div>
                            <div className="rMax" >
                                Max people : <b>{item.maxPeople}</b> 
                            </div>
                            <div className="rPrice">Price : {item.price}</div>
                        </div>

                        {item.roomNumbers.map(roomNumber => (
                                <div className="room" key={roomNumber._id}>
                                <label>{roomNumber.number}</label>
                                <input 
                                    type="checkbox" 
                                    value={roomNumber._id} 
                                    onChange={handleSelect}
                                    disabled={!isAvailable(roomNumber)}
                                >

                                </input>
                                </div>
                            ))}
                     
                    
                    </div>
                ))}
                <button onClick={handleClick} className="rButton">Reserve Now!</button>  
            </div>
        </div>
    )
}

export default Reserve