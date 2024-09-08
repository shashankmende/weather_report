
import  {  BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css';
import CityTable from './components/CitiesTable/CityTable';
import WeatherReport from './components/WeatherReport/WeatherReport';

function App() {
  return (
    <div className="App">
        
        <Router>
          <Routes>
            
            
          <Route exact path='/' element={<CityTable/>}/>
          <Route exact path='/city/:id' element={<WeatherReport/>}/>

          </Routes>
        </Router>
    </div>
  );
}

export default App;
