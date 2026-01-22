import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login/login'
import CharacterPage from '../components/GetRoom/PageComponents/CharacterPage';
import RegistrationForm from '../components/Register/RegistrationForm';
import RoomsPage from '../components/GetRoom/RoomsPage';
import Main from '../components/LandingPage/Main';
// import HotelPage from '../components/GetHotel/HotelPage';
import AboutPage from '../components/About/AboutPage';
import ConnectPage from '../components/ConnectUs/ConnectPage';
// import Setting from '../components/LandingPage/PageComponents/Setting';

function Index() {
  return (
    <>
    <Routes>
      <Route path='/login' element={<Login />} />
      {/* <Route path='/player' element={<Player />} /> */}
      {/* <Route path='/hotel' element={<HotelPage />} /> */}
      <Route path='/' element={<Main />} />
      <Route path='/register' element={<RegistrationForm />} />
      <Route path='/room' element={<RoomsPage />} />
      <Route path='/about' element={<AboutPage/>} />
      <Route path='/connectus' element={<ConnectPage/>} />
      <Route path='/character/:id' element={<CharacterPage/>} />
      {/* <Route path='/setting' element={<Setting/>} /> */}
    </Routes>
    </>
  );
}

export default Index;
