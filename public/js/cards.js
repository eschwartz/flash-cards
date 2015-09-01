/**
 * A CardView encapsulates the application behavior for a single flash card
 */
var CardView = function(el, card) {
  this.el = el;
  this.card = card;
  this.englishSound = this.createSound_(card.audioClipEnglish);
  this.frenchSound = this.createSound_(card.audioClipFrench);

  // this can be overridden, to tell us what to do when a user clicks the 'next' button
  this.onNext = function() {
  };
};

/**
 * Utility method for creating a Howl sound from an audioClip model
 */
CardView.prototype.createSound_ = function(audioClip) {
  return new Howl({
    urls: [audioClip.src],
    sprite: {
      word: [audioClip.startTime, audioClip.stopTime]
    }
  });
};

/**
 * Render the HTML for a application view,
 * using our `card` model
 */
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

  // Play the english word sound as soon as the view is rendered
  this.englishSound.play('word');

  // Play sounds when the user clicks the "Play Sound" button
  $(this.el).find('.front .playSound').
    click(function() {
      this.englishSound.play('word');
    }.bind(this));

  $(this.el).find('.back .playSound').
    click(function() {
      this.frenchSound.play('word');
    }.bind(this));

  // Handle keyboard inputs
  $(this.el).find('input').on('keydown', function(evt) {
    var ENTER = 13;

    // Clear the "result" text
    $(this.el).find('.result').text('');

    // If the user presses enter, submit their text as a guess
    if (evt.which === ENTER) {
      this.guess(evt.currentTarget.value.trim())
    }
  }.bind(this));
};

CardView.prototype.guess = function(frenchWord) {
  // Check if the guess is correct
  if (frenchWord === this.card.dictionary.french) {
    // Flip the card over (a CSS trick)
    $(this.el).find('.card').addClass('flipped');

    // Show the result text
    $(this.el).find('.result').
      addClass('correct').
      text('You got it!');

    // And play the audio for the french word
    this.englishSound.stop();
    this.frenchSound.play('word');

    // Show the "next" button, so the user can advance
    this.renderNextButton();
  }
  else {
    // If the guess is incorrect,
    // show a negative result message
    $(this.el).find('.result').
      removeClass('correct').
      text('nope.');
  }
};

CardView.prototype.renderNextButton = function() {
  var $nextButton = $(this.el).find('.next');

  $nextButton.show();
  $nextButton.click(function() {
    // Clean up: make sure no sounds are playing
    this.englishSound.stop();
    this.frenchSound.stop();

    this.onNext();
  }.bind(this));
};


/**
 * Bootstrap the application,
 * by creating CardViews for each flash card, in sequence
 */
playCard(0);

function playCard(index) {
  // Create a new card view, in the '#app' element
  var cardView = new CardView(document.getElementById('app'), flashCards[index]);

  // Tell the card view what to do when
  // a user clicks the `next` button
  // (go to the next card)
  cardView.onNext = function() {
    var nextCardIndex = index + 1;
    if (nextCardIndex > flashCards.length - 1) {
      alert('You finished all the cards!');
      return;
    }

    playCard(nextCardIndex);
  };

  cardView.render();
}