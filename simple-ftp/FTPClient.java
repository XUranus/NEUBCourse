import java.net.*;
import java.io.*;
import java.util.*;
import java.text.*;

/*
|----------------------------|
|    this is FTP Client      |
|        by XUranus          |
| https://github.com/XUranus |
|----------------------------|
*/

public class FTPClient {
	/*******     Configuation    ******/
	private static int PORT;
	private static String IP;
	private static String PATH;
	
	private static BufferedReader reader;
	private static PrintWriter writer;
	private static Socket socket;
	
	private static Socket dataSocket;
	private static int dataPort;
	private static File uploadingFile;
	
	public static boolean loadConfig() {
		BufferedReader in = null;
		try {
			in = new BufferedReader(new FileReader(new File("client.config")));
			PORT = Integer.parseInt(in.readLine().split(" ")[1]);
			IP = in.readLine().split(" ")[1];
			PATH = in.readLine().split(" ")[1];
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	//Judge if the command is valid or not
	public static boolean isValidCommand(String command) {
		if (command.equals("")||command==null) 
			return false;
		command = command.toUpperCase();
		if(command.startsWith("RETR")) {
			StringTokenizer st = new StringTokenizer(command," ");
			st.nextToken();
			String filename = st.nextToken();
			uploadingFile = new File(PATH+"/"+filename);
			if(!uploadingFile.exists()) {
				System.out.println("Local file ["+filename+"] not exist!");
				return false;
			}
		}
		if(command.startsWith("USER")||command.startsWith("PASS")||command.startsWith("PASV")||command.startsWith("SIZE")||command.startsWith("RESET")||command.startsWith("RETR")||command.startsWith("STOR")||command.startsWith("QUIT")||command.startsWith("CWD")||command.startsWith("LIST"))
			return true;
		return false;
	}
	
	
	public static void main(String[] args) {
		if (loadConfig()) {
			System.out.println("FTP Server starting...");
		}
		else {
			System.out.print("Client Config Load Error , Client broken down.");
			return;
		}
		try {
			String response = "";
			String command = "";
			String user = "GUEST";
			//Socket Connection Setup
			System.out.println("Welcome To FTP service!\nConnecting to Server:...");
			socket = new Socket(IP,PORT);
			System.out.println("Connect Success!\n"+"server IP: "+IP+"  server PORT: "+PORT+"\nDefault Download Path: "+PATH+"\n");
			reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			writer = new PrintWriter(new OutputStreamWriter(socket.getOutputStream()));
			BufferedReader input = new BufferedReader(new InputStreamReader(System.in));
			
			System.out.print("["+new Date()+"]"+"["+user+"]"+" ~ ");
			command = input.readLine();
			while (!(command.toUpperCase().equals("QUIT"))) {
				if(isValidCommand(command)) {					
					writer.println(command);
					writer.flush();
					response = reader.readLine();
					if(response.startsWith("Login Successful!")) {//USER PASS
						StringTokenizer st = new StringTokenizer(response," ");
						user = st.nextToken();user = st.nextToken();user = st.nextToken();
					}
					if (response.startsWith("Passive Mode : Data Transmission Port: ")) {//PSW
						String s= response;
						String pre="Passive Mode : Data Transmission Port: ";
						String suf=" .";
						dataPort = Integer.parseInt(s.substring((s.indexOf(pre)+pre.length()), s.indexOf(suf)));
					}
					System.out.println("@Server: " + response);
				
					if(response.startsWith("Files in Directory: ")) {//LIST
						String filename = "";
						ArrayList<String> files = new ArrayList<String>();
						
						while(!(filename = reader.readLine()).equals("/..")) 
							files.add(filename);
							//System.out.println(filename);
						//System.out.println("/..");
						files.add("/..");
						int i=0;
						while(i+2<files.size()) {
							System.out.printf("%-40s%-40s%-40s\n",files.get(i),files.get(i+1),files.get(i+2));
							i+=3;
						}
						for(int j=i;j<files.size();j++ ) System.out.printf("%-30s",files.get(j));
						System.out.println();
						reader.readLine();
					}
					
					
					//Download file
					if(response.endsWith("Ready to download....")) { //接收到服务器确认 打开端口 准备开始接受 
						try {
							String s= response;
							String pre="[";
							String suf="]";
							String filename = s.substring((s.indexOf(pre)+pre.length()), s.indexOf(suf));
							//get length
							pre="Size: ";
							suf=" bytes";
							int filelength = Integer.parseInt(s.substring((s.indexOf(pre)+pre.length()), s.indexOf(suf)));
							
							String filepath = PATH;
							File file = new File(filepath);
							if (!file.exists()) {
								file.mkdir();
							}
							filepath = filepath + "/" +filename;
							
							//创建接收文件名
							dataSocket = new Socket(IP,dataPort);//数据端口开启
							writer.println("Client Port Ready...");
							writer.flush();
							//传送开始
							System.out.println("Download ["+filename+"] begin...."); //dataSocket -> local
							System.out.println("file ["+filename+"] will be stored in: "+filepath); 
							/*************** transfering part*****************/
							byte[] inputByte = null;  
							int length = 0;
							DataInputStream	dis = new DataInputStream(dataSocket.getInputStream());  
							FileOutputStream fos = new FileOutputStream(new File(filepath)); 
							
							inputByte = new byte[1024];     
							System.out.println("transfering bytes... ");   
							//bar *********************************
							int transferByte = 0;
							double rate = 0;
							String bar = "";
							while ((length = dis.read(inputByte,0,inputByte.length)) > 0) {//io congestion 
							
								transferByte+=length;
								double newrate = (double)(transferByte*100.0/filelength);
								if(newrate-rate>=1) {
									for(int j=0;j<bar.length();j++) System.out.print("\b");
									bar="Progress: "+new DecimalFormat("#.00").format(newrate)+"% [";
									for(int j=1;j<=100;j++) 
										if(newrate<=j)
											bar+=" ";
										else bar+="=";
									bar+="]";
									System.out.print(bar);
									rate = newrate;
									Thread.sleep(10);
								}
								
								fos.write(inputByte, 0, length); 
								fos.flush();       
							}
							/*************************************************/	
							for(int j=0;j<bar.length();j++) System.out.print("\b");
							bar="Progress: 100% [";
							for(int j=1;j<=100;j++) bar+="=";
							bar+="]";
							System.out.print(bar);
							
							System.out.println("\nDownload Accomplished!");
							dis.close();
							fos.close();
							dataSocket.close();
						} catch (Exception fileFetchException) {
							fileFetchException.printStackTrace();
						}
					}
					
					if (response.endsWith("Server Port Ready...")) { //Upload files
						try {
							dataSocket = new Socket(IP,dataPort);//数据端口开启
							
							
							/****************************************/		
							int length = 0;  
							double sumL = 0 ;  
							byte[] sendBytes = null;  
							boolean bool = false;
							long l = uploadingFile.length();   
							DataOutputStream dos = new DataOutputStream(dataSocket.getOutputStream());  
							FileInputStream fis = new FileInputStream(uploadingFile);        
							sendBytes = new byte[1024];  
							System.out.print("Uploaded: ");
							String bar = "";
							while ((length = fis.read(sendBytes, 0, sendBytes.length)) > 0) {  
								sumL += length;    
								for (int j = 0; j < bar.length(); j++) {
									System.out.print("\b");
								}
								//System.out.println("已传输："+((sumL/l)*100)+"%");  
								// Progress Bar
								int i = (int)((sumL/l)*100);
								bar = i+"% ";
								bar +="[";
								for(int j=1;j<=100;j++) {
									if(j<=i) bar += "=";
									else bar+=" ";
								}
								bar +="]"; 
								System.out.print(bar);
								Thread.sleep(100);
								//
								dos.write(sendBytes, 0, length);  
								dos.flush();  
							}   
							if(sumL==l){  
								bool = true;  
							}  
							System.out.println();
							/**************************************/

							System.out.println("Upload Accomplished!");
							fis.close();
							dos.close();
							dataSocket.close();
							
						} catch (Exception fileUploadException) {
							fileUploadException.printStackTrace();
						}
					}
					
				}
				else System.out.println("Invalid Command: "+command);
				System.out.print("["+new Date()+"]"+"["+user+"]"+" ~ ");
				command = input.readLine();
			} 
		
			
			//close connection
			writer.close();
			reader.close();
			socket.close();
			System.out.println("\nConnection Closed\nFTP Service Exit");
		} 
		catch (Exception e) {
			System.out.println("Cannot Connnect to Server :");
			e.printStackTrace();
		}
	}
}