const express = require('express')
const app = express()
const port = 20018
var cors = require('cors')
var mysql = require('mysql');
const fileUpload = require("express-fileupload");
const path = require("path");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const saltRounds = 10;
const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

var con
function dbconn() {
    	con = mysql.createConnection({
        host: "192.168.0.200",
        user: "u39_pUQr4wXGDX",
        password: "W93uGuNFhVXR3IC1OVf!ZSm+",
        database: "s39_db"
    });
    con.connect();
}

var uploadedPicture

app.use(cors())
app.use(express.json())
app.use(express.static('files'))
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/felhasznaloLetezike', (req, res) => {
	dbconn()
    con.query(`SELECT felhasznalo, email FROM felhasznalok WHERE felhasznalo='${req.body.user}' OR email='${req.body.email}'; `, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/regisztracio', (req, res) => {
    password = req.body.password;
    user = req.body.user;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            // returns hash
            //console.log(hash);

            dbconn()
            con.query(`INSERT INTO felhasznalok (id, felhasznalo, email, jelszo, rang) VALUES (NULL ,'${req.body.user}','${req.body.email}','${hash}','0')`,
                function (err, rows, fields) {
                    if (err) throw err
                    //console.log(`Regisztráció check: ${rows}`);
                    res.send("Sikeres regisztráció! Kérjük jelenkezzen be a megadott adataival!");
                });
            con.end();
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
	dbconn()
    con.query('SELECT * FROM felhasznalok WHERE email = ?', [email], (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            return res.status(400).json({ message: 'Az email vagy jelszó hibás!' });
        }

        const user = results[0];
        console.log(results[0])
		
        bcrypt.compare(password, user.jelszo, (error, result) => {
            if (error) throw error;

            if (!result) {
                return res.status(400).json({ message: 'Az email vagy jelszó hibás!' });
            }

            req.session.email = email;
            req.session.user=user.felhasznalo;
            req.session.role = user.rang;
            req.session.userId=user.id

            res.json({ email: req.session.email, felhasznalo: req.session.user, rang: req.session.role, userId: req.session.userId});
            console.log({ email: req.session.email, felhasznalo: req.session.user, rang: req.session.role });
        });
    });
    con.end()
});

app.post('/kijelentkezes', (req, res) => {
    if (!req.session.user) {
        return res.status(400).json({ message: 'Nincs bejelentkezett felhasználó' });
    }

    req.session.destroy(() => {
        res.json({ message: 'Sikeres kijelentkezés!' });
    });
});

app.get('/klimaberendezesek3', (req, res) => {
    dbconn()
    con.query("SELECT * FROM klimaberendezesek", function (err, result, fields) {
    	if (err) throw err;
        res.send(result);
    });
	con.end();
});

app.get('/klimaberendezesek', (req, res) => {
    dbconn()
    con.query("SELECT * FROM klimaberendezesek WHERE Keszlet>0 ORDER BY Klimaberendezes ", function (err, result, fields) {
    	if (err) throw err;
        res.send(result);
    });
	con.end();
});

app.post('/rendelesPost', (req, res) => {
	dbconn()
    con.query(`INSERT INTO rendelesek VALUES(NULL, '${req.body.felhId}', (SELECT klimaberendezes FROM kosar WHERE userID='${req.body.felhId}'), (SELECT mennyiseg FROM kosar WHERE userID='${req.body.felhId}'), (SELECT SUM(ar*mennyiseg) FROM kosar WHERE userID='${req.body.felhId}'), (SELECT SUM(mennyiseg*90000) FROM kosar WHERE userID=${req.body.felhId}), (SELECT SUM((mennyiseg*ar)+(mennyiseg*90000)) FROM kosar WHERE userID=${req.body.felhId}), NULL, '${req.body.felhVezeteknev}', '${req.body.felhKeresztnev}', '${req.body.email}', '${req.body.tel}', '${req.body.Szemely}', '${req.body.szamlaVezeteknev}', '${req.body.szamlaKeresztnev}', '${req.body.szamlaIrSzam}', '${req.body.szamlaTelepules}', '${req.body.szamlaUtca}', '${req.body.szamlaHazSzam}', '${req.body.szamlaAdoSzam}', '${req.body.szallVezeteknev}', '${req.body.szallKeresztnev}', '${req.body.szallIrSzam}', '${req.body.szallTelepules}', '${req.body.szallUtca}', '${req.body.szallHazSzam}', '${req.body.megjegyzes}', '${req.body.allapot}')`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/veglegesit', (req, res) => {
	dbconn()
    con.query(`UPDATE rendelesek SET fizetesi_mod='${req.body.fizetesimod}', Allapot='${req.body.Allapot}' WHERE id='${req.body.rendelesId}'`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/osszegzes', (req, res) => {
	dbconn()
    con.query(`SELECT * FROM rendelesek WHERE felh_id='${req.body.userId}'`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.get('/rendelesek', (req, res) => {
	dbconn()
    con.query(`SELECT * FROM rendelesek WHERE Allapot LIKE "Elküldve" OR Allapot LIKE "Elfogadva"`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/userRendelesek', (req, res) => {
	dbconn()
    con.query(`SELECT * FROM rendelesek WHERE Allapot LIKE "Elküldve" OR Allapot LIKE "Elfogadva" AND felh_id='${req.body.id}'`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/rendelesElfogad', (req, res) => {
	dbconn()
    con.query(`UPDATE rendelesek SET Allapot="${req.body.Allapot}" WHERE id='${req.body.rendelesId}'`, function (err, rows) {
        if (err) throw err
        res.send("Rendelés elfogadva!");
    });
    con.end();
});

app.post('/rendelesDelete', (req, res) => {
	dbconn()
    con.query(`DELETE FROM rendelesek WHERE rendelesek.id='${req.body.rendelesId}'`, function (err, rows) {
        if (err) throw err
        res.send("Rendelés törölve!");
    });
    con.end();
});

app.post('/uploadFile',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files);

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
                console.log(files[key].name)
            })
        })
        res.header("Access-Control-Allow-Origin", "*")
    	return res.status(200).json({message: "Sikeres feltöltés"})
    }
)

app.post('/klimaPost', (req, res) => {
    console.log("2.képnev: " + uploadedPicture)
    dbconn()
    con.query(`INSERT INTO klimaberendezesek VALUES (NULL, '${req.body.klimaberendezes}', '${req.body.teljesitmeny}', '${req.body.klimaAr}', ${req.body.keszlet}, '${req.body.leiras}', '${req.body.kep}'); `, function (err, rows) {
        if (err) throw err
        res.json("Sikeres feltöltés");
    });
    con.end();
});

app.get('/felhasznalokGet', (req, res) => {
    dbconn()
    con.query("SELECT * FROM felhasznalok", function (err, result, fields) {
    	if (err) throw err;
        res.send(result);
    });
	con.end();
});

app.post('/felhasznaloEdit', (req, res) => {
    dbconn()
    con.query(`SELECT * FROM felhasznalok WHERE id='${req.body.id}'`, function (err, rows) {
    	if (err) throw err;
        res.send(rows);
    });
	con.end();
});

app.post('/userEdit', (req, res) => {
    dbconn()
    con.query(`UPDATE felhasznalok SET felhasznalo='${req.body.userName}', email='${req.body.email}', rang='${req.body.rang}' WHERE id='${req.body.id}'`, function (err, rows) {
    	if (err) throw err;
        res.send("Módosítás megtörtént!");
    });
	con.end();
});

app.post('/felhasznalokDelete', (req, res) => {
    dbconn()
    con.query(`DELETE FROM felhasznalok WHERE felhasznalok.id=${req.body.id}`, function (err, rows) {
        if (err) throw err
        res.json("Felhasználó törölve!");
    });
    con.end();
});

app.post('/klimaDelete', (req, res) => {
    dbconn()
    con.query(`DELETE FROM klimaberendezesek WHERE klimaberendezesek.id=${req.body.id}`, function (err, rows) {
        if (err) throw err
        res.json("Klímaberendezés törölve!");
    });
    con.end();
});

app.post('/klimaberendezesek_2', (req, res) => {
    dbconn()
    con.query(`SELECT * FROM klimaberendezesek WHERE klimaberendezesek.id=${req.body.id}`, function (err, rows) {
        if (err) throw err
        res.json(rows);
    });
    con.end();
});

app.post('/klimaUpdate', (req, res) => {
    dbconn()
    con.query(`UPDATE klimaberendezesek SET Keszlet=Keszlet-(SELECT db FROM rendelesek WHERE id=${req.body.id}) WHERE Klimaberendezes=(SELECT Klimaberendezes FROM rendelesek WHERE id='${req.body.id}')`, function (err, rows) {
        if (err) throw err
        res.json(rows);
    });
    con.end();
});

app.post('/klimaEdit', (req, res) => {
    dbconn()
    con.query(`UPDATE klimaberendezesek SET Klimaberendezes='${req.body.klima}', teljesitmeny='${req.body.teljesitmeny}', Ar='${req.body.ar}', Keszlet='${req.body.keszlet}' WHERE id='${req.body.id}'`, function (err, rows) {
        if (err) throw err
        res.json("Módosítás megtörtént!");
    });
    con.end();
});

app.post('/kosarba', (req, res) => {
    dbconn()
    con.query(`INSERT INTO kosar VALUES (NULL, ${req.body.klimaId}, (SELECT id FROM felhasznalok WHERE id=${req.body.userId}), (SELECT Klimaberendezes FROM klimaberendezesek WHERE id=${req.body.klimaId}), (SELECT Ar FROM klimaberendezesek WHERE id=${req.body.klimaId}), 1)`, function (err, rows) {
        if (err) throw err
        res.json("A termék belekerült a kosaradba!");
    });
    con.end();
});

app.post('/kosar', (req, res) => {
    dbconn()
    con.query("SELECT * FROM kosar WHERE kosar.userID = (SELECT id FROM felhasznalok WHERE id = ?)", [req.body.userId], function (err, result, fields) {
    	if (err) throw err;
        res.send(result);
    });
	con.end();
});
app.post('/kosar2', (req, res) => {
    dbconn()
    con.query("SELECT SUM(ar*mennyiseg) AS osszesen, SUM(mennyiseg) AS osszMennyiseg FROM kosar WHERE kosar.userID = (SELECT id FROM felhasznalok WHERE id = ?)", [req.body.userId], function (err, result, fields) {
    	if (err) throw err;
        res.send(result);
    });
	con.end();
});

app.post('/kosarUpdate', (req, res) => {
    dbconn()
    con.query(`UPDATE kosar SET mennyiseg=${req.body.mennyiseg} WHERE klimaberendezes_id=${req.body.klimaId} AND userID=(SELECT id FROM felhasznalok WHERE id='${req.body.userId}')`, function (err, rows) {
        if (err) throw err
        res.json("A termék belekerült a kosaradba!");
    });
    con.end();
});

app.post('/kosarUpdate2', (req, res) => {
    dbconn()
    con.query(`UPDATE kosar SET mennyiseg=${req.body.mennyiseg} WHERE id=${req.body.klimaId} AND userID=(SELECT id FROM felhasznalok WHERE id='${req.body.userId}')`, function (err, rows) {
        if (err) throw err
        res.json(rows);
    });
    con.end();
});

app.post('/kosarUrit', (req, res) => {
    dbconn()
    con.query("DELETE FROM kosar WHERE userID=(SELECT id FROM felhasznalok WHERE felhasznalo=?)", [req.body.user], function (err, result, fields) {
    	if (err) throw err;
        res.send("Kosár tartalma törölve!");
    });
	con.end();
});

app.post('/kosarDelete', (req, res) => {
    dbconn()
    con.query(`DELETE FROM kosar WHERE kosar.id=${req.body.id} AND userID=(SELECT id FROM felhasznalok WHERE felhasznalo='${req.body.user}')`, function (err, rows) {
        if (err) throw err
        res.json("Törölve!");
    });
    con.end();
});

app.post('/felhasznalok', (req, res) => {
    dbconn()
    con.query(`SELECT * FROM felhasznalok WHERE id='${req.body.userId}'`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/felhasznaloUpdate', (req, res) => {
    dbconn()
    con.query(`UPDATE felhasznalok SET felhasznalo='${req.body.user}', email='${req.body.email}' WHERE felhasznalok.id='${req.body.userId}'`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/VanEilyenFelhasznalo', (req, res) => {
	dbconn()
    con.query(`SELECT felhasznalo FROM felhasznalok WHERE felhasznalo='${req.body.user}'; `, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/VanEilyenEmail', (req, res) => {
	dbconn()
    con.query(`SELECT email FROM felhasznalok WHERE email='${req.body.email}'; `, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/iranyitoszamok', (req, res) => {
	dbconn()
    con.query(`SELECT * FROM iranyitoszamok WHERE IrSzam LIKE '${req.body.irSzam}%'`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.post('/iranyitoszamok1', (req, res) => {
	dbconn()
    con.query(`SELECT * FROM iranyitoszamok WHERE IrSzam LIKE '${req.body.irSzam}%'`, function (err, rows) {
        if (err) throw err
        res.send(rows);
    });
    con.end();
});

app.listen(port, () => {
    console.log(`Example app listening on port http://nodejs.dszcbaross.edu.hu:20018`);
});