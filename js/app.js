var listado_direcciones = document.querySelector('ul#direcciones');

var map = L.map('mapa');
var popup = L.popup();
var latitude = 36.721445874615355;
var longitude = -4.419819116592408;
var geo_options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
}

var template_direction = document.querySelector('#direction');
var template_badge = document.querySelector('#badge');
var modal_direction = document.querySelector('#modal-direction');


window.addEventListener("load", () => {

    // Mostramos el overlay de carga
    document.querySelector('div#cargando').classList.remove('d-none');

    // Insertamos el mapa
    map.setView([latitude, longitude], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    // Obtenemos el json
    fetch(
        'https://raw.githubusercontent.com/FRomero999/ExamenDIW2022/main/rutas_arqueologicas.json?classId=a44f2eea-e51b-4a7a-a11a-eefc73428d1a&assignmentId=b6d46e1e-b651-43e1-b861-1d6ba465dd82&submissionId=9aa6e256-ab4b-1c7b-0782-be576cd74f25',
        { method: 'get' })
        .then((response) => {
            if (response.ok) {
                console.log('response', response);
                return response.json();
            } else {
                listado_direcciones.innerHTML = '<p>Ocurrió un error al obtener el json con las direcciones</p>';
                throw new Error("Ocurrió un error al obtener el json con las direcciones");
            }
        })
        .then((data) => {
            console.log('Datos: ', data);

            data.forEach(element => {

                /* Generamos el listado de direcciones en aside */
                let nuevaFila = template_direction.content.cloneNode(true);
                nuevaFila.querySelector('h4').innerText = element.properties.nombre;
                nuevaFila.querySelector('p').innerText = element.properties.horario;

                if (element.properties.direccion.length > 0) {
                    let badge = template_badge.content.cloneNode(true);
                    badge.querySelector('span').innerText = element.properties.direccion;
                    nuevaFila.querySelector('li').appendChild(badge);
                }

                if (element.properties.telefono.length > 0) {
                    let badge = template_badge.content.cloneNode(true);
                    badge.querySelector('span').innerText = element.properties.telefono;
                    nuevaFila.querySelector('li').appendChild(badge);
                }

                // Lanzamos un modal al hacer click sobre la dirección
                nuevaFila.querySelector('li').addEventListener('click', function () {
                    
                    console.log(element.properties);

                    // Actualizamos el contenido del modal
                    modal_direction.querySelector('.modal-title').innerText = element.properties.nombre;
                    
                    modal_direction.querySelector('.modal-body .direccion').innerText = element.properties.direccion;
                    modal_direction.querySelector('.modal-body .horario').innerText = element.properties.horario;
                    if( element.properties.telefono.length > 0 ) {
                        modal_direction.querySelector('.modal-body .telefono a').innerText = element.properties.telefono;
                        modal_direction.querySelector('.modal-body .telefono a').setAttribute('href', 'tel:'+element.properties.telefono);
                    } else {
                        modal_direction.querySelector('.modal-body .telefono a').innerText = '';
                        modal_direction.querySelector('.modal-body .telefono a').removeAttribute('href');
                    }

                    let myModal = new bootstrap.Modal('#modal-direction', {
                        keyboard: false
                    });
                    myModal.show();

                });

                listado_direcciones.appendChild(nuevaFila);


                /* Generamos los tags sobre el mapa */
                L.marker([element.properties.x, element.properties.y]).addTo(map)
                    .bindPopup('<p>' + element.properties.direccion + '</p><h5>' + element.properties.nombre + '</h5>');


            });

        })
        .catch((error) => {
            console.log('Error: ', error);
        });

    // Cerramos el overlay de carga (con 200ms de retardo para darle mejor apariencia ya que se cierra muy rápido)
    setTimeout(() => { document.querySelector('div#cargando').classList.add('d-none'); }, 200);


});


