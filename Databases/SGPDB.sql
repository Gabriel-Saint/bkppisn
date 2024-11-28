drop database gestaofinanceira;
create schema if not exists gestaoFinanceira default character set utf8;
use gestaoFinanceira;

DROP TABLE IF EXISTS `user_data`;
CREATE TABLE `user_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_user` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_user` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `record`;
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `description_record` varchar(255) NOT NULL,
  `value_record` decimal(10,2) NOT NULL,
  `type_record` tinyint(4) NOT NULL,
  `date_record` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `record_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_data` (`id`)
) ENGINE=InnoDB;

select*from user_data;
