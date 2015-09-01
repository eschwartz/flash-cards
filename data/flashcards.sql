CREATE SCHEMA `flashcards`
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_general_ci;
USE `flashcards`;

CREATE TABLE `dictionary` (
  `id`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `english` VARCHAR(256) NOT NULL,
  `french`  VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `audio` (
  `id` INT UNSIGNED NOT NULL,
  `src` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `dictionary_audio` (
  `dictionary_id` INT UNSIGNED NOT NULL,
  `audio_id` INT UNSIGNED NOT NULL,
  `language` VARCHAR(64) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `stop_time` DATETIME NOT NULL,
  PRIMARY KEY (`dictionary_id`, `audio_id`, `language`),
  INDEX `fk_audio_id` (`audio_id` ASC),
  INDEX `fk_dictionary_id` (`dictionary_id` ASC),
  CONSTRAINT `fk_audio`
    FOREIGN KEY (`audio_id`)
    REFERENCES `audio` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_dictionary`
    FOREIGN KEY (`dictionary_id`)
    REFERENCES `dictionary` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);