import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot
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

// 🎯 Estado en tiempo real (círculo arriba)
const punto = document.getElementById("puntoEstado");
const texto = document.getElementById("textoEstado");
const estadoRef = doc(db, "Estado", "acceso");

onSnapshot(estadoRef, (docSnap) => {
  const estado = docSnap.data()?.estado || "Off";

  if (estado === "On") {
    punto.style.backgroundColor = "lime";
    punto.style.boxShadow = "0 0 8px lime, 0 0 16px lime";
    texto.style.color = "white";
    // NO cambiamos estilo de texto (negrita se conserva desde HTML o CSS)
  } else {
    punto.style.backgroundColor = "red";
    punto.style.boxShadow = "0 0 8px red, 0 0 16px red";
    texto.style.color = "white";
  }
});

// ✅ Validación de formulario (registro)
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("button");
  const inputs = document.querySelectorAll(".ds_textinput");
  const mensaje = document.getElementById("mensaje");

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const campos = Array.from(inputs).map(i => i.value.trim());
    const algunoVacio = campos.some(v => v === "");

    if (algunoVacio) {
      mensaje.textContent = "❌ Por favor completa todos los campos";
      mensaje.style.display = "block";
      mensaje.style.color = "red";
      mensaje.style.textShadow = "0 0 6px red";
      mensaje.style.animation = "alertaZoom 0.2s ease";

      setTimeout(() => {
        mensaje.textContent = "";
        mensaje.style.display = "none";
      }, 2000);
    } else {
      mensaje.textContent = "";
      mensaje.style.display = "none";

      // Aquí iría el guardado en Firestore si deseas
      console.log("✔ Registro válido:", {
        usuario: campos[0],
        contraseña: campos[1],
        telefono: campos[2],
        codigo: campos[3]
      });

      alert("✅ Registro correcto (simulado)");
    }
  });
});
