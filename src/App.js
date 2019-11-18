import React from 'react';
import './App.css';
import ContainerWeather from './components/ContainerWeather';
import CityInput from './components/CityInput';
import DayCard from './components/DayCard';

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function parseJSON(response) {
  return response.json();
}

class App extends React.Component {
  state = {
    city: undefined,
    days: new Array(4)
  };

  // creates the day objects and updates the state
  updateForcastState = data => {
    const days = [];
    const dayIndices = this.getDayIndices(data);

    for (let i = 0; i < 4; i++) {
      days.push({
        date: data.list[dayIndices[i]].dt_txt,
        weather_desc: data.list[dayIndices[i]].weather[0].description,
        icon: data.list[dayIndices[i]].weather[0].icon,
        id: data.list[dayIndices[i]].weather[0].id,
        temp: data.list[dayIndices[i]].main.temp
      });
    }

    this.setState({
      // currentConditions: currentConditions,
      // city: city,
      days: days
    });
  };
  updateCurrentConditionsState = data => {
    const city = data.name;
 
    const currentConditions = {
      weather_desc: data.weather[0].description,
      icon: data.weather[0].icon,
      id: data.weather[0].id,
      temp: data.main.temp
    }
    this.setState({
      currentConditions: currentConditions,
      city: city,
    });
  };

  // tries to make an API call with the given city name and triggers state update
  makeApiCall = async city => {
    const urls = [
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${process.env.REACT_APP_API_KEY}`,
      `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=${process.env.REACT_APP_API_KEY}`
    ];
 
    Promise.all(urls.map(url =>
      fetch(url)
      .then(checkStatus)                 
      .then(parseJSON)
      .catch(error => console.log('There was a problem!', error))
  ))
  .then(data => {
    const currentWeather = data[0];
    const forecast = data[1];
    this.updateCurrentConditionsState(currentWeather);
    this.updateForcastState(forecast);
  })
}


  // returns array with Indices of the next five days in the list
  // from the API data (every day at 12:00 pm)
  getDayIndices = data => {
    let dayIndices = [];
    dayIndices.push(0);

    let index = 0;
    let tmp = data.list[index].dt_txt.slice(8, 10);

    for (let i = 0; i < 4; i++) {
      while (
        tmp === data.list[index].dt_txt.slice(8, 10) ||
        data.list[index].dt_txt.slice(11, 13) !== '15'
      ) {
        index++;
      }
      dayIndices.push(index);
      tmp = data.list[index].dt_txt.slice(8, 10);
    }
    return dayIndices;
  };

  render() {
    const DayCards = () => {
      const DayCards = this.state.days.map(day => (
        <li>
          <DayCard {...day} />
        </li>
      ));

      return <ul className='weather-box-list'>{DayCards}</ul>;
    };
console.log(this.state.days)
    return (
      <div className='App'>
        <header className='App-header'>
          <ContainerWeather city={this.state.city} currentConditions={this.state.currentConditions}>
            <CityInput city={this.state.city} makeApiCall={this.makeApiCall.bind(this)} />
            <DayCards />
          </ContainerWeather>
        </header>
      </div>
    );
  }
}

export default App;
