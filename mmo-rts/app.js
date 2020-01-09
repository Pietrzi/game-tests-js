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
