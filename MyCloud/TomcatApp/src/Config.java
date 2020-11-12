

public class Config {
	//MySQL Config
	private static String mysql_url = "jdbc:mysql://localhost:3306/MyCloud?useSSL=false";//need to be modified
	private static String mysql_username = "root";
	private static String mysql_password = "password";
	
	//Mail Config
	private static String mail_sender  = "1363775144@qq.com"; //寄件人
    private static String mail_host = "smtp.qq.com"; //QQ smtp服务
    private static String mail_key = "pqnsefwwwnxufdjf"; //授权码
    
    //Server Url Config
    private static String domain = "http://localhost:8080/MyCloud/";
    private static String file_domain = "http://localhost:80";
    /*******************************************************************************************************************/
	public static String getFileServerDomain() {
		return file_domain;
	}
    
	public static String getMySQLUrl() {
		return mysql_url;
	}
	
	public static String getMySQLUserName() {
		return mysql_username;
	}
	
	public static String getMySQLPassword() {
		return mysql_password;
	}
	
	public static String getMailHost() {
		return mail_host;
	}
	
	public static String getMailSender() {
		return mail_sender;
	}
	
	public static String getMailKey() {
		return mail_key;
	}
	
	public static String getDomain() {
		return domain;
	}
	
}
