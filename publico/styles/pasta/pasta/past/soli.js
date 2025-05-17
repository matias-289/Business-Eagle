import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


const supabaseUrl = 'https://vsxepokxihwlpojlpmjf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzeGVwb2t4aWh3bHBvamxwbWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjQyMTQsImV4cCI6MjA2MDMwMDIxNH0.ycfke4A6dRp66Qz6sIzO83BtXZJ61BrSpBXaScJrMpo';
const supabase = createClient(supabaseUrl, supabaseKey);

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const documento = document.querySelector('.documento').value.trim();
    const nombre = document.querySelector('.nombre').value.trim();
    const monto = parseFloat(document.querySelector('.monto').value);
    const mensaje = document.querySelector('.mensaje').value.trim();

    const { data, error } = await supabase
        .from('solicitudes_prestamo')
        .insert([{ documento, nombre, monto, mensaje }]);

    if (error) {
        alert('Error al enviar la solicitud: ' + error.message);
        console.error(error);
    } else {
        alert('Solicitud enviada correctamente.');
        document.querySelector('form').reset();
    }
});
