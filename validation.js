function initBrasalandValidation() {
  const form = document.getElementById("brasalandApplicationForm");
  const formHeader = document.getElementById("formHeader");
  const formMessage = document.getElementById("formMessage");
  const successContainer = document.getElementById("successContainer");
  const registerAnotherBtn = document.getElementById("registerAnotherBtn");
  const countrySelect = document.getElementById("country");
  const citySelect = document.getElementById("city");

  if (!form || !formMessage || !successContainer) return;

  // 1. LÓGICA DE CIUDAD DINÁMICA
  const citiesByCountry = {
    colombia: ["Medellín", "Bogotá", "Cali", "Barranquilla"],
    usa: ["Miami", "Orlando", "Tampa", "Fort Lauderdale"]
  };

  if (countrySelect && citySelect) {
    countrySelect.addEventListener("change", (e) => {
      const selectedCountry = e.target.value;
      citySelect.innerHTML = '<option value="" selected disabled>Selecciona tu ciudad...</option>';
      
      if (selectedCountry && citiesByCountry[selectedCountry]) {
        citiesByCountry[selectedCountry].forEach(city => {
          const option = document.createElement("option");
          option.value = city.toLowerCase();
          option.textContent = city;
          citySelect.appendChild(option);
        });
        citySelect.disabled = false;
        citySelect.classList.remove("disabled:opacity-50", "disabled:cursor-not-allowed");
      } else {
        citySelect.disabled = true;
        citySelect.classList.add("disabled:opacity-50", "disabled:cursor-not-allowed");
      }
      
      // Re-validar la ciudad si ya había sido tocada
      validateField("city", { showNeutralIfEmpty: true });
    });
  }

  // 2. CONFIGURACIÓN DE CAMPOS Y VALIDACIONES
  const fieldIds = ["fullName", "email", "phone", "birthDate", "country", "city", "favoriteLocation", "preferences", "howDidYouHear", "terms"];
  const fields = {};

  fieldIds.forEach((id) => {
    fields[id] = document.getElementById(id);
  });

  const validClassList = ["border-emerald-400", "ring-1", "ring-emerald-400"];
  const invalidClassList = ["border-red-400", "ring-1", "ring-red-400"];
  const neutralClassList = ["border-stone-700", "ring-0"];

  function ensureErrorNode(field) {
    const messageId = `${field.id}Error`;
    let node = document.getElementById(messageId);

    if (!node) {
      node = document.createElement("p");
      node.id = messageId;
      node.className = "hidden text-xs font-medium text-red-400 mt-1";
      node.setAttribute("aria-live", "polite");
      
      if (field.type === "checkbox") {
        field.parentElement.insertAdjacentElement("afterend", node);
      } else {
        field.insertAdjacentElement("afterend", node);
      }
    }

    if (!field.hasAttribute("aria-describedby")) {
      field.setAttribute("aria-describedby", messageId);
    }

    return node;
  }

  function setFieldVisualState(field, state, message = "") {
    const errorNode = ensureErrorNode(field);
    
    if (field.type !== "checkbox") {
      field.classList.remove(...validClassList, ...invalidClassList, ...neutralClassList);
    }

    if (state === "valid") {
      if (field.type !== "checkbox") field.classList.add(...validClassList);
      errorNode.textContent = "";
      errorNode.classList.add("hidden");
      field.setAttribute("aria-invalid", "false");
      return;
    }

    if (state === "invalid") {
      if (field.type !== "checkbox") field.classList.add(...invalidClassList);
      errorNode.textContent = message;
      errorNode.classList.remove("hidden");
      field.setAttribute("aria-invalid", "true");
      return;
    }

    if (field.type !== "checkbox") field.classList.add(...neutralClassList);
    errorNode.textContent = "";
    errorNode.classList.add("hidden");
    field.removeAttribute("aria-invalid");
  }

  function setFormMessage(type, message) {
    formMessage.className = "empty:hidden rounded-xl px-4 py-3 text-sm font-medium transition-all mt-4";

    if (type === "error") {
      formMessage.classList.add("border", "border-red-400/60", "bg-red-500/10", "text-red-200");
      formMessage.textContent = message;
      return;
    }

    formMessage.textContent = "";
  }

  const validators = {
    fullName: (val) => val.trim().length >= 3 ? "" : "Nombre completo: ingresa al menos 3 caracteres.",
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim()) ? "" : "Correo electrónico: ingresa un formato válido.",
    phone: (val) => val.replace(/\D/g, "").length >= 10 ? "" : "Teléfono: ingresa al menos 10 dígitos.",
    birthDate: (val) => {
      if (!val) return "Fecha de nacimiento: este campo es obligatorio.";
      const date = new Date(val);
      const age = new Date().getFullYear() - date.getFullYear();
      // Regla explícita +18 para la evaluación
      return age >= 18 ? "" : "Fecha de nacimiento: debes ser mayor de 18 años.";
    },
    country: (val) => val ? "" : "País: selecciona una opción.",
    city: (val) => val ? "" : "Ciudad: selecciona una opción.",
    favoriteLocation: (val) => val.trim().length >= 3 ? "" : "Ubicación favorita: indícanos el local.",
    preferences: (val) => val ? "" : "Preferencias: selecciona tu plato favorito.",
    howDidYouHear: (val) => val ? "" : "Origen: dinos cómo nos conociste.",
    terms: () => fields.terms && fields.terms.checked ? "" : "Términos: debes aceptar las políticas para continuar."
  };

  function validateField(fieldId, options = { showNeutralIfEmpty: false }) {
    const field = fields[fieldId];
    if (!field) return true;

    const value = field.type === "checkbox" ? field.checked : field.value;
    const validator = validators[fieldId];
    const errorMessage = validator(value);

    if (!errorMessage) {
      setFieldVisualState(field, "valid");
      return true;
    }

    if (options.showNeutralIfEmpty && (value === "" || value === false)) {
      setFieldVisualState(field, "neutral");
      return false;
    }

    setFieldVisualState(field, "invalid", errorMessage);
    return false;
  }

  function validateAllFields() {
    let isValid = true;
    fieldIds.forEach((fieldId) => {
      if (!validateField(fieldId)) isValid = false;
    });
    return isValid;
  }

  // Validación en tiempo real
  fieldIds.forEach((fieldId) => {
    const field = fields[fieldId];
    if (!field) return;

    const isSelect = field.tagName.toLowerCase() === "select";
    const isCheckbox = field.type === "checkbox";
    const primaryEvent = (isSelect || isCheckbox) ? "change" : "input";

    field.addEventListener(primaryEvent, () => {
      validateField(fieldId, { showNeutralIfEmpty: !(isSelect || isCheckbox) });
      setFormMessage("idle", "");
    });

    if (!isCheckbox) {
      field.addEventListener("blur", () => {
        validateField(fieldId);
      });
    }
  });

  // 3. LÓGICA DE SUBMIT Y PANTALLA DE ÉXITO
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateAllFields()) {
      setFormMessage("error", "Revisa los campos marcados en rojo antes de continuar.");
      
      // Enfocar el primer campo con error
      const firstInvalidField = fieldIds
        .map((id) => fields[id])
        .find((field) => field && field.getAttribute("aria-invalid") === "true");

      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    // SI TODO ESTÁ BIEN: Ocultar form y mostrar pantalla bonita
    form.classList.add("hidden");
    if (formHeader) formHeader.classList.add("hidden");
    
    successContainer.classList.remove("hidden");
    
    // Subir suavemente al tope del contenedor de éxito
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Limpiar formulario y resetear estados
  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      fieldIds.forEach((fieldId) => {
        const field = fields[fieldId];
        if (field) setFieldVisualState(field, "neutral");
      });
      setFormMessage("idle", "");
      if (citySelect) {
        citySelect.innerHTML = '<option value="" selected disabled>Selecciona el país primero</option>';
        citySelect.disabled = true;
        citySelect.classList.add("disabled:opacity-50", "disabled:cursor-not-allowed");
      }
    }, 0);
  });

  // Botón para registrar a otra persona (reinicia el estado)
  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener("click", () => {
      form.reset();
      
      // Volver a mostrar el formulario
      successContainer.classList.add("hidden");
      if (formHeader) formHeader.classList.remove("hidden");
      form.classList.remove("hidden");
      
      fields.fullName.focus();
    });
  }
}

// Inicialización segura para Live Servers
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBrasalandValidation);
} else {
  initBrasalandValidation();
}