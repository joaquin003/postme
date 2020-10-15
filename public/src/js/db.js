db.enablePersistence()
    .catch(err => {
        if(err.code == 'failed-precondition'){
            //solo funciona en una pestaña
            console.error('persitence failed');
        }else if(err.code === 'unimplemented'){
            //tu navegador no soporta este tipo de tecnologia
            console.error('persistence is not available');
        }
    });

const createPosts = ({description,title,image,timestamp}) => {
    let UNIX;
    if(timestamp){
        UNIX = new Date(timestamp.second * 1000 + timestamp.nanoseconds / 1000000).getTime();
        UNIX = dayjs(UNIX).fromNow(); //calculo de tiempo de la publicacion
    }
    //container
    const cardText = document.createElement('div');
    cardText.className= 'card-posts mdl-card mdl-shadow--2dp select-none';

    //title
    const cardTitleContainer = document.createElement('div');
    cardTitleContainer.className = 'mdl-card__title select-none';
    const cardH3 = document.createElement('h3');
    cardH3.className = 'mdl-card__title-text fs8';
    cardH3.appendChild(document.createTextNode(title));
    cardTitleContainer.appendChild(cardH3);

    //body
    const cardBodyContainer = document.createElement('div');
    cardBodyContainer.className="mdl-card__supporting-text";
    cardBodyContainer.appendChild(document.createTextNode(description));

    //Date
    const cardDateContainer = document.createElement('div');
    cardDateContainer.className="mdl-card__actions mdl-card--border pa-0";
    const enlace = document.createElement('div');
    enlace.className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
    enlace.appendChild(document.createTextNode(UNIX ? UNIX : ""));
    cardDateContainer.appendChild(enlace);

    //share
    const btnShare = document.createElement('div');
    btnShare.className = 'mdl-card__menu';
    const btn = document.createElement('button');
    btn.className = 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect';
    btn.addEventListener('click', () => share(title, description, image));
    const icon = document.createElement('i');
    icon.className = 'material-icons mdl-color-text--orange';
    icon.appendChild(document.createTextNode('share'));
  
    btn.appendChild(icon);
    btnShare.appendChild(btn);

    cardText.appendChild(cardTitleContainer);
    cardText.appendChild(cardBodyContainer);
    cardText.appendChild(cardDateContainer);
    cardText.appendChild(btnShare);

    componentHandler.upgradeElement(cardText);
    MAIN.appendChild(cardText);
};

const share = async (title, text, image) => {
    if (image) {
      const url = URL.createObjectURL(image);
      console.log('------------------------------------');
      console.log(url);
      console.log('------------------------------------');
     let imgBlob = await fetch(image, {
       mode: 'no-cors',
       responseType: 'blob',
       method: 'GET'
    });
    imgBlob = await imgBlob.blob();
    console.log('------------------------------------');
    console.log(imgBlob);
    console.log('------------------------------------');

      if (navigator.canShare && navigator.canShare({ files: [image] })) {
        const data = {
          files: [image],
          title,
          text
        };
        await navigator.share(data);
      }
    } else {
      if (navigator.share) {
        const data = {
          title,
          text
        };
        await navigator.share(data);
      } else {
        const data = {
          message: 'Tu navegador no soporta la opción de compartir'
        };
        Message('error').MaterialSnackbar.showSnackbar(data);
      }
    }
  };

if(window.location.href.includes('post.html')){
    db.collection('posts').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(change => {
            if(change.type === 'added'){
                const data = change.doc.data();
                createPosts(data);
                closePostModal();
                document.forms[0].reset();
            }
            if(change.type === 'removed'){
                const data = change.doc.data();
                createPosts(data);
                closePostModal();
                document.forms[0].reset();
            }
        });
    })
}