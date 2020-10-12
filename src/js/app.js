/*Declaracion de variables globales*/
let MAIN;
let MODAL_POST;
let BTN_SHOW_POST;
let BTN_CANCEL_POST;
let deferredPrompt;
let TITLE;
let DESCRIPTION;
let DB_POUCH;

//funciones
const showPostModal = () => {
    MAIN.style.display = "none";
    MODAL_POST.style.display="block";
    setTimeout(()=>{
        MODAL_POST.style.transform="translateY(0)";
    }, 1); 
};
const closePostModal = () => {
    MAIN.style.display="block";
    MODAL_POST.style.transform = "translateY(100vh)";
};

//enviar datos
const sendData = async (e) => {
    try{
        e.preventDefault();
        TITLE = document.querySelector('#title').value;
        DESCRIPTION = document.querySelector('#description').value;
        if(TITLE && DESCRIPTION){
            const post = {
                title: TITLE,
                description: DESCRIPTION
            }
            //vamos a utilizar el syncManager
            if(window.SyncManager){
                //grabar o armar nuestra logica
                const readySW = await navigator.serviceWorker.ready;
                await readySW.sync.register('new-post');
                post._id = new Date().toISOString();
                await DB_POUCH.put(post);
            }else{
                post.timestamp = firebase.firestore.FieldValue.serverTimestamp()
                await db.collection('posts').add(post);
            }
            const data = {
                message: 'Registro exitosamente almacenado',
                timeout: 4000
            };
            Message().MaterialSnackbar.showSnackbar(data);
        }else{
            const data = {
                message: 'Faltan campos por llenar',
                timeout: 1500
            };
            Message('error').MaterialSnackbar.showSnackbar(data);
        }
    }catch (error){
        const data = {
            message: error.message,
            timeout: 1500
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
    }
}

const showNotification = () =>{
    //new Notification('Notificaciones activadas');
    navigator.serviceWorker.getRegistration()
        .then(instancia => {
            instancia.showNotification('Notificaciones activadas' , {
                body: "El cuerpo de la notificacion",
                icon: 'src/images/icons/icon-144x144.png',
                image: 'src/images/computer.jpg',
                badge: 'src/images/icons/icon-144x144.png',
                dir: 'ltr',
                tag: "notification-postme",
                requireInteraction: true,
                vibrate: [100,50,200],
                actions: [
                    {action: 'confirm', title: 'Aceptar', icon: 'src/images/icons/icon-144x144.png'},
                    {action: 'cancel', title: 'Cancelar', icon: 'src/images/icons/icon-144x144.png'}
                ]
            });
        })
        .catch(err => console.error(err.message))
};

const requestPermission = async () => {
    const result = await Notification.requestPermission();
    if(result !== 'granted'){
        const data = {
            message: 'El usuario no activo las notificaciones',
            timeout: 5000
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
    }else{
        showNotification();
    }
};

//evitar que salga la pantalla de instalar
window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt=e;
});

//cuando se cargue todo nuestro DOM
window.addEventListener('load', async ()=>{
    try {
        //declarando mi instancia de base de datos creada por PouchDB
        DB_POUCH = new PouchDB('posts');

        MAIN = document.querySelector("#main");
        MODAL_POST = document.querySelector("#modal-post-section");
        BTN_SHOW_POST = document.querySelector("#btn-upload-post");
        BTN_SHOW_POST.addEventListener("click", showPostModal);
        BTN_CANCEL_POST = document.querySelector("#btn-post-cancel");
        BTN_CANCEL_POST.addEventListener('click', closePostModal);

        //await Notification.requestPermission();

        if('serviceWorker' in navigator){
            const response = await navigator.serviceWorker.register('sw.js');
        }

        window.Message = (option = 'success',container = document.querySelector('#toast-container')) => {
            container.classList.remove('success');
            container.classList.remove('error');
            container.classList.add(option);
            return container;
        };

        window.Loading = (option = "block") => {
            document.querySelector('#loading').style.display = option;
        };

        //seccion notificaciones
        BTN_NOTIFICATIONS = document.querySelector('#notifications-install');
        BTN_NOTIFICATIONS.addEventListener('click', requestPermission);

        //agarrando el boton enviar post
        const btnPostSubmit = document.querySelector("#btn-post-submit");
        btnPostSubmit.addEventListener('click', (e)=>sendData(e));

        const bannerInstall = document.querySelector('#banner-install');
        bannerInstall.addEventListener('click', async ()=>{
            if(deferredPrompt){
                deferredPrompt.prompt();
                const response = await deferredPrompt.userChoice;
                if(response.outcome==='dismissed'){
                    console.error('El usuario cancelo la instalacion');
                }
            }
        });
    } catch (error) {
        const data = {
            message: error.message,
            timeout: 5000
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
    }
});