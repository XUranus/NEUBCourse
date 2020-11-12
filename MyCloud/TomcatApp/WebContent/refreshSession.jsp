<%@ page contentType="text/html; charset=UTF-8" import="java.sql.*,Bean.UserBean,Bean.Config"%>
<% request.setCharacterEncoding("UTF-8");%>
<%
		String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();//need to be modified
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			String mail ="";
			String nickname = "";
			String avatar_path = "";
			int count = 0;
			int userID = -1;

			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select * from user where id = " + session.getAttribute("USERID");
			ResultSet rs = statement.executeQuery(sql);//执行查询
			//添加删除修改 使用 executeUpdate  只返回0/1 或影响的行数
			while (rs.next()) {
				count ++;
				userID = rs.getInt("ID");
				nickname = rs.getString("nickname");
				avatar_path = rs.getString("avatar_path");
			}
			rs.close();
			statement.close();
			conn.close();
			if(count==1){
				session.setAttribute("USERID",userID);
				UserBean user_now = new UserBean(mail,nickname,avatar_path,userID);
				session.setAttribute("user_now",user_now);
			 	out.println("<script>history.back(-1)</script>");
			}else{
				out.println("<script>alert('sync JSESSION error!')</script>");
			}
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	%>
