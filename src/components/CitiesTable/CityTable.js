import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import "./CityTable.css";
import AutoComplete from "../AutoCompleteInput/AutoComplete";
import { MdSort } from "react-icons/md";
import Sort from "../Sort/Sort";
import { useNavigate } from "react-router-dom";

const CityTable = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(false);
  const navigate = useNavigate();

  const sortObject = useRef({
    column: "", // Tracks the column being sorted (population, name, etc.)
    direction: "asc", // Tracks sort direction (asc/desc)
  });

  const fetchCities = useCallback(async () => {
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
        toast.error(
          `API Error: ${error.response.data.message || "Something went wrong!"}`
        );
      } else if (error.request) {
        toast.error(
          "Network Error: unable to reach the API. Please check your connection."
        );
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchCities();
  }, [offset, fetchCities]);

  const handleScroll = useCallback(() => {
    const tableBody = document.querySelector(".table_body");
    if (tableBody) {
      const scrollTop = tableBody.scrollTop;
      const tableHeight = tableBody.offsetHeight;
      const scrollHeight = tableBody.scrollHeight;

      if (
        scrollTop + tableHeight >= scrollHeight * 0.8 &&
        !loading &&
        hasMore
      ) {
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
    };
  }, [handleScroll]);

  const retryFetch = () => {
    setRetry((prev) => !prev); // Toggle the retry state
    fetchCities(); // Re-fetch cities data on retry
  };

  const filteredDataFromInput = useCallback(
    (dataFromInput) => {
      if (dataFromInput.length === 0) {
        setCitiesData([]); // Clear the table data
        fetchCities(); // Fetch and reset original data
      } else {
        setCitiesData(dataFromInput); // Set the filtered data
      }
    },
    [fetchCities]
  );

  const sortData = useCallback(
    (column) => {
      const direction = sortObject.current.direction === "asc" ? "desc" : "asc";

      const sortedCities = [...citiesData].sort((a, b) => {
        if (a[column] < b[column]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[column] > b[column]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });

      setCitiesData(sortedCities);
      sortObject.current = { column, direction };
    },
    [citiesData]
  );

  const handleCityClick = (city) => {
    navigate(`/city/${city.geoname_id}`, { state: { city } });
  };

  const handleCityRightClick = (event, city) => {
    event.preventDefault(); // Prevent the default context menu
    const newTab = window.open(`/city/${city.geoname_id}`, "_blank");
    newTab.focus(); // Focus on the newly opened tab
  };

  return (
    <div className="cities_table_bg_container">
      <div className="heading_input_wrapper">
        <h1 className="cities_heading">Cities Weather Forecast Table</h1>
        <AutoComplete
          data={citiesData}
          filteredDataFromInput={filteredDataFromInput}
        />
      </div>

      <div className="table_container">
        <table>
          <thead>
            <tr>
              <th>
                Name
                <Sort
                  column="name"
                  sortData={sortData}
                  sortState={sortObject.current}
                />
              </th>
              <th>
                Country Name
                <Sort
                  column="cou_name_en"
                  sortData={sortData}
                  sortState={sortObject.current}
                />
              </th>
              <th>
                Population
                <Sort
                  column="population"
                  sortData={sortData}
                  sortState={sortObject.current}
                />
              </th>
              <th>
                Timezone
                <Sort
                  column="timezone"
                  sortData={sortData}
                  sortState={sortObject.current}
                />
              </th>
            </tr>
          </thead>
          <tbody
            className="table_body"
            data-aos="fade-up"
            // data-aos='slide-up'
            data-aos-offset="200"
            data-aos-delay="0"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            // data-aos-mirror="true"
            // data-aos-once="false"
            // data-aos-anchor-placement="top-center"
          >
            {citiesData.map((city, index) => (
              <tr key={index}>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCityClick(city)}
                  onContextMenu={(event) => handleCityRightClick(event, city)}
                >
                  {city.name}
                </td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCityClick(city)}
                  onContextMenu={(event) => handleCityRightClick(event, city)}
                >
                  {city.cou_name_en}
                </td>
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
