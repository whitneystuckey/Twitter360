import "aframe";
import "aframe-particle-system-component";
import "aframe-htmlembed-component";
import "aframe-html-shader";
import "babel-polyfill";
import TimesSquare from "./assets/Skyboxes/TimesSquare.jpg";
import Rio from "./assets/Skyboxes/Rio.jpg";
import UCF from "./assets/Skyboxes/UCF.jpg";
import UrbanGround from "./assets/groundPlane.png";
import BlackGoldGround from "./assets/groundPlaneBlackGold.png"
import CityAmbience from "./assets/Ambience/new-york-street-ambience.wav";
import UrbanPanelDesign from "./assets/Themes/Urban/PanelDesign.png";
import NaturePanelDesign from "./assets/Themes/Nature/PanelDesign.png";
import BlackGoldPanelDesign from "./assets/Themes/BlackGold/PanelDesign.png";
import UrbanButtonDesign from "./assets/Themes/Urban/ButtonDesign.png";
import NatureButtonDesign from "./assets/Themes/Nature/ButtonDesign.png";
import BlackGoldButtonDesign from "./assets/Themes/BlackGold/ButtonDesign.png";
import { Entity, Scene } from "aframe-react";
import React from "react";
import { IoMdVolumeOff, IoMdVolumeHigh, IoMdArrowBack } from "react-icons/io";
import { NYTweets } from "./assets/Tweets/TimeSquare";
import { RioTweets } from "./assets/Tweets/Rio";
import { UCFTweets } from "./assets/Tweets/UCF";
import ReactDOM from "react-dom";

{ /* Set Panels rotation and position*/ }
let planeRadius = 10;
let closeRadius = 5;
const panelPositions = [];

let degrees = 0;
let rotation = -90;

for (let i = 0; i < 8; i++) {
	let xPos = Math.cos(degrees) * planeRadius;
	let zPos = Math.sin(degrees) * planeRadius;

	let orientation = {};

	orientation.position = `${xPos} 3 ${zPos}`;
	orientation.rotation = `0 ${rotation} 0`;
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

let focusedPanel = "";

class VRScene extends React.Component {
	constructor(props) {
		super(props);
		this.tweets = [];
		this.panel = null;
		this.platform = null;
		this.skyBox = null;
		this.state = { audibleSound: true };
	}

	componentDidMount() {
		console.log(this.props.location);
		switch (this.props.location) {
			case "TimesSquare":
				this.tweets = NYTweets;
				this.skyBox = TimesSquare;
				this.panel = UrbanPanelDesign;
				this.platform = UrbanGround;
				break;
			case "UCF":
				this.tweets = UCFTweets;
				this.skyBox = UCF;
				this.panel = BlackGoldPanelDesign;
				this.platform = BlackGoldGround;
				break;
			case "Rio":
				this.tweets = RioTweets;
				this.skyBox = Rio;
				this.panel = UrbanPanelDesign;
				break;
		}
		this.setState({ tweets: this.tweets });
	}

	render () {
		if (!this.state.tweets) return null;

		return (
			<div>
				<Scene renderer = "antialias: true">
					{ /* Skybox and Ground*/ }
					<a-assets>
						<img id = "skyTexture" src = { this.skyBox } />
						<img id = "groundTexture" src = { this.platform } />
						{
							this.state.tweets.map((tweet, index) => (<img id = { `img+${index}` } src = { tweet }></img>))
						}
						<img id = "panelTexture" src = { this.panel } />
						{/* <audio id = "ambience" src = { CityAmbience } /> */}
					</a-assets>
					{ this.platform && (<Entity
						primitive = "a-plane"
						src = "#groundTexture"
						material = {{ opacity: 0.99 }}
						rotation = "-90 0 0"
						position = "0 -9 0"
						scale = "25 25"
						animation = { "property: rotation; to: -90 360000 0; loop: true; dur: 1000000" }
					/>) }
					<Entity primitive = "a-sky" src = "#skyTexture" rotation = "0 -130 0" />

					{ /* Mouse-to-Movement Control*/ }
					<Entity
						primitive = "a-camera"
						fov = "70"
						look-controls = "pointerLockEnabled: true;"
					>
						<Entity
							fuse
							fuse-timeout = "300"
							primitive = "a-cursor"
							animation__click = {{ property: "scale", startEvents: "click", from: "0.1 0.1 0.1", to: "1 1 1", dur: 150 }}
							animation__fusing = "property: scale; startEvents: fusing; easing: easeInCubic; dur: 300; from: 1 1 1; to: 0.1 0.1 0.1"
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
								src = { `#img+${index}` }
								material = {{ opacity: 0.99, shader: "flat" }}
								rotation = { rotation }
								position = { position }
								scale = "3 5"
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
								material = { this.props.location === "TimesSquare" || this.props.location === "Rio" ? { opacity: 0.99, shader: "standard", emissive: "#1DA1F2", emissiveIntensity: "0.75" } : { opacity: 0.99 } }
								rotation = { rotation }
								position = { position }
								scale = "3 5"
								events = {{
									click: ({ target: { object3D } }) => {
										if (focusedPanel !== `panel+${index}`) {
											let degrees = Math.acos(object3D.position.x / planeRadius);
											let xPos = Math.cos(degrees) * closeRadius;
											let zPos = Math.sin(degrees) * closeRadius;

											object3D.position.set(xPos, 3, (zPos * Math.sign(object3D.position.z)));

											let panelObj3d = document.getElementById(`tweet+${index}`).object3D;

											xPos = Math.cos(degrees) * (closeRadius + 0.5);
											zPos = Math.sin(degrees) * (closeRadius + 0.5);

											panelObj3d.position.set(xPos, 3, (zPos * Math.sign(panelObj3d.position.z)));
											focusedPanel = `panel+${index}`;
										}
									},
									mouseenter: ({ target: { object3D } }) => {
										object3D.scale.x += 1;
										object3D.scale.y += 1;
									},
									mouseleave: ({ target: { object3D } }) => {
										object3D.scale.x -= 1;
										object3D.scale.y -= 1;

										console.log(focusedPanel);

										if (focusedPanel === `panel+${index}`) {
											let degrees = Math.acos(object3D.position.x / closeRadius);
											let xPos = Math.cos(degrees) * planeRadius;
											let zPos = Math.sin(degrees) * planeRadius;

											object3D.position.set(xPos, 3, (zPos * Math.sign(object3D.position.z)));

											let panelObj3d = document.getElementById(`tweet+${index}`).object3D;

											xPos = Math.cos(degrees) * (planeRadius + 0.5);
											zPos = Math.sin(degrees) * (planeRadius + 0.5);

											panelObj3d.position.set(xPos, 3, (zPos * Math.sign(panelObj3d.position.z)));
											focusedPanel = "";
										}
									}
								}}
							>
							</Entity>
						))
					}
					{ /* <a-sound src = "#ambience" autoplay = "true" position = "0 1.6 0" loop volume = { this.state.audibleSound ? ".3" : "0" }></a-sound> */ }
				</Scene>
				<div style = {{ zIndex: 1, position: "absolute", bottom: 0, backgroundColor: "silver", borderTopRightRadius: "25px" }}>
					<IoMdArrowBack size = "5em" style = {{ cursor: "pointer" }}
						onClick = { () => {
							ReactDOM.unmountComponentAtNode(document.getElementById("sceneContainer"));
							document.getElementById("root").style.display = "inline";
						} }
					/>
					{ /* {
						this.state.audibleSound ?
							(
								<IoMdVolumeOff
									onClick = { () => this.setState({ audibleSound: !this.state.audibleSound }) }
									style = {{ cursor: "pointer" }}
									size = "5em"
								/>
							) :
							(
								<IoMdVolumeHigh
									onClick = { () => this.setState({ audibleSound: !this.state.audibleSound }) }
									style = {{ cursor: "pointer" }}
									size = "5em"
								/>
							)
					} */ }
				</div>
			</div>
		);
	}
}

export default VRScene;