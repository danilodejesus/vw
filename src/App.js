import './App.css';
import auto from './t-cross.png'
import call from './call.jpeg'
import taxi3 from './taxi3.jpeg'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: -12.1484648, // default latitude
  lng: -76.9913109, // default longitude
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBvPIPFi9lTtZ7LbCYUOZ66QFMqpGq5foM',
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="body">
      <div className='map'>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={17}
          center={center}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>

      <header className="header">
        <div className='header-width'>
          <div className='header-menu'>
            <a
              className="link logo"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dantaxi
            </a>
          </div>
          <div className='header-user'>
            <a className="link">
              Pedir un taxi
            </a>
            <a className="link">
              Cómo funciona?
            </a>
            <a className="link">
              Contacto
            </a>
            <a>
              Login
            </a>
          </div>
        </div>
      </header>

      <div className='car-information'>
        <div className='car-container'>
          <div className='car-header'>
            <figure className='car-img'>
              <img src={auto} />
            </figure>
            <div className='car-close'>x</div>
          </div>

          <div className='car-info'>
            <div className='car-plate'>
              <h4>CCP-445</h4>
            </div>
            <div className='car-model'>
              Camioneta Volkswagen T-Cross 2023
            </div>
          </div>

          <div className='car-use'>
            <div className='car-fuel'>
              <p>GASOLINA</p>
              <h4>
                80%
              </h4>
            </div>
            <div className='car-price'>
              <p>PRECIO</p>
              <h4><u>s/. 9,90</u> /hora.</h4>
            </div>
          </div>

          <div className='car-address'>
            <p>Jirón Esteban Camere</p>
            <p>15054 Lima</p>
            <p className='green'>101.74 km desde tu ubicación</p>
          </div>

          <div className='car-actions'>
            <a className='unlock'>Desbloquear</a>
            <a className='reserve'>Reservar ahora!</a>
          </div>

        </div>
      </div>

      <div className='banner'>
        <div className='banner-width'>
          <div className='banner-text'>
            <p>
              Reserva un taxi! <br></br>
              <strong>
                Llama, pide o reserva un taxi 100% online en ésta página. <br></br>
                Imagina que tiene 400 taxis en tu bolsillo, listos para transportarte a donde necesitas.
              </strong>
            </p>
            <div className='d-flex'>
              <a href="">Reserva ahora</a>
              <a href="">Ver autos</a>
            </div>
          </div>
        </div>
      </div>

      <div className="how_it_works">
        <div className='how_it_works_width'>
          <div className='how_it_works_items'>
            <div className='how_it_works_item'>
              <img src={call} />
              <div className='text'>
                <div className='title'>
                  Llama al 48 48 48 48
                </div>
                <div className='description'>
                  Dantaxi te lo pone fácil y rápido para pedir uno de nuestros 1.900 taxis. Nuestro centro de atención al cliente está abierto las 24 horas del día y siempre está listo para aceptar su pedido.
                </div>
                <div className='description'>
                  70 soles por 30 km Camioneta
                </div>
              </div>
            </div>
            <div className='how_it_works_item'>
              <img src={call} />
              <div className='text'>
                <div className='title'>
                  Llama al 48 48 48 48
                </div>
                <div className='description'>
                  Dantaxi te lo pone fácil y rápido para pedir uno de nuestros 1.900 taxis. Nuestro centro de atención al cliente está abierto las 24 horas del día y siempre está listo para aceptar su pedido.
                </div>
                <div className='description'>
                  60 soles por 25 km Camioneta
                </div>
              </div>
            </div>
            <div className='how_it_works_item'>
              <img src={taxi3} />
              <div className='text'>
                <div className='title'>
                  Reserve un taxi en línea
                </div>
                <div className='description'>
                  Pide una furgoneta Dantaxi directamente en esta página. Es rápido y fácil, ¡y su taxi está de camino hacia usted!
                </div>
                <div className='description'>
                  50 soles por 20 km Camioneta
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
