var logged = sessionStorage.getItem('key')

if (logged == null) {
   sessionStorage.setItem('key', 'true');
   window.location.assign('login.html');
}



function irAInicio() {
   
   username = document.getElementById('usuario').value;
   pass = document.getElementById('contraseña').value;

   if (username != '' && pass != '') {
      sessionStorage.setItem('user', username);
      sessionStorage.setItem('contraseña', pass);
      window.location.assign('index.html');
   } else {
      alert('Debes completar ambos campos para ingresar.');
      document.getElementById('usuario').value = '';
      document.getElementById('contraseña').value = '';
  }
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function(e){
 
});
