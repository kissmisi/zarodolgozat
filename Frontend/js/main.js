function klimaberendezesek3() {
  let url = "http://nodejs.dszcbaross.edu.hu:20018/klimaberendezesek";
  fetch(url)
    .then((x) => x.json())
    .then((y) => megjelenit(y));

  document.getElementById('klimaTable').innerHTML = ""
  function megjelenit(adatok) {
    let tablazat = `
      <table class="table container-fluid">
        <thead>
          <tr>
            <th></th>
            <th>Klímaberendezés neve</th>
            <th>Teljesítmény</th>
            <th>Ár</th>
            <th>Készlet</th>
            <th></th>
          </tr>
        <tbody>  
        `;
    let tablazatVege = `
        </tbody>
      </table>  
      `

    let keszleten="készleten"
    let kosarba=`
    <button class="btn btn-success" onclick="kosarba(this)"><i class="fa-solid fa-cart-shopping"></i> Kosárba</button>
    `
    for (var sor of adatok) {
      if(sor.Keszlet!=0) {
        keszleten=`<i class="fa-solid fa-check"></i>`
        kosarba=`
        <button class="btn btn-outline-success" onclick="kosarba(this)"><i class="fa-solid fa-cart-shopping"></i> Kosárba</button>
        `
      }
      else if(sor.Keszlet==0) {
        keszleten=`<i class="fa-solid fa-x"></i>`
        kosarba=`
        Nincs raktáron
        `
      }
      tablazat += `
          <tr>
            <td style="visibility: hidden;">${sor.id}</td>
            <td>${sor.Klimaberendezes}<button class="btn" onclick=klimaOldal(this)><i class="fa-solid fa-arrow-up-right-from-square"></i></button></td>
            <td>${sor.teljesitmeny}</td>
            <td>${sor.Ar}Ft</td>
            <td style="text-align: center;">${keszleten}</td>
            <td>${kosarba}</td>
          </tr>
          `;
    }
    document.getElementById("klimaTable").innerHTML += tablazat + tablazatVege;
  }
}

function kosarba(btn) {

  let tr = btn.parentElement.parentElement;
  let id = tr.querySelector("td:first-child").innerHTML;

  let bemenet={
    userId: sessionStorage.getItem('userId')
  }

  let fetchO = {
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*"
    }
  }

  fetch("http://nodejs.dszcbaross.edu.hu:20018/kosar", fetchO)
    .then(x => x.json())
    .then(y => vizsgal(y))

    function vizsgal(adatok) {
      console.log(adatok);
      if (adatok.length != 0) {
        for (var sor of adatok) {
          console.log(sor.klimaberendezes_id, id);
          if (sor.klimaberendezes_id == id) {
            let bemenet2 = {
              klimaId: id,
              mennyiseg: parseInt(sor.mennyiseg) + 1,
              userId: sessionStorage.getItem("userId"),
            };
            let fetchOp = {
              method: "POST",
              body: JSON.stringify(bemenet2),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
              },
            };
    
            fetch("http://nodejs.dszcbaross.edu.hu:20018/kosarUpdate", fetchOp)
              .then((x) => x.json())
              .then((y) => alert(y));
            return; // exit the function after updating the quantity
          }
        }
      }
    
      // if the product is not already in the cart, add a new item
      let url = "http://nodejs.dszcbaross.edu.hu:20018/kosarba";
    
      let bemenet3 = {
        klimaId: id,
        userId: sessionStorage.getItem("userId"),
      };
    
      let fetchOpt = {
        method: "POST",
        body: JSON.stringify(bemenet3),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      };
    
      fetch(url, fetchOpt)
        .then((x) => x.json())
        .then((y) => alert(y));
    }
    
}

function klimaberendezesek() {
  let url = "http://nodejs.dszcbaross.edu.hu:20018/klimaberendezesek";
  fetch(url)
    .then((x) => x.json())
    .then((y) => megjelenit(y));

  function megjelenit(adatok) {
    let tablazat = `
        <thead>
          <tr>
            <th>Klímaberendezés neve</th>
            <th>Teljesítmény</th>
            <th>Ár</th>
            <th>Készlet</th>
          </tr>
        <tbody>  
        `;
    let tablazatVege = `
        </tbody> 
      `

    let keszlet="Készleten"  
    for (var sor of adatok) {
      if(sor.Keszlet>0){
        keszlet="Készleten"
      }
      else if(sor.Keszlet==0){
        keszlet="Nincs készleten"
      }

      tablazat += `
          <tr>
            <td>${sor.Klimaberendezes}</td>
            <td>${sor.teljesitmeny}</td>
            <td>${sor.Ar}Ft</td>
            <td>${keszlet}</td>
          </tr>
          `;
    }
    document.getElementById("klimaberendezesek").innerHTML += tablazat + tablazatVege;
  }
}

function currentYear() {
  let year = new Date().getFullYear();
  document.getElementById('year').innerHTML = `
  © 2022-${year} Copyright by: Kiss Mihály
  `
}
function klimaOldal(btn) {
  let tr = btn.parentElement.parentElement;
  let id = tr.querySelector("td:first-child").innerHTML;

  let url = "http://nodejs.dszcbaross.edu.hu:20018/klimaberendezesek_2"

  let bemenet = {
    id: id,
  }

  let fetchOptions = {
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "Access-Control-Allow-Origin": "*"
    }
  }

  fetch(url, fetchOptions)
    .then(x => x.json())
    .then(y => megjelenit(y))


  function megjelenit(adatok) {

    let oldal = ""

    for (var sor of adatok) {
      oldal += `
        <div class="row container">
          <button class="btn btn-danger col-md-1 mt-2" onclick="klimaberendezesek3()">Vissza</button>
          <h3 class="m-0 p-0 mt-3 mb-3">${sor.Klimaberendezes}</h3>
          <div class="m-0 p-0 mt-3 col-md-6">
            <img src="http://nodejs.dszcbaross.edu.hu:20018/${sor.kep}" alt="${sor.kep}"
            title="${sor.kep}" style="width: 75%;">
          </div>
          <div class="m-0 p-0 mt-3 col-md-3">
            <h5>Tulajdonságok:</h1>
              <ul>
                <li>${sor.teljesitmeny}</li>
                <li>Hűtés/Fűtés</li>
              </ul>
          </div>
          <div class="m-0 p-0 mt-3 col-md-3">
            <p class="m-0 p-0 mt-5" style="font-weight: bolder; text-align: right;">Ár: ${sor.Ar}Ft</p>
            <p style="text-align: right;"><span style="font-weight: bolder;">Elérhetőség:</span> Raktáron ${sor.Keszlet}db</p>
          </div>
          <div class="m-0 p-0 mt-5 col-md-12">
            <p>${sor.Leiras}</p>
          </div>
        </div>  
        `
    }
    document.getElementById('klimaTable').innerHTML = oldal
  }
}