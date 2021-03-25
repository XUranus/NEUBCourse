Imports System.Data.SQLite
Imports System.Threading
Public Class ContactsWindow

    Public Contacts As ArrayList
    Public UserData As UserData

    Private Sub Window_Loaded(sender As Object, e As RoutedEventArgs)
        Dim Contact As Contact
        For Each Contact In Contacts
            Add_New_Contact_To_ListBox(Contact.Name)
        Next
    End Sub

    Private Sub ListView_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)
        '显示选中的人的详情信息
        Dim Selected_Name As String = Get_Selected_Name()
        Dim Contact As Contact
        For Each Contact In Contacts
            If Contact.Name = Selected_Name Then
                DetailMail.Text = Contact.Mail
                DetailNameLabel.Content = Contact.Name
                DetailPhone.Text = Contact.Phone
                Return
            End If
        Next
        'MsgBox(Selected_Name)
    End Sub

    Private Sub Add_New_Contact_To_ListBox(ByVal name As String)
        '往列表中添加新的一项
        Me.Dispatcher.Invoke(
            Function()
                Dim PathTemplate As Path = New Path
                PathTemplate.Data = New GeometryConverter().ConvertFromString("M6,17C6,15 10,13.9 12,13.9C14,13.9 18,15 18,17V18H6M15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6A3,3 0 0,1 15,9M3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3H5C3.89,3 3,3.9 3,5Z")
                PathTemplate.Fill = New BrushConverter().ConvertFromString("Black")
                Dim CanvasTemplate As Canvas = New Canvas
                CanvasTemplate.Width = 24
                CanvasTemplate.Height = 24
                CanvasTemplate.Children.Add(PathTemplate)
                Dim ViewBoxTemplate As Viewbox = New Viewbox
                ViewBoxTemplate.Child = CanvasTemplate
                ViewBoxTemplate.Width = 48
                ViewBoxTemplate.Height = 48
                Dim NewPanel As WrapPanel = New WrapPanel
                NewPanel.Children.Add(ViewBoxTemplate)
                Dim Label1 As Label = New Label()
                Label1.Content = name
                Label1.FontSize = 20
                NewPanel.Children.Add(Label1)
                ContactsListBox.Items.Add(NewPanel)
                Return 0
            End Function)
    End Sub

    Private Function Get_Selected_Name() As String
        Try
            Dim elements As UIElementCollection = ContactsListBox.SelectedItem.Children
            Dim element As UIElement
            For Each element In elements
                If element.GetType.ToString.EndsWith("Label") Then
                    Dim label As Label = element
                    Return label.Content
                End If
            Next
        Catch er As Exception
            'nothing
        End Try
        Return ""
    End Function

    Private Sub Button_Click(sender As Object, e As RoutedEventArgs)
        '添加电话项目
        '可以输入多组电话 有机会拓展
    End Sub

    Private Sub Button_Click_1(sender As Object, e As RoutedEventArgs)
        '保存/修改联系人
        '表单验证还没写
        Dim Name As String = NameTextBox.Text
        Dim Mail As String = MaillTextBox.Text
        Dim Phone As String = PhoneTextBox.Text

        Dim thread As New Thread(
         Sub()
             '判断是否存在
             Dim NewContact As Contact = New Contact
             NewContact.Name = Name
             NewContact.Mail = Mail
             NewContact.Phone = Phone
             Dim temp As Contact
             For Each temp In Contacts
                 If temp.Name = NewContact.Name Then
                     MessageBox.Show(temp.Name + " 已存在！")
                     Return
                 End If
             Next
             Contacts.Add(NewContact)

             Dim Conn = SQLConnection.NewConn()
             Try
                 Dim Query As String = "insert into contact (name,mail,phone,belong) values ('" + Name + "','" + Mail + "','" + Phone + "','" + UserData.Id.ToString + "')"
                 Dim Command = New SQLiteCommand(Query, Conn)
                 Command.ExecuteNonQuery()
                 Conn.Close()
             Catch ex As Exception
                 MessageBox.Show(ex.Message)
             Finally
                 Conn.Dispose()
             End Try
             '更新数组和ListBox
             Add_New_Contact_To_ListBox(Name)
             MessageBox.Show("添加成功")
         End Sub
        )
        thread.Start()


    End Sub

    Private Sub Button_Click_2(sender As Object, e As RoutedEventArgs)
        '删除联系人
        Dim Conn = SQLConnection.NewConn()
        Dim temp As Contact
        For Each temp In Contacts
            If temp.Name = DetailNameLabel.Content Then
                Contacts.Remove(temp)
                Exit For
            End If
        Next
        ContactsListBox.Items.Clear()
        For Each temp In Contacts
            Add_New_Contact_To_ListBox(temp.Name)
        Next
        ContactsListBox.Items.Refresh()
        Try
            Dim Query As String = "delete from contact where belong = " + UserData.Id.ToString + " and name = '" + DetailNameLabel.Content + "'"
            Dim Command = New SQLiteCommand(Query, Conn)
            Command.ExecuteNonQuery()
            Conn.Close()
        Catch ex As Exception
            MessageBox.Show(ex.Message)
        Finally
            Conn.Dispose()
        End Try

    End Sub
End Class
