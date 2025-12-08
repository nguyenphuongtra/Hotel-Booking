import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: 16.032523, 
  lng: 108.221140
};

export default function HotelMap() {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
