-- ShakeWords MySQL Schema
-- Run: mysql -u root -p your_database < schema.sql

CREATE TABLE IF NOT EXISTS users (
  id              VARCHAR(36)  NOT NULL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password        VARCHAR(255) NOT NULL,
  name            VARCHAR(100),
  email_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at      DATETIME(3)  NOT NULL,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_records (
  id         VARCHAR(60)  NOT NULL PRIMARY KEY,
  user_id    VARCHAR(36)  NOT NULL,
  word_id    VARCHAR(100) NOT NULL,
  book_id    VARCHAR(100) NOT NULL,
  is_correct BOOLEAN      NOT NULL,
  response_ms INT,
  gesture    VARCHAR(10),
  created_at DATETIME(3)  NOT NULL,
  INDEX idx_user_book (user_id, book_id),
  INDEX idx_created_at (created_at),
  INDEX idx_word_book (word_id, book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS word_progress (
  user_id     VARCHAR(36)  NOT NULL,
  word_id     VARCHAR(100) NOT NULL,
  book_id     VARCHAR(100) NOT NULL,
  mastery     INT          NOT NULL DEFAULT 0,
  next_review DATETIME(3)  NOT NULL,
  updated_at  DATETIME(3)  NOT NULL,
  PRIMARY KEY (user_id, word_id, book_id),
  INDEX idx_user_book (user_id, book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_settings (
  user_id   VARCHAR(36)  NOT NULL,
  key_name  VARCHAR(100) NOT NULL,
  value     TEXT         NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  PRIMARY KEY (user_id, key_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
