import React, { useState } from 'react';
import './pages.css';
import ReactMapGL, { Marker } from "react-map-gl";
import { twitterData } from '../data/twitterData';

export default function Home() {
    const [viewport, setViewport] = useState({
        width: '80vw',
        height: '100vh',
        latitude: 28.6011,
        longitude: -81.2004,
        zoom: 3
    });

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
                { twitterData.map((hotspots) => (
                    <Marker 
                        key={ hotspots.id } 
                        latitude = { hotspots.lat } 
                        longitude = { hotspots.long }
                    >
                        <button className="markerBtn">
                            <img className="markers" src={require("../assets/logo.png")}/>
                        </button>
                    </Marker>
                ))}
            </ReactMapGL>
            <div className = 'sidebar'>
                Sidebar
            </div>
        </div>
    )
}

