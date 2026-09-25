import React, { useEffect } from 'react'
import {
  HashRouter as Router,
  Route, Routes
} from 'react-router-dom';

import Calculator from './components/Calculator';
import DataSearch from './components/DataSearch';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Logo from './components/Logo';
import BoxRate from './components/BoxRate';
import BoxSearch from './components/BoxSearch';
import BoxUniversal from './components/BoxUniversal';
import BoxUniversalSearch from './components/BoxUniversalSearch';
import CorrugatedCalculator from './components/CorrugatedCalculator';
import CorrugatedData from './components/CorrugatedData';
import { ensureAllEnvJsonFiles } from './utils/jsonFile';

function App() {
  useEffect(() => {
    ensureAllEnvJsonFiles().catch((err) => {
      console.error("Unable to initialize database files:", err);
    });
  }, []);

  return (
    <div className="App text-Roboto h-screen overflow-hidden">

      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Logo />} />
          <Route path='/rate_calculator' element={<Calculator />} />
          <Route path='/data_search' element={<DataSearch />} />
          <Route path='/box_rate' element={<BoxRate />} />
          <Route path='/box_search' element={<BoxSearch/>} />
          <Route path='/box_universal' element={<BoxUniversal/>} />
          <Route path='/box_universal_search' element={<BoxUniversalSearch/>} />
          <Route path='/corrugated_calculator' element={<CorrugatedCalculator />} />
          <Route path='/corrugated_data' element={<CorrugatedData />} />



          <Route path='/loading' element={<Loading />} />
        </Routes>
        <Footer />
      </Router>
      
    </div>
  );
}

export default App;
