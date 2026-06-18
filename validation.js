document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("brasalandApplicationForm");
  const formMessage = document.getElementById("formMessage");
  const successContainer = document.getElementById("successContainer");
  const formHeader = document.getElementById("formHeader");
  
  const countrySelect = document.getElementById("country");
  const citySelect = document.getElementById("city");
  const locationSelect = document.getElementById("favoriteLocation");

  if (!form) return;

  // 1. LÓGICA DE CAMPOS DEPENDIENTES EXACTA DEL CONTEXTO
  const cascadeData = {
    "Colombia": {
      "Medellín": ["Brasaland El Poblado", "Brasaland Laureles", "Brasaland Envigado", "Brasaland Sabaneta"],
      "Bogotá": ["Brasaland Usaquén", "Brasaland Chapinero", "Brasaland Zona Rosa"],
      "Cali": ["Brasaland Granada", "Brasaland Ciudad Jardín", "Brasaland Unicentro"]
    },
    "Estados Unidos": {
      "Miami": ["Brasaland Brickell", "Brasaland Coral Gables"],
      "Orlando": ["Brasaland Downtown", "Brasaland International Drive"]
    }
  };

  countrySelect.addEventListener("change", (e) => {
    const country = e.target.value;
    citySelect.innerHTML = '<option value="" selected disabled>Selecciona ciudad</option>';
    locationSelect.innerHTML = '<option value="" selected disabled>Selecciona ciudad primero</option>';
    locationSelect.disabled = true;

    if (country && cascadeData[country]) {
      Object.keys(cascadeData[country]).forEach(city => {
        citySelect.add(new Option(city, city));
      });
      citySelect.disabled = false;
    } else {
      citySelect.disabled = true;
    }
  });

  citySelect.addEventListener("change", (e) => {
    const country = countrySelect.value;
    const city = e.target.value;
    
    locationSelect.innerHTML = '<option value="" selected disabled>Selecciona ubicación favorita</option>';
    
    if (country && city && cascadeData[country][city]) {
      cascadeData[country][city].forEach(loc => locationSelect.add(new Option(loc, loc)));
      locationSelect.disabled = false;
    } else {
      locationSelect.disabled = true;
    }
  });

  // 2. VALIDACIONES Y MENSAJES LITERALES
  function validateField(id) {
    const field = document.getElementById(id);
    if (!field) return true;

    const errorId = id + "Error";
    let errorNode = document.getElementById(errorId);
    
    if (!errorNode) {
      errorNode = document.createElement("p");
      errorNode.id = errorId;
      errorNode.className = "text-xs font-bold text-red-400 mt-1.5";
      if(field.type === "checkbox") {
        field.parentElement.insertAdjacentElement("afterend", errorNode);
      } else {
        field.insertAdjacentElement("afterend", errorNode);
      }
    }
    
    let errorMsg = "";
    const val = field.type === "checkbox" ? field.checked : field.value.trim();

    // Reglas literales
    if (id === "fullName") {
      if (!val || val.split(" ").filter(Boolean).length < 2) {
        errorMsg = "Ingresa tu nombre completo (nombre y apellido)";
      }
    } 
    else if (id === "email") {
      if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        errorMsg = "Ingresa un email válido (ejemplo: nombre@correo.com)";
      }
    } 
    // --- LÓGICA DE TELÉFONO BLINDADA ---
    else if (id === "phone") {
      // Quitamos todos los espacios vacíos que el usuario pueda poner
      const cleanPhone = val.replace(/\s+/g, '');
      const phoneError = "El teléfono debe incluir código de país (ejemplo: +57 300 123 4567 o +1 305 123 4567)";

      if (!cleanPhone) {
        errorMsg = phoneError;
      } else if (!cleanPhone.startsWith("+57") && !cleanPhone.startsWith("+1")) {
        errorMsg = phoneError;
      } else if (!/^\+\d+$/.test(cleanPhone)) {
        errorMsg = phoneError;
      } else if (!/^(?:\+57\d{10}|\+1\d{10})$/.test(cleanPhone)) {
        errorMsg = phoneError;
      }
    } 
    // -----------------------------------
    else if (id === "country") {
      if (!val) errorMsg = "Selecciona tu país";
    } 
    else if (id === "city") {
      if (!val) errorMsg = "Selecciona tu ciudad";
    } 
    else if (id === "howDidYouHear") {
      if (!val) errorMsg = "Cuéntanos cómo conociste Brasaland";
    } 
    else if (id === "birthDate") {
      if (!val) {
         errorMsg = "Debes ser mayor de 18 años para registrarte en Brasa Points";
      } else {
         const date = new Date(val);
         let age = new Date().getFullYear() - date.getFullYear();
         const monthDiff = new Date().getMonth() - date.getMonth();
         // Ajuste preciso de cumpleaños
         if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < date.getDate())) {
             age--;
         }
         
         if (age < 18) {
           errorMsg = "Debes ser mayor de 18 años para registrarte en Brasa Points";
         }
      }
    } 
    else if (id === "terms") {
      if (!val) errorMsg = "Debes aceptar los términos del programa Brasa Points para continuar";
    }

    // Aplicación visual de los errores
    if (errorMsg) {
      field.setCustomValidity(errorMsg);
      if(field.type !== "checkbox") {
        field.classList.remove("border-stone-700", "focus:border-orange-500");
        field.classList.add("border-red-400", "focus:border-red-500");
      }
      errorNode.textContent = errorMsg;
      errorNode.style.display = "block";
      return false;
    } else {
      field.setCustomValidity("");
      if(field.type !== "checkbox") {
        field.classList.remove("border-red-400", "focus:border-red-500");
        field.classList.add("border-stone-700", "focus:border-orange-500");
      }
      errorNode.style.display = "none";
      return true;
    }
  }

  // 3. ENVÍO Y MOSTRAR PANTALLA DE ÉXITO
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const reqFields = ["fullName", "email", "phone", "country", "city", "howDidYouHear", "birthDate", "terms"];
    let isValid = true;
    
    // Forzamos validar todos los campos para que salgan en rojo si están mal
    reqFields.forEach(id => {
      if (!validateField(id)) isValid = false;
    });

    if (isValid) {
      // Ocultar formulario, mostrar éxito
      form.classList.add("hidden");
      if(formHeader) formHeader.classList.add("hidden");
      formMessage.classList.add("hidden");
      
      successContainer.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Aviso de que hay errores
      formMessage.className = "rounded-xl px-4 py-3 text-sm font-medium mt-4 border border-red-400 bg-red-500/10 text-red-200 block";
      formMessage.textContent = "Por favor, corrige los errores señalados en rojo antes de enviar el formulario.";
      
      // Poner el foco en el primer error encontrado
      const firstError = reqFields.find(id => document.getElementById(id + "Error")?.style.display === "block");
      if(firstError) document.getElementById(firstError).focus();
    }
  });

  // 4. VALIDACIÓN EN TIEMPO REAL
  ["fullName", "email", "phone", "birthDate"].forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener("input", () => validateField(id));
      el.addEventListener("blur", () => validateField(id));
    }
  });
  
  ["country", "city", "howDidYouHear", "terms"].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener("change", () => validateField(id));
  });
});