import java.io.*;
import java.net.*;
import java.util.*;

/*
|----------------------------|
|    this is FTP Server      |
|        by XUranus          |
| https://github.com/XUranus |
|----------------------------|
*/

public class FTPServer {
	//Define Configuation 
	private static int PORT;
	public static String F_DIR;
	
	public static boolean loadConfig() {
		BufferedReader in = null;
		try {
			in = new BufferedReader(new FileReader(new File("server.config")));
			PORT = Integer.parseInt(in.readLine().split(" ")[1]);
			F_DIR = in.readLine().split(" ")[1];
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public static void main(String[] args) {
		try {
			ServerSocket serverSocket = null;
			if (loadConfig()) {
				serverSocket = new ServerSocket(PORT);
				System.out.println("FTP Server Running...");
				System.out.println("Command Port: "+PORT+"\nDocument root: "+F_DIR);
			}
			else {
				System.out.println("Config Load Error, Server broken Down.");
				return;
			}
			while (true) {
				Socket client = serverSocket.accept();
				new ClientThread(client,F_DIR).start();
				System.out.println("A Client Connected: "+client.getInetAddress()+":"+client.getPort());
			}
		} catch (Exception e) {
			System.out.println("An Serious Error Occured!");
			e.printStackTrace();
		}
	}
}

