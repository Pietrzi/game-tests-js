const city = {
    stanDrewna: 50,
    stanKamienia: 50,
    stanZlota: 50,
    stanWiary: 0,
    //uaktualnianieDrewna: false
}

// budynki

const ratusz = {
    poziom: 1
}

const tartak = {
    poziom: 0
}

const kamieniolom = {
    poziom: 0
}

const kopalnia = {
    poziom: 0
}

// zmienne do surowców

const wykazDrewna = document.querySelector('#licznik-drewna');
const wykazKamienia = document.querySelector('#licznik-kamienia');
const wykazZlota = document.querySelector('#licznik-zlota');

wykazDrewna.innerHTML = city.stanDrewna;
wykazKamienia.innerHTML = city.stanKamienia;
wykazZlota.innerHTML = city.stanZlota;

// zmienne do budynków

const poziomRatusza = document.querySelector('#poziom-ratusza');
const poziomTartaku = document.querySelector('#poziom-tartaku');
const poziomKamieniolomu = document.querySelector('#poziom-kamieniolomu');
const poziomKopalni = document.querySelector('#poziom-kopalni');

poziomRatusza.innerHTML = ratusz.poziom;
poziomTartaku.innerHTML = tartak.poziom;
poziomKamieniolomu.innerHTML = kamieniolom.poziom;
poziomKopalni.innerHTML = kopalnia.poziom;

// funkcje

const pokaDrewno = () => wykazDrewna.innerHTML = city.stanDrewna;
const pokaKamien = () => wykazKamienia.innerHTML = city.stanKamienia;
const pokaZloto = () => wykazZlota.innerHTML = city.stanZlota;


const uaktualnijDrewno = () => setInterval(pokaDrewno, 1000);
const uaktualnijKamien = () => setInterval(pokaKamien, 1000);
const uaktualnijZloto = () => setInterval(pokaZloto, 1000);

const produkujDrewno = () => {
    if (tartak.poziom === 0 && city.stanDrewna >= 10 && city.stanKamienia >= 10 && city.stanZlota >= 10) {
    tartak.poziom++;
    poziomTartaku.innerHTML = tartak.poziom;
    city.stanDrewna -= 10;
    city.stanKamienia -= 10;
    city.stanZlota -= 10;
    pokaDrewno();
    pokaKamien();
    pokaZloto();
    setInterval(() => city.stanDrewna += tartak.poziom, 1000);
    uaktualnijDrewno();
    }
}

const produkujKamien = () => {
    if (kamieniolom.poziom === 0 && city.stanDrewna >= 10 && city.stanKamienia >= 10 && city.stanZlota >= 10) {
    kamieniolom.poziom++;
    poziomKamieniolomu.innerHTML = kamieniolom.poziom;
    city.stanDrewna -= 10;
    city.stanKamienia -= 10;
    city.stanZlota -= 10;
    pokaDrewno();
    pokaKamien();
    pokaZloto();
    setInterval(() => city.stanKamienia += kamieniolom.poziom, 1000);
    uaktualnijKamien();
    }
}

const produkujZloto = () => {
    if (kopalnia.poziom === 0 && city.stanDrewna >= 10 && city.stanKamienia >= 10 && city.stanZlota >= 10) {
    kopalnia.poziom++;
    poziomKopalni.innerHTML = kopalnia.poziom;
    city.stanDrewna -= 10;
    city.stanKamienia -= 10;
    city.stanZlota -= 10;
    pokaDrewno();
    pokaKamien();
    pokaZloto();
    setInterval(() => city.stanZlota += kopalnia.poziom, 1000);
    uaktualnijZloto();
    }
}

const rozbudujTartak = () => {
    if (city.stanDrewna >= tartak.poziom * 20) {
        city.stanDrewna -= tartak.poziom * 20;
        tartak.poziom++;
        poziomTartaku.innerHTML = tartak.poziom;
    } else {
        console.log("za mało surki");
    }
    
}

const rozbudujKamieniolom = () => {
    if (city.stanKamienia >= kamieniolom.poziom * 20) {
        city.stanKamienia -= kamieniolom.poziom * 20;
        kamieniolom.poziom++;
        poziomKamieniolomu.innerHTML = kamieniolom.poziom;
    } else {
        console.log("za mało surki");
    }
    
}

const rozbudujKopalnie = () => {
    if (city.stanZlota >= kopalnia.poziom * 20) {
        city.stanZlota -= kopalnia.poziom * 20;
        kopalnia.poziom++;
        poziomKopalni.innerHTML = kopalnia.poziom;
    } else {
        console.log("za mało surki");
    }
    
}

// guziki budynków

const btnZbudujTartak = document.querySelector('#zbudujTartak');
const btnRozbudujTartak = document.querySelector('#rozbudujTartak');
const btnZbudujKamieniolom = document.querySelector('#zbudujKamieniolom');
const btnRozbudujKamieniolom = document.querySelector('#rozbudujKamieniolom');
const btnZbudujKopalnie = document.querySelector('#zbudujKopalnie');
const btnRozbudujKopalnie = document.querySelector('#rozbudujKopalnie');

// nasłuchiwacze;)

btnZbudujTartak.addEventListener('click', produkujDrewno);
btnRozbudujTartak.addEventListener('click', rozbudujTartak);
btnZbudujKamieniolom.addEventListener('click', produkujKamien);
btnRozbudujKamieniolom.addEventListener('click', rozbudujKamieniolom);
btnZbudujKopalnie.addEventListener('click', produkujZloto);
btnRozbudujKopalnie.addEventListener('click', rozbudujKopalnie);
