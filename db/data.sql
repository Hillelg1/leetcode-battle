-- ======================
-- USERS
-- ======================
CREATE TABLE IF NOT EXISTS `user` (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin TINYINT(1) NOT NULL DEFAULT 0
);

INSERT INTO `user` (id, username, password, is_admin)
VALUES
  (1, 'hillel', 'password123', 1),
  (2, 'opponent', 'password123', 0);

-- ======================
-- LEETCODE QUESTIONS
-- ======================
CREATE TABLE IF NOT EXISTS leetcode_questions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(50),
  example TEXT NOT NULL,
  starter_code TEXT
);

INSERT INTO leetcode_questions (id, title, description, difficulty, example, starter_code)
VALUES
  (1,
   'Two Sum',
   'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
   'Easy',
   'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
   'function solution(nums, target) {\n  // Write your code here\n}'
  );

-- ======================
-- TEST CASES
-- ======================
CREATE TABLE IF NOT EXISTS test_cases (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  question_id BIGINT NOT NULL,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES leetcode_questions(id)
);

INSERT INTO test_cases (id, question_id, input, output)
VALUES
  (1, 1, '{"nums": [2,7,11,15], "target": 9}', '[0,1]'),
  (2, 1, '{"nums": [3,2,4], "target": 6}', '[1,2]'),
  (3, 1, '{"nums": [3,3], "target": 6}', '[0,1]'),
  (4, 1, '{"nums": [1,2,3,4,5], "target": 9}', '[3,4]'),
  (5, 1, '{"nums": [0,4,3,0], "target": 0}', '[0,3]'),
  (6, 1, '{"nums": [-1,-2,-3,-4,-5], "target": -8}', '[2,4]'),
  (7, 1, '{"nums": [5,75,25], "target": 100}', '[1,2]'),
  (8, 1, '{"nums": [2,5,5,11], "target": 10}', '[1,2]'),
  (9, 1, '{"nums": [1,3,4,2], "target": 6}', '[2,3]'),
  (10, 1, '{"nums": [3,2,95,4,-3], "target": 92}', '[2,4]');