function adatok(){
  document.getElementById('userEmail').value=sessionStorage.getItem('email')
}

function IrSzam() {

  let url="http://nodejs.dszcbaross.edu.hu:20018/iranyitoszamok"

  console.log(document.getElementById('szamlaIrSzam').value)

  let bemenet={
    irSzam: document.getElementById('szamlaIrSzam').value
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin" : "*" }
  }).then(x=>x.json()).then(y=>{
      document.getElementById("szamlaTelepules").value=y[0].Varos
    })
}

function IrSzam1() {
  let url="http://nodejs.dszcbaross.edu.hu:20018/iranyitoszamok1"

  console.log(document.getElementById('szallIrSzam').value)

  let bemenet={
    irSzam: document.getElementById('szallIrSzam').value
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin" : "*" }
  }).then(x=>x.json()).then(y=>{
      document.getElementById("szallTelepules").value=y[0].Varos
    })
}

function karakterszamlalo(){
  document.getElementById('karakterszam').innerHTML=document.getElementById('megjegyzes').value.length
}

function osszegzes(){
  let url="http://nodejs.dszcbaross.edu.hu:20018/osszegzes"

  let bemenet={
    userId: sessionStorage.getItem('userId')
  }

  let fetchOptions={
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
               "Access-Control-Allow-Origin" : "*" }
  }

  fetch(url, fetchOptions)
    .then(x=>x.json())
    .then(y=>{
      megjelenit(y)
      console.log(y)
    })

  function megjelenit(adatok){
    let megjegyzes=""
    let oldal=`
    <div class="row">
    `

    for(var sor of adatok){
      sessionStorage.setItem("rendelesId", sor.id)
      console.log(sor.Allapot)
      if(sor.Allapot=="Várakozik"){
        if(sor.SzamlAdoszam=="undefined"){
          adoszam=""
        }
        else{
          adoszam=`<p>Adószám: ${sor.SzamlAdoszam}</p>`
        }
        if(sor.Megjegyzes=="undefined"){
          megjegyzes=""
        }
        else{
          megjegyzes=sor.Megjegyzes
        }
        oldal+=`
        <div class="col-md-12 m-0 p-0 mt-2 container row">
            <h1>Megrendelés részletei</h1>
            <div class="col-md-6 mt-4 container">
                <table class="table">
                  <tr>
                    <td>Klímaberendezés: ${sor.klimaberendezes}</td>
                    <td>${sor.db}db</td>
                    <td>${sor.ar}Ft</td>
                  </tr>
                  <tr>
                    <td>Munkadíj: ${sor.munkadij}Ft</td>
                  </tr>
                  <tr>
                    <td>Összesen: ${sor.osszesen}Ft</td>
                  </tr>    
                </table>
            </div>
            <div class="col-md-6 m-0 p-0 mt-4 ml-2 container">
                <h3>Szállítási adatok</h3>
                <p>Név: ${sor.SzallVezeteknev} ${sor.SzallKeresztnev}</p>
                <p>Szállítási cím: ${sor.SzallIrszam}, ${sor.SzallTelepules} ${sor.SzallUtca} ${sor.SzallHazszam}</p>
                <p>Megjegyzés: ${megjegyzes}</p>
            </div>
        </div>
        <div class="col-md-12 m-0 p-0 mt-4 container row">
            <div class="col-md-6 m-0 p-0 mt-2 container">
                <h3>Számlázási adatok</h3>
                <p>Név: ${sor.SzamlVezeteknev} ${sor.SzamlKeresztnev}</p>
                <p>Számlázási cím: ${sor.SzamlIrszam}, ${sor.SzamlTelepules} ${sor.SzamlUtca} ${sor.SzamlHazszam}</p>
                ${adoszam}
            </div>
            <div class="col-md-6 m-0 p-0 mt-2 container">
                <h3>Fizetési lehetőségek</h3>
                <div class="container">
                    <input type="radio" class="form-check-input" name="" id="" checked>
                    <label class="form-check-label" for="radio1">Kézpénzes fizetés a helyszínen</label>
                </div>
                <div class="container">
                    <input type="radio" class="form-check-input" disabled>
                    <label class="form-check-label" for="radio2" aria-disabled="true">Átutalás <sup>[1]</sup></label>
                </div>
                <div class="container">
                    <input type="radio" class="form-check-input" disabled>
                    <label class="form-check-label" for="radio3" aria-disabled="true">Bankártyás <sup>[1]</sup></label>
                </div>
                <div class="container">
                    <input type="radio" class="form-check-input" disabled>
                    <label class="form-check-label" for="radio4" aria-disabled="true">PayPal <sup>[1]</sup></label>
                </div>
            </div>
        </div>
        <div class="col-md-12 mt-4 container">
        <button class="btn btn-danger" onclick="rendelesVeglegesit()">Megrendelés leadása</button>
        </div>
        <div class="col-md-12 mt-4 container">
            <p>[1] - Ez a fizetési lehetőség jelenleg még nem elérhető</p>
        </div>
    </div> 
      `
      }
    }
    document.getElementById("osszegzes").innerHTML=oldal
  }  
}

function rendelesVeglegesit(){
  let url="http://nodejs.dszcbaross.edu.hu:20018/veglegesit"

  let bemenet={
    rendelesId: sessionStorage.getItem("rendelesId"),
    fizetesimod: "Készpénzes fizetés a helyszínen",
    Allapot: "Elküldve"
  }

  let fetchOptions={
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
               "Access-Control-Allow-Origin" : "*" }
  }

  fetch(url, fetchOptions)
    .then(x=>x.json())
    .then(y=>{
      let be={
        id: sessionStorage.getItem('rendelesId')
      }
      sessionStorage.removeItem("rendelesId")
      fetch("http://nodejs.dszcbaross.edu.hu:20018/klimaUpdate", {
        method: "POST",
        body: JSON.stringify(be),
        headers: { "Content-type": "application/json; charset=UTF-8",
               "Access-Control-Allow-Origin" : "*" }
      }).then(x=>x.json())
        .then(y=>{
          let b={
            user: sessionStorage.getItem('user')
          }
          fetch("http://nodejs.dszcbaross.edu.hu:20018/kosarurit", {
            method: "POST",
            body: JSON.stringify(b),
            headers: { "Content-type": "application/json; charset=UTF-8",
                  "Access-Control-Allow-Origin" : "*" }
          }).then(x=>x.text).then(y=>{
            window.location.replace("./rendelesElkuldve.html")
          })
        })
    })

}

/*function adatok() {
    let url = "http://nodejs.dszcbaross.edu.hu:20018/adatokGet"
    fetch(url)
      .then(x => x.json())
      .then(y => megjelenit(y))
  
    function megjelenit(adatok) {
      for (var sor of adatok) {
        if (sor.szamlSzemely == document.getElementById('maganRadio').value) {
          document.getElementById('maganRadio').checked = true;
          radioButton();
        }
        else if (sor.szamlSzemely == document.getElementById('cegRadio').value) {
          document.getElementById('cegRadio').checked = true;
          radioButton();
        }
        document.getElementById('maganRadio').disabled=true;
        document.getElementById('cegRadio').disabled=true;
        document.getElementById('csillag').innerHTML="";
        document.getElementById('userVezeteknev').value = sor.felhVezeteknev;
        document.getElementById('userVezeteknev').disabled=true;
        document.getElementById('userVezDiv').className="col-md-6 m-0 p-0 mt-4";
        document.getElementById('userKeresztnev').value = sor.felhKeresztnev;
        document.getElementById('userKeresztnev').disabled=true;
        document.getElementById('userKeresztDiv').className="col-md-6 m-0 p-0 mt-4";
        document.getElementById('userTel').value = sor.felhTel;
        document.getElementById('userTel').disabled=true;
        document.getElementById('userEmail').value = sor.felhEmail;
        document.getElementById('userEmail').disabled=true;
        document.getElementById('szamlaUserVezeteknev').value = sor.szamlVezeteknev;
        document.getElementById('szamlaUserVezeteknev').disabled=true;
        document.getElementById('szamlaUserKeresztnev').value = sor.szamlKeresztnev;
        document.getElementById('szamlaUserKeresztnev').disabled=true;
        document.getElementById('szamlaIrSzam').value = sor.szamlIrSzam;
        document.getElementById('szamlaIrSzam').disabled=true;
        document.getElementById('szamlaTelepules').value = sor.szamlTelepules;
        document.getElementById('szamlaTelepules').disabled=true;
        document.getElementById('szamlaUtca').value = sor.szamlUtca;
        document.getElementById('szamlaUtca').disabled=true;
        document.getElementById('szamlaHazszam').value = sor.szamlHazSzam;
        document.getElementById('szamlaHazszam').disabled=true;
        if (sor.szamlEmelet != null) {
          document.getElementById('szamlaEmelet').value = sor.szamlEmelet;
          document.getElementById('szamlaEmelet').disabled=true;
        }
        else {
          document.getElementById('szamlaEmelet').disabled=true;
        }
        if (sor.szamlAjto != null) {
          document.getElementById('szamlaAjto').value = sor.szamlAjto;
          document.getElementById('szamlaAjto').disabled=true;
        }
        else {
          document.getElementById('szamlaAjto').disabled=true;
        }
        if (sor.szamlAdoszam != null) {
          document.getElementById('szamlaAdoszam').value = sor.szamlAdoszam;
          document.getElementById('szamlaAdoszam').disabled=true;
        }
        if (
          sor.szamlVezeteknev==sor.szallVezeteknev && sor.szallKeresztnev==sor.szamlKeresztnev && sor.szallIrSzam==sor.szamlIrSzam &&
          sor.szallTelepules==sor.szamlTelepules && sor.szallUtca==sor.szamlUtca && sor.szallHazSzam==sor.szamlHazSzam && sor.szallEmelet==sor.szamlEmelet &&
          sor.szallAjto==sor.szamlAjto
        ) {
          document.getElementById('flexCheckBox').checked=true;
          document.getElementById('flexCheckBox').disabled=true;
        }
        else{
          document.getElementById('flexCheckbox').checked=false;
          document.getElementById('felxCheckBox').disabled=true;
        }
  
        document.getElementById('szallUserVezeteknev').value = sor.szallVezeteknev;
        document.getElementById('szallUserVezeteknev').disabled=true;
        document.getElementById('szallUserKeresztnev').value = sor.szallKeresztnev;
        document.getElementById('szallUserKeresztnev').disabled=true;
        document.getElementById('szallIrSzam').value = sor.szallIrSzam;
        document.getElementById('szallIrSzam').disabled=true;
        document.getElementById('szallTelepules').value = sor.szallTelepules;
        document.getElementById('szallTelepules').disabled=true;
        document.getElementById('szallUtca').value = sor.szallUtca;
        document.getElementById('szallUtca').disabled=true;
        document.getElementById('szallHazszam').value = sor.szallHazSzam;
        document.getElementById('szallHazszam').disabled=true;
        document.getElementById('szallEmelet').value=sor.szallEmelet;
        document.getElementById('szallEmelet').disabled=true;
        document.getElementById('szallAjto').value=sor.szallAjto;
        document.getElementById('szallAjto').disabled=true;
        }
    }
  
    }

    */