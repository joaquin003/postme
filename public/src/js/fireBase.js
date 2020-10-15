// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDjaeeqnMthwAHlNJhZQ3X7hPnStbMzfwg",
    authDomain: "postme-app-ebc19.firebaseapp.com",
    databaseURL: "https://postme-app-ebc19.firebaseio.com",
    projectId: "postme-app-ebc19",
    storageBucket: "postme-app-ebc19.appspot.com",
    messagingSenderId: "930755451276",
    appId: "1:930755451276:web:50c30df21ca70db5035ea9",
    measurementId: "G-5N6RW9QG1Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//configuramos dayjs
dayjs.extend(window.dayjs_plugin_relativeTime);
const locale = {
    name: 'es',
    monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
    weekdays: 'domingo_lunes_martes_miercoles_jueves_viernes_sabado'.split('_'),
    weekdaysShort: 'dom._lun._mar._mie._jue._vie._sab._'.split('_'),
    weekdaysMin: 'do_lu_ma_mi_ju_vi_sa'.split('_'),
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septimebre_Octubre_Noviembre_Diciembre'.split('_'),
    weekStart: 1,
    formats: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D [de] MMM [de] YYYY',
        LLL: 'D [de] MMM [de] YYYY H:mm',
        LLLL: 'dddd, D [de] MMM [de] YYYY H:mm',
    },
    relativeTime: {
        future: 'en %s',
        past: 'hace %s',
        s: 'unos segundos',
        m: 'un minuto',
        mm: '%d horas',
        h: 'una hora',
        hh: '%d horas',
        d: 'un dia',
        dd: '%d dias',
        M: 'un mes',
        MM: '%d meses',
        y: 'un año',
        yy: '%d años'
    },
    ordinal: (n) => `${n}ª`
};
dayjs.locale(locale,null,true);
dayjs.locale('es');