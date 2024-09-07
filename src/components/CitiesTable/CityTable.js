import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";

const CityTable = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore,setHasMore]=useState(true)
  const [error,setError]=useState(null)
  const [retry,setRetry]=useState(false)

  const fetchCities = useCallback( async () => {
    try {
      setLoading(true);
      setError(null)
      const url = `${process.env.REACT_APP_CITIES_API}&offset=${offset}`;
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("response", response);
      await new Promise((resolve)=>{
        setTimeout(resolve,500)
      })


      if (response.status === 200) {
        const data = response.data.results;


        // setCitiesData(response.data.results);
        setCitiesData(prevCities=>[...prevCities,...data])

        if (data.length < 20) {  // Assuming you expect 20 results per call
          setHasMore(false);  // No more data to fetch
        } else {
          setHasMore(true);   // Continue fetching
        }

        toast.success("Cities fetched successfully!");
      } else {
        toast.error(`Error: Recieved status code ${response.status}`);
      }
    } catch (error) {
      setError(error)
      if (error.response) {
        //api responded with other than 2xx
        toast.error(
          `API Error: ${error.response.data.message || "Something went wrong!"}`
        );
      } else if (error.request) {
        //request was made, but no reponse is recived
        toast.error(
          "Network Error: unable to react the API. Please check your connection"
        );
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
     
     
    }
  },[offset]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const handleScroll = useCallback(()=>{

    //scroll postion from top of the web page
    const scrollTop = document.documentElement.scrollTop
    //height of the visible page
    const windowHeight = window.innerHeight
    //total height of the body including visible and un-visible part
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + windowHeight >= scrollHeight*0.8 && !loading && hasMore){

      setOffset(prev=>prev+20)
      
     
    }

  },[loading,hasMore])


  useEffect(()=>{
    window.addEventListener('scroll',handleScroll)
    return ()=>{
      window.removeEventListener('scroll',handleScroll)
    }
  },[handleScroll])


  const retryFetch =()=>{
    setRetry(!retry)
  }


  return (
    <div style={{padding:'15px'}}>
      
      {/* <ul>
        {citiesData.length > 0
          && citiesData.map((each, index) => (
              <li style={{backgroundColor:"lightgray",height:'150px',listStyleType:'none',margin:'10px'}} key={index}>{each.geoname_id}</li>
            ))
          }
      </ul> */}
      <table style={{margin:'auto', width: '80%', textAlign: 'center', borderCollapse: 'collapse' }}>
  <thead style={{
    position:'sticky',
    top:0,
    backgroundColor:'lightgray',
    zIndex:1
  }}>
    <tr>
      <th style={{ border: '1px solid #000' }}>City Name</th>
      <th style={{ border: '1px solid #000' }}>Country Name</th>
      <th style={{ border: '1px solid #000' }}>Population</th>
      <th style={{ border: '1px solid #000' }}>Time zone</th>
    </tr>
  </thead>
  <tbody>
    {citiesData.map((city, index) => (
      <tr key={index} style={{ height: '150px' }}>
        <td style={{ border: '1px solid #000' }}>{city.name}</td>
        <td style={{ border: '1px solid #000' }}>{city.cou_name_en}</td>
        <td style={{ border: '1px solid #000' }}>{city.population}</td>
        <td style={{ border: '1px solid #000' }}>{city.timezone}</td>
      </tr>
    ))}
  </tbody>
</table>

      {/* <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>City Name</th>
            <th>Country</th>
            <th>Timezone</th>
            <th>Population</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {citiesData.length > 0 &&
            citiesData.map((city, index) => (
              <tr key={index} style={{height:'150px'}}>
                <td>{city.name}</td>
                <td>{city?.country?.name || "N/A"}</td>
                <td>{city?.timezone?.name || "N/A"}</td>
                <td>{city?.population || "N/A"}</td>
                <td>{city?.location?.lat || "N/A"}</td>
                <td>{city?.location?.lon || "N/A"}</td>
              </tr>
            ))}
        </tbody>
      </table> */}



      {loading ? (
        <DNA
          visible={true}  
          height="80"
          width="80"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      ) : (
        ""
      )}



      {
        error && (
          <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
            <p>Failed to load data. Please try again</p>
            <button onClick={()=>retryFetch}
               style={{ padding: "10px", cursor: "pointer" }}
              >retry</button>
          </div>
        )
      }

      <ToastContainer position="top-right" autoClose={500}
      hideProgressBar={true}
      />
    </div>
  );
};

export default CityTable;
