    document.addEventListener("DOMContentLoaded", function() {  // Aseguramos que el DOM esté completamente cargado antes de ejecutar el script.
      const SUPABASE_URL = "https://vsxepokxihwlpojlpmjf.supabase.co";
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeGVwb2t4aWh3bHBvamxwbWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjQyMTQsImV4cCI6MjA2MDMwMDIxNH0.ycfke4A6dRp66Qz6sIzO83BtXZJ61BrSpBXaScJrMpo";

      const { createClient } = supabase;
      const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      document.getElementById("registro-form").addEventListener("submit", async function(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const documento = document.getElementById("documento").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;
        const control = document.getElementById("control").value;  // Aquí se usa 'control' como campo de contraseña
        const mensajeDiv = document.getElementById("mensaje");

        mensajeDiv.textContent = "";
        mensajeDiv.classList.remove("error", "success");

        // Validar que todos los campos estén completos
        if (!nombre || !documento || !telefono || !correo || !control) {
          mensajeDiv.textContent = "Por favor complete todos los campos.";
          mensajeDiv.classList.add("error");
          return;
        }

        try {
          // Guardar los datos en la tabla solicitud_registro
          const { data, error } = await supabaseClient
            .from("solicitud_registro")
            .insert([
              {
                nombre,
                documento,
                telefono,
                correo,
                control  // Aquí se usa 'control' como campo de contraseña
              }
            ]);

          if (error) {
            mensajeDiv.textContent = "Hubo un error al registrar los datos. Intente de nuevo.";
            mensajeDiv.classList.add("error");
          } else {
            mensajeDiv.textContent = "Registro exitoso. Sus datos han sido guardados.";
            mensajeDiv.classList.add("success");

            // Redirigir al formulario de inicio después del registro exitoso
            setTimeout(() => {
              window.location.href = "form.html"; // Aquí especificas la página a la que deseas redirigir
            }, 2000); // Espera 2 segundos antes de redirigir para que el usuario vea el mensaje de éxito
          }
        } catch (err) {
          mensajeDiv.textContent = "Error inesperado. Intente más tarde.";
          mensajeDiv.classList.add("error");
        }
      });
    });