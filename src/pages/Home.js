import React, { useState } from 'react';
import './pages.css';
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { twitterData } from '../data/twitterData';
import { TwitterTweetEmbed } from 'react-twitter-embed';

export default function Home() {
    const [viewport, setViewport] = useState({
        width: '80vw',
        height: '100vh',
        latitude: 43.616365,
        longitude: -0.001,
        zoom: 1.5
    });

    const [selectedTweet, setSelectedTweet] = useState(null);

    return (
        <div>
            <ReactMapGL 
                { ...viewport }
                mapboxApiAccessToken = { process.env.REACT_APP_MAPBOX_TOKEN }
                mapStyle = 'mapbox://styles/csepulveda7/ckg41stxq2aec1anzf925xogi'
                onViewportChange={ viewport => {
                    setViewport(viewport);
                }}
            >
                { twitterData.map((hotspot) => (
                    <Marker 
                        key={ hotspot.id } 
                        latitude = { hotspot.lat } 
                        longitude = { hotspot.long }
                    >
                        <button 
                            className="markerBtn" 
                            onClick={ e => {
                                e.preventDefault();
                                setSelectedTweet(hotspot);
                            }}
                        >
                            <img className="markers" src={require("../assets/logo.png")}/>
                        </button>
                    </Marker>
                ))}
                { selectedTweet ? (
                    <Popup 
                        latitude = { selectedTweet.lat } 
                        longitude = { selectedTweet.long }
                    >
                        <div>
                            <TwitterTweetEmbed
                                tweetId = { selectedTweet.tweet }
                            />
                        </div>

                    </Popup>
                ) : null }
            </ReactMapGL>
            <div className = 'sidebar'>
                Sidebar
            </div>
        </div>
    )
}

