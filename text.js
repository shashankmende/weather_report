import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import './CityTable.css'
import AutoComplete from "../AutoCompleteInput/AutoComplete";
import { MdSort } from "react-icons/md";

const CityTable = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);

  const fetchCities = useCallback(async () => {
    console.log('Fetching cities with offset:', offset);
    try {
      setLoading(true);
      setError(null);
      const url = `${process.env.REACT_APP_CITIES_API}&offset=${offset}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      if (response.status === 200) {
        const data = response.data.results;
        console.log('Fetched data:', data);
        setCitiesData((prevCities) => [...prevCities, ...data]);

        if (data.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        toast.success("Cities fetched successfully!");
      } else {
        toast.error(`Error: Received status code ${response.status}`);
      }
    } catch (error) {
      setError(error);
      if (error.response) {
        toast.error(`API Error: ${error.response.data.message || "Something went wrong!"}`);
      } else if (error.request) {
        toast.error("Network Error: unable to reach the API. Please check your connection.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    console.log('Fetching cities due to offset change:', offset);
    fetchCities();
  }, [offset, fetchCities]);

  const handleScroll = useCallback(() => {
    const tableBody = document.querySelector(".table_body");
    if (tableBody) {
      const scrollTop = tableBody.scrollTop;
      const tableHeight = tableBody.offsetHeight;
      const scrollHeight = tableBody.scrollHeight;

      console.log('ScrollTop:', scrollTop, 'TableHeight:', tableHeight, 'ScrollHeight:', scrollHeight);
      
      if (scrollTop + tableHeight >= scrollHeight * 0.8 && !loading && hasMore) {
        console.log('Triggering fetch');
        setOffset((prev) => prev + 20);
      }
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const tableBody = document.querySelector(".table_body");
    if (tableBody) {
      tableBody.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (tableBody) {
        tableBody.removeEventListener("scroll", handleScroll);
      }
    }
  }, [handleScroll]);

  const retryFetch = () => {
    setRetry((prev) => !prev); // Toggle the retry state
    fetchCities(); // Re-fetch cities data on retry
  };

  const filteredDataFromInput = useCallback((dataFromInput) => {
    if (dataFromInput.length === 0) {
      setCitiesData([]); // Clear the table data
      fetchCities(); // Fetch and reset original data
    } else {
      setCitiesData(dataFromInput); // Set the filtered data
    }
  }, [fetchCities]);

  return (
    <div className="cities_table_bg_container">
      <div className="heading_input_wrapper">
        <h1 className="cities_heading">Cities Weather Forecast Table</h1>
        <AutoComplete data={citiesData} filteredDataFromInput={filteredDataFromInput} />
      </div>
      <div className="table_wrapper">
    <table className="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Country Name</th>
                <th>Population</th>
                <th>Timezone</th>
            </tr>
        </thead>
        <tbody className="table_body">
            {citiesData.map((city, index) => (
                <tr key={index}>
                    <td>{city.name}</td>
                    <td>{city.cou_name_en}</td>
                    <td>{city.population}</td>
                    <td>{city.timezone}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>



      {loading && (
        <DNA
          visible={true}
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      )}

      {error && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          <p>Failed to load data. Please try again</p>
          <button
            onClick={retryFetch}
            style={{ padding: "10px", cursor: "pointer" }}
          >
            retry
          </button>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={true}
      />
    </div>
  );
};

export default CityTable;
