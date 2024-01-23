import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getLocalizacaoBySnBarCode } from "../../store/actions/actionLocalizacoes";
import './Map.css';

const center = { lat: 48.8584, lng: 2.2945 };

function Map() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const products = useSelector((state) => state.product.products);
    const product = products?.find(p => p._id === id);
    const [originMarker,setOriginMaker] = useState(null);
    let localizacoes = useSelector((state) => state.localizacoes.localizacoes);
    const [destinationMarker,setDestinationMaker] = useState(null);
    
    useEffect(() => {
        if (product) {
            dispatch(getLocalizacaoBySnBarCode(product.sn_bar_code));
        }
    }, [dispatch, product]);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyD_HZgRS_WnZj1k9ZzE2vAdpXvtlwcNHUI',
        libraries: ['places'],
    });

    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if (isLoaded && localizacoes && product) {
            calculateRoute();
        }
    }, [isLoaded, localizacoes, product]);

    async function calculateRoute() {
        try {
            const directionsService = new window.google.maps.DirectionsService();
            const geocoder = new window.google.maps.Geocoder();
            const lastLocalization = localizacoes[localizacoes.length - 1];
    
            if (!lastLocalization || !product.ne_adress) return;
    
            const origin = {
                lat: parseFloat(lastLocalization.latitude),
                lng: parseFloat(lastLocalization.longitude)
            };
    
            let destination = product.ne_adress;
    
            // If destination is a string address, geocode it to get LatLng
            if (typeof destination === 'string') {
                const geocodeResults = await geocoder.geocode({ address: destination });
                destination = geocodeResults.results[0].geometry.location;
            }
    
            const results = await directionsService.route({
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            });
    
            setDirectionsResponse(results);
            setDistance(results.routes[0].legs[0].distance.text);
            setDuration(results.routes[0].legs[0].duration.text);
            setOriginMaker(origin);
            setDestinationMaker(destination); 
        } catch (error) {
            console.error('Error calculating route: ', error);
        }
    }
    

    if (!isLoaded) return <div>Loading...</div>;
    return (
        <div className="container">
          <h2>Localização do Ativo</h2>
          <div className="map-box">
            <GoogleMap
              center={center}
              zoom={15}
              mapContainerStyle={{ width: '100%', height: '100%' }}
              onLoad={map => setMap(map)}
            >
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} options={{ suppressMarkers: true }} />
              )}
              {originMarker && (
                <Marker position={originMarker} label="Atual" />
              )}
              {destinationMarker && (
                <Marker position={destinationMarker} label="Fim" />
              )}
            </GoogleMap>
          </div>
          <div className="info-box">
            <div className="text">Distance: {distance}</div>
            <div className="text">Duration: {duration}</div>
            <button
              className="button"
              onClick={() => {
                map.panTo(center);
                map.setZoom(15);
              }}
            >
              &#x1f4cd;
            </button>
          </div>
        </div>
      );
}

export default Map;
