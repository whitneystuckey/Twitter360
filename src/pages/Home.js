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
                
                <input className= 'searchbar' type="text" placeholder="Search.."/>
                
                <div className= 'featuredLocationsTitle'>
                    360° Locations
                </div>
                <div className='featuredLocations'>
                    <div className= 'location'>
                        <div className= 'locationTitle'>
                            Times Squares, New York City
                        </div>
                    </div>
                    <div className= 'location'>
                        <div className= 'locationTitle'>
                            Rio de Janeiro, Brazil
                        </div>
                    </div>
                    <div className= 'location'>
                        <div className= 'locationTitle'>
                            UCF, Orlando
                        </div>
                    </div>
                </div>

                <div className= 'trendingHashtagsTitle'>
                    Trending Locations
                </div>
                <div className= 'trendingHashtags'>
                    <div className= 'hashtags'>
                        <div className= 'hashtagsTitle'>
                            Location 1
                        </div>
                    </div>
                    <div className= 'hashtags'>
                        <div className= 'hashtagsTitle'>
                            Location 2
                        </div>
                    </div>
                    <div className= 'hashtags'>
                        <div className= 'hashtagsTitle'>
                            Location 3
                        </div>
                    </div>
                    <div className= 'hashtags'>
                        <div className= 'hashtagsTitle'>
                            Location 4
                        </div>
                    </div>
                    <div className= 'hashtags'>
                        <div className= 'hashtagsTitle'>
                            Location 5
                        </div>
                    </div>
                    
                </div>

                
                
             
            </div>
        </div>
    )
}

