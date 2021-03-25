Imports System.Threading
Imports System.Data.SQLite

Public Class AccountWindow
    Public AccountRecords As ArrayList
    Public UserData As UserData

    Private Sub Add_Plus_To_ListBox(ByVal cost As Double, ByVal name As String, ByVal time As String)
        '往列表中添加新的一项 收入
        Dim PathTemplate As Path = New Path
        PathTemplate.Data = New GeometryConverter().ConvertFromString("M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z")
        PathTemplate.Fill = New BrushConverter().ConvertFromString("Indigo")
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
        NewPanel.Tag = time
        Dim Label1 As Label = New Label()
        Label1.Content = "+" + cost.ToString
        Label1.FontSize = 30
        Label1.VerticalAlignment = VerticalAlignment.Center
        NewPanel.Children.Add(Label1)

        Dim Label2 As Label = New Label()
        Label2.Content = name
        Label2.FontSize = 20
        Label2.VerticalAlignment = VerticalAlignment.Center
        NewPanel.Children.Add(Label2)

        Dim Label3 As Label = New Label()
        Label3.Content = time
        Label3.FontSize = 15
        NewPanel.Children.Add(Label3)
        Label3.VerticalAlignment = VerticalAlignment.Bottom
        RecordListBox.Items.Add(NewPanel)
    End Sub

    Private Sub Add_Minus_To_ListBox(ByVal cost As Double, ByVal name As String, ByVal time As String)
        '往列表中添加新的一项 支出
        Dim PathTemplate As Path = New Path
        PathTemplate.Data = New GeometryConverter().ConvertFromString("M3,4.27L4.28,3L21,19.72L19.73,21L16.06,17.33C15.44,18 14.54,18.55 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15H9C9,16.08 10.37,17 12,17C13.13,17 14.14,16.56 14.65,15.92L11.68,12.95C9.58,12.42 7,11.75 7,9C7,8.77 7,8.55 7.07,8.34L3,4.27M10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C11.63,7 11.28,7.05 10.95,7.13L9.4,5.58L10.5,5.18Z")
        PathTemplate.Fill = New BrushConverter().ConvertFromString("Red")
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
        NewPanel.Tag = time
        Dim Label1 As Label = New Label()
        Label1.Content = cost.ToString
        Label1.FontSize = 30
        Label1.VerticalAlignment = VerticalAlignment.Center
        NewPanel.Children.Add(Label1)

        Dim Label2 As Label = New Label()
        Label2.Content = name
        Label2.FontSize = 20
        Label2.VerticalAlignment = VerticalAlignment.Center
        NewPanel.Children.Add(Label2)

        Dim Label3 As Label = New Label()
        Label3.Content = time
        Label3.FontSize = 15
        NewPanel.Children.Add(Label3)
        Label3.VerticalAlignment = VerticalAlignment.Bottom
        RecordListBox.Items.Add(NewPanel)
    End Sub

    Private Function Get_Selected_Name() As String
        Try
            Dim elements As UIElementCollection = RecordListBox.SelectedItem.Children
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

    Private Sub ListView_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)
        Try
            Dim Cost As Double = 0
            Dim Name As String = ""
            Dim Count As Integer = 1
            Dim DateCreated As String = RecordListBox.SelectedItem.Tag
            Dim SelectedPanel As WrapPanel = RecordListBox.SelectedItem
            Dim elementUI As UIElement
            Dim collection As UIElementCollection = SelectedPanel.Children
            For Each elementUI In collection
                If elementUI.GetType.ToString.EndsWith("Label") Then
                    Dim Label1 As Label = elementUI
                    If Count = 1 Then
                        Cost = Double.Parse(Label1.Content)
                        Count = Count + 1
                    ElseIf Count = 2 Then
                        Name = Label1.Content
                        Set_Detail_Panel(Cost, DateCreated, Name)
                        Return
                    End If

                End If
            Next
        Catch ex As Exception
            'nothing
        End Try
    End Sub

    Private Sub Set_Detail_Panel(ByVal Cost, ByVal DateCreated, ByVal Name)
        If (Cost >= 0) Then
            DetailedIconDate.Data = New GeometryConverter().ConvertFromString("M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z")
            DetailedIconDate.Fill = New BrushConverter().ConvertFromString("Indigo")
        Else
            DetailedIconDate.Data = New GeometryConverter().ConvertFromString("M3,4.27L4.28,3L21,19.72L19.73,21L16.06,17.33C15.44,18 14.54,18.55 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15H9C9,16.08 10.37,17 12,17C13.13,17 14.14,16.56 14.65,15.92L11.68,12.95C9.58,12.42 7,11.75 7,9C7,8.77 7,8.55 7.07,8.34L3,4.27M10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C11.63,7 11.28,7.05 10.95,7.13L9.4,5.58L10.5,5.18Z")
            DetailedIconDate.Fill = New BrushConverter().ConvertFromString("Red")
        End If
        DetailedCostLabel.Content = Cost
        DetailedCostDateLabel.Content = DateCreated
        DetailedCostNameLabel.Content = Name

    End Sub

    Private Sub Button_Click(sender As Object, e As RoutedEventArgs)
        '提交添加新记录
        Dim Cost As Double = Double.Parse(CostTextBox.Text)
        If (Cost >= 0) Then
            Add_Plus_To_ListBox(Cost, ContentTextBox.Text, DateCurrentLabel.Content)
        ElseIf (Cost < 0) Then
            Add_Minus_To_ListBox(Cost, ContentTextBox.Text, DateCurrentLabel.Content)
        End If
        Add_Update_AccountRecords(Cost, ContentTextBox.Text, DateCurrentLabel.Content)
    End Sub

    Private Sub Add_Update_AccountRecords(ByVal Cost, ByVal Content, ByVal Time)
        Dim Record As AccountRecord = New AccountRecord
        Record.Content = Content
        Record.Cost = Cost
        Record.DateCreated = Time
        AccountRecords.Add(Record)
        Refresh_Statistic_Panel()
        Dim thread As New Thread(
        Sub()

            Dim Conn = SQLConnection.NewConn()
            Try
                Dim Query As String = "insert into account (content,cost,date,belong) values ('" + Content + "'," + Cost.ToString + ",'" + Time + "'," + UserData.Id.ToString + ")"
                ' MsgBox(Query)
                Dim Command = New SQLiteCommand(Query, Conn)
                Command.ExecuteNonQuery()
                Conn.Close()
            Catch ex As Exception
                MessageBox.Show(ex.Message)
            Finally
                Conn.Dispose()
            End Try
            '更新数组和ListBox

            MessageBox.Show("添加成功")
        End Sub
       )
        thread.Start()
    End Sub

    Private Sub Refresh_Statistic_Panel()
        Dim Left As Double = 0
        Dim Consume As Double = 0
        Dim Gain As Double = 0
        Dim temp As AccountRecord
        For Each temp In AccountRecords
            If temp.Cost >= 0 Then
                Gain = Gain + temp.Cost
            Else
                Consume = Consume + temp.Cost
            End If
            Left = Left + temp.Cost
        Next
        LeftMoneyTextBox.Text = Left.ToString
        InBoundsTextBox.Text = Gain.ToString
        OutBoundsTextBox.Text = Consume.ToString
    End Sub


    Private Sub Window_Loaded(sender As Object, e As RoutedEventArgs)
        Init()
    End Sub

    Private Sub Init()
        Me.Dispatcher.Invoke(Function()
                                 RecordListBox.Items.Clear()
                                 DateCurrentLabel.Content = Date.Today.ToString
                                 Dim Record As AccountRecord
                                 For Each Record In AccountRecords
                                     If (Record.Cost >= 0) Then
                                         Add_Plus_To_ListBox(Record.Cost, Record.Content, Record.DateCreated)
                                     Else
                                         Add_Minus_To_ListBox(Record.Cost, Record.Content, Record.DateCreated)
                                     End If
                                 Next
                                 Refresh_Statistic_Panel()
                                 Return 0
                             End Function
            )
    End Sub


    Private Sub Button_Click_1(sender As Object, e As RoutedEventArgs)
        '删除一条记录
        Dim Cost As Double = Double.Parse(DetailedCostLabel.Content)
        Dim Time As String = DetailedCostDateLabel.Content
        Dim Content As String = DetailedCostNameLabel.Content

        Dim thread As New Thread(
       Sub()
           Dim Conn = SQLConnection.NewConn()
           Try
               Dim Query As String = "delete from account where content = '" + Content + "' and cost = " + Cost.ToString + " and date = '" + Time + "' and belong = " + UserData.Id.ToString
               'MsgBox(Query)
               Dim Command = New SQLiteCommand(Query, Conn)
               Command.ExecuteNonQuery()
               Conn.Close()
           Catch ex As Exception
               MessageBox.Show(ex.Message)
           Finally
               Conn.Dispose()
           End Try
           Dim temp As AccountRecord
           For Each temp In AccountRecords
               If temp.Content = Content AndAlso temp.Cost = Cost AndAlso temp.DateCreated = Time Then
                   AccountRecords.Remove(temp)
                   Exit For
               End If
           Next
           MessageBox.Show("删除成功")
           Init()
       End Sub
      )
        thread.Start()
    End Sub
End Class
