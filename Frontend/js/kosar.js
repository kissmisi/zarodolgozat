function Kosar() {
    let url="http://nodejs.dszcbaross.edu.hu:20018/kosar"

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
        if(y.length!=0) {
            megjelenit(y)
        }
        else {
            let oldal=`
            <h3 class="mt-3 mb-5">Kosár</h3>
            <div classz="col-md-12" style="height: 100%; font-size: 40px; margin: auto;">A kosár tartalma üres<i class="fa-solid fa-face-frown"></i></div>
            `
            document.getElementById('kosar').innerHTML=oldal
            document.getElementById('kosarFooter').className+=" fixed-bottom"
        }
    })

    function megjelenit(adatok) {
        let oldal=`
        <h3 class="mt-3 mb-5">Kosár</h3>
        <div class="row">
            <div class="col-md-6" style="border-right: 1px solid black;">`
        let table1=`<table class="table m-0 p-0">`
        let table1Vege=`
            </table>
            <button class="btn btn-danger mt-2" style="float: right;" onclick="kosarUrit()">Kosár ürítése</button>
        </div>
        <div class="col-md-6" id="osszegzes">
                
            <button class="btn btn-danger mt-3" style="float: right;">Tovább</button>
        </div>
        </div>
        `
        
        for (var sor of adatok) {
            table1+=`
                <tr style="width: 100%">
                    <td style="visibility: hidden;">${sor.id}</td>
                    <td style="width: 50%">${sor.klimaberendezes}</td>
                    <td style="width: 20%; text-align: center;">${sor.ar} Ft</td>
                    <td style="text-align: right;"><input type="number" value="${sor.mennyiseg}" min="1" max="10" onchange="mennyiseg(this)" style="width: 60%; margin-right: 5%;"></td>
                    <td><button class="btn btn-danger" onclick=kosarDelete(this)><i class="fa-solid fa-trash"></i></button></td>
                </tr>`  
        }
        oldal+=table1+table1Vege
        document.getElementById('kosar').innerHTML=oldal

        let url="http://nodejs.dszcbaross.edu.hu:20018/kosar2"

        let bemenet2={
            userId: sessionStorage.getItem('userId')
        }

        let fetchO={
            method: "POST",
            body: JSON.stringify(bemenet2),
            headers: { "Content-type": "application/json; charset=UTF-8",
                       "Access-Control-Allow-Origin" : "*" }
          }

        fetch(url, fetchO)
            .then(x=>x.json())
            .then(y=>kiirat(y))

            
        function kiirat(tomb) {
            let munkadij=parseInt(tomb[0].osszMennyiseg)*90000
            let osszesen=munkadij+parseInt(tomb[0].osszesen)   

            console.log(tomb[0].osszesen)
            console.log(tomb[0].osszMennyiseg)

            var osszegzes=`
            <table class="table">
                <tr>
                    <td>Klímaberendezések: </td>
                    <td id="klimaOsszeg">${parseInt(tomb[0].osszesen)}Ft</td>
                </tr>
                <tr>
                    <td>Mennyiség: </td>
                    <td id="mennyiseg">${parseInt(tomb[0].osszMennyiseg)}db</td>
                </tr>    
                <tr>
                    <td>Munkadíj: </td>
                    <td>${munkadij}Ft</td>
                </tr>
                <tr>
                    <td>Összesen:</td>
                    <td id="osszesen">${osszesen}Ft</td>
                </tr>
            </table>
            <button class="btn btn-danger mt-3" style="float: right;" onclick="tovabb()">Tovább</button>
            `
            document.getElementById('osszegzes').innerHTML=osszegzes
        }
    }
}

function mennyiseg(inpt) {
    let td=inpt.parentElement
    let mennyiseg=td.querySelector('input').value

    let tr=inpt.parentElement.parentElement
    let id=tr.querySelector('td:first-child').innerHTML
    console.log(id)

    let url="http://nodejs.dszcbaross.edu.hu:20018/kosarUpdate2"

    let bemenet={
        klimaId: id,
        mennyiseg: mennyiseg,
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

      let bemenet3={
        userId: sessionStorage.getItem('userId')
      }

      let fetchOp = {
        method: "POST",
        body: JSON.stringify(bemenet3),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      }

      fetch(url, fetchO)
        .then(x => x.json())
        .then(y=>{
            fetch("http://nodejs.dszcbaross.edu.hu:20018/kosar2", fetchOp)
            .then(a=>a.json())
            .then(b=>megjelenit(b))
        })
        
      function megjelenit(adatok) {
        var munkadij=adatok[0].osszMennyiseg*90000
        var osszesen=munkadij+adatok[0].osszesen
        var osszegzes=`
        <table class="table">
            <tr>
                <td>Klímaberendezések: </td>
                <td id="klimaOsszeg">${adatok[0].osszesen}Ft</td>
            </tr>
            <tr>
                <td>Mennyiség: </td>
                <td id="mennyiseg">${adatok[0].osszMennyiseg}db</td>
            </tr>    
            <tr>
                <td>Munkadíj: </td>
                <td>${munkadij}Ft</td>
            </tr>
            <tr>
                <td>Összesen:</td>
                <td id="osszesen">${osszesen}Ft</td>
            </tr>
        </table>
        <button class="btn btn-danger mt-3" style="float: right;" onclick="tovabb()">Tovább</button>
        `
        document.getElementById('osszegzes').innerHTML=osszegzes
      }  
    
}

function kosarUrit() {
    let confirmAction=confirm("Biztos hogy törlöd a kosár tartalmát?")

    let bemenet={
        user: sessionStorage.getItem('user')
    }

    let fetchO = {
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      }

    if(confirmAction) {
        fetch("http://nodejs.dszcbaross.edu.hu:20018/kosarUrit", fetchO)
        .then(x=>x.text())
        .then(y=>{
            console.log(y)
            window.location.reload()
        })
    }
    
}

function kosarDelete(btn) {
    let confirmAction=confirm("Biztos hogy törlöd a kosárból?")

    let tr=btn.parentElement.parentElement
    let id=tr.querySelector('td:first-child').innerHTML

    let url="http://nodejs.dszcbaross.edu.hu:20018/kosarDelete"

    let bemenet={
        id: id,
        user: sessionStorage.getItem('user')
    }

    let fetchO = {
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      }

    if(confirmAction) {
        fetch(url, fetchO)
        .then(x=>x.json())
        .then(y=>{
            alert(y)
            window.location.reload()
        })  
    }
}

function tovabb(){
    window.location.replace("./adatokMegad.html")
}