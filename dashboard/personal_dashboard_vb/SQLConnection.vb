Imports System.Data.SQLite

Public NotInheritable Class SQLConnection

    Public Shared Function NewConn() As SQLiteConnection
        Dim SqliteConn = New SQLiteConnection With {
            .ConnectionString = "Data Source=C:\Users\tedis\data.db"
        }
        SqliteConn.Open()
        Return SqliteConn
    End Function

End Class