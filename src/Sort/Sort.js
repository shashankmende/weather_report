

import React from 'react'
import { MdSort } from "react-icons/md";
import './Sort.css'

// const Sort = (props) => {
  
const Sort = ({sortData,column,sortState}) => {

  const isCurrentColumn = column === sortState.column;
  const direction = isCurrentColumn? sortState.direction:"asc"




  return (
    <div className="sort_bg_container">
      <button
        onClick={() => sortData(column)}
        className={`sort-button ${direction}`}
      >
        <MdSort />
        {direction === "asc" ? "▲" : "▼"}
      </button>
    </div>
  )
}

export default Sort