import './App.css';
import auto from './t-cross.png'
import { useEffect, useState } from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import { auth, firestore, getUsers, googleAuthProvider, localPersistence } from './firebase'
import { environment } from './environments/environment';

function App() {

  // declare var google: any ;

  const [isOpenCarPopup, setIsOpenCarPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [state, setState] = useState();
  const [user, setUser] = useState({uid: '', name: ''});
  const email = window.localStorage.getItem('email') || '';
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    
    console.log(email)
    if (email != null) {
      setUser({email})
    } 
    getUsersFirebase();

  }, [isLogin]);

  const getUsersFirebase = () => {
    const unsubscribe = getUsers({
      next: (querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => 
          ({...doc.data(), id:doc.id })
        );
        setState(newData)
        console.log(newData)
      },
      error: (e) => {
        console.error(e);
      }
    });
    return unsubscribe;
  }


  const carClosePopup = () => {
    setIsOpenCarPopup(true)
    console.log('click')
  }

  const saveUser = async (email, uid) => {
    // const user = insertUser(email, uid)
    const batch = firestore.batch();
    batch.set(firestore.collection('users').doc(email), {uid})
    await batch.commit();
    return true;
  }

  const unlock = () => {
    setIsLogin(true)
    console.log('unlock')
  }

  const reserve = () => {
    console.log(email)
    if (email == '') {
      setIsLogin(true)
    } else {
      console.log('2')

    }
  }

  const loginClose = () => {
    setIsLogin(false)
    // const google;
  }

  const login = () => {
    auth.setPersistence(localPersistence)
      .then(() => {
        auth.signInWithPopup(googleAuthProvider).then((res) => {
          const uidSelected = state.filter((id) => id.uid === res.user.uid)
          if (uidSelected.length >= 1) {
            setState(res.user)
            window.localStorage.setItem('email', res.user.email)
            setIsLogin(false)
          } else if (uidSelected.length === 0) {
            setState(res.user)
          }
          setUser({name: res.user.email, uid: res.user.uid})
          saveUser(res.user.email, res.user.uid)
        }).catch((error) => {
          console.log(error)
        })
      })
  }

  const register = () => {
    setIsRegister(!isRegister)
  }

  const logout = () => {
    window.localStorage.removeItem('email')
    setUser(email)
  }

  return (
    <div className="body">
        <div className='map'>
          <APIProvider apiKey={environment.clientId}>
            <Map
              defaultCenter={{lat: -12.1460953, lng: -76.9863282}}
              defaultZoom={10}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            />
          </APIProvider>
        </div>

        <header className="header">
          <div className='header-width'>

            <div className='user'>
              {user && user.email ? <p>{user.email}</p> : <p>menu</p>}
            </div>

            <div className='header-menu'>
              <a
                className="link logo"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                DanTaxi
              </a>
            </div>

            <div className='call'>
              {user && user.email ? <p onClick={logout}>logout</p> : <p>call</p>}
            </div>

            <div className='header-user d-none'>
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

        <div className={`car-information ${!isOpenCarPopup ? '' : 'd-none'}`}>
          <div className='car-container'>
            <div className='car-header'>
              <figure className='car-img'>
                <img src={auto} />
              </figure>
              <div className='car-close' onClick={carClosePopup}>x</div>
            </div>

            <div className='car-info'>
              <div className='car-plate'>
                <h4>CCP-445</h4>
              </div>
              <div className='car-model'>
                Volkswagen T-Cross
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
              <p className='green'>51.74 km desde tu ubicación</p>
            </div>

            <div className='car-actions'>
              <div className='btn secondary' onClick={unlock}>Desbloquear</div>
              <div className='btn primary' onClick={reserve}>Reservar ahora!</div>
            </div>

          </div>
        </div>

        <div className={`login ${isLogin ? '' : 'd-none'}`}>
          <div className='login-container'>
            <div className='login-close' onClick={loginClose}>x</div>
            <h5 className='logo-white'>DanTaxi</h5>
            <h4>{isRegister ? 'Register' : 'Log in'}</h4>
            <div className='btn primary' onClick={login}>{isRegister ? 'Registe in Google' : 'Log in Google'}</div>
          </div>
          <div className='login-bottom'>
            <h5>{isRegister ? 'Reservar ahora ->' : 'Not registered yet?'}</h5>
            <a onClick={register}>{isRegister ? 'Log in' : 'Sign up'}</a>
          </div>
        </div>

    </div>
  );
}

export default App;
