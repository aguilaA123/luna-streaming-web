import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔧 Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCw0N5E6fpie78A5X80CUWpsCm3_Kga8TE",
  authDomain: "luna-streaming-39e6f.firebaseapp.com",
  projectId: "luna-streaming-39e6f",
  storageBucket: "luna-streaming-39e6f.appspot.com",
  messagingSenderId: "1048274356742",
  appId: "1:1048274356742:web:eccf3112f323c525a41187"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔴 DOM
const estadoWeb = document.getElementById("estadoWeb");
const alertaTexto = document.getElementById("alertaTexto");
const botonEmergencia = document.getElementById("botonEmergencia");
const alarmaAudio = document.getElementById("alarma");
const activadoAudio = document.getElementById("activado");
const panelPin = document.getElementById("panelPin");
const pinDisplay = document.getElementById("pinDisplay");
const botones = document.querySelectorAll(".digito");
const borrar = document.querySelector(".borrar");
const limpiar = document.querySelector(".limpiar");

let pin = "";

const estadoRef = doc(db, "Estado", "acceso");

// 🔄 Estado en tiempo real
onSnapshot(estadoRef, (docSnap) => {
  const estado = docSnap.data()?.estado || "Off";

  estadoWeb.className = "";
  if (estado === "On") {
    estadoWeb.textContent = "Página web: habilitado";
    estadoWeb.classList.add("estado-verde");
    alertaTexto.style.display = "none";
    panelPin.classList.add("oculto");
    pin = "";
    actualizarPin();
  } else {
    estadoWeb.textContent = "Página web: deshabilitado";
    estadoWeb.classList.add("estado-rojo");
    alertaTexto.style.display = "block";
    panelPin.classList.remove("oculto");
  }
});

// 🛑 Botón de emergencia
botonEmergencia.addEventListener("click", async () => {
  const estadoSnap = await getDoc(estadoRef);
  const estado = estadoSnap.data()?.estado;

  if (estado === "On") {
    await updateDoc(estadoRef, { estado: "Off" });

    alarmaAudio.currentTime = 0;
    alarmaAudio.play();

    botonEmergencia.classList.add("parpadeo");
    setTimeout(() => {
      botonEmergencia.classList.remove("parpadeo");
    }, 3000);
  }
});

// 🔢 PIN manual
function actualizarPin() {
  pinDisplay.textContent = pin.padEnd(4, "_").replace(/./g, c => c === "_" ? "_" : "*");
}

botones.forEach(btn => {
  btn.addEventListener("click", () => {
    if (pin.length < 4) {
      pin += btn.textContent;
      actualizarPin();
      if (pin.length === 4) {
        verificarPin();
      }
    }
  });
});

borrar.addEventListener("click", () => {
  pin = pin.slice(0, -1);
  actualizarPin();
});

limpiar.addEventListener("click", () => {
  pin = "";
  actualizarPin();
});

async function verificarPin() {
  if (pin === "1379") {
    await updateDoc(estadoRef, { estado: "On" });

    activadoAudio.currentTime = 0;
    activadoAudio.play();
  } else {
    alert("❌ Código incorrecto");
    pin = "";
    actualizarPin();
  }
}
