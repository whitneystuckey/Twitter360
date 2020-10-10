import React, { useState } from 'react';
import './pages.css';
import ReactMapGL from "react-map-gl"

export default function Home() {
    const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        latitude: 45.4211,
        longitude: -75.6903,
        zoom: 10
    });

    return (
        <div>
            <ReactMapGL 
                { ...viewport }
                mapboxApiAccessToken = { process.env.REACT_APP_MAPBOX_TOKEN }
            >
                markers here
            </ReactMapGL>
        </div>
    )
}

