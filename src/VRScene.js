import "aframe";
import "aframe-particle-system-component";
import "aframe-htmlembed-component";
import "aframe-html-shader";
import "babel-polyfill";
import Skybox from "./assets/Skyboxes/TimesSquare.jpg";
import Ground from "./assets/groundPlane.png";
import TweetTexture from "./assets/sampleTweet.jpg";
import CityAmbience from "./assets/Ambience/new-york-street-ambience.wav";
import UrbanPanelDesign from "./assets/Themes/Urban/PanelDesign.png";
import NaturePanelDesign from "./assets/Themes/Nature/PanelDesign.png";
import BlackGoldPanelDesign from "./assets/Themes/BlackGold/PanelDesign.png";
import UrbanButtonDesign from "./assets/Themes/Urban/ButtonDesign.png";
import NatureButtonDesign from "./assets/Themes/Nature/ButtonDesign.png";
import BlackGoldButtonDesign from "./assets/Themes/BlackGold/ButtonDesign.png";
import TweetOne from "./assets/TweetOne.png";
import TweetTwo from "./assets/TweetTwo.png";
import { Entity, Scene } from "aframe-react";
import React from "react";
import ReactDOM from "react-dom";

{ /* Set Panels rotation and position*/ }
let planeRadius = 10;
let closeRadius = 4;
const panelPositions = [];

let degrees = 0;
let rotation = -90;

for (let i = 0; i < 8; i++) {
	let xPos = Math.cos(degrees) * planeRadius;
	let zPos = Math.sin(degrees) * planeRadius;

	let orientation = {};

	orientation.position = `${xPos} 3 ${zPos}`;
	orientation.rotation = `-10 ${rotation} 0`;
	panelPositions.push(orientation);

	degrees += Math.PI / 4;
	rotation -= 45;
}

let tweetRadius = planeRadius + 0.5 ;
let tweetPositions = [];

degrees = 0;
rotation = -90;

for (let i = 0; i < 8; i++) {
	let xPos = Math.cos(degrees) * tweetRadius;
	let zPos = Math.sin(degrees) * tweetRadius;

	let orientation = {};

	orientation.position = `${xPos} 3 ${zPos}`;
	orientation.rotation = `0 ${rotation} 0`;
	tweetPositions.push(orientation);

	degrees += Math.PI / 4;
	rotation -= 45;
}

let img = document.createElement("img");

img.id = "TweetOne";
img.setAttribute("src", TweetOne);

document.body.appendChild(img);


class VRScene extends React.Component {
	constructor(props) {
		super(props);
		this.state = { audibleSound: true };
	}

	focusedPanel = "";

	render () {
		return (
			<div>
				<Scene renderer = "antialias: true">
					{ /* Skybox and Ground*/ }
					<a-assets>
						<img id = "skyTexture" src = { Skybox } />
						<img id = "groundTexture" src = { Ground } />
						<img id = "tweetTexture" src = { TweetTexture } />
						<img id = "panelTexture" src = { UrbanPanelDesign } />
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
							fuse
							primitive = "a-cursor"
							animation__click = {{ property: "scale", startEvents: "click", from: "0.1 0.1 0.1", to: "1 1 1", dur: 150 }}
							animation__fusing = "property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; from: 1 1 1; to: 0.1 0.1 0.1"
						/>
					</Entity>

					{ /* Tweet Panels:
				Tweet Scale: 4.2 2.2
				Panel Scale: 5.0 3.0*/ }

					{
						tweetPositions.map(({ rotation, position }, index) => (
							<Entity
								id = { `tweet+${index}` }
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
						panelPositions.map(({ rotation, position }, index) => (
							<Entity
								id = { `panel+${index}` }
								primitive = "a-plane"
								src = "#panelTexture"
								material = {{ opacity: 0.99, shader: "standard", emissive: "#1DA1F2", emissiveIntensity: "0.75" }}
								rotation = { rotation }
								position = { position }
								scale = "3 4"
								events = {{
									click: ({ target: { object3D } }) => {
										let degrees = Math.acos(object3D.position.x / planeRadius);
										let xPos = Math.cos(degrees) * closeRadius;
										let zPos = Math.sin(degrees) * closeRadius;

										object3D.position.set(xPos, 3, (zPos * Math.sign(object3D.position.z)));

										let panelObj3d = document.getElementById(`tweet+${index}`).object3D;

										xPos = Math.cos(degrees) * (closeRadius + 0.5);
										zPos = Math.sin(degrees) * (closeRadius + 0.5);

										panelObj3d.position.set(xPos, 3, (zPos * Math.sign(panelObj3d.position.z)));
										this.focusedPanel = `panel+${index}`;
									},
									mouseenter: ({ target: { object3D } }) => {
										object3D.scale.x += 1;
										object3D.scale.y += 1;
									},
									mouseleave: ({ target: { object3D } }) => {
										object3D.scale.x -= 1;
										object3D.scale.y -= 1;
									}
								}}
							>
							</Entity>
						))
					}
					<Entity primitive = "a-box" color = "red" material = {{ shader: "html", target: "#TweetOne" }}></Entity>
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