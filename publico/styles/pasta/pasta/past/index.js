 import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

    const rsew = "https://vsxepokxihwlpojlpmjf.supabase.co";
    const fesgfes = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeGVwb2t4aWh3bHBvamxwbWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjQyMTQsImV4cCI6MjA2MDMwMDIxNH0.ycfke4A6dRp66Qz6sIzO83BtXZJ61BrSpBXaScJrMpo";

    const supabase = createClient(rsew, fesgfes);

    document.getElementById("login-form").addEventListener("submit", async function (e) {
      e.preventDefault();
      const correo = document.getElementById("correo").value;
      const control = document.getElementById("control").value;
      const mensajeDiv = document.getElementById("mensaje");

      mensajeDiv.textContent = "";
      mensajeDiv.className = "";

      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", correo)
        .eq("control", control)
        .single();

      if (error || !data) {
        mensajeDiv.textContent = "Correo o contraseña incorrectos.";
        mensajeDiv.classList.add("error");
      } else {
        const url = `publico/bienvenida.html?correo=${encodeURIComponent(data.correo)}&deuda=${encodeURIComponent(data.deuda)}`;
        window.location.href = url;
      }
    });