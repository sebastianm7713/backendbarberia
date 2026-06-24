CREATE TABLE PasswordResetTokens (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_usuario INT NOT NULL,
  token VARCHAR(128) NOT NULL,
  expires_at DATETIME2 NOT NULL,
  used BIT NOT NULL DEFAULT 0,
  fecha_creacion DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_PasswordResetTokens_Usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
CREATE INDEX IDX_PasswordResetTokens_Token ON dbo.PasswordResetTokens(token);
