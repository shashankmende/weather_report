import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import "./AutoComplete.css";
import debounce from 'lodash.debounce';


const AutoComplete = ({ data, filteredDataFromInput }) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([...data]);

  // Options for Select component
  const options = filteredData.map((city) => ({
    label: `${city.cou_name_en} - ${city.geoname_id}`,
    value: city.geoname_id,
  }));


  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#f0f0f0', // Background color for the select control
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#ffffff', // Background color for the dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#e0e0e0' : '#ffffff', // Background color for options
      color: state.isSelected ? '#000000' : '#333333', // Text color for options
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333333', // Text color for the selected value
    }),
  };



const debouncedSearch = useCallback(
    debounce((inputValue) => {
        if (inputValue.trim()===""){
            setFilteredData(data)
            
            filteredDataFromInput(data)

        }
        else{
            const filterResult = data.filter((city) =>
                city.cou_name_en.toLowerCase().includes(inputValue.toLowerCase())
              );
              setFilteredData(filterResult);

        }
      
      
    }, 300),
    [data] // only recreate debounced function if data changes
  );


const handleSearchChange = (e)=>{
    const inputValue = e.target.value 
    setSearchText(inputValue)
    debouncedSearch(inputValue)


}



  // Handle select dropdown changes
  const onHandleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setSearchText(selectedOption.label);

      const filterResult = data.filter(
        (city) => city.geoname_id === selectedOption.value
      );

      setFilteredData(filterResult);
      filteredDataFromInput(filterResult); // Pass filtered data to parent
    } else {
      // Reset when nothing is selected
      setSearchText("");
      
      setFilteredData(data);
filteredDataFromInput(data); // Reset the parent's state

    }
  };



  return (
    <div style={{position:'relative'}}>
      <input
        className="search_input"
        type="search"
        placeholder="Enter your city"
        value={searchText}
        onChange={handleSearchChange}
        name="search_by_city"
      />
      
      {/* No Data Found Message */}
      {/* {filteredData.length === 0 && <p>No data found...</p>} */}

      {/* Dropdown only when data is available */}
      <div style={{position:'absolute',width:'100%'}}>
      {filteredData.length>0 && (
        <Select
          value={null} // Only set to null when no specific option is selected
          onChange={onHandleSelectChange}
          options={options}
          placeholder="Search..."
          isClearable
          styles={customStyles}
        />
      )}
      </div>
    </div>
  );
};

export default AutoComplete;
