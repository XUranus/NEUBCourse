Imports System.Data.SQLite
Imports System.Threading

Public Class LoginWindow

    Dim UserData As UserData
    Dim Diaries As ArrayList
    Dim Contacts As ArrayList
    Dim AccountRecords As ArrayList

    Private Sub Button_Click(sender As Object, e As RoutedEventArgs)
        LoginPanel.Visibility = Visibility.Hidden
        LoadingPanel.Visibility = Visibility.Visible
        Dim thread As New Thread(
         Sub()
             Thread.Sleep(3000)
             Prepare_For_Login()
         End Sub
        )
        thread.Start()

    End Sub

    Private Function Prepare_For_Login()
        Me.Dispatcher.Invoke(Function()
                                 Dim userMail = LoginUserNameTextBox.Text
                                 If Authentic(LoginUserNameTextBox.Text, LoginPasswordBox.Password) Then
                                     Dim NewWindow As Object = New DashBoardWindow

                                     If LoadData(userMail) Then
                                         '加载成功后改换句柄
                                         NewWindow.UserData = UserData
                                         NewWindow.Diaries = Diaries
                                         NewWindow.Contacts = Contacts
                                         NewWindow.AccountRecords = AccountRecords
                                         NewWindow.Show()
                                         Me.Close()
                                     Else
                                         MessageBox.Show("系统错误 与数据库通信失败！")
                                         Application.Current.Shutdown()
                                     End If

                                 Else
                                     LoginPanel.Visibility = Visibility.Visible
                                     LoadingPanel.Visibility = Visibility.Hidden
                                     MessageBox.Show("用户名或者密码不正确")
                                 End If
                                 Return 0
                             End Function
        )
    End Function

    'Authenic Function
    Private Function Authentic(ByVal UserMail As String, ByVal PassWord As String) As Boolean
        Dim Conn = SQLConnection.NewConn()
        Dim ret = False
        Try
            Dim Query As String = "select * from user where mail = '" + UserMail + "' and password = '" + PassWord + "'"
            Dim Command = New SQLiteCommand(Query, Conn)
            Dim Reader = Command.ExecuteReader
            Dim count As Integer = 0
            While Reader.Read
                count = count + 1
            End While
            If (count = 1) Then
                Conn.Close()
                ret = True
            End If
            Conn.Close()
        Catch ex As Exception
            MessageBox.Show(ex.Message)
        Finally
            Conn.Dispose()
        End Try
        Return ret
    End Function

    'Mysql加载数据
    Private Function LoadData(ByVal Mail As String) As Boolean
        Dim Conn = SQLConnection.NewConn()

        Try
            Dim Query As String = "select id,username,gender,mail,age,birthday from user where mail = '" + Mail + "'"
            Dim Command = New SQLiteCommand(Query, Conn)
            Dim Reader = Command.ExecuteReader

            While Reader.Read
                UserData.Id = Reader(0)
                UserData.Name = Reader(1)
                UserData.Gender = Reader(2)
                UserData.Mail = Reader(3)
                UserData.Age = Reader(4)
                UserData.Birthday = Reader(5)
            End While
            Reader.Close()

            Query = "select id,title,content,format,date from diary where belong = " & UserData.Id
            Command = New SQLiteCommand(Query, Conn)
            Reader = Command.ExecuteReader
            Diaries = New ArrayList
            Dim Diary As Diary
            While Reader.Read
                Diary = New Diary
                Diary.Id = Reader(0)
                Diary.Title = Reader(1)
                Diary.Content = Reader(2)
                Diary.Format = Reader(3)
                Diary.DateEdit = Reader(4)
                Diaries.Add(Diary)
            End While
            Reader.Close()

            Query = "select name,mail,phone from contact where belong = " & UserData.Id
            Command = New SQLiteCommand(Query, Conn)
            Reader = Command.ExecuteReader
            Contacts = New ArrayList
            Dim Contact As Contact
            While Reader.Read
                Contact = New Contact
                Contact.Name = Reader(0)
                Contact.Mail = Reader(1)
                Contact.Phone = Reader(2)
                Contacts.Add(Contact)
            End While
            Reader.Close()

            Query = "select id,content,cost,date from account where belong = " & UserData.Id
            Command = New SQLiteCommand(Query, Conn)
            Reader = Command.ExecuteReader
            AccountRecords = New ArrayList
            Dim Record As AccountRecord
            While Reader.Read
                Record = New AccountRecord
                Record.Id = Reader(0)
                Record.Content = Reader(1)
                Record.Cost = Reader(2)
                Record.DateCreated = Reader(3)
                AccountRecords.Add(Record)
            End While
            Reader.Close()

            Conn.Close()
        Catch ex As Exception
            MessageBox.Show(ex.Message)
            Return False
        Finally
            Conn.Dispose()
        End Try
        Return True
    End Function

    Private Sub Hyperlink_Click(sender As Object, e As RoutedEventArgs)
        '打开相应的网页
        System.Diagnostics.Process.Start("http://sites.xuranus.com/vbdashboard")
    End Sub
End Class


Public Structure UserData
    Dim Id As Integer
    Dim Name As String
    Dim Gender As String
    Dim Mail As String
    Dim Age As Integer
    Dim Birthday As String
End Structure

Public Structure Diary
    Dim Id As Integer
    Dim Title As String
    Dim Content As String
    Dim DateEdit As String
    Dim Format As String
End Structure

Public Structure Contact
    Dim Name As String
    Dim Mail As String
    Dim Phone As String
End Structure

Public Structure AccountRecord
    Dim Id As Integer
    Dim Content As String
    Dim Cost As Double
    Dim DateCreated As String
End Structure