import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Scanner;
import java.io.*;
import java.util.*;
import java.text.*;


class HTTPClinet {
	
	private static int port= 8888;// SERVER_PORT Config
	private static String address = "localhost";//SERVER_IP Config
	private static String PATH = "/Users/mac/Desktop";//save download

	public static void main(String[] args) {
		Socket s=null;
		try {                                  
			System.out.println("请输入你要得到的文件：");
			Scanner scanner=new Scanner(System.in);
			String filename=scanner.next();
			//连接服务器
			s=new Socket(address,port);
			//发送请求头
			PrintStream writer=new PrintStream(s.getOutputStream());
			writer.println("GET /"+filename+" HTTP/1.1");
			writer.println("Host:localhost");
			writer.println("connection:keep-alive");
			writer.println();
			writer.flush();
			//发送请求体                                             
			//接受响应状态  响应成功（状态吗200）--保存资源到本地磁盘
			//跳过响应中的前四行，开始读取相应的数据
			InputStream in=s.getInputStream();
			BufferedReader reader=new BufferedReader(new InputStreamReader(s.getInputStream()));
			String firstLineOfResponse=reader.readLine();//HTTP/1.1 200  ok
			String secondLineOfResponse=reader.readLine();
			String threeLineOfResponse=reader.readLine();
			String fourLineOfResponse=reader.readLine();
			System.out.println("\n"+firstLineOfResponse);
			System.out.println(secondLineOfResponse);
			System.out.println(threeLineOfResponse);
			System.out.println(fourLineOfResponse);
			
			StringTokenizer st = new StringTokenizer(firstLineOfResponse," ");
			st.nextToken();
			String code = st.nextToken();
			if(!code.equals("200")) {
				if(code.equals("404")) {
					System.out.println("File not Found!");
					return;
				}
				//响应失败，（状态404）-将响应信息打印在控制台上
				//output error message
				StringBuffer result = new StringBuffer();
				String line;
				while ((line=reader.readLine())!=null) {
					result.append(line+"\n");
				}
				reader.close();
				writer.close();
				s.close();
				System.out.println("Tranfer Failed\n");
				System.out.println(result);
				return;
			}
			
			int fileLength = Integer.parseInt(threeLineOfResponse.split(":")[1]);//filelength
			
			//success
			System.out.println("File transfer start");
			//读取响应文件，保存数据
			byte[] b=new byte[1024];
			OutputStream out=new FileOutputStream(PATH+"/"+filename);
			System.out.println("file will save at: "+PATH+"/"+filename);
			//bar start 
			String bar = "";
			double rate = 0;
			int transferByte = 0;
			int len=in.read(b);
			while(len!=-1){
				transferByte+=len;
				double newrate = (double)(transferByte*100.0/fileLength);
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
				out.write(b,0,len);
				len=in.read(b);
			}
			for(int j=0;j<bar.length();j++) System.out.print("\b");
			bar="Progress: 100% [";
			for(int j=1;j<=100;j++) bar+="=";
			bar+="]";
			System.out.print(bar);

			//bar end
			in.close();
			out.close();
			System.out.println("\n\nFile transfer complete");
			reader.close();
			writer.close();
			s.close();
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
