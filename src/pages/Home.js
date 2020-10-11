import React, { useState, useEffect, useRef } from "react";
import "./pages.css";
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import { twitterData } from "../data/twitterData";
import { TwitterTweetEmbed } from "react-twitter-embed";
import useSupercluster from "use-supercluster";
import ReactDOM from "react-dom";
import VRScene from "../VRScene";

export default function Home() {
	const [selectedTweet, setSelectedTweet] = useState(null);

	const [viewport, setViewport] = useState({
		width: "80vw",
		height: "100vh",
		latitude: 40.616365,
		longitude: -0.08,
		zoom: 1.5
	});

	useEffect(() => {
		const listener = e => {
			if (e.key === "Escape")
				setSelectedTweet(null);
		};

		window.addEventListener("keydown", listener);

		return () => {
			window.removeEventListener("keydown", listener);
		};
	}, []);

	const mapRef = useRef();
	const points = twitterData.map(hotspot => ({
		type: "Feature",
		properties: {
			cluster: false,
			tweetId: hotspot.id,
			tweet: hotspot.tweet,
			hotspot: hotspot
		},
		geometry: {
			type: "Point",
			coordinates: [
				parseFloat(hotspot.long),
				parseFloat(hotspot.lat)
			]
		}
	}));

	const bounds = mapRef.current
		? mapRef.current
			.getMap()
			.getBounds()
			.toArray()
			.flat()
		: null;

	const { clusters } = useSupercluster({
		points,
		zoom: viewport.zoom,
		bounds,
		options: { radius: 75, maxZoom: 20 }
	});

	function remove360(ref) {
		ReactDOM.unmountComponentAtNode(document.getElementById("sceneContainer"));
	}

	return (
		<div>
			<ReactMapGL
				{ ...viewport }
				mapboxApiAccessToken = { process.env.REACT_APP_MAPBOX_TOKEN }
				mapStyle = 'mapbox://styles/csepulveda7/ckg41stxq2aec1anzf925xogi'
				onViewportChange = { viewport => {
					setViewport(viewport);
				} }
				ref = { mapRef }
			>
				{ clusters.map(cluster => {
					const [longitude, latitude] = cluster.geometry.coordinates;
					const { cluster: isCluster, point_count: pointCount } = cluster.properties;

					if (isCluster) {
						return (
							<Marker key = { cluster.id } latitude = { latitude } longitude = { longitude }>
								<div className = "clusterMarker"> { pointCount } </div>
							</Marker>
						);
					}

					return (
						<Marker
							key = { cluster.properties.tweetId }
							latitude = { latitude }
							longitude = { longitude }
						>
							<button
								className = "markerBtn"
								onClick = { e => {
									e.preventDefault();
									setSelectedTweet(cluster);

									let location = "";
									let ref = React.createRef();

									if (cluster.properties.tweetId === 13) location = "TimesSquare";
									else if (cluster.properties.tweetId === 7) location = "Rio";
									else if (cluster.properties.tweetId === 10) location = "UCF";

									ReactDOM.render(<VRScene ref = { c => (ref = c) } id = "vrscene" location = { location } stop360 = { () => remove360(ref) } />, document.querySelector("#sceneContainer"));
								} }
							>
								<img className = "markers" src = { require("../assets/logo.png") } />
							</button>
						</Marker>
					);
				}) }

				{ selectedTweet ? (
					<Popup
						latitude = { selectedTweet.geometry.coordinates[1] }
						longitude = { selectedTweet.geometry.coordinates[0] }
						onClose = { () => {
							setSelectedTweet(null);
						} }
					>
						<div>
							<TwitterTweetEmbed
								tweetId = { selectedTweet.properties.tweet }
							/>
						</div>

					</Popup>
				) : null }

			</ReactMapGL>
			<div className = 'sidebar'>

				<input className = 'searchbar' type = "text" placeholder = "Search.." />

				<div className = 'featuredLocationsTitle'>
                    360° Locations
				</div>
				<div className = 'featuredLocations'>
					<div className = 'location'>
						<div className = 'locationTitle'>
                            Times Squares, New York City
						</div>
					</div>
					<div className = 'location'>
						<div className = 'locationTitle'>
                            Rio de Janeiro, Brazil
						</div>
					</div>
					<div className = 'location'>
						<div className = 'locationTitle'>
                            UCF, Orlando
						</div>
					</div>
				</div>

				<div className = 'trendingHashtagsTitle'>
                    Trending Locations
				</div>
				<div className = 'trendingHashtags'>
					<div className = 'hashtags'>
						<div className = 'hashtagsTitle'>
                            Location 1
						</div>
					</div>
					<div className = 'hashtags'>
						<div className = 'hashtagsTitle'>
                            Location 2
						</div>
					</div>
					<div className = 'hashtags'>
						<div className = 'hashtagsTitle'>
                            Location 3
						</div>
					</div>
					<div className = 'hashtags'>
						<div className = 'hashtagsTitle'>
                            Location 4
						</div>
					</div>
					<div className = 'hashtags'>
						<div className = 'hashtagsTitle'>
                            Location 5
						</div>
					</div>

				</div>

			</div>
		</div>
	);
}