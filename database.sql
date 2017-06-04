DROP TABLE IF EXISTS category;
create  table category
(
id int(12) primary key auto_increment,
name varchar(255)
)default charset=utf8;
insert into category (name) values
('要闻'),
('财经'),
('娱乐'),
('体育'),
('军事'),
('科技'),
('历史'),
('凤凰号');

DROP TABLE IF EXISTS news;
create table news
(
  id int(12) primary key  auto_increment,
  title varchar(255),
  url varchar(255),
  thumbnail varchar(255),
  cate int(12)
)default charset=utf8;