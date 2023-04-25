function hozzaad() {
    window.location.href="klimaberendezesekform.html";
}

function klimaPost() {
  
    if (document.getElementById('klimaberendezes').value!="" && document.getElementById('teljesitmeny').value!="" && document.getElementById('klimaAr').value!="" && document.getElementById('keszlet').value!="") {
        let url="http://nodejs.dszcbaross.edu.hu:20018/klimaPost"
        let kepNev=document.getElementById('klimaFiles').value.split("\\")
        console.log(kepNev[2])
        let bemenet={
            klimaberendezes: document.getElementById('klimaberendezes').value,
            teljesitmeny: document.getElementById('teljesitmeny').value,
            klimaAr: document.getElementById('klimaAr').value,
            keszlet: document.getElementById('keszlet').value,
            leiras: document.getElementById('klimaLeiras').value,
            kep: kepNev[2]
        }
        let fetchOptions={
            method: "POST",
            body: JSON.stringify(bemenet),
            headers: { "Content-type": "application/json; charset=UTF-8",
                        "Access-Control-Allow-Origin" : "*" }
        }

        fetch(url, fetchOptions)
            .then(x=>x.text())
            .then(y=>{
                alert(y)
                document.getElementById('klimaberendezes').value=""
                document.getElementById('teljesitmeny').value=""
                document.getElementById('klimaAr').value=""
                document.getElementById('keszlet').value=""
                document.getElementById('klimaLeiras').value=""
                document.getElementById('klimaFiles').value=""
            })
    }
    else {
        alert("Minden mezőt ki kell tölteni")
    }
}

function klimaberendezesek2() {
    let url = "http://nodejs.dszcbaross.edu.hu:20018/klimaberendezesek3";
    fetch(url)
      .then((x) => x.json())
      .then((y) => megjelenit(y));
  
    function megjelenit(adatok) {
      let tablazat = `
        <thead>
          <tr>
            <th></th>
            <th>Klímaberendezés neve</th>
            <th>Teljesítmény</th>
            <th>Ár</th>
            <th>Készlet</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>  
        `;
      let tablazatVege=`</tbody>`
      for (var sor of adatok) {
        tablazat += `
          <tr>
            <td style="visibility: hidden;">${sor.id}.</td>
            <td>${sor.Klimaberendezes}</td>
            <td>${sor.teljesitmeny}</td>
            <td>${sor.Ar}Ft</td>
            <td>${sor.Keszlet}db</td>
            <td><button class="btn btn-warning" onclick="klimaEdit(this)" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-danger" onclick="klimaDelete(this)"><i class="fa-solid fa-trash"></i></button>
            </td>    
          </tr>
          `;
      }
      document.getElementById("klimaberendezesek").innerHTML += tablazat + tablazatVege;
    }
}

function klimaEdit(btn) {
  let tr=btn.parentElement.parentElement
  let id=tr.querySelector("td:first-child").innerHTML

  let bemenet={
    id: id
  }
  
  fetch("http://nodejs.dszcbaross.edu.hu:20018/klimaberendezesek_2",{
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin" : "*" }
  }).then(x=>x.json()).then(y=>{
    megjelenit(y)
  })

  function megjelenit(adatok) {
    for(var sor of adatok){
      document.getElementById('klimaId').innerHTML=sor.id
      document.getElementById('modalKlima').value=sor.Klimaberendezes
      document.getElementById('modalTeljesitmeny').value=sor.teljesitmeny
      document.getElementById('modalAr').value=sor.Ar
      document.getElementById('modalKeszlet').value=sor.Keszlet
    }
  }
  
}

function klimaModosit(){
  let url="http://nodejs.dszcbaross.edu.hu:20018/klimaEdit"

  let bemenet={
    id: document.getElementById('klimaId').innerHTML,
    klima: document.getElementById('modalKlima').value,
    teljesitmeny: document.getElementById('modalTeljesitmeny').value,
    ar: document.getElementById('modalAr').value,
    keszlet: document.getElementById('modalKeszlet').value
  }

  let fetchOptions={
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin" : "*" }
  }

  fetch(url, fetchOptions)
    .then(x=>x.text())
    .then(y=>{
      alert(y)
      window.location.reload()
    })
}

function felhasznalok() {
    let url = "http://nodejs.dszcbaross.edu.hu:20018/felhasznalokGet";
    fetch(url)
      .then((x) => x.json())
      .then((y) => megjelenit(y));
  
    function megjelenit(adatok) {
      
      let rang
      let tablazat = `
        <thead>
          <tr>
            <th></th>
            <th>Felhasznalo</th>
            <th>Email</th>
            <th>Rang</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>  
        `;
      let tablazatVege=`</tbody>`
      for (var sor of adatok) {
        

        if (sor.rang==1) {
          rang="admin"
        }
        else if (sor.rang==0) {
          rang="felhasználó"
        }
        tablazat += `
          <tr>
            <td style="visibility: hidden;">${sor.id}</td>
            <td>${sor.felhasznalo}</td>
            <td>${sor.email}</td>
            <td>${rang}</td>
            <td><button onclick="userEdit(this)" class="btn btn-warning"  data-bs-toggle="modal" data-bs-target="#editModal2"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-danger" onclick=userDelete(this)><i class="fa-solid fa-trash"></i></button>
            </td>    
          </tr>
          `;
      }
      
      document.getElementById("felhasznalok").innerHTML += tablazat + tablazatVege;
    }
}


function userDelete(btn) {
  let confirmAction=confirm("Biztos hogy törlöd a felhasználót?")

  if (confirmAction) {
    let tr=btn.parentElement.parentElement;
    let id=tr.querySelector("td:first-child").innerHTML;

    let url="http://nodejs.dszcbaross.edu.hu:20018/felhasznalokDelete"
  
    let bemenet={
      id: id,
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
      alert(y)
      window.location.reload();
    })
  }
  else alert("Művelet megszakítva!")
}

function klimaDelete(btn) {
  let tr=btn.parentElement.parentElement
  let id=tr.querySelector("td:first-child").innerHTML

  
  let confirmAction=confirm("Biztos hogy törlöd a klímaberendezést?")

  if (confirmAction) {
    let url="http://nodejs.dszcbaross.edu.hu:20018/klimaDelete"
    let bemenet={
      id: id,
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
      alert(y)
      window.location.reload()
    })
  }
  else alert("Művelet megszakítva!")
}

function fileSend() {
  const form = document.getElementById('klimaForm')
  const myFiles = document.getElementById('klimaFiles').files

  if (myFiles.length > 0) {
    const sendFiles = async () => {
      const formData = new FormData()
      Object.keys(myFiles).forEach(key => {
        formData.append(myFiles.item(key).name, myFiles.item(key))
      })

      const response = await fetch('http://nodejs.dszcbaross.edu.hu:20018/uploadFile', {
        method: 'POST',
        body: formData
      })
      const json = await response.json()
      console.log(json)

      // Reset the file input
      document.getElementById('myFiles').value = ''
    }

    sendFiles()
  }
}

function rendelesek(){
  let url="http://nodejs.dszcbaross.edu.hu:20018/rendelesek"

  fetch(url)
    .then(x=>x.json())
    .then(y=>megjelenit(y))

    function megjelenit(adatok){
      let sz=`
      <div class="container-fluid">
        <table class="table container-fluid">
          <thead>
            <tr>
              <th></th>
              <th>Klímaberendezés</th>
              <th>Mennyiség</th>
              <th>Fizetendő</th>
              <th>Fizetési mód</th>
              <th>Kapcsolattartási adatok</th>
              <th>Számlázási adatok</th>
              <th>Szállítási adatok</th>
              <th>Megjegyzés</th>
              <th>Állapot</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>    
      `
      let adoszam="";
      let megjegyzes=""
      let gombok=""
      for(var sor of adatok){
        if(sor.Allapot=="Elküldve"){
          gombok=`
          <button class="btn btn-success" onclick=rendelesElfogad(this)><i class="fa-solid fa-check"></i></button>
          <button class="btn btn-danger" onclick=rendelesDelete(this)><i class="fa-solid fa-x"></i></button>
          `
        }
        else if(sor.Allapot=="Elfogadva"){
          gombok=`
          <button class="btn btn-danger" onclick=rendelesDelete(this)><i class="fa-solid fa-x"></i></button>
          `
        }


        if(sor.SzamlAdoszam=="undefined"){
          adoszam=""
        }
        else{
          adoszam=sor.SzamlAdoszam
        }

        if(sor.Megjegyzes=="undefined"){
          megjegyzes=""
        }
        else{
          megjegyzes=sor.Megjegyzes
        }

        sz+=`
        <tr>
          <td style="visibility: hidden;">${sor.id}</td>
          <td>${sor.klimaberendezes}</td>
          <td>${sor.db}db</td>
          <td>${sor.osszesen}Ft</td>
          <td>${sor.fizetesi_mod}</td>
          <td>${sor.Vezeteknev} ${sor.Keresztnev}<br>
              ${sor.Email}<br>
              ${sor.Tel}</td>
          <td>${sor.SzamlVezeteknev} ${sor.SzamlKeresztnev}<br>
              ${sor.SzamlIrszam} ${sor.SzamlTelepules},<br>
              ${sor.SzamlUtca} ${sor.SzamlHazszam}<br>
              Adószám: ${adoszam}</td>
          <td>${sor.SzallVezeteknev} ${sor.SzallKeresztnev}<br>
              ${sor.SzallIrszam} ${sor.SzallTelepules},<br>
              ${sor.SzallUtca} ${sor.SzallHazszam}</td>
          <td>${megjegyzes}</td>
          <td>${sor.Allapot}</td>
          <td>
            <div>
              ${gombok}
            </div>
          
          </td>    
        `
      }
      sz+=`
      </tbody>
      </table>
      </div>
      `
      document.getElementById('adminRendelesek').innerHTML=sz;
    }
}

function rendelesElfogad(btn){
  let tr=btn.parentElement.parentElement.parentElement;
  let id=tr.querySelector("td:first-child").innerHTML

  let url="http://nodejs.dszcbaross.edu.hu:20018/rendelesElfogad"

  let bemenet={
    rendelesId: id,
    Allapot: "Elfogadva"
  }

  let fetchOptions={
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
                  "Access-Control-Allow-Origin" : "*" }
  }

  fetch(url, fetchOptions)
    .then(x=>x.text())
    .then(y=>{
      alert(y)
      rendelesek()
    })
}

function rendelesDelete(btn){
  let tr=btn.parentElement.parentElement.parentElement;
  let id=tr.querySelector("td:first-child").innerHTML

  let confirmAction=confirm("Biztos hogy törlöd a rendelést?")

  if(confirmAction){
    let url="http://nodejs.dszcbaross.edu.hu:20018/rendelesDelete"

    let bemenet={
      rendelesId: id
    }

    let fetchOptions={
      method: "POST",
      body: JSON.stringify(bemenet),
      headers: { "Content-type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin" : "*" }
    }

    fetch(url, fetchOptions)
      .then(x=>x.text())
      .then(y=>{
        alert(y)
        rendelesek()
      })
  }
  else{
    alert("Művelet megszakítva?")
  }
  
  
}

function userEdit(btn){
  let tr=btn.parentElement.parentElement;
  let id=tr.querySelector("td:first-child").innerHTML
  
  let bemenet={
    id: id
  }

  fetch("http://nodejs.dszcbaross.edu.hu:20018/felhasznaloEdit", {
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin" : "*" }
  }).then(x=>x.json())
    .then(y=>megjelenit(y))

  function megjelenit(adatok){
    for(var sor of adatok) {
      document.getElementById('modalUser').value=sor.felhasznalo
      document.getElementById('modalEmail').value=sor.email
      document.getElementById('modalRang').value=sor.rang
      document.getElementById('userId').innerHTML=sor.id
    }
  }  
}

function userModosit() {
  let url="http://nodejs.dszcbaross.edu.hu:20018/userEdit"

  let bemenet={
    id: document.getElementById('userId').innerHTML,
    userName: document.getElementById('modalUser').value,
    email: document.getElementById('modalEmail').value,
    rang: document.getElementById('modalRang').value
  }

  let fetchOptions={
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin" : "*" }    
  }

  fetch(url, fetchOptions)
    .then(x=>x.text())
    .then(y=>{
      alert(y)
      window.location.reload()
    })
}