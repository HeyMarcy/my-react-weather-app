import React from 'react';
import './ContainerWeather.css';


export default class ContainerWeather extends React.Component {
  render(props) {
    const Title = this.props.city ? null : <h1 className='title'>Weather Forecast</h1>;
console.log('props', this.props)
    return (
      <div className='main'>
        <div className='inner-main'>
          {Title}
          <img
            src={
              this.props.currentConditions
                ? require(`../images/${this.props.currentConditions.icon}.svg`)
                : require('../images/01d.svg')
            }
            alt='sun'
            style={{
              visibility: this.props.city ? 'visible' : 'hidden',
              opacity: this.props.city ? '1' : '0'
            }}
          />

          <div
            className='today'
            style={{
              visibility: this.props.city ? 'visible' : 'hidden',
              opacity: this.props.city ? '1' : '0'
            }}
          >
            <span>Currently in</span>
            <h1>{this.props.city}</h1>
            <p>
              Temperature: {this.props.currentConditions ? Math.round(this.props.currentConditions.temp) : 0}
              °F
            </p>
            <p>{this.props.currentConditions ? this.props.currentConditions.weather_desc.toLowerCase() : ''}</p>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
