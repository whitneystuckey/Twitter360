import 'aframe';
import 'aframe-particle-system-component';
import 'aframe-htmlembed-component'
import 'aframe-html-shader'
import 'babel-polyfill';
import Skybox from './assets/Skyboxes/TimesSquare.jpg';
import Ground from './assets/groundPlane.png'
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
	  <Scene 
	  renderer="antialias: true"
	  cursor="rayOrigin: mouse"
	  >
        {/*Skybox*/}
        <a-assets>
          <img id="skyTexture" src={Skybox}/>
          <img id="groundTexture" src={Ground}/>
          <img id="tweetTexture" src={PanelDesign}/>
        </a-assets>
        <Entity
          primitive="a-plane"
          src="#groundTexture"
          material={{opacity: 0.99}}
          rotation="-90 0 0"
          position="0 -8 0"
          scale="25 25"
          animation={"property: rotation; to: -90 360000 0; loop: true; dur: 1000000"}
        />
        <Entity primitive="a-sky" src="#skyTexture" rotation="0 -130 0"/>

        {/*Tweet Panels*/}
        {
          positions.map(({rotation, position}) => (
            <Entity
              primitive="a-plane"
              src="#tweetTexture"
              material={{opacity: 0.99}}
              rotation={rotation}
              position={position}
              scale="5 3"
              events={{
				  mouseenter: (eg) => eg.target.setAttribute("scale", "6. 4"),
				  mouseleave: (eg) => eg.target.setAttribute("scale", "5. 3")
				}}
            >
				
			</Entity>
          ))
        }
		{/* <Entity htmlembed={{}}>
				<div style={{backgroundColor: "red", width: "100", height: "100"}}>Hello</div>
			</Entity> */}

		<Entity primitive="a-plane" rotation="-90 0 0" material={{shader: "html", target: "#htmlElement"}}></Entity>
      </Scene>
    );
  }
}



ReactDOM.render(<VRScene/>, document.querySelector('#sceneContainer'));
