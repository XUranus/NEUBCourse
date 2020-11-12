import java.util.*;
import java.io.*;

public class User {
	private String name;
	private String password;
	private boolean logged;
	
	public User(String name) {
		this.name = name;
		password = null;
		logged = false;
	}
		
	public String getUserName() {
		return name;
	}
	
	public boolean isLogged() {
		return logged;
	}
	
	//@override
	public boolean authentication(String password) {		
		BufferedReader in = null;
		try {
			in = new BufferedReader(new FileReader(new File("userList.dat")));
			String record = "";
			while ((record=in.readLine())!=null) {
				if(name.equals(record.split(" ")[0])) {
					if(password.equals(record.split(" ")[1])) {
						in.close();
						logged = true;
						return true;
					}
					else {
						in.close();
						logged = false;
						return false;
					}
				}
			}
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
			logged =false;
			return false;
		}
		logged = false;
		return false;
	}
}