function adatokPost() {
    if(
      document.getElementById('userVezeteknev').value!="" && document.getElementById('userKeresztnev').value!="" && 
      document.getElementById('userEmail').value!="" && document.getElementById('userTel').value!="" && 
      document.getElementById('szamlaUserVezeteknev').value!="" && document.getElementById('szamlaUserKeresztnev').value!="" &&
      document.getElementById('szamlaIrSzam').value!="" && document.getElementById('szamlaTelepules').value!="" && 
      document.getElementById('szamlaUtca').value!="" && document.getElementById('szamlaHazszam').value!="" &&
      document.getElementById('szallUserVezeteknev').value!="" && document.getElementById('szallUserKeresztnev').value!="" &&
      document.getElementById('szallIrSzam').value!="" && document.getElementById('szallTelepules').value!="" &&
      document.getElementById('szallUtca').value!="" && document.getElementById('szallHazszam').value!=""
    ) {

      let szemely="Magánszemély";
      let adoszam=null;
  
      if (document.getElementById('maganRadio').checked==true) {
        szemely="Magánszemély";
        adoszam=null;
      }
      else if(document.getElementById('cegRadio').checked==true) {
        szemely="Cég";
        adoszam=document.getElementById('szamlaAdoszam').value;
      }
      let bemenet={
        felhId: sessionStorage.getItem('userId'),
        felhVezeteknev: document.getElementById('userVezeteknev').value,
        felhKeresztnev: document.getElementById('userKeresztnev').value,
        email: document.getElementById('userEmail').value,
        tel: document.getElementById('userTel').value,
        Szemely: szemely,
        szamlaVezeteknev: document.getElementById('szamlaUserVezeteknev').value,
        szamlaKeresztnev: document.getElementById('szamlaUserKeresztnev').value,
        szamlaIrSzam: document.getElementById('szamlaIrSzam').value,
        szamlaTelepules: document.getElementById('szamlaTelepules').value,
        szamlaUtca: document.getElementById('szamlaUtca').value,
        szamlaHazSzam: document.getElementById('szamlaHazszam').value,
        szamlaAdoszam: adoszam,
        szallVezeteknev: document.getElementById('szallUserVezeteknev').value,
        szallKeresztnev: document.getElementById('szallUserKeresztnev').value,
        szallIrSzam: document.getElementById('szallIrSzam').value,
        szallTelepules: document.getElementById('szallTelepules').value,
        szallUtca: document.getElementById('szallUtca').value,
        szallHazSzam: document.getElementById('szallHazszam').value,
        megjegyzes: document.getElementById('megjegyzes').value,
        allapot: "Várakozik"
      }
      let url="http://nodejs.dszcbaross.edu.hu:20018/rendelesPost"
      let fetchOptions={
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: { "Content-type": "application/json; charset=UTF-8",
                   "Access-Control-Allow-Origin" : "*" }
      }
      fetch(url, fetchOptions)
        .then(x=>x.json())
        .then(y=>{
          window.location.replace("./osszegzes.html")
        })
    }
    else (alert("Minden adatot ki kell tölteni!"))
  }