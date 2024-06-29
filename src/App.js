import './App.css';
import auto from './t-cross.png'
import { useEffect, useState } from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import { auth, firestore, getUsers, googleAuthProvider, insertUser, localPersistence } from './firebase'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro/DateTimeRangePicker';

function App() {
  const [isOpenCarPopup, setIsOpenCarPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [pay, setPay] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [isSucess, setIsSucess] = useState(false);
  const [isValidPay, setIsValidPay] = useState();
  const [state, setState] = useState();
  const [user, setUser] = useState({uid: '', name: ''});
  const email = window.localStorage.getItem('email') || '';
  const [isRegister, setIsRegister] = useState(false);

  const [value, setValue] = useState();

  useEffect(() => {    
    console.log(email)
    console.log(value)
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
    const batch = firestore.batch();
    batch.set(firestore.collection('users').doc(email), {uid: uid, isValidPay: false})
    await batch.commit();
    return true;
  }

  const unlock = () => {
    setIsLogin(true)
    console.log('unlock')
  }

  const reserve = () => {
    // console.log(email)
    if (email == '') {
      setIsLogin(true)
    } else {
      console.log('debo pedir pago, efectivo tarjeta')
      setPay(true)
    }
  }

  const loginClose = () => {
    setIsLogin(false)
    // const google;
  }

  const payClose = () => {
    setPay(false)
  }

  const login = () => {
    auth.setPersistence(localPersistence)
      .then(() => {
        auth.signInWithPopup(googleAuthProvider).then((res) => {
          const uidSelected = state.filter((id) => id.uid === res.user.uid)
          if (uidSelected.length >= 1) {
            setState(res.user)
            window.localStorage.setItem('email', res.user.email)
          } else if (uidSelected.length === 0) {
            setState(res.user)
          }
          setUser({name: res.user.email, uid: res.user.uid})
          saveUser(res.user.email, res.user.uid)
          setIsLogin(false)
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

  const depositCash = () => {
    setDeposit(true)
  }

  const creditCard = () => {  
  }

  const cashClose = () => {
    setDeposit(false)
  }

  const successClose = () => {
    setIsSucess(false);
  }

  const handleSubmit = (e) => {
    console.log('form enviado', isValidPay)
    e.preventDefault();
    setDeposit(false)
    setPay(false)
    setIsSucess(true)

    // setTimeout(() => {
    //   setIsSucess(false)
    // }, 4000);

    insertUser(email, isValidPay)
    setIsValidPay('')
  }
  
  const handleChange = (e) => {
    console.log(e.target.value)
    setIsValidPay(e.target.value)
  }

  const handleChangeCalendar = (e) => {
    console.log(e)
    // (newValue) => setValue(newValue)
    // setValue(e )
  }

  return (
    <div className="body">
        <div className='map'>
          <APIProvider apiKey={'AIzaSyCOIG6y-t0daQC7lyIcRV1lmJZ_EJg2nOM'}>
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
                <p>GASOLINA / GAS</p>
                <h4>
                  90%
                </h4>
              </div>
              <div className='car-price'>
                <p>PRECIO</p>
                <h4><u>s/. 100.00</u> /día</h4>
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
          <h5 className='logo-white'>DanTaxi</h5>
          <div className='login-container'>
            <div className='login-close' onClick={loginClose}>x</div>
            <h4>{isRegister ? 'Register' : 'Log in'}</h4>
            <div className='btn primary' onClick={login}>{isRegister ? 'Registe in Google' : 'Log in Google'}</div>
          </div>
          <div className='login-bottom'>
            <h5>{isRegister ? 'Reservar ahora ->' : 'Not registered yet?'}</h5>
            <a onClick={register}>{isRegister ? 'Log in' : 'Sign up'}</a>
          </div>
        </div>

        <div className={`pay ${pay ? '' : 'd-none'}`}>
          <h5 className='logo-white'>DanTaxi</h5>
          <div className={`pay-container ${deposit ? 'd-none' : ''}`}>
            <div className='pay-close' onClick={payClose}>x</div>
            <h3 className='pay-white'>Formulario de pago</h3>
            <p>
              Necesitas depositar una garantía de s/. 100.00 soles que serán retornados al finalizar el alquiler.
            </p>
            <div className='pay-buttons'>
              <div className='pay-button' onClick={depositCash}>Depositar</div>
              <div className='pay-button disabled' onClick={creditCard}>Tarjeta débito, crédito</div>
            </div>
          </div>

          <div className={`pay-container ${deposit ? '' : 'd-none'}`}>
            <div className='pay-close' onClick={cashClose}>x</div>
            <p>Haz tu depósito a los siguientes destinos disponibles:</p>
            <ul>
              <li>
                Plin: <br/> 992 304 757
              </li>
              <li>
                Interbank soles corriente: <br/> 898 329 800 384 0
              </li>
              <li>
                Interbank soles corriente CCI: <br/> 003 898 013 298 003 840 41
              </li>
            </ul>
            <div className='pay-operation'>
              <form onSubmit={handleSubmit}>
                <label>Código de operación</label>
                <input placeholder='Código' onChange={handleChange} value={isValidPay}/>
                <div>ó</div>
                <button >Enviar</button>
              </form>
            </div>
          </div>
        </div>

        <div className={`pay-success ${isSucess ? '' : 'd-none'}`}>
          <h5 className='logo-white'>DanTaxi</h5>
          <div className={`pay-container ${deposit ? 'd-none' : ''}`}>
            <div className='pay-close' onClick={successClose}>x</div>
            <p>Estamos revisando tu pago.</p>
            <p>Elige tu horario de alguiler</p>
            <div>
              <div className="calendly-inline-widget" data-url="https://calendly.com/danilojesusv?hide_landing_page_details=1&hide_gdpr_banner=1" style={{minWidth: "320px", height: "50vh"}}></div>

            </div>
            <p className='mt-2 mb-0'>Precio aproximado:</p>
            <p>s/. 100.00 por día</p>
            <button >Enviar</button>
          </div>
        </div>



        <div className={`documents ${isSucess ? '' : 'd-none'}`}>
          <h5 className='logo-white'>DanTaxi</h5>
          <div className={`pay-container ${deposit ? 'd-none' : ''}`}>
            <div className='pay-close' onClick={successClose}>x</div>
            <p>Estamos en el último paso</p>
            <p>Sube estos documentos para validar tu identidad</p>
            <div>
              <div className="calendly-inline-widget" data-url="https://calendly.com/danilojesusv?hide_landing_page_details=1&hide_gdpr_banner=1" style={{minWidth: "320px", height: "50vh"}}></div>

            </div>
            <p className='mt-2 mb-0'>Precio aproximado:</p>
            <p>s/. 100.00 por día</p>
            <button >Enviar</button>
          </div>
        </div>

    </div>
  );
}

export default App;
