import './App.css';
import auto from './t-cross.png'
import { useEffect, useState } from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import { auth, firestore, storage, getUsers, googleAuthProvider, insertUser, localPersistence } from './firebase'
import { InlineWidget } from "react-calendly";

function App() {
  const [isOpenCarPopup, setIsOpenCarPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [pay, setPay] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [isSucess, setIsSucess] = useState(false);
  const [isValidPay, setIsValidPay] = useState();
  const [documents, setDocuments] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [state, setState] = useState();
  const [user, setUser] = useState({uid: '', name: ''});
  const email = window.localStorage.getItem('email') || '';
  const [isRegister, setIsRegister] = useState(false);

  const [value, setValue] = useState();

  const [dniA, setDniA] = useState();
  const [dniB, setDniB] = useState();
  const [breveteA, setBreveteA] = useState();
  const [breveteB, setBreveteB] = useState();
  // const [antecedentes, setAntecedentes] = useState();

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
    // console.log(email)
    if (email === '') {
      setIsLogin(true)
    } else {
      console.log('unlock')
    }
  }

  const reserve = () => {
    // console.log(email)
    if (email === '') {
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
          setPay(true)
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

  const documentsClose = () => {
    setDocuments(false);
    setThanks(true);
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

  const goDocuments = (e) => {
    setDocuments(true)
    setIsSucess(false)
  }

  const thanksClose = (e) => {
    setThanks(false)
  }

  const handleInputChangeDniA = (e) => {
    setDniA(e.target.files[0])
  };

  const handleInputChangeDniB = (e) => {
    setDniB(e.target.files[0])
  };

  const handleInputChangeBreveteA = (e) => {
    setBreveteA(e.target.files[0])
  };

  const handleInputChangeBreveteB = (e) => {
    setBreveteB(e.target.files[0])
  };

  // const handleInputChangeAntecendes = (e) => {
  //   setAntecedentes(e.target.files[0])
  // };

  const sendDocuments = () => {
    if (!dniA, !dniB, !breveteA, !breveteB) return;
    
    const storageRefdniA = storage.ref(`files/${email}/${dniA.name}`);
    const uploadTaskdniA = storageRefdniA.put(dniA);

    const storageRefdniB = storage.ref(`files/${email}/${dniB.name}`);
    const uploadTaskdniB = storageRefdniB.put(dniB);
    
    const storageRefBreveteA = storage.ref(`files/${email}/${breveteA.name}`);
    const uploadTaskBreveteA = storageRefBreveteA.put(breveteA);

    const storageRefBreveteB = storage.ref(`files/${email}/${breveteB.name}`);
    const uploadTaskBreveteB = storageRefBreveteB.put(breveteB);

    // const storageRefAnt = storage.ref(`files/${email}/${antecedentes.name}`);
    // const uploadTaskAnt = storageRefAnt.put(antecedentes);

    uploadTaskdniA.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploadProgress(progress);
      },
      (error) => {
        console.error("Error al subir el archivo:", error);
      },
      () => {
        uploadTaskdniA.snapshot.ref?.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL)
          // setDownloadURL(downloadURL);
          // saveFileURLToFirestore(downloadURL);
        });
      }
    );
    uploadTaskdniB.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploadProgress(progress);
      },
      (error) => {
        console.error("Error al subir el archivo:", error);
      },
      () => {
        uploadTaskdniB.snapshot.ref?.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL)
          // setDownloadURL(downloadURL);
          // saveFileURLToFirestore(downloadURL);
        });
      }
    );
    uploadTaskBreveteA.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploadProgress(progress);
      },
      (error) => {
        console.error("Error al subir el archivo:", error);
      },
      () => {
        uploadTaskBreveteA.snapshot.ref?.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL)
          // setDownloadURL(downloadURL);
          // saveFileURLToFirestore(downloadURL);
        });
      }
    );
    uploadTaskBreveteB.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploadProgress(progress);
      },
      (error) => {
        console.error("Error al subir el archivo:", error);
      },
      () => {
        uploadTaskBreveteB.snapshot.ref?.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL)
          // setDownloadURL(downloadURL);
          // saveFileURLToFirestore(downloadURL);
        });
      }
    );
    // uploadTaskAnt.on('state_changed',
    //   (snapshot) => {
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     // setUploadProgress(progress);
    //   },
    //   (error) => {
    //     console.error("Error al subir el archivo:", error);
    //   },
    //   () => {
    //     storageRefAnt.snapshot.ref?.getDownloadURL().then((downloadURL) => {
    //       console.log(downloadURL)
    //       // setDownloadURL(downloadURL);
    //       // saveFileURLToFirestore(downloadURL);
    //     });
    //   }
    // );

    setTimeout(() => {
      setDocuments(false)
      setThanks(true)
    }, 2000);
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
                  GNV
                </h4>
              </div>
              <div className='car-price'>
                <p>PRECIO</p>
                <h4><u>S/ 100.00</u> /día</h4>
              </div>
            </div>

            <div className='car-address'>
              <p>Jirón Esteban Camere</p>
              <p>15054 Lima</p>
              <p className='green'>51.74 km desde tu ubicación</p>
            </div>

            <div className='car-actions'>
              <div className='btn secondary' onClick={unlock}>Pedir ayuda</div>
              <div className='btn primary' onClick={reserve}>Reservar ahora!</div>
            </div>

          </div>
        </div>

        <div className={`login ${isLogin ? '' : 'd-none'}`}>
          <h5 className='logo-white'>DanTaxi</h5>
          <div className='login-container'>
            <div className='login-close' onClick={loginClose}>x</div>
            <h4>{isRegister ? 'Regístrate' : 'Iniciar sesión'}</h4>
            <div className='btn primary' onClick={login}>{isRegister ? 'Regístrate en Google' : 'Iniciar sesión en Google'}</div>
          </div>
          <div className='login-bottom'>
            <h5>{isRegister ? 'Reservar ahora ->' : 'No te has registrado todavía?'}</h5>
            <a onClick={register}>{isRegister ? 'Iniciar sesión' : 'Regístrate'}</a>
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
                {/* <div>ó</div> */}
                <button className='content-button'>Enviar</button>
              </form>
            </div>
          </div>
        </div>

        <div className={`pay-success ${isSucess ? '' : 'd-none'}`}>
          <h5 className='logo-white'>DanTaxi</h5>
          <div className={`pay-container ${deposit ? 'd-none' : ''}`}>
            <div className='pay-close' onClick={successClose}>x</div>
            <p className='mb-0'>Estamos revisando tu pago...</p>
            <p>Elige el <u>día</u> y <u>horario</u> de recojo del auto</p>
            <div className='h-50'>
              <InlineWidget 
                style={{minWidth: "320px", height: "100% !important"}}
                url="https://calendly.com/danilojesusv?hide_landing_page_details=1&hide_gdpr_banner=1" />
            </div>
            <p className='mb-0 text-center font-w-bold'>Click aquí ⬆</p>
            <p className='mt-2 mb-0'>Precio aproximado:</p>
            <p className='mt-0'>s/. 100.00 por <u>día</u></p>
            <button className='pay-button content-button' onClick={goDocuments}>Enviar</button>
          </div>
        </div>

        <div className={`documents ${documents ? '' : 'd-none'}`}>
          <h5 className='logo-white'>DanTaxi</h5>
          <div className={`pay-container ${deposit ? 'd-none' : ''}`}>
            <div className='pay-close' onClick={documentsClose}>x</div>
            <p className='mb-0'>Estamos en el último paso:</p>
            <p className='mt-0'>Sube estos <u>documentos</u> para validar tu <u>identidad:</u></p>
            <div className='documents-box'>
              <div className=''>
                <p className='m-0'>DNI:</p>
                <div>
                  <input type='file' name="dniA" onChange={handleInputChangeDniA} />
                  <input type='file' name="dniB" onChange={handleInputChangeDniB} />
                </div>
              </div>
              <div className=''>
                <p className='m-0'>Brevete:</p>
                <div>
                  <input type='file' name="breveteA" onChange={handleInputChangeBreveteA} />
                </div>
              </div>
              <div className=''>
                <p className='m-0'>Antecedentes penales:</p>
                <div>
                  <input type='file' name="breveteB" onChange={handleInputChangeBreveteB} />
                </div>
              </div>
            </div>
            <button className='mt-2 pay-button content-button' onClick={sendDocuments}>Enviar</button>
          </div>
        </div>

        <div className={`thanks ${thanks ? '' : 'd-none'}`}>
          <h5 className='logo-white'>DanTaxi</h5>
          <div className={`pay-container ${deposit ? 'd-none' : ''}`}>
            <div className='pay-close' onClick={thanksClose}>x</div>
            <p className='mb-0'>Tu reserva se ha generado con éxito.</p>
            <p className='mt-0'>Recuerda <u>revisar tu correo</u> para la confirmación de la reserva.</p>
            <button className='mt-2 pay-button content-button' onClick={thanksClose}>Cerrar</button>
          </div>
        </div>

    </div>
  );
}

export default App;
