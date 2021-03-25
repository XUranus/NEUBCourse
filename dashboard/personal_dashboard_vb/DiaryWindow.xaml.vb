Imports com.github.rjeschke.txtmark
Imports System.Data.SQLite
Imports System.Threading

Public Class DiaryWindow
    Public Diaries As ArrayList
    Public UserData As UserData
    Private NewFormat As String

    Private Sub Window_Loaded(sender As Object, e As RoutedEventArgs)
        Dim diary As Diary
        For Each diary In Diaries
            Add_Diary_To_ListView(diary)
        Next
        NewFormat = ""
    End Sub

    Private Sub Add_Diary_To_ListView(Diary As Diary)
        Dim label As Label = New Label
        label.Content = Diary.Title
        label.Tag = Diary.Id
        DiariesListView.Items.Add(label)
    End Sub

    Private Sub DiariesListView_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)
        Try
            Dim element As Label = DiariesListView.SelectedItem
            Dim Id As Integer = Integer.Parse(element.Tag.ToString)
            Dim diary As Diary
            For Each diary In Diaries
                If diary.Id = Id Then

                    TitleLabel.Content = diary.Title
                    FormatLabel.Content = diary.Format
                    TimeLabel.Content = diary.DateEdit
                    SelectedDetailDock.Tag = diary.Id

                    If (diary.Format = "Markdown") Then
                        Dim htmlData = Ozone.Markdown.Parser.ParseMarkdown(diary.Content)
                        PreView_content(htmlData)
                    Else
                        PreView_content(diary.Content)
                    End If
                    Return

                End If
            Next
        Catch ex As Exception
            'nothing
        End Try
    End Sub

    Sub PreView_content(ByVal content)
        PreViewContent.Navigate("about:blank")
        PreViewContent.Document.write(content)
        PreViewContent.Refresh()
    End Sub

    Private Sub Button_Click(sender As Object, e As RoutedEventArgs)
        '新建文档
        Dim Formart As String
        If NewFormat.Equals("Markdown") Or NewFormat.Equals("CommonText") Then
            Formart = NewFormat
        Else
            MessageBox.Show("请选择文章格式类型")
            Return
        End If
        Dim Title As String = NewDiaryTitleBox.Text
        If (Not Title.Equals("")) Then
            Dim Diary As New Diary
            Diary.Title = Title
            If (Formart.Equals("Markdown")) Then
                Diary.Content = "# " & Title & "  " & "\n" & " - 创建时间：" & DateAndTime.DateString & " " & DateAndTime.TimeString
            Else
                Diary.Content = Title & "  " & "\n" & " - 创建时间：" & DateAndTime.DateString & " " & DateAndTime.TimeString
            End If
            Diary.Format = Formart
            Diary.DateEdit = DateAndTime.DateString & " " & DateAndTime.TimeString
            Diary.Id = -1 '无意义
            Add_New_Diary_To_DB(Diary)
        Else
            MessageBox.Show("请输入文章标题")
            Return
        End If
    End Sub

    Private Sub Add_New_Diary_To_DB(ByVal Diary)
        '添加到数据库 并且 添加到ListView中
        Dim Conn = SQLConnection.NewConn()
        Try
            Dim Query As String = "insert into diary (title,content,format,date,belong) values ('" + Diary.Title & "','" & Diary.Content & "','" & Diary.Format & "','" &
                Diary.DateEdit & "','" & UserData.Id & "')"
            Dim Command = New SQLiteCommand(Query, Conn)
            Command.ExecuteNonQuery()
            Conn.Close()
        Catch ex As Exception
            MessageBox.Show(ex.Message)
        Finally
            Conn.Dispose()
        End Try
        '更新数组和ListBox

        Update_Diaries_Data()
        MessageBox.Show("添加成功")
    End Sub

    Public Sub Update_Diaries_Data()
        Diaries.Clear()
        Dim Conn = SQLConnection.NewConn()
        Try
            Dim Query As String = "select id,title,content,format,date from diary where belong = " & UserData.Id
            Dim Command = New SQLiteCommand(Query, Conn)
            Dim Reader = Command.ExecuteReader
            While Reader.Read
                Dim Diary As Diary = New Diary
                Diary.Id = Reader(0)
                Diary.Title = Reader(1)
                Diary.Content = Reader(2)
                Diary.Format = Reader(3)
                Diary.DateEdit = Reader(4)
                Diaries.Add(Diary)
            End While
            Conn.Close()
        Catch ex As Exception
            MessageBox.Show(ex.Message)
        Finally
            Conn.Dispose()
        End Try

        DiariesListView.Items.Clear()
        Dim temp As Diary
        For Each temp In Diaries
            Add_Diary_To_ListView(temp)
        Next
    End Sub

    Private Sub Button_Click_1(sender As Object, e As RoutedEventArgs)
        '删除
        '从数据库中删除 更新
        Dim Conn = SQLConnection.NewConn()
        Try
            Dim Query As String = "delete from diary where id = " & Integer.Parse(SelectedDetailDock.Tag.ToString)
            Dim Command = New SQLiteCommand(Query, Conn)
            Command.ExecuteNonQuery()
            Conn.Close()
        Catch ex As Exception
            MessageBox.Show(ex.Message)
        Finally
            Conn.Dispose()
        End Try
        Update_Diaries_Data()
        MessageBox.Show("删除成功")
    End Sub

    Private Sub Button_Click_2(sender As Object, e As RoutedEventArgs)
        '打开编辑窗口
        Dim Id = Integer.Parse(SelectedDetailDock.Tag.ToString)
        For Each diary As Diary In Diaries
            If diary.Id = Id Then
                Dim Editor As New EditorWindow
                Editor.Diary = diary
                Editor.MotherWindow = Me
                Editor.Show()
            End If
        Next
    End Sub

    Private Sub NewDiaryFormatRadio_Checked(sender As Object, e As RoutedEventArgs) Handles NewDiaryFormatRadio.Checked
        NewFormat = NewDiaryFormatRadio.Content
    End Sub

    Private Sub NewDiaryFormatRadio1_Checked(sender As Object, e As RoutedEventArgs) Handles NewDiaryFormatRadio1.Checked
        NewFormat = NewDiaryFormatRadio1.Content
    End Sub
End Class
