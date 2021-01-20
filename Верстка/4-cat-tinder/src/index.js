'use strict';

let index = 0;
let pause = 500;

function swipe(ind) {
  let src = '';
  if (ind === 0) {
    src = 'img1';
  } else if (ind === 1) {
    src = 'img7';
  } else if (ind === 2) {
    src = 'img9';
  } else if (ind === 3) {
    src = 'img3';
  } else if (ind === 4) {
    src = 'img2';
  } else if (ind === 5) {
    src = 'img4';
  } else if (ind === 6) {
    src = 'img5';
  } else if (ind === 7) {
    src = 'img6';
  } else if (ind === 8) {
    src = 'img8';
  } else if (ind === 9) {
    src = 'img10';
  }
  let startPoint = {};
  let nowPoint;
  let ldelay;
  let image = document.getElementById(src);
  image.addEventListener('touchstart', function(event) {
    event.preventDefault();
    event.stopPropagation();
    startPoint.x = event.changedTouches[0].pageX;
    startPoint.y = event.changedTouches[0].pageY;
    ldelay = new Date();
  }, false);
  //Long swipe
  image.addEventListener('touchmove', function(event) {
    event.preventDefault();
    event.stopPropagation();
    let otk = {};
    nowPoint = event.changedTouches[0];
    otk.x = nowPoint.pageX - startPoint.x;
    if (Math.abs(otk.x) > 200) {
      if (otk.x < 0) {
        nextCat('bad');
      }
      if (otk.x > 0) {
        nextCat('good');
      }
      startPoint = { x: nowPoint.pageX, y: nowPoint.pageY };
    }
  }, false);
  //Short swipe
  image.addEventListener('touchend', function(event) {
    let pdelay = new Date();
    nowPoint = event.changedTouches[0];
    let xAbs = Math.abs(startPoint.x - nowPoint.pageX);
    let yAbs = Math.abs(startPoint.y - nowPoint.pageY);
    if ((xAbs > 20 || yAbs > 20) && (pdelay.getTime() - ldelay.getTime()) < 200) {
      if (xAbs > yAbs) {
        if (nowPoint.pageX < startPoint.x) {
          nextCat('bad');
        } else {
          nextCat('good');
        }
      } else {
        nextCat('love');
      }
    }
  }, false);
}

function showMeme(type) {
  if (index === 0) {
    document.getElementById('img1').src = type;
  } else if (index === 1) {
    document.getElementById('img7').src = type;
  } else if (index === 2) {
    document.getElementById('img9').src = type;
  } else if (index === 3) {
    document.getElementById('img3').src = type;
  } else if (index === 4) {
    document.getElementById('img2').src = type;
  } else if (index === 5) {
    document.getElementById('img4').src = type;
  } else if (index === 6) {
    document.getElementById('img5').src = type;
  } else if (index === 7) {
    document.getElementById('img6').src = type;
  } else if (index === 8) {
    document.getElementById('img8').src = type;
  } else if (index === 9) {
    document.getElementById('img10').src = type;
  }
  document.getElementsByClassName('button1')[index].style.display = 'none';
  document.getElementsByClassName('button2')[index].style.display = 'none';
  document.getElementsByClassName('button3')[index].style.display = 'none';
}

function nextCat(type) {
  let cats = document.getElementsByClassName('cat');
  let card = document.getElementsByClassName('card');
  if (type === 'love') {
    showMeme('img/love.jpg');
    card[index].style.background = 'red';
    card[index].style.border = '2px solid red';
  } else if (type === 'bad') {
    showMeme('img/sad.jpg');
    card[index].style.background = 'black';
    card[index].style.border = '2px solid black';
  } else if (type === 'good') {
    showMeme('img/happy.jpg');
    card[index].style.background = 'lightsteelblue';
    card[index].style.border = '2px solid lightsteelblue';
  }
  setTimeout(function() {
    if (index >= 0) {
      card[index].style.background = 'rgba(220, 20, 60, 0.7)';
      card[index].style.border = '2px solid rgba(220, 20, 60, 0.7)';
      cats[index].style.display = 'none';
      if (index === 0) {
        document.getElementById('img1').src = 'img/1.jpg';
      } else if (index === 1) {
        document.getElementById('img7').src = 'img/7.jpg';
      } else if (index === 2) {
        document.getElementById('img9').src = 'img/9.jpg';
      } else if (index === 3) {
        document.getElementById('img3').src = 'img/3.jpg';
      } else if (index === 4) {
        document.getElementById('img2').src = 'img/2.jpg';
      } else if (index === 5) {
        document.getElementById('img4').src = 'img/4.jpg';
      } else if (index === 6) {
        document.getElementById('img5').src = 'img/5.jpg';
      } else if (index === 7) {
        document.getElementById('img6').src = 'img/6.jpg';
      } else if (index === 8) {
        document.getElementById('img8').src = 'img/8.jpg';
      } else if (index === 9) {
        document.getElementById('img10').src = 'img/10.jpg';
      }
      document.getElementsByClassName('button1')[index].style.display = 'block';
      document.getElementsByClassName('button2')[index].style.display = 'block';
      document.getElementsByClassName('button3')[index].style.display = 'block';
    }
    index++;
    let flag = false;
    for (let i = 0; i < cats.length; i++) {
      if (i === index) {
        setTimeout(function() {
          document.getElementsByClassName('catWait')[0].style.display = 'grid';
          setTimeout(function() {
            document.getElementsByClassName('catWait')[0].style.display = 'none';
          }, pause);
        }, 0);
        setTimeout(function() {
          cats[index].style.display = 'grid';
        }, pause + 200);
        flag = true;
      } else {
        cats[i].style.display = 'none';
      }
    }
    if (!flag) {
      document.getElementsByClassName('catEnd')[0].style.display = 'grid';
    }
  }, pause + 200);
}

function repeatCat() {
  index = -1;
  nextCat('repeat');
}
