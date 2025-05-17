const SUPABASE_URL = "https://vsxepokxihwlpojlpmjf.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeGVwb2t4aWh3bHBvamxwbWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjQyMTQsImV4cCI6MjA2MDMwMDIxNH0.ycfke4A6dRp66Qz6sIzO83BtXZJ61BrSpBXaScJrMpo";

    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const params = new URLSearchParams(window.location.search);
    const correo = params.get("correo");

    const correoElement = document.getElementById("correo");
    const cardCorreo = document.getElementById("card-correo");

    if (correo) {
      correoElement.textContent = correo;
      cardCorreo.setAttribute("data-correo", correo);
      document.getElementById("bienvenida").textContent = `Bienvenido, ${correo}`;
    } else {
      document.getElementById("error").textContent = "No se proporcionó el correo.";
    }

    function formatearGs(valor) {
      return `₲ ${Number(valor).toLocaleString('es-PY')}`;
    }

    async function cargarCuotas() {
      const correoGuardado = cardCorreo.getAttribute("data-correo");

      const { data, error } = await supabaseClient
        .from("cuotas")
        .select("fechadevencimiento, valorcuota, estado")
        .eq("correo", correoGuardado)
        .eq("estado", "")
        .order("fechadevencimiento", { ascending: false });

      if (error) {
        document.getElementById("error").textContent = "No se pudieron obtener las cuotas.";
        return;
      }

      const tbody = document.getElementById("tabla-cuotas");
      tbody.innerHTML = "";

      let totalVencidas = 0;  // Variable para calcular el total de cuotas vencidas

      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No hay cuotas pendientes.</td></tr>`;
        return;
      }

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Limpiar hora

      data.forEach(cuota => {
        const fechaVenc = new Date(cuota.fechadevencimiento);
        fechaVenc.setHours(0, 0, 0, 0);

        let diasAtraso = 0;
        let interes = 0;
        let totalConInteres = cuota.valorcuota;

        let claseFila = "";

        if (fechaVenc <= hoy) {
          diasAtraso = Math.floor((hoy - fechaVenc) / (1000 * 60 * 60 * 24));
          interes = (cuota.valorcuota * 0.01) * diasAtraso;
          totalConInteres += interes;
          claseFila = "vencida";
          totalVencidas += totalConInteres;  // Sumar al total de vencidas
        } else if (fechaVenc.getTime() === hoy.getTime()) {
          claseFila = "hoy";
        }

        const tr = document.createElement("tr");
        if (claseFila) tr.classList.add(claseFila);

        tr.innerHTML = `
          <td>${fechaVenc.toLocaleDateString()}</td>
          <td>${formatearGs(cuota.valorcuota)}</td>
          <td>${diasAtraso}</td>
          <td>${formatearGs(interes)}</td>
          <td>${formatearGs(totalConInteres)}</td>
          <td>${cuota.estado || "Pendiente"}</td>
        `;
        tbody.appendChild(tr);
      });

      // Mostrar el total de cuotas vencidas
      const totalVencidasElement = document.getElementById("total-vencidas");
      totalVencidasElement.textContent = `Total de cuotas vencidas: ${formatearGs(totalVencidas)}`;
    }

    function cerrarSesion() {
      window.location.href = "../index.html"; 
    }

    async function descargarPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const correoUser = cardCorreo.getAttribute("data-correo");
      const filas = document.querySelectorAll("#tabla-cuotas tr");

      doc.setFontSize(14);
      doc.text(`Reporte de Cuotas - ${correoUser}`, 14, 20);

      const headers = ["Fecha", "Monto", "Días atraso", "Interés", "Total", "Estado"];
      const rows = [];

      filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        const filaData = Array.from(celdas).map(td => td.textContent.replace(/₲/g, "").trim());
        if (filaData.length) rows.push(filaData);
      });

      let startY = 30;
      rows.forEach((row, index) => {
        let posY = startY + index * 10;
        row.forEach((col, i) => {
          doc.text(col, 14 + i * 30, posY);
        });
      });

      doc.save(`cuotas_${correoUser}.pdf`);
    }

    cargarCuotas();