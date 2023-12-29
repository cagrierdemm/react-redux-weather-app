import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCities, fetchWeather } from '../redux/weatherSlice';

function Weather() {
  const cities = useSelector((state) => state.weather.data.cities.data); // tamam
  const citiesStatus = useSelector((state) => state.weather.status.cities);
  const weatherStatus = useSelector((state) => state.weather.status.weather);
  const temps = useSelector((state) => state.weather.data.weather);
  const [city, setCity] = useState(localStorage.getItem("city") || "Adana");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || 'light');
  const daysOfWeek = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const today = new Date().getDay();
  const hour = new Date().getHours();
  const dispatch = useDispatch();

  useEffect(() => {
    if (citiesStatus === 'idle' && weatherStatus === 'idle') {
      dispatch(fetchCities());
      dispatch(fetchWeather(city));
    }
  }, [dispatch, citiesStatus, city, weatherStatus])

  useEffect(() => {
    dispatch(fetchWeather(city));
  }, [dispatch, city])

  useEffect(() => {
    localStorage.setItem("theme", theme);
  },[theme])


  if (citiesStatus === "failed") {
    return <div>Şehir bilgisi çekilemedi!</div>;
  }

  if (weatherStatus === "failed") {
    return <div>Hava durumu getirilemedi!</div>;
  }

  if(!cities || !temps){
    return null;
  }

  const handleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <div>
      {(citiesStatus === "loading") ? (
        <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}><div className="spinner-border text-white" role="status">
          <span className="visually-hidden">Loading...</span>
        </div></div>
      ) : (<div className={`${theme} container box`}>

        <div className='row'>
          <div className='col-lg-8 col-md-12 p-5 pe-lg-0'>
            <div className={`${theme}Box`}>
              <div className='row'>
                <div className='row col-lg-6 col-sm-12 d-flex align-items-center'>
                  <h1 className='text-center pt-2'>{city}</h1>
                </div>
                <div className='col-lg-6 col-sm-12 float-center text-center pt-4 pb-3 '>
                  <label className='me-3' htmlFor='sehir'>Şehir seçiniz:</label>
                  <select id='sehir' onChange={(e) => setCity(e.target.value) || localStorage.setItem("city", e.target.value)} value={localStorage.getItem("city") || "Adana"}>
                    {cities.map((x) => (
                      <option key={x.id} value={x.name}>{x.name}</option>
                    ))}
                  </select>
                </div></div>
            </div>

            <div className={`${theme}Box mt-4`}>
              <div className='row mx-auto  d-flex align-items-center '>
                {temps.list &&
                  <>
                    <div className='col-lg-4 col-sm-4 float-center text-center'>
                      <img className="img-fluid " src={`https://openweathermap.org/img/wn/${temps.list[0].weather[0].icon.slice(0, 2)}d@4x.png`} alt='current weather icon' /></div>
                    <div className="col-lg-4 col-sm-4">
                      <h1 className='display-1 fw-bold text-center'>{temps.list && Math.round(temps.list[0].main.temp) + "°"}</h1>
                    </div>
                    <div className='col-lg-4 col-sm-4 float-start'>
                      <h6 className='fs-5 fw-light text-center'>{temps.list[0].weather[0].description}</h6>
                      <h6 className='fs-6  text-center'><span className='color1'>Hissedilen: </span>{" " + Math.round(temps.list[0].main.feels_like) + "°"}</h6></div>
                  </>
                }</div>
            </div>

            <div className='mt-4'>
              <div className='row mx-auto'>
                {temps.list &&
                  <>
                    <div className={`${theme}Box col-lg-3 flex-fill mb-3 mx-2 col-sm-3 p-4 d-flex align-items-center`}>
                      <div className='row d-flex align-items-center'>
                        <h3 className='col-7 fw-bold fs-4'><span className='color1 fw-light fs-6'>Görüş Mesafesi: </span><br />{Math.round((temps.list[0].visibility) / 1000) + " km"}</h3>
                        <div className='col-5'>
                          <img src={process.env.PUBLIC_URL + '/goz.png'} className={`img-fluid ${theme}Logo2`} alt='eye icon' />
                        </div>
                      </div>
                    </div>
                    <div className={`${theme}Box col-lg-3 flex-fill mb-3 mx-2 col-sm-3 p-4 d-flex align-items-center`}>
                      <div className='row d-flex align-items-center'>
                        <h3 className='col-7 fw-bold fs-4 '><span className='color1 fw-light fs-5'>Nem: </span><br />{temps.list[0].main.humidity + "%"}</h3>
                        <div className='col-5'>
                          <img src={process.env.PUBLIC_URL + '/nem.png'} className={`img-fluid ${theme}Logo2`} alt='humidity icon' />
                        </div>
                      </div>
                    </div>
                    <div className={`${theme}Box col-lg-3 flex-fill mb-3 mx-2 col-sm-3 p-4 d-flex align-items-center`}>
                      <div className='row d-flex align-items-center'>
                        <h3 className='col-7 fw-bold fs-4 '><span className='color1 fw-light fs-5'>Basınç: </span><br />{temps.list[0].main.pressure + " mb"}</h3>
                        <div className='col-5'>
                          <img src={process.env.PUBLIC_URL + '/basinc.png'} className={`img-fluid ${theme}Logo2`} alt='pressure icon' />
                        </div>
                      </div>
                    </div>
                  </>
                }</div>
            </div>

            <div className={`${theme}Box mt-2`}>
              <div className='row mx-auto'>
                <h3 className=' p-3 color1 text-uppercase fs-5 fw-bold text-center'>Günlük Hava Tahmini</h3>
                {temps.list && temps.list.slice(1, 7).map((day, i) => (
                  <div key={i} className='col-6 col-md-2 float-center mx-auto p-2'>
                    <h5 className='color1 text-center fs-6'>{((hour + 3 * i) % 24).toFixed(2).padStart(5, '0')}</h5>
                    <div className="img-fluid text-center"><img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt='weather icon' /></div>
                    <h6 className='color1 text-center fs-6 fw-light'>{day.weather[0].description}</h6>
                    <h4 className='text-center fw-bold'>{day && Math.round(day.main.temp) + "°"}</h4>
                  </div>
                ))}</div>
            </div>

          </div>
          <div className='col-lg-4 col-md-12 px-5 pt-md-5'>
            <div className={`${theme}Box row`}>
              <h3 className='p-4 color1 text-uppercase fs-5 fw-bold text-center'>5 Günlük Hava Tahmini</h3>
              {temps.list && temps.list.slice(1).filter((_, i) => i % 8 === 0).map((day, i) => (
                <div key={i} className='row mx-auto d-flex align-items-center justify-content-center'>
                  <h5 className='color1 col-3 text-start fs-6'>{daysOfWeek[(today + i + 1) % 7]}</h5>
                  <div className="col-3"><img src={`https://openweathermap.org/img/wn/${day.weather[0].icon.slice(0, 2)}d@2x.png`} alt='weather icon' /></div>
                  <h6 className='color1 col-3 ps-4 text-start fs-6 fw-light'>{day.weather[0].description}</h6>
                  <h4 className='col-3 fw-bold'>{day && Math.round(day.main.temp) + "°"}</h4>
                  {i !== temps.list.length / 8 - 1 && <hr />}
                </div>
              ))}</div>
            <div className='row my-5 justify-content-center align-items-center'>
              <div className='col-2' >
                <a href="https://www.github.com/cagrierdemm"><img src={process.env.PUBLIC_URL + '/github.png'} className={`img-fluid logo ${theme}Logo`} alt='github icon' /></a>
              </div>
              <div className='col-2'>
                <a href="https://www.linkedin.com/in/cagrierdemm/"><img src={process.env.PUBLIC_URL + '/linkedin.png'} className={`img-fluid logo ${theme}Logo`} alt='linkedin icon' /></a>
              </div>
              <div className='col-8 d-flex align-items-center justify-content-end'>
                <h6 className=' me-3 ms-2 mt-2'>Dark Mode</h6>
                <label className="switch">
                  <input type="checkbox" id="mode-switch" onClick={handleTheme} defaultChecked={(theme === "dark")} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>)}

    </div>
  )
}

export default Weather