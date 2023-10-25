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


select *
from Usuarios

select *
from RegistrosAcceso

select *
from TransaccionesTangle
