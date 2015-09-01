USE flashcards;

INSERT INTO dictionary (english, french)
VALUES
  ('dog', 'chien'),
  ('cat', 'chat'),
  ('badger', 'blaireau')
;

INSERT INTO audio (src)
  VALUES ('/audio/dub.mp3'), ('/audio/space.mp3'), ('/audio/steel_drums.mp3');

INSERT INTO dictionary_audio (dictionary_id, audio_id, `language`, start_time, stop_time)
  VALUES
    (1, 1, 'english', 1000, 5000),
    (1, 1, 'french', 5000, 10000),
    (2, 2, 'english', 1000, 5000),
    (2, 2, 'french', 5000, 10000),
    (3, 3, 'english', 1000, 5000),
    (3, 3, 'french', 5000, 10000)
;
