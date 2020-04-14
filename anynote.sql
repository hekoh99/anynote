CREATE TABLE contents (
  `id` int(11) not null,
  `name` varchar(20) NOT NULL,
  `details` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `author`
--

INSERT INTO `contents` VALUES (1,'자유게시판','자유 게시물');
INSERT INTO `contents` VALUES (2,'잔망 토론','잔망스런 토론방');
INSERT INTO `contents` VALUES (3,'스토리텔링','스토리텔러들의 방');
INSERT INTO `contents` VALUES (4,'거미줄 짓기','엮어 글쓰기 방');

--
-- Table structure for table `topic`
--

CREATE TABLE article (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `description` text,
  `content_id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `time` TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (`id`)
);
 
INSERT INTO article VALUES (1,'test','test contents',1,1,default);
INSERT INTO article(title, description, content_id, author_id, time) VALUES ('test','test contents',2,1,default);
INSERT INTO article(title, description, content_id, author_id, time) VALUES ('test','test contents',3,1,default);
INSERT INTO article(title, description, content_id, author_id, time) VALUES ('test','test contents',4,1,default);
