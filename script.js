import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔧 Configuración de Firebase
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

// 🔴 Indicador de estado en tiempo real
const puntoEstado = document.getElementById("puntoEstado");
const estadoRef = doc(db, "Estado", "acceso");

onSnapshot(estadoRef, (docSnap) => {
  const estado = docSnap.data()?.estado || "Off";
  puntoEstado.classList.remove("punto-verde", "punto-rojo");

  if (estado === "On") {
    puntoEstado.classList.add("punto-verde");
  } else {
    puntoEstado.classList.add("punto-rojo");
  }
});

// 🟢 LOGIN
const botonLogin = document.querySelector("button");
const mensajeDiv = document.getElementById("mensaje");

botonLogin.addEventListener("click", async (e) => {
  e.preventDefault();

  const username = document.querySelectorAll(".ds_textinput")[0].value.trim();
  const password = document.querySelectorAll(".ds_textinput")[1].value.trim();

  try {
    const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
    const estadoSnap = await getDoc(estadoRef);
    const estadoActual = estadoSnap.data()?.estado || "Off";

    let accesoPermitido = false;

    usuariosSnapshot.forEach((doc) => {
      const data = doc.data();
      const usuario = data.usuario?.trim();
      const contrasena = data.contraseña?.trim();
      const rol = data.rol?.trim();

      if (usuario === username && contrasena === password) {
        accesoPermitido = true;

        // 🟢 Guardar acceso autorizado
        localStorage.setItem("accesoAutorizado", "true");

        mostrarMensaje("✓ Credenciales correctas", true);

        setTimeout(() => {
          if (rol === "admin") {
            window.location.href = "/admin2228/";
          } else if (rol === "seller" && estadoActual === "On") {
            window.location.href = "inicio.html";
          } else if (rol === "supplier" && estadoActual === "On") {
            window.location.href = "distribuidor.html";
          } else {
            mostrarMensaje("✅ Acceso correcto, pero la página está en mantenimiento...", true);
          }
        }, 1000);
      }
    });

    if (!accesoPermitido) {
      mostrarMensaje("❌ Usuario o contraseña incorrectos.");
    }

  } catch (error) {
    console.error("Error al verificar usuarios:", error);
    mostrarMensaje("⚠️ Error al conectar con la base de datos.");
  }
});

// 💬 Mostrar mensaje animado
function mostrarMensaje(texto, correcto = false) {
  mensajeDiv.textContent = texto;
  mensajeDiv.classList.remove("mensaje-correcto");
  if (correcto) mensajeDiv.classList.add("mensaje-correcto");

  mensajeDiv.style.opacity = "1";
  setTimeout(() => {
    mensajeDiv.style.opacity = "0";
  }, 2500);
}
