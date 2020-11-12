package Bean;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class UserBean {
	/**
	 * 
	 */
	private int id = -1;
	private String mail = "";
	private String password = "";
	private String nickname = "";
	private String avatar_path = "";
	private boolean state = false;
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	
	public UserBean(String mail, String nickname, String avatar_path,int id) {
		super();
		this.mail = mail;
		this.nickname = nickname;
		this.avatar_path = avatar_path;
		this.id = id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getNickname() {
		return nickname;
	}
	public int getId() {
		return id;
	}
	public String getAvatar_path() {
		return avatar_path;
	}
	public void setAvatar_path(String avatar_path) {
		this.avatar_path = avatar_path;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public boolean isState() {
		return state;
	}
	public void setState(boolean state) {
		this.state = state;
	}
	
	public static UserBean getUser(String userId) {
		return null;//
	}
	
	public static UserBean getUserByMail(String mailAddr) {
		if(mailAddr==null) return null;
		String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select * from user where mail = '" + mailAddr+"'";
			ResultSet rs = statement.executeQuery(sql);
			int count = 0;
			String mail = "";
			String nickname = "";
			String avatar_path = "";
			int id = -1;
			while (rs.next()) {
				count++;
				mail = rs.getString("mail");
				nickname = rs.getString("nickname");
				avatar_path = rs.getString("avatar_path");
				id = rs.getInt("id");
			}
			rs.close();
			statement.close();
			conn.close();
			if(count==1) {
				return new UserBean(mail,nickname,avatar_path,id);
			}
			else return null;
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static UserBean getUserById(int userId) {
		String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select * from user where id = " + userId +"";
			ResultSet rs = statement.executeQuery(sql);
			int count = 0;
			String mail = "";
			String nickname = "";
			String avatar_path = "";
			int id = -1;
			while (rs.next()) {
				count++;
				mail = rs.getString("mail");
				nickname = rs.getString("nickname");
				avatar_path = rs.getString("avatar_path");
				id = rs.getInt("id");
			}
			rs.close();
			statement.close();
			conn.close();
			if(count==1) {
				return new UserBean(mail,nickname,avatar_path,id);
			}
			else return null;
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
