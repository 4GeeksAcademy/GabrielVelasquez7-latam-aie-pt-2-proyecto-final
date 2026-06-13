document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("brasalandApplicationForm");
  const formHeader = document.getElementById("formHeader");
  const formMessage = document.getElementById("formMessage");
  const successContainer = document.getElementById("successContainer");
  const registerAnotherBtn = document.getElementById("registerAnotherBtn");

  if (!form || !formMessage || !successContainer) {
    return;
  }

  const fieldIds = ["fullName", "email", "phone", "birthDate", "frequentLocation"];
  const fields = {};

  fieldIds.forEach((id) => {
    fields[id] = document.getElementById(id);
  });

  const validClassList = ["border-emerald-400", "ring-2", "ring-emerald-400/30"];
  const invalidClassList = ["border-red-400", "ring-2", "ring-red-400/40"];
  const neutralClassList = ["border-stone-700", "ring-0"];

  function sanitizeText(value) {
    return value.trim().replace(/\s+/g, " ");
  }

  function normalizePhone(value) {
    return value.replace(/[^\d+]/g, "");
  }

  function parseDate(value) {
    if (!value) {
      return null;
    }
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function yearsBetween(fromDate, toDate) {
    let years = toDate.getFullYear() - fromDate.getFullYear();
    const monthDiff = toDate.getMonth() - fromDate.getMonth();
    const dayDiff = toDate.getDate() - fromDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years -= 1;
    }

    return years;
  }

  function ensureErrorNode(field) {
    const messageId = `${field.id}Error`;
    let node = document.getElementById(messageId);

    if (!node) {
      node = document.createElement("p");
      node.id = messageId;
      node.className = "hidden text-xs font-medium text-red-400 mt-1";
      node.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", node);
    }

    if (!field.hasAttribute("aria-describedby")) {
      field.setAttribute("aria-describedby", messageId);
    }

    return node;
  }

  function setFieldVisualState(field, state, message = "") {
    const errorNode = ensureErrorNode(field);
    field.classList.remove(...validClassList, ...invalidClassList, ...neutralClassList);

    if (state === "valid") {
      field.classList.add(...validClassList);
      errorNode.textContent = "";
      errorNode.classList.add("hidden");
      field.setAttribute("aria-invalid", "false");
      return;
    }

    if (state === "invalid") {
      field.classList.add(...invalidClassList);
      errorNode.textContent = message;
      errorNode.classList.remove("hidden");
      field.setAttribute("aria-invalid", "true");
      return;
    }

    field.classList.add(...neutralClassList);
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

  function validateRequiredSelect(value, label) {
    if (!value) {
      return `${label}: selecciona una opción para continuar.`;
    }
    return "";
  }

  const validators = {
    fullName: (value) => {
      const normalized = sanitizeText(value);
      if (!normalized) {
        return "Este campo es obligatorio.";
      }
      if (normalized.length < 3) {
        return "Escribe al menos 3 caracteres.";
      }
      if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]+$/.test(normalized)) {
        return "Usa solo letras, espacios, apóstrofes o guiones.";
      }
      if (!normalized.includes(" ")) {
        return "Por favor, incluye nombre y apellido.";
      }
      return "";
    },
    email: (value) => {
      const normalized = value.trim();
      if (!normalized) {
        return "Este campo es obligatorio.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized)) {
        return "Ingresa un correo válido (ejemplo@dominio.com).";
      }
      return "";
    },
    phone: (value) => {
      const normalized = normalizePhone(value);
      const city = fields.frequentLocation.value;

      if (!normalized) {
        return "Este campo es obligatorio.";
      }

      const digits = normalized.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 12) {
        return "Ingresa entre 10 y 12 dígitos incluyendo prefijo internacional si aplica.";
      }

      if (city === "medellin") {
        const isColombiaValid = /^(\+57\d{10}|\d{10})$/.test(normalized);
        if (!isColombiaValid) {
          return "Para Medellín usa un número colombiano (10 dígitos, opcional +57).";
        }
      }

      if (city === "miami") {
        const isUsValid = /^(\+1\d{10}|1\d{10}|\d{10})$/.test(normalized);
        if (!isUsValid) {
          return "Para Miami usa un número de USA (10 dígitos, opcional +1).";
        }
      }

      return "";
    },
    birthDate: (value) => {
      const birthDate = parseDate(value);
      const today = new Date();

      if (!birthDate) {
        return "Este campo es obligatorio.";
      }
      if (birthDate > today) {
        return "No puede ser una fecha futura.";
      }

      const age = yearsBetween(birthDate, today);
      if (age < 13) {
        return "Debes tener al menos 13 años para registrarte.";
      }

      return "";
    },
    frequentLocation: (value) => {
      const baseError = validateRequiredSelect(value, "Ubicación");
      if (baseError) {
        return baseError;
      }
      if (!["medellin", "miami"].includes(value)) {
        return "Selección inválida.";
      }
      return "";
    }
  };

  function validateField(fieldId, options = { showNeutralIfEmpty: false }) {
    const field = fields[fieldId];
    const validator = validators[fieldId];

    if (!field || !validator) {
      return true;
    }

    const errorMessage = validator(field.value);

    if (!errorMessage) {
      setFieldVisualState(field, "valid");
      return true;
    }

    if (options.showNeutralIfEmpty && !field.value) {
      setFieldVisualState(field, "neutral");
      return false;
    }

    setFieldVisualState(field, "invalid", errorMessage);
    return false;
  }

  function validateAllFields() {
    return fieldIds.every((fieldId) => validateField(fieldId));
  }

  function attachRealtimeValidation() {
    fieldIds.forEach((fieldId) => {
      const field = fields[fieldId];
      if (!field) {
        return;
      }

      const isSelect = field.tagName.toLowerCase() === "select";
      const primaryEvent = isSelect ? "change" : "input";

      field.addEventListener(primaryEvent, () => {
        validateField(fieldId, { showNeutralIfEmpty: !isSelect });

        if (fieldId === "frequentLocation") {
          validateField("phone", { showNeutralIfEmpty: true });
        }

        setFormMessage("idle", "");
      });

      field.addEventListener("blur", () => {
        validateField(fieldId);
      });
    });
  }

  // --- LÓGICA DE SUBMIT Y ÉXITO ---
  
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isFormValid = validateAllFields();
    
    if (!isFormValid) {
      setFormMessage("error", "Revisa los campos marcados en rojo antes de continuar.");

      const firstInvalidField = fieldIds
        .map((id) => fields[id])
        .find((field) => field && field.getAttribute("aria-invalid") === "true");

      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // Ocultar formulario y cabecera, mostrar mensaje de éxito
    form.classList.add("hidden");
    if(formHeader) formHeader.classList.add("hidden");
    
    successContainer.classList.remove("hidden");
    
    // Subir suavemente al tope del contenedor de éxito
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      fieldIds.forEach((fieldId) => {
        const field = fields[fieldId];
        if (field) {
          setFieldVisualState(field, "neutral");
        }
      });
      setFormMessage("idle", "");
    }, 0);
  });

  // Botón para registrar a otra persona (reinicia el estado)
  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener("click", () => {
      form.reset();
      
      fieldIds.forEach((fieldId) => {
        const field = fields[fieldId];
        if (field) {
          setFieldVisualState(field, "neutral");
        }
      });
      
      setFormMessage("idle", "");
      
      // Volver a mostrar el formulario
      successContainer.classList.add("hidden");
      if(formHeader) formHeader.classList.remove("hidden");
      form.classList.remove("hidden");
      
      fields.fullName.focus();
    });
  }

  attachRealtimeValidation();
  setFormMessage("idle", "");
});