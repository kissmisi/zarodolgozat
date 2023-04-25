function radioButton() {
    var sz = `
      <input type="text" class="userform" placeholder="Adószám: *" id="szamlaAdoszam">
    `
    if (document.getElementById('cegRadio').checked == true) {
      document.getElementById('radioCheck').innerHTML = sz;
    }
    else if (document.getElementById('maganRadio').checked == true) {
      document.getElementById('radioCheck').innerHTML = "";
    }
}
  
function checkBox() {
    if (document.getElementById('flexCheckBox').checked==true) {
      if (
        document.getElementById('szamlaUserVezeteknev').value!="" && document.getElementById('szamlaUserKeresztnev').value!="" && 
        document.getElementById('szamlaIrSzam').value!="" && document.getElementById('szamlaTelepules').value!="" &&
        document.getElementById('szamlaUtca').value!="" && document.getElementById('szamlaHazszam').value!=""
      ) {
        document.getElementById('szallUserVezeteknev').value=document.getElementById('szamlaUserVezeteknev').value;
        document.getElementById('szallUserKeresztnev').value=document.getElementById('szamlaUserKeresztnev').value;
        document.getElementById('szallIrSzam').value=document.getElementById('szamlaIrSzam').value;
        document.getElementById('szallTelepules').value=document.getElementById('szamlaTelepules').value;
        document.getElementById('szallUtca').value=document.getElementById('szamlaUtca').value;
        document.getElementById('szallHazszam').value=document.getElementById('szamlaHazszam').value;
      }
      else {
        alert("A *-al jelölt mezők kitöltése kötelező!")
        document.getElementById('flexCheckBox').checked=false;
      }
      if (
        document.getElementById('szamlaEmelet').value!="" && document.getElementById('szamlaAjto').value!=""
      )
      {
        document.getElementById('szallEmelet').value=document.getElementById('szamlaEmelet').value;
      document.getElementById('szallAjto').value=document.getElementById('szamlaAjto').value;
      }
    }
}