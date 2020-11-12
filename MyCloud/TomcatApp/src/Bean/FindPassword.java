package Bean;
import java.sql.*;
import java.util.Random;
public class FindPassword {
	public static boolean mailExist(String mailAddr) {
		String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select * from user where mail = '" + mailAddr+"'";
			ResultSet rs = statement.executeQuery(sql);//执行查询
			//添加删除修改 使用 executeUpdate  只返回0/1 或影响的行数
			int count = 0;
			while (rs.next()) {
				count++;
			}
			rs.close();
			statement.close();
			conn.close();
			if(count>0) return true;
			else return false;
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	
	public static boolean resetPassword(String token,String password) {
		String sql = "update user set password = '"+ password + "' where id in "
				+ "(select user_id from account_token where token = '" + token +"')"; 
		boolean res = excuteSQL(sql);
		deleteToken(token);
		return res;
	}
	
	public static void sendResetPasswordMail(String mail) {
		UserBean user = UserBean.getUserByMail(mail);
		String token = getToken(user);
		createTokenRecord(token,user.getId());
		sendResetPasswordMail(mail,user.getNickname(),"resetPassword.jsp?token="+token,"login.html");
	}
	
	
    public static void sendResetPasswordMail(String mailAddress,String nickname,String resetPasswordLink,String accountLink) {
    	String domain = Config.getDomain();
        String content =
                        "<div style=\"font-family:arial,helvetica;margin:1em 1em 1em 1em ;font-size:10pt; color:#000000;-webkit-box-shadow: #666 0px 0px 10px;-moz-box-shadow: #666 0px 0px 10px;box-shadow: #666 0px 0px 10px;\">\n" +
                        "    <div style=\"margin:2em 2em 2em 2em ;\">\n" +
                        "        <p><br>\n" +
                        "            "+ nickname +"，您好：<br><br>\n" +
                        "            您最近为您的 MyCloud 账户提出了密码重设请求。要完成此过程，请点按以下链接。<br><br>\n" +
                        "            <a href='"+resetPasswordLink+"'>"+ domain + resetPasswordLink +"</a><br><br>\n" +
                        "            如果您未提出此请求，可能是其他用户无意中输入了您的电子邮件地址，您的帐户仍然安全。如果您怀疑有未经授权的人员访问了您的帐户，您应尽快前往您的 <a href=\""+accountLink+"\">MyCloud 帐户页面</a>更改您的密码。<br><br>\n" +
                        "            此致<br><br>\n" +
                        "            MyCloud 支持<br><br>\n" +
                        "        </p>\n" +
                        "    </div>\n" +
                        "</div>";
        
        String title = "重设MyCloud密码";
        MailService mailThread = new MailService(title,content,mailAddress);
        mailThread.start();
    }
    
    public static String getToken(UserBean user) {
        Random random = new Random(100);
    	double random_num = Math.abs(random.nextInt());
    	String token = Cipher.MD5(random_num+"boy next door");
    	while(tokenExist(token)) 
    		token = Cipher.MD5(token);
		return token;
    }
    
    public static boolean deleteToken(String token) {
    	String sql = "delete from account_token where token = '" + token + "'";
    	return excuteSQL(sql);
    }
    
    public static boolean tokenExist(String token) {
    	String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select * from account_token where token = '" + token+"'";
			ResultSet rs = statement.executeQuery(sql);
			int count = 0;
			while (rs.next()) {
				count++;
			}
			rs.close();
			statement.close();
			conn.close();
			if(count>0) return true;
			else return false;
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
    }
    
    public static boolean createTokenRecord(String token,int user_id) { //insert update delete
		String sql = "insert into account_token (user_id,token) values ("+user_id+",'"+ token +"')";
		return excuteSQL(sql);
    }
    
    public static boolean excuteSQL(String sql) {
    	String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			boolean rs = statement.execute(sql);
			statement.close();
			conn.close();
			return rs;
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
    }
    
    //public User
}
