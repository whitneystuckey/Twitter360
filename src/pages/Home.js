import React, { useState, useEffect, useRef } from 'react';
import './pages.css';
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import { twitterData } from '../data/twitterData';
import picture from "../assets/201.jpg" 
import pictureNY from "../assets/NY.jpg"
import pictureRio from "../assets/Rio.jpg"
import { TwitterTweetEmbed } from 'react-twitter-embed';
import useSupercluster from "use-supercluster";

export default function Home() {

    const [selectedTweet, setSelectedTweet] = useState(null);

    const [viewport, setViewport] = useState({
        width: '79vw',
        height: '100vh',
        latitude: 40.616365,
        longitude: -0.08,
        zoom: 1.5
    });

    useEffect(() => {
        const listener = e => {
            if (e.key === 'Escape')
                setSelectedTweet(null);
        };
        window.addEventListener('keydown', listener);

        return () => {
            window.removeEventListener('keydown', listener);
        }
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

    return (
        <div>
            <ReactMapGL 
                { ...viewport }
                mapboxApiAccessToken = { process.env.REACT_APP_MAPBOX_TOKEN }
                mapStyle = 'mapbox://styles/csepulveda7/ckg41stxq2aec1anzf925xogi'
                onViewportChange={ viewport => {
                    setViewport(viewport);
                }}
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
                        )
                    }

                    return(
                        <Marker 
                            key={ cluster.properties.tweetId } 
                            latitude = { latitude } 
                            longitude = { longitude }
                        >
                        <button 
                            className="markerBtn" 
                            onClick={ e => {
                                e.preventDefault();
                                setSelectedTweet(cluster);
                            }}
                        >
                            <img className="markers" src={ require("../assets/logo.png") }/>
                        </button>
                    </Marker>
                    );
                })}

                { selectedTweet ? (
                    <Popup 
                        latitude = { selectedTweet.geometry.coordinates[1] } 
                        longitude = { selectedTweet.geometry.coordinates[0] }
                        onClose = {() => {
                            setSelectedTweet(null);
                        }}
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
                            Tokyo, Japan
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

