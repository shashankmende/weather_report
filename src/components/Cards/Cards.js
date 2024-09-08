
import React from 'react'
import { IoIosInformationCircleOutline } from "react-icons/io";
import './Cards.css'


const Cards = ({item,value}) => {
  return (
    <div className='cards_container'>
        {/* <p>{item}<IoIosInformationCircleOutline/></p> */}
        <p>{item}</p>
        <p>{value}</p>
    </div>
  )
}

export default Cards