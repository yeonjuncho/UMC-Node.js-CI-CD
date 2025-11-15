-- FoodCategory 시드 데이터 (중복 방지)
INSERT IGNORE INTO `FoodCategory` (`name`, `createdAt`) VALUES
('한식', NOW(3)),
('중식', NOW(3)),
('일식', NOW(3)),
('양식', NOW(3)),
('분식', NOW(3)),
('치킨', NOW(3)),
('피자', NOW(3)),
('패스트푸드', NOW(3)),
('카페', NOW(3)),
('디저트', NOW(3));

