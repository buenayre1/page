(function(){
  var STORAGE_KEY = 'buenayre-resumen-tours';
  var checkboxes = Array.prototype.slice.call(document.querySelectorAll('.chk input[type="checkbox"]'));
  var relleno = document.getElementById('progreso-relleno');
  var contador = document.getElementById('progreso-contador');

  function estadoGuardado(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    }catch(e){
      return {};
    }
  }

  function guardar(id, marcado){
    var estado = estadoGuardado();
    estado[id] = marcado;
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(estado)); }catch(e){}
  }

  function actualizarProgreso(){
    var marcados = checkboxes.filter(function(c){ return c.checked; }).length;
    var total = checkboxes.length;
    if(relleno) relleno.style.width = (total ? (marcados / total * 100) : 0) + '%';
    if(contador) contador.textContent = marcados + ' de ' + total + ' confirmados';
  }

  var estado = estadoGuardado();
  checkboxes.forEach(function(chk){
    if(estado[chk.id]) chk.checked = true;
    chk.addEventListener('change', function(){
      guardar(chk.id, chk.checked);
      actualizarProgreso();
    });
  });
  actualizarProgreso();

  var anio = document.getElementById('anio');
  if(anio) anio.textContent = new Date().getFullYear();
})();
