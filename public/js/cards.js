var CardView = function(el, card) {
  this.el = el;
  this.card = card;
  this.englishSound = this.createSound_(card.audioClipEnglish);
  this.frenchSound = this.createSound_(card.audioClipFrench);

  this.onNext = function() {
  };
};

CardView.prototype.createSound_ = function(audioClip) {
  return new Howl({
    urls: [audioClip.src],
    sprite: {
      word: [audioClip.startTime, audioClip.stopTime]
    }
  });
};

CardView.prototype.render = function() {
  this.el.innerHTML = '\
    <div class="flip">\
      <div class="card">\
        <div class="face front">\
          <div class="word">' + this.card.dictionary.english + '</div>\
          <button class="playSound">Play Audio</button>\
        </div>\
        <div class="face back">\
          <div class="word">' + this.card.dictionary.french + '</div>\
          <button class="playSound">Play Audio</button>\
        </div>\
      </div>\
    </div>\
    <div class="inputs">\
      <label class="prompt">Press enter to guess</label>\
      <input type="text" placeholder="How do you say this in french?" />\
      <button class="next button" style="display: none;">Next</button>\
      <div class="result"></div>\
    </div>\
  ';

  this.englishSound.play('word');
  $(this.el).find('.front .playSound').
    click(function() {
      this.englishSound.play('word');
    }.bind(this));

  $(this.el).find('.back .playSound').
    click(function() {
      this.frenchSound.play('word');
    }.bind(this));

  $(this.el).find('input').on('keydown', function(evt) {
    var ENTER = 13;

    $(this.el).find('.result').text('');

    if (evt.which === ENTER) {
      this.guess(evt.currentTarget.value.trim())
    }
  }.bind(this));
};

CardView.prototype.guess = function(frenchWord) {
  if (frenchWord === this.card.dictionary.french) {
    $(this.el).find('.card').addClass('flipped');

    $(this.el).find('.result').
      addClass('correct').
      text('You got it!');

    this.englishSound.stop();
    this.frenchSound.play('word');

    this.renderNextButton();
  }
  else {
    $(this.el).find('.result').
      removeClass('correct').
      text('nope.');
  }
};

CardView.prototype.renderNextButton = function() {
  var $nextButton = $(this.el).find('.next');

  $nextButton.show();
  $nextButton.click(function() {
    this.englishSound.stop();
    this.frenchSound.stop();
    this.onNext();
  }.bind(this));
};

playCard(0);

function playCard(index) {
  var cardView = new CardView(document.getElementById('app'), flashCards[index]);

  cardView.onNext = function() {
    var nextCardIndex = index + 1;
    if (nextCardIndex > flashCards.length - 1) {
      alert('You finished all the cards!');
      return;
    }

    setTimeout(function() {
      playCard(nextCardIndex);
    }, 1000);
  };

  cardView.render();
}