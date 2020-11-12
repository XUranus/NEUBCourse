package Bean;

import java.sql.*;

public class ShareBean {
	private String token;
	private FileBean file;
	private UserBean uploader ;
	
	public ShareBean(String token) {
		this.token = token;
		if(token==null) {
			file = null;
			uploader = null;
			return;
		}
		else {
			this.file = getFileByToken(token);
			if(file==null) 
				this.uploader = null;
			else 
				this.uploader = UserBean.getUserById(file.getUploaderId());
		}
	}
	
	public boolean isValid(String token) {
		return (file!=null);
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public FileBean getFile() {
		return file;
	}

	public void setFile(FileBean file) {
		this.file = file;
	}

	public UserBean getUploader() {
		return uploader;
	}

	public void setUploader(UserBean uploader) {
		this.uploader = uploader;
	}
	
	public String getTime(String token) {
		Timestamp time = null;
		if(token==null) return null;
    	String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select time from share where token = '"+token+"'";
			ResultSet rs = statement.executeQuery(sql);
			int count = 0;
			while (rs.next()) {
				count++;
				time = rs.getTimestamp("time");
			}
			rs.close();
			statement.close();
			conn.close();
			if(count==0) return null;
		} catch (ClassNotFoundException e) {
			System.out.println("Sorry,can`t find the Driver!");
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		if(time==null) return null;
		else return time.toString();
	}
	
	public static FileBean getFileByToken(String token) {
		if(token==null) return null;
    	String driver = "com.mysql.jdbc.Driver";
		String url = Config.getMySQLUrl();
		String user = Config.getMySQLUserName();
		String sqlPassword = Config.getMySQLPassword();
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, user, sqlPassword);
			Statement statement = conn.createStatement();
			String sql = "select * from file"
					+ " where id in "
					+ "(select file_id from share where token = '"+ token +"') "
					+ " and not in_dustbin";
			ResultSet rs = statement.executeQuery(sql);
			String name = "";
			String link = "";
			int uploader_id = -1;
			int count = 0;
			String format = "";
			while (rs.next()) {
				count++;
				name = rs.getString("name");
				link = rs.getString("actual_path");
				uploader_id = rs.getInt("uploader_id");
				format = rs.getString("format");
			}
			rs.close();
			statement.close();
			conn.close();
			if(count==1) return new FileBean(name,link,uploader_id,format);
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
	
	public static boolean deleteToken(String token) {
    	String sql = "delete from share where token = '" + token + "'";
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
	
}
