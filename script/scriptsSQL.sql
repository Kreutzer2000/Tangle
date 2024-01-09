--CREATE TABLE Usuarios (
--    UsuarioID INT PRIMARY KEY IDENTITY(1,1),
--    Nombre NVARCHAR(100) NOT NULL,
--    Apellido NVARCHAR(100) NOT NULL,
--    Email NVARCHAR(255) UNIQUE NOT NULL,
--    Usuario NVARCHAR(50) UNIQUE NOT NULL,
--    Contrasena NVARCHAR(255) NOT NULL,
--    FechaCreacion DATETIME DEFAULT GETDATE(),
--    FechaUltimoAcceso DATETIME,
--    Activo BIT DEFAULT 1
--);


--CREATE TABLE RegistrosAcceso (
--    RegistroAccesoID INT PRIMARY KEY IDENTITY(1,1),
--    UsuarioID INT NOT NULL,
--    FechaAcceso DATETIME DEFAULT GETDATE(),
--    IP VARCHAR(45),
--    UserAgent NVARCHAR(255),
--    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
--);

--CREATE TABLE TransaccionesTangle (
--    TransaccionID INT PRIMARY KEY IDENTITY(1,1),
--    UsuarioID INT NOT NULL,
--    HashSHA3 NVARCHAR(255) NOT NULL,
--    BlockID NVARCHAR(255) NOT NULL,
--    FechaTransaccion DATETIME DEFAULT GETDATE(),
--    ProtocolVersion INT,
--    Parents NVARCHAR(MAX),
--    PayloadType INT,
--    PayloadTag NVARCHAR(255),
--    PayloadData NVARCHAR(MAX),
--    Nonce NVARCHAR(255),
--    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
--);

--ALTER TABLE Usuarios
--ADD NumeroTelefono NVARCHAR(15) NULL;

--ALTER TABLE TransaccionesTangle
--ADD ArchivoCifradoURL NVARCHAR(1024);

--ALTER TABLE Usuarios 
--DROP COLUMN FechaUltimoAcceso;

select *
from Usuarios

select *
from TransaccionesTangle

--update Usuarios
--set NumeroTelefono = '913754400'
--where UsuarioID = 1

SELECT * 
FROM TransaccionesTangle tt
JOIN Usuarios u
ON tt.UsuarioID = u.UsuarioID
WHERE u.NumeroTelefono = '913754400'
AND u.UsuarioID = 1 and tt.ArchivoCifradoURL NOT IN ('NULL', 'undefined')


/*

ALTER TABLE Usuarios DROP CONSTRAINT UQ__Usuarios__A9D1053440166E15;
ALTER TABLE Usuarios DROP CONSTRAINT UQ__Usuarios__E3237CF76B302F36;

ALTER TABLE Usuarios ALTER COLUMN Nombre NVARCHAR(MAX) NOT NULL;
ALTER TABLE Usuarios ALTER COLUMN Apellido NVARCHAR(MAX) NOT NULL;
ALTER TABLE Usuarios ALTER COLUMN Email NVARCHAR(MAX) NOT NULL;
ALTER TABLE Usuarios ALTER COLUMN Usuario NVARCHAR(MAX) NOT NULL;
ALTER TABLE Usuarios ALTER COLUMN Contrasena NVARCHAR(MAX) NOT NULL;
ALTER TABLE Usuarios ALTER COLUMN NumeroTelefono NVARCHAR(MAX) NULL;

ALTER TABLE Usuarios ALTER COLUMN Email NVARCHAR(450) NOT NULL;
ALTER TABLE Usuarios ALTER COLUMN Usuario NVARCHAR(450) NOT NULL;

CREATE UNIQUE INDEX UX_Usuarios_Email ON Usuarios(Email);
CREATE UNIQUE INDEX UX_Usuarios_Usuario ON Usuarios(Usuario);

DROP INDEX UX_Usuarios_Email ON Usuarios;
DROP INDEX UX_Usuarios_Usuario ON Usuarios;

ALTER TABLE Usuarios ALTER COLUMN Email NVARCHAR(MAX) NOT NULL;
ALTER TABLE Usuarios ALTER COLUMN Usuario NVARCHAR(MAX) NOT NULL;
*/