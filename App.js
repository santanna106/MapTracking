import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import React,{useRef,useEffect,useState} from 'react';
import {SafeAreaView,StyleSheet,Image,PermissionsAndroid,Text} from 'react-native'
import MapView,{MarkerAnimated,AnimatedRegion, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';



const App = () => {

  const LATITUDE_DELTA = 0.00922;
  const LONGITUDE_DELTA =  0.00421;

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,

  });
  const [watchID, setWatchID] = useState(0);
  const refMarker = useRef(null);

  const requesLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização',
          message: 'A aplicação precisa da permissão de localização.',
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        },
    );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  

  function getLocation ()  {
    Geolocation.getCurrentPosition(
      pos => {
        setPosition({
          ...position,
         latitude: pos.coords.latitude,
         longitude: pos.coords.longitude,
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 50000 }
    );
  
   // const rr = await registrarLocalizacao(position,idRomaneio);

  }


  useEffect(() => {
  
    requesLocationPermission();
    //const interval = setInterval(() => {
      getLocation();
     
    //},2000);

    //return () => clearInterval(interval);
  },[])

  const handleUserLocationChange = ({ nativeEvent }) => {
    console.warn(nativeEvent.coordinate);
    setPosition({
      ...position,
     latitude: nativeEvent.coordinate.latitude,
     longitude: nativeEvent.coordinate.longitude,
    });
  };

  useKeepAwake(); //Não entrar na tela de descanso
  return (
    <SafeAreaView style={styles.container}>
     <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={position}
       showsUserLocation
       followsUserLocation
       loadingEnabled={true}
       onUserLocationChange={handleUserLocationChange}
       
     >
       <Marker 
            coordinate={position}      
          >
            <Image source={require('./assets/frontal-truck.png')} style={{height: 35, width:35, resizeMode:"contain",elevation : 5 }} />
       </Marker>
     </MapView>
   </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  map:{
    flex:1,
  }
});

export default App;
