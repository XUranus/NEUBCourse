import java.io.*;
import java.net.*;
import java.util.*;

public class ClientThread extends Thread {
	private Socket client;
	private String F_DIR;//用户目录
	private BufferedReader reader;
	private PrintWriter writer;
	private User user;
	private String workingDIR;
	private ServerSocket dataTransSocket;
	
	public ClientThread(Socket socket,String F_DIR) {
		client = socket;
		this.F_DIR = F_DIR;
		reader = null;
		writer = null;
		workingDIR = F_DIR;
		dataTransSocket = null;
	}

	public void run() {
		try {
			reader = new BufferedReader(new InputStreamReader(client.getInputStream()));
			writer = new PrintWriter(new OutputStreamWriter(client.getOutputStream()));
			String command = "";
			boolean flag =true;
			
			while (flag) {
				command = reader.readLine();
				if (command.equalsIgnoreCase("QUIT")) {
					flag = false;
					System.out.println("A Client Connection broken"+client.getInetAddress()+":"+client.getPort());
					break;
				}
				handle(command);	
			}
			System.out.println("A thread released");
			writer.close();
			reader.close();
			client.close();
		} catch (Exception e) {
			System.out.println("Client Thread Error!");
			e.printStackTrace();
		}
	}
	
	//deal with the command
	public void handle(String command) {
		try {
			System.out.println("Get A Command: ["+command+"] from "+client.getInetAddress()+":"+client.getPort());//log
			String response = "deault response";
			String operand = "";
			String parameter = "";
			StringTokenizer st = new StringTokenizer(command);
			if(st.hasMoreTokens()) operand = st.nextToken();
			if(st.hasMoreTokens()) parameter = st.nextToken();
			switch (operand.toUpperCase()) {
				case "USER":
					user = new User(parameter);
					response = "USER :"+parameter+", Entering Password...";
					writer.println(response);
					writer.flush();
					break;
				case "PASS":
					if(user==null) {
						response = "Not Input Username Yet!";
						writer.println(response);
						writer.flush();
						break;
					}
					user.authentication(parameter);
					if(user.isLogged()) 
						response = "Login Successful! "+user.getUserName();
					else response = "Login Failed!";
					writer.println(response);
					writer.flush();
					break;
				case "PASV":
					dataTransSocket =  new ServerSocket(0); //读取空闲的可用端口
					int freePort = dataTransSocket.getLocalPort();
					System.out.println("distributed a data transmissn port:"+freePort+" to "+client.getInetAddress()+":"+client.getPort());
					response = "Passive Mode : Data Transmission Port: "+freePort+" .";
					writer.println(response);
					writer.flush();
					break;
				case "SIZE":
					try {
						String filename = parameter;
						File file = new File(workingDIR+"/"+filename);
						if (file.exists()) {
							response = "File ["+file.getName()+"] Size: "+file.length()+" bytes";
							writer.println(response);
							writer.flush();
						}
						else {
							response = "File Not Exist!";
							writer.println(response);
							writer.flush();
						}
					}
					catch (Exception fileSizeException) {
						fileSizeException.printStackTrace();
					}
					break;
				case "REST"://offset
					response = "Not implement this function yet!";
					writer.println(response);
					writer.flush();
					break;
				case "RETR"://upload
					try {
						String filename = parameter;
						File file = new File(workingDIR+filename);
						if (!file.exists()) {
							if(dataTransSocket==null) {
								response = "Data Transmission Connection Not Bulid Up Yet!";
								writer.println(response);
								writer.flush();
							}
							else {
								try {
									String filepath = workingDIR="upload";
									file = new File(filepath);
									if (!file.exists()) {
										file.mkdir();
									}
									filepath = filepath + "/" +filename;
													
									//clientDataSocket ---file---> dataTransSocket    (socket ->  server) 
									writer.println("Server Port Ready...");
									writer.flush();
									Socket clientDataSocket = dataTransSocket.accept();
									//传送开始
									System.out.println("Receiving ["+filename+"] ...."); //dataSocket -> local
									System.out.println("file ["+filename+"] will be stored in: "+filepath); 
									/*************** transfering part*****************/
									byte[] inputByte = null;  
									int length = 0;
									DataInputStream	dis = new DataInputStream(clientDataSocket.getInputStream());  
									FileOutputStream fos = new FileOutputStream(new File(filepath)); 
											
									inputByte = new byte[1024];     
									System.out.println("transfering bytes...");    
									while ((length = dis.read(inputByte,0,inputByte.length)) > 0) {//io congestion 
										fos.write(inputByte, 0, length); 
										fos.flush();       
									}
									
									System.out.println("Upload Success!");
									dis.close();
									fos.close();
									clientDataSocket.close();
									System.out.println("Client Data Port Closed!");
								} catch (Exception receiveFileException) {
									receiveFileException.printStackTrace();
								}
							}	
						}
						else {
							response = "File has Exist in Server::"+workingDIR+filename;//上传文件和工作目录不能重名
							writer.println(response);
							writer.flush();
						}
					}
					catch (Exception fileUploadException) {
						fileUploadException.printStackTrace();
					}
					break;
				case "STOR"://download
					try {
						String filename = parameter;
						File file = new File(workingDIR+"/"+filename);
						if (file.exists()) {
							if(dataTransSocket==null) {
								response = "Data Transmission Connection Not Bulid Up Yet!";
								writer.println(response);
								writer.flush();
							}
							else {
								response = "File ["+file.getName()+"] Size: "+file.length()+" bytes, Ready to download....";
								writer.println(response);
								writer.flush();
								
								Socket clientDataSocket = dataTransSocket.accept();
								System.out.println(reader.readLine());//"Client Port Ready..."
								
								//Transfer start...
								int length = 0;  
								double sumL = 0 ;  
								byte[] sendBytes = null;  
								boolean bool = false;
								long l = file.length();   
								DataOutputStream dos = new DataOutputStream(clientDataSocket.getOutputStream());  
								FileInputStream fis = new FileInputStream(file);        
								sendBytes = new byte[1024];    
								while ((length = fis.read(sendBytes, 0, sendBytes.length)) > 0) {  
									sumL += length;    
									System.out.println("已传输："+((sumL/l)*100)+"%");  
									dos.write(sendBytes, 0, length);  
									dos.flush();  
								}   
								//虽然数据类型不同，但JAVA会自动转换成相同数据类型后在做比较  
								if(sumL==l){  
									bool = true;  
								}  
								//FileTransfer(dataTransSocket,client,file); dataTransSocket ---file---> clientDataSocket    (Sever ->  socket) 
								System.out.println("Transfer Success!");
								dos.close();
								fis.close();
								clientDataSocket.close();
								System.out.println("Client Data Port Closed!");
							}	
						}
						else {
							System.out.println("request File ["+workingDIR+"/"+filename+"] not exists!");
							response = "File Not Exist!";
							writer.println(response);
							writer.flush();
						}
					}
					catch (Exception fileDownloadException) {
						fileDownloadException.printStackTrace();
					}
					break;
					
				case "CWD":
					response = "Working Directory Changed: ";
					try {
						File f = new File(workingDIR+parameter);
						if(f.isDirectory()) {
							response = "Working Directory Changed: "+workingDIR+parameter;
							workingDIR = workingDIR+parameter;
						}
						else {
							response = "No Such Directory! Current Rirectory: "+workingDIR;
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
					writer.println(response);
					writer.flush();
					break;
					
				case "LIST"://LIST  列出工作目录下文件信息：文件大小 创建时间 文件名称
					String curDIR = parameter;
					response = "";
					try {
						response = "Files in Directory: "+workingDIR;
						writer.println(response);
						writer.flush();
						File file = new File(workingDIR+curDIR);
						File[] fileList = file.listFiles();
						for (int i = 0; i < fileList.length; i++) {
							if (fileList[i].isFile()) {//判断是否为文件
								writer.println(fileList[i].getName());
								writer.flush();
							 }
						}
						for (int i = 0; i < fileList.length; i++) {
							if (fileList[i].isDirectory()) {//判断是否为文件夹
								writer.println("/"+fileList[i].getName());
								writer.flush();
							}
						}
						response = "/..";
						writer.println(response);
						writer.flush();
					} catch (Exception listException) {
						listException.printStackTrace();
						response = "Directory ["+curDIR+"] Not Found!";
					}
					writer.println(response);
					writer.flush();
					break;
				default://没有匹配的操作符，二次验证
					response = "Operands Error Occured!";
					break;
			}
		}
		catch (Exception e) {
			System.out.println("Response Failed");
			e.printStackTrace();
		}
		
	}
}
