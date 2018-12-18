var p0, p1, p2, pBoard, edit1, edit2, editBoard, btn;

function setup() {
  noCanvas();
  noLoop();
	
  p0 = createP('c♣, d♦, h♥, s♠');
  
  p1 = createP('игрок 1'); 
  edit1 = createInput('Ts Jc');
  
  p2 = createP('игрок 2');
  edit2 = createInput('Kh As');
  
  pBoard = createP('стол');
  editBoard = createInput('2c 5c 8s Td 3h');
  
  createElement('br');
  btn = createButton('ввод');
  createElement('br');
  pClass = createP('класс');
  
  
  btn.mouseReleased(onPressBtn);
}

function onPressBtn() {
  pClass.html("ошибка чтения hand1");
  var hand1 = readHand(edit1.value());
  
  pClass.html("ошибка чтения hand2");
  var hand2 = readHand(edit2.value());
  
  pClass.html("ошибка чтения Board");
  var handBoard = readHand(editBoard.value());
  
  var str;
  var numberOfClass = getHandClass(handBoard);
  if(numberOfClass == undefined) {
    str = "numberOfClass = undefined";
  } else {
    str = handClassString[numberOfClass];
  }
  pClass.html("на столе " + str);
}

function isWrongHand(hand) {
  // если карты в множестве hand одинаковы, то true
  return false;
}

function isFlushSuits(handSuits) {
  var s = handSuits[0];
  for(var i = 0; i < handSuits.length; i++) {
    if(handSuits[i] != s) {
      return false;
    }
  }
  return true;
}

function isStraightRanks(handRanks) {
  var r = handRanks[0];
  for(var i = 0; i < handRanks.length; i++) {
    if(handRanks[i] != r++) {
      return false;
    }
  }
  return true;
}

function getFiveHandClass(hand) {
  var handSuits = hand.map(getSuit);
  var handRanks = hand.map(getRank);
  
  handRanks.sort();
  
  console.log(handRanks);
  
  var isHighCard = (handRanks[4] == ranks.length - 1);
  var isStraight = isStraightRanks(handRanks);
  var isFlush = isFlushSuits(handSuits);
  
  
  if(isStraight && isFlush && isHighCard) {
    return handClassConst.ROYAL_FLUSH;
  }
  
  if(isStraight && isFlush) {
    return handClassConst.STRAIGHT_FLUSH;
  }
  
  /*
  FOUR_OF_A_KIND
  FULL_HOUSE
  */
  
  if(isFlush) {
    return handClassConst.FLUSH;
  }
  
  if(isStraight) {
    return handClassConst.STRAIGHT;
  }
  
  /*
  THREE_OF_A_KIND
  TWO_PAIR
  ONE_PAIR
  HIGH_CARD
  */

  
  return handClassConst.NOTHING;
}

// diamonds (♦), clubs (♣), hearts (♥) and spades (♠)
function getHandClass(hand) {
  if(hand.length < 5) {
    return handClassConst.NOTHING;
  }
  if(isWrongHand(hand)) {
    return handClassConst.WRONG_HAND;
  }
  // hand = "8♥ 5♣ 3♥ 2♠ 3♥" -> one pair
  // начинаем проверку с ROYAL_FLASH и идем назад
  

  
  if(hand.length == 5) {
    // одна возможная комбинация
    return getFiveHandClass(hand);
  }
  
  if(hand.length == 6) {
    // comb(5, 6) = comb(1, 6) = шесть возможных комбинаций
    // (6) / (1) = 6
    return undefined;
  }
  
  if(hand.length == 7) {
    // comb(5, 7) = comb(2, 7) = (7*6) / (1*2) = 21 комбинаций
    return undefined;
  }
}

function compareHands(hand1, hand2) {
  var unionHand = hand1.concat(hand2); // объединяем два множества
	
  if(isWrongHand(unionHand)) {
    // руки не могут содержать одинаковые карты
    return compareConst.WRONG;
  }
  // hand1 = "5♥ 6♥ 7♥ 8♥ 9♥"
  // hand2 = "2♥ 3♥ 4♥ 5♥ 6♥"
	
  // в этой функции определяем какой набор из 5 карт лучше
  // return compareConst.something
}

// ********** CARDS TO STRING **************

function getSuit(n) {
  return floor(n / ranks.length);
}

function getRank(n) {
  return n % ranks.length;
}

function getCardStringFromNumber(n) {
  var rank = getRank(n);
  var suit = getSuit(n);
  return getCardString(rank, suit);
}

function getCardString(rank, suit) {
  return ranks[rank] + suits[suit];
}

function getHandString(hand, options) {
  var str = "";
  for(var i = 0; i < hand.length; i++) {
    str += getCardStringFromNumber(hand[i]) + " ";
  }
  return str;
}
// ********** READ CARDS **************
function readFromArray(arr, ch) {
  for(var i = 0; i < arr.length; i++) {
    if(arr[i] == ch) {
      return i;
    }
  }
  return NOT_FOUND;
}

function readRank(ch) {
  return readFromArray(ranks, ch);
}

function readSuit(ch) {
  return readFromArray(suits, ch);
}

function rankSuitToNumber(rank, suit) {
  return suit * ranks.length + rank;
}

function deleteSpaces(handString) {
  return handString.split(' ').join('');
}

function readHand(handString) {
  var handArray = readHandToArray(handString);
  return handArrayToNumbers(handArray);
}

function rankAndSuitToPair(rankAndSuit) {
  var rank = readRank(rankAndSuit[0]);
  var suit = readSuit(rankAndSuit[1]);
  return {rank, suit};
}

function handArrayToNumbers(handArray) {
  var hand = [];
  for(var i = 0; i < handArray.length; i++) {
    var rankAndSuit = handArray[i];
    var err = checkRankAndSuit(rankAndSuit);
    if(err) {
      throw new Error("Ошибка чтения в функции handArrayToNumbers: " + handArray);
    }
    var pair = rankAndSuitToPair(rankAndSuit);
    hand.push(rankSuitToNumber(pair.rank, pair.suit));
  }
  return hand;
}

function checkRankAndSuit(rankAndSuit) {
  var pair = rankAndSuitToPair(rankAndSuit);
  if(pair.rank == NOT_FOUND || pair.suit == NOT_FOUND) {
    return true;
  }
  return false;
}

function readHandToArray(handString) {
  var handArray = [];
  handString = deleteSpaces(handString);
	
  if(handString.length % 2 == 1) {
    throw new Error("Требуется указать масть карты в функции readHandToArray: " + handString);
  }
	
  for(var i = 0; i < handString.length; i += 2) {
    var rankAndSuit = handString.substring(i, i + 2);
    var err = checkRankAndSuit(rankAndSuit);
    if(err) {
      throw new Error("Ошибка чтения в функции readHandToArray: " + handString);
    }
    handArray.push(rankAndSuit);
  }
  return handArray;
}