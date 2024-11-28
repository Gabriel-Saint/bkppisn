DROP DATABASE IF EXISTS gestaoFinanceira2;
CREATE SCHEMA IF NOT EXISTS gestaoFinanceira2 DEFAULT CHARACTER SET utf8;
USE gestaoFinanceira2;


DROP TABLE IF EXISTS `user_data`;
CREATE TABLE `user_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_user` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_user` varchar(255) NOT NULL,
  `admin` tinyint(4) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

-- Tabela de categorias
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_category` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL, 
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela de registros financeiros
DROP TABLE IF EXISTS `record`;
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `description_record` varchar(255) NOT NULL,
  `value_record` decimal(10,2) NOT NULL,
  `type_record` tinyint(4) NOT NULL,
  `date_record` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB;

-- Tabela de logs do sistema
DROP TABLE IF EXISTS `system_logs`;
CREATE TABLE `system_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11),
  `action_type` varchar(100) NOT NULL, 
  `action_timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

/*INSERT INTO `user_data` (`name_user`, `email`, `password_user`, `admin`)
VALUES 
('Maria Oliveira', 'maria.oliveira@email.com', 'senhaMaria123', 0),
('Pedro Santos', 'pedro.santos@email.com', 'senhaPedro123', 1),
('Ana Costa', 'ana.costa@email.com', 'senhaAna123', 0);

INSERT INTO `category` (`name_category`, `user_id`)
VALUES 
('Alimentação', 1),
('Transporte', 1),
('Salário', 2),      
('Entretenimento', 3),
('Educação', 3);

 INSERT INTO `record` (`user_id`, `category_id`, `description_record`, `value_record`, `type_record`, `date_record`)
VALUES 
(1, 1, 'Compra de material de escritório', 150.00, 1, '2024-09-30 14:30:00'),
(1, 2, 'Deslocamento para reunião', 5.50, 1, '2024-09-29 08:00:00'),
(2, 3, 'Recebimento de contrato de serviços', 3000.00, 0, '2024-09-28 12:00:00'),
(3, 4, 'Despesas com publicidade', 30.00, 1, '2024-09-27 20:00:00'),
(3, 5, 'Treinamento de equipe', 200.00, 1, '2024-09-25 10:00:00');


INSERT INTO `system_logs` (`user_id`, `action_type`)
VALUES 
(1, 'cadastro'),     
(1, 'login'),        
(2, 'cadastro'),      
(2, 'login'),      
(3, 'cadastro'),      
(3, 'login');       
INSERT INTO `category` (`name_category`, `user_id`)
VALUES 
('Alimentação', 1),
('Transporte', 1),
('Salário', 1),      
('Entretenimento', 1),
('Educação', 1);

*/

SELECT * FROM `user_data`;
SELECT * FROM `category`;
SELECT * FROM `record`;
SELECT * FROM `system_logs`;

