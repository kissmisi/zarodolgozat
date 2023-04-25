function felhasznalo() {
    let url="http://nodejs.dszcbaross.edu.hu:20018/felhasznalok"

    let bemenet={
        userId: sessionStorage.getItem('userId')
    }

    let fethOptions={
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: { "Content-type": "application/json; charset=UTF-8",
                  "Access-Control-Allow-Origin" : "*" }
    }

    fetch(url, fethOptions)
        .then(x=>x.json())
        .then(y=>megjelenit(y))

    function megjelenit(adatok) {
        let sz=`<div class="col-md-4 m-0 p-0 ml-2 mt-2">`
        for (var sor of adatok) {
            sz+=`
            <label class="form-label">Felhasználónév: </label><input class="form-control" type="text" id="felhUsername" value="${sor.felhasznalo}" disabled>
            <label class="form-label mt-3">Email: </label><input class="form-control" type="text" id="felhEmail" value="${sor.email}" disabled>
            <button class="btn btn-danger mt-3" onclick="felhModosit()" id="felhModosit">Módosítás</button>
            `
        }
        sz+="</div>"
        document.getElementById('userDatas').innerHTML=sz;
    }    
}

function rendelesek(){
    let url="http://nodejs.dszcbaross.edu.hu:20018/rendelesek"

    let bemenet={
        id: sessionStorage.getItem('userId')
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
        })

    function megjelenit(adatok) {
        var oldal=`
        <table>
        `
        for(var sor in adatok) {

        }
    }    

}

function updating() {
            var bemenet={
                user: document.getElementById('felhUsername').value,
                email: document.getElementById('felhEmail').value,
                userId: sessionStorage.getItem('userId')
            }
            fetch("http://nodejs.dszcbaross.edu.hu:20018/felhasznaloUpdate", {
                method: "POST",
                body: JSON.stringify(bemenet),
                headers: { "Content-type": "application/json; charset=UTF-8",
                  "Access-Control-Allow-Origin" : "*" }
            }).then(x=>x.json())
              .then(y=>{
                let bemenet2={
                    userId: sessionStorage.getItem('userId')
                }
                fetch("http://nodejs.dszcbaross.edu.hu:20018/felhasznalok", {
                    method: "POST",
                    body: JSON.stringify(bemenet2),
                    headers: { "Content-type": "application/json; charset=UTF-8",
                            "Access-Control-Allow-Origin" : "*" }
                })
                .then(x=>x.json())
                .then(y=>{
                    console.log(y)
                    sessionStorage.removeItem('user')
                    sessionStorage.removeItem('email')
                    sessionStorage.setItem('email', y[0].email)
                    sessionStorage.setItem('user', y[0].felhasznalo)
                    melyikNev()
                })
              })
}

function felhModosit() {
    if (document.getElementById('felhModosit').innerHTML=="Módosítás") {
        document.getElementById('felhUsername').disabled=false
        document.getElementById('felhEmail').disabled=false
        document.getElementById('felhModosit').innerHTML="Mentés"
    }
    else if(document.getElementById('felhModosit').innerHTML=="Mentés") {

        if (document.getElementById('felhUsername').value!=sessionStorage.getItem('user')) {
            let bemenet ={
                user: document.getElementById('felhUsername').value
            }
            fetch("http://nodejs.dszcbaross.edu.hu:20018/VanEilyenFelhasznalo", {
                method: "POST",
                body: JSON.stringify(bemenet),
                headers: { "Content-type": "application/json; charset=UTF-8",
                            "Access-Control-Allow-Origin" : "*" }
             }).then(x=>x.json())
               .then(y=>{
                    if (y.length!=0) {
                        alert("Már van ilyen felhasználónév")
                    }
                    else {
                        updating()
                        document.getElementById('felhUsername').disabled=true
                        document.getElementById('felhEmail').disabled=true
                        document.getElementById('felhModosit').innerHTML="Módosítás"
                    }
                })
        }
        else if(document.getElementById('felhUsername').value==sessionStorage.getItem('user')) {
            document.getElementById('felhUsername').disabled=true
            document.getElementById('felhEmail').disabled=true
            document.getElementById('felhModosit').innerHTML="Módosítás"
        }


        if(document.getElementById('felhEmail').value!=sessionStorage.getItem('email')) {
            let bemenet={
                email: document.getElementById('felhEmail').value
            }
            fetch("http://nodejs.dszcbaross.edu.hu:20018/VanEilyenEmail", {
                method: "POST",
                body: JSON.stringify(bemenet),
                headers: { "Content-type": "application/json; charset=UTF-8",
                            "Access-Control-Allow-Origin" : "*" }
             }).then(x=>x.json())
               .then(y=>{
                    if (y.length!=0) {
                        alert("Már van ilyen email!")
                    }
                    else {
                        updating()
                        document.getElementById('felhUsername').disabled=true
                        document.getElementById('felhEmail').disabled=true
                        document.getElementById('felhModosit').innerHTML="Módosítás"
                    }
                })
        }
        
    }
}