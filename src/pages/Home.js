import React, { useState } from 'react';
import './pages.css';
import ReactMapGL, { Marker } from "react-map-gl";
import { twitterData } from '../data/twitterData';
import picture from "../assets/201.jpg" 
import pictureNY from "../assets/NY.jpg"
import pictureRio from "../assets/Rio.jpg"

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
                        <a href="/divclick" className='locationTitle'>
                            <img src= {pictureNY}/>
                            Times Squares, New York City
                        </a>   
                    </div>
                    <div className= 'location'>
                        <a href="/divclick" className='locationTitle'>
                                <img src= {pictureRio}/>
                                Rio de Janeiro, Brazil
                        </a>
                    </div>
                    <div className= 'location'>
                        <a href="/divclick" className='locationTitle'>
                                <img src= {picture}/>
                                UCF, Orlando
                        </a>
                    </div>
                </div>

                <div className= 'trendingHashtagsTitle'>
                    Trending Locations
                </div>
                <div className= 'trendingHashtags'>
                    <div className= 'hashtags'>
                        <a href="/divclick" className='hashtagsTitle'>
                            Tokio, Japan
                        </a>
                    </div>
                    <div className= 'hashtags'>
                        <a href="/divclick" className='hashtagsTitle'>
                            Cairo, Egypt
                        </a>
                    </div>
                    <div className= 'hashtags'>
                        <a href="/divclick" className='hashtagsTitle'>
                            Delhi, India
                        </a>
                    </div>
                    <div className= 'hashtags'>
                        <a href="/divclick" className='hashtagsTitle'>
                            Moscow, Russia
                        </a>
                    </div>
                    <div className= 'hashtags'>
                        <a href="/divclick" className='hashtagsTitle'>
                            Manila, Philippines
                        </a>
                    </div>   
                </div>
             
            </div>

        </div>
    )
}

