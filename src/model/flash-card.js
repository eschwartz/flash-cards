var connection = require('../db/connection');
var Promise = require('es6-promise').Promise;

/**
 * Simple data representation of a flash card
 */
var FlashCard = function(props) {
  this.dictionary = props.dictionary;
  this.audioClipEnglish = props.audioClipEnglish;
  this.audioClipFrench = props.audioClipFrench;
};

/**
 * The following methods act like a simple ORM (Object-Relational Mapper),
 *  in that they map DB records to javascript objects.
 * Making an ORM is hard, so I would suggest taking a look at a well-established
 * library (search Google for "node MySQL ORM")
 */

FlashCard.findEnglishAndFrenchByEnglish = function(englishWord) {
  return connection.
    query('\
      SELECT *\
      FROM dictionary\
      LEFT JOIN dictionary_audio on dictionary.id = dictionary_audio.dictionary_id\
      RIGHT JOIN audio on dictionary_audio.audio_id = audio.id\
      WHERE dictionary.english = "' + englishWord + '"\
    ').
    then(function(rows) {
      var filterRowByLanguage = function(language) {
        return function(row) { return row.language === language };
      };

      var rowToAudioClip = function(row) {
        return {
          src: row.src,
          startTime: row.start_time,
          stopTime: row.stop_time
        };
      };

      var englishRow = rows.filter(filterRowByLanguage('english'))[0];
      var frenchRow = rows.filter(filterRowByLanguage('french'))[0];

      return new FlashCard({
        dictionary: {
          id: rows[0].dictionary_id,
          english: rows[0].english,
          french: rows[0].french
        },
        audioClipEnglish: rowToAudioClip(englishRow),
        audioClipFrench: rowToAudioClip(frenchRow)
      });
    });
};

FlashCard.findAll = function() {
  // this is a naive/inefficient way to do this,
  // but it's quick and easy for demonstration.
  // I would suggest using an ORM for more advanced
  // DB interactions: try http://docs.sequelizejs.com/
  return connection.
    query('\
      SELECT *\
      FROM dictionary\
    ').
    then(function(results) {
      var cards = results.map(function(res) {
        return FlashCard.findEnglishAndFrenchByEnglish(res.english);
      });
      return Promise.all(cards);
    })
};


module.exports = FlashCard;