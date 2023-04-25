function felhLetezik() {
  if (
    document.getElementById("regUser").value != "" &&
    document.getElementById("regEmail").value != "" &&
    document.getElementById("regPass1").value != "" &&
    document.getElementById("regPass2").value != ""
  ) {
    if (
      document.getElementById("regPass1").value ==
      document.getElementById("regPass2").value
    ) {
      let bemenet = {
        user: document.getElementById("regUser").value,
        email: document.getElementById("regEmail").value,
      };
      let url = "http://nodejs.dszcbaross.edu.hu:20018/felhasznaloLetezike";
      let fetchOptions = {
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };
      fetch(url, fetchOptions)
        .then((x) => x.json())
        .then((y) => {
          if (y != "") {
            alert("Már foglalt felhasználónév vagy email!");
          } else {
            regiszztracio();
          }
        });
    } else alert("A jelszavak nem egyeznek");
  } else alert("Minden mezőt ki kell tölteni!");
}

function regiszztracio() {
  var bemenet = {
    user: document.getElementById("regUser").value,
    email: document.getElementById("regEmail").value,
    password: document.getElementById("regPass1").value,
  };
  //console.log("2");
  let url = "http://nodejs.dszcbaross.edu.hu:20018/regisztracio";
  let fetchO = {
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  };
  //console.log("3");
  fetch(url, fetchO)
    .then((x) => x.text())
    .then((y) => {
      alert(y);
      window.location.href = "bejelentkezes.html";
    });

  //console.log("4");
}

var storedEmail
var storedUser
var storedRole
var storedId

function bejelentkezes() {
  if (
    document.getElementById("logEmail").value != "" &&
    document.getElementById("logPass").value != ""
  ) {
    let bemenet = {
      email: document.getElementById("logEmail").value,
      password: document.getElementById("logPass").value,
    };

    let url = "http://nodejs.dszcbaross.edu.hu:20018/login";
    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(bemenet),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    };

    fetch(url, fetchOptions)
      .then((x) =>{
        return x.json()
      })
      .then(y=> {
        console.log(y)
        if (y.rang === 1) {
          console.log(y)
          sessionStorage.setItem('email', y.email);
          sessionStorage.setItem('user', y.felhasznalo);
          sessionStorage.setItem('role', y.rang);
          sessionStorage.setItem('userId', y.userId)
          window.location.replace('../admin/adminfelulet.html')
        }
        else if(y.rang===0) {
          sessionStorage.setItem('email', y.email);
          sessionStorage.setItem('user', y.felhasznalo);
          sessionStorage.setItem('role', y.rang);
          sessionStorage.setItem('userId', y.userId)
          window.location.replace('../pages/loggedINDEX.html')
        }
        else {
          alert(y.message)
        }
      });
  } else alert("Minden mezőt ki kell tölteni!");
}

window.onload=function() {
  melyikNev()
}

function melyikNev() {
  console.log(sessionStorage)
  let username = sessionStorage.getItem('user');
    if (username) {
        let loggedInUser = document.getElementById('loggedInUser');
        if (loggedInUser) {
            loggedInUser.innerHTML = `${username}`;
        }
    }
};

function logout() {
  let bemenet = {
    felhasznalo: sessionStorage.getItem('email'),
  };
  let fetchOptions = {
    method: "POST",
    body: JSON.stringify(bemenet),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };
  let url = "http://nodejs.dszcbaross.edu.hu:20018/kijelentkezes";
  fetch(url, fetchOptions)
    .then((x) =>{
      x.json();
      sessionStorage.removeItem('email');
      sessionStorage.removeItem("rang");
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userId')
      window.location.replace('../index.html')
    })
}