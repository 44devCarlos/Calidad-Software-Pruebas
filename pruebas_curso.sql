-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.44 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.13.0.7147
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for pruebas_curso
DROP DATABASE IF EXISTS `pruebas_curso`;
CREATE DATABASE IF NOT EXISTS `pruebas_curso` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pruebas_curso`;

-- Dumping structure for procedure pruebas_curso.actualizar_usuario
DROP PROCEDURE IF EXISTS `actualizar_usuario`;
DELIMITER //
CREATE PROCEDURE `actualizar_usuario`(
	IN `p_id_usuario` INT,
	IN `p_email` TEXT,
	IN `p_contrasena` TEXT,
	IN `p_locked` INT,
	IN `p_failed_attempt` INT,
	IN `p_token` TEXT
)
BEGIN
	 DECLARE email_actual VARCHAR(100);
    DECLARE email_existe INT;

    -- Obtener el email actual
    SELECT email INTO email_actual FROM usuarios WHERE id_usuario = p_id_usuario;

    -- Verificar si se intenta cambiar el email
    IF p_email IS NOT NULL AND p_email != email_actual THEN
        SELECT COUNT(*) INTO email_existe
        FROM usuarios
        WHERE email = p_email AND id_usuario != p_id_usuario;

        IF email_existe > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este email ya está registrado por otro usuario';
        END IF;
    END IF;

    -- Si se proporciona una nueva contraseña, se actualiza con ella
    IF p_contrasena IS NOT NULL AND p_contrasena != '' THEN
        UPDATE usuarios
        SET email = IF(p_email IS NOT NULL AND p_email != '', p_email, email_actual),
            contrasena = p_contrasena, usuarios.`locked` = p_locked, 
				usuarios.failed_attempt = p_failed_attempt, token = p_token
        WHERE id_usuario = p_id_usuario;
    ELSE
        UPDATE usuarios
        SET email = IF(p_email IS NOT NULL AND p_email != '', p_email, email_actual), 
				usuarios.`locked` = p_locked, usuarios.failed_attempt = p_failed_attempt, token = p_token
        WHERE id_usuario = p_id_usuario;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure pruebas_curso.actualizar_usuario_completo
DROP PROCEDURE IF EXISTS `actualizar_usuario_completo`;
DELIMITER //
CREATE PROCEDURE `actualizar_usuario_completo`(
	IN `p_id_usuario` INT,
	IN `p_contrasena` TEXT,
	IN `p_locked` INT,
	IN `p_failed_attempt` INT,
	IN `p_token` TEXT,
	IN `p_token_reset` TEXT,
	IN `p_token_expira` DATETIME
)
BEGIN
	UPDATE usuarios AS u
	SET u.contrasena = p_contrasena, u.`locked` = p_locked, u.failed_attempt = p_failed_attempt,
	u.token = p_token, u.token_reset = p_token_reset, u.token_expira = p_token_expira
	WHERE u.id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Dumping structure for procedure pruebas_curso.consultar_usuario
DROP PROCEDURE IF EXISTS `consultar_usuario`;
DELIMITER //
CREATE PROCEDURE `consultar_usuario`(
	IN `p_email` TEXT
)
BEGIN
	SELECT * FROM usuarios WHERE email = p_email;
END//
DELIMITER ;

-- Dumping structure for procedure pruebas_curso.guardar_token_recuperacion
DROP PROCEDURE IF EXISTS `guardar_token_recuperacion`;
DELIMITER //
CREATE PROCEDURE `guardar_token_recuperacion`(
	IN `p_id_usuario` INT,
	IN `p_token_reset` TEXT,
	IN `p_token_expira` DATETIME
)
BEGIN
	UPDATE usuarios AS u
	SET u.token_reset = p_token_reset, u.token_expira = p_token_expira
	WHERE id_usuario = p_id_usuario;
END//
DELIMITER ;

-- Dumping structure for table pruebas_curso.usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `email` text COLLATE utf8mb4_general_ci,
  `contrasena` text COLLATE utf8mb4_general_ci,
  `locked` int DEFAULT NULL,
  `failed_attempt` int DEFAULT NULL,
  `token` text COLLATE utf8mb4_general_ci,
  `token_reset` text COLLATE utf8mb4_general_ci,
  `token_expira` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table pruebas_curso.usuarios: ~1 rows (approximately)
INSERT INTO `usuarios` (`id_usuario`, `email`, `contrasena`, `locked`, `failed_attempt`, `token`, `token_reset`, `token_expira`) VALUES
	(1, 'carv2012@gmail.com', '12345678', 0, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNhcnYyMDEyQGdtYWlsLmNvbSIsImlhdCI6MTc2NTMzNDQyMywiZXhwIjoxNzY1MzM1MDIzfQ._9WK5vCIRONHN-L_u0QEiu0MMIHp3ExI_pzg7Plrw2c', NULL, NULL);

-- Dumping structure for procedure pruebas_curso.verificar_usuario
DROP PROCEDURE IF EXISTS `verificar_usuario`;
DELIMITER //
CREATE PROCEDURE `verificar_usuario`(
	IN `p_email` TEXT,
	IN `p_contrasena` TEXT
)
BEGIN
	SELECT *
    FROM usuarios
    WHERE email = p_email AND contrasena = p_contrasena
    LIMIT 1;
END//
DELIMITER ;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
