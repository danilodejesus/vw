
function AboutUs() {

  return (
    <div className="body">
        
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
          </div>3
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

export default AboutUs;
