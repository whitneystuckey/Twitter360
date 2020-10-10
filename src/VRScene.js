import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'babel-polyfill';
import Skybox from './assets/Skyboxes/TimesSquare.jpg';
import PanelDesign from './assets/PanelDesign/PanelDesign.png';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

{/**/}

{/*Set Panels rotation and position*/}
const radius = 10;
const positions = []

let degrees = 0
let rotation = -90

for (let i = 0; i < 8; i++) {
    let xPos = Math.cos(degrees) * radius
    let zPos = Math.sin(degrees) * radius

    let orientation = {}

    orientation.position = `${xPos} -2 ${zPos}`
    orientation.rotation = `-10 ${rotation} 0`
    positions.push(orientation)

    orientation = {}

    orientation.position = `${xPos} 3 ${zPos}`
    orientation.rotation = `-10 ${rotation} 0`
    positions.push(orientation)

    orientation = {}

    orientation.position = `${xPos} 8 ${zPos}`
    orientation.rotation = `-10 ${rotation} 0`
    positions.push(orientation)

    degrees += Math.PI/4
    rotation -= 45
}




class VRScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {color: 'red'};
  }

  render () {
    return (
      <Scene renderer=
      "antialias: true"
      >
        <a-assets>
          {/*Skybox*/}
          <img id="skyTexture" src={Skybox}/>
          <img id="tweetTexture" src={PanelDesign}/>
        </a-assets>

        <Entity primitive="a-sky" src="#skyTexture" rotation="0 -130 0"/>

        {/*Tweet Panels*/}
        {
          positions.map(({rotation, position}) => (
            <Entity
              primitive="a-plane"
              src="#tweetTexture"
              material= {{opacity: 0.99}}
              rotation={rotation}
              position={position}
              scale="5 3"
              event-set__mouseenter="scale: 1.2 1.2 1"
              event-set__mouseleave="scale: 1 1 1"
            />
          ))
        }
      </Scene>
    );
  }
}

ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));
