CREATE TABLE [dbo].[NodeLogs] (
    [Id]         BIGINT        IDENTITY (1, 1) NOT NULL,
    [LogDate]    DATETIME2 (3) NOT NULL,
    [Level]      NVARCHAR (5)  NOT NULL,
    [Message]    NTEXT         NOT NULL,
    CONSTRAINT [PK_dbo.NodeLogs] PRIMARY KEY CLUSTERED ([Id] ASC)
);
