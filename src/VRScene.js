import 'aframe';
import 'aframe-particle-system-component';
import 'aframe-htmlembed-component'
import 'aframe-html-shader'
import 'babel-polyfill';
import Skybox from './assets/Skyboxes/TimesSquare.jpg';
import Ground from './assets/groundPlane.png'
import PanelDesign from "./assets/PanelDesign/PanelDesign.png";
import TweetTexture from "./assets/sampleTweet.jpg";
import CityAmbience from "./assets/Ambience/new-york-street-ambience.wav";
import UrbanPanelDesign from './assets/Themes/Urban/PanelDesign.png';
import NaturePanelDesign from './assets/Themes/Nature/PanelDesign.png';
import BlackGoldPanelDesign from './assets/Themes/BlackGold/PanelDesign.png';
import UrbanButtonDesign from './assets/Themes/Urban/ButtonDesign.png';
import NatureButtonDesign from './assets/Themes/Nature/ButtonDesign.png';
import BlackGoldButtonDesign from './assets/Themes/BlackGold/ButtonDesign.png';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

{ /* Set Panels rotation and position*/ }
let radius = 10;
const panelPositions = [];

let degrees = 0;
let rotation = -90;

for (let i = 0; i < 8; i++) {
	let xPos = Math.cos(degrees) * radius;
	let zPos = Math.sin(degrees) * radius;

	let orientation = {};

	orientation.position = `${xPos} 3 ${zPos}`;
	orientation.rotation = `-10 ${rotation} 0`;
	panelPositions.push(orientation);

	degrees += Math.PI / 4;
	rotation -= 45;
}

radius += 0.5;
let tweetPositions = [];

degrees = 0;
rotation = -90;

for (let i = 0; i < 8; i++) {
	let xPos = Math.cos(degrees) * radius;
	let zPos = Math.sin(degrees) * radius;

	let orientation = {};

	/*
	 * orientation.position = `${xPos} -2 ${zPos}`
	 * orientation.rotation = `-10 ${rotation} 0`
	 * positions.push(orientation)
	 *
	 * orientation = {}
	 */

	orientation.position = `${xPos} 3 ${zPos}`;
	orientation.rotation = `0 ${rotation} 0`;
	tweetPositions.push(orientation);
	/*
	 *
	 * orientation = {}
	 *
	 * orientation.position = `${xPos} 8 ${zPos}`
	 * orientation.rotation = `-10 ${rotation} 0`
	 * positions.push(orientation)
	 */

	degrees += Math.PI / 4;
	rotation -= 45;
}

class VRScene extends React.Component {
	constructor(props) {
		super(props);
		this.state = { audibleSound: true };
	}

	render () {
		return (
			<div>
				<Scene renderer = "antialias: true">
					{ /* Skybox and Ground*/ }
					<a-assets>
						<img id = "skyTexture" src = { Skybox } />
						<img id = "groundTexture" src = { Ground } />
						<img id = "tweetTexture" src = { TweetTexture } />
						<img id = "panelTexture" src = { PanelDesign } />
						<audio id = "ambience" src = { CityAmbience } />
					</a-assets>
					<Entity
						primitive = "a-plane"
						src = "#groundTexture"
						material = {{ opacity: 0.99 }}
						rotation = "-90 0 0"
						position = "0 -9 0"
						scale = "25 25"
						animation = { "property: rotation; to: -90 360000 0; loop: true; dur: 1000000" }
					/>
					<Entity primitive = "a-sky" src = "#skyTexture" rotation = "0 -130 0" />

					{ /* Mouse-to-Movement Control*/ }
					<Entity
						primitive = "a-camera"
						fov = "70"
						look-controls = "pointerLockEnabled: true;"
					>
						<Entity
							primitive = "a-cursor"
							animation__click = {{ property: "scale", startEvents: "click", from: "0.1 0.1 0.1", to: "1 1 1", dur: 150 }}
						/>
					</Entity>

					{ /* Tweet Panels:
				Tweet Scale: 4.2 2.2
				Panel Scale: 5.0 3.0*/ }

					{
						tweetPositions.map(({ rotation, position }) => (
							<Entity
								primitive = "a-plane"
								src = "#tweetTexture"
								material = {{ opacity: 0.99, shader: "flat" }}
								rotation = { rotation }
								position = { position }
								scale = "4.2 2.2"
							>
							</Entity>
						))
					}

					{
						panelPositions.map(({ rotation, position }) => (
							<Entity
								primitive = "a-plane"
								src = "#panelTexture"
								material = {{ opacity: 0.99, shader: "standard", emissive: "#1DA1F2", emissiveIntensity: "0.75" }}
								rotation = { rotation }
								position = { position }
								scale = "5 3"
								events = {{
									mouseenter: (eg) => eg.target.setAttribute("scale", "5.5. 3.5"),
									mouseleave: (eg) => eg.target.setAttribute("scale", "5. 3")
								}}
							>
							</Entity>
						))
					}
					<a-sound src = "#ambience" autoplay = "true" position = "0 1.6 0" loop volume = { this.state.audibleSound ? ".3" : "0" }></a-sound>
				</Scene>
				<div style = {{ zIndex: 1, position: "absolute" }}>
					<div
						style = {{ height: 100, width: 100, backgroundColor: this.state.audibleSound ? "red" : "yellow" }}
						onClick = { () => this.setState({ audibleSound: !this.state.audibleSound }) }
					>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<VRScene />, document.querySelector("#sceneContainer"));