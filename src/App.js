import react from 'react'
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

function App() {
  return (
    <div className="App text-Roboto h-screen overflow-hidden bg-gradient-to-tr from-neutral-700 via-gray-800 to-neutral-900">

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



          <Route path='/loading' element={<Loading />} />
        </Routes>
        <Footer />
      </Router>
      
    </div>
  );
}

export default App;
