import java.io.*;
import java.net.Socket;

public class TaskThread extends Thread{
	private Socket s;
	private String DOC_PATH;
	public TaskThread(Socket s,String path) {
		this.s=s;
		DOC_PATH = path;
	}
	
	private void returnNotFound(PrintWriter writer) {
		//File not found
		writer.println("HTTP/1.1 404 Not Found");
		writer.println("Content-type:text/html");
		writer.println("Content-Length:59");
		writer.println();
		writer.print("<h1>404 Not Found</h1><br>Resource Not Found On this Server");
		writer.flush();
	}

	
	public void run() {
		try {
			BufferedReader reader=new BufferedReader(new InputStreamReader(s.getInputStream()));
			PrintWriter writer=new PrintWriter(new OutputStreamWriter(s.getOutputStream()));
			String firstLineOfRequest;
			firstLineOfRequest=reader.readLine();//得到客户端发送的第一行数据
			System.out.println("firstLineRequest:"+firstLineOfRequest);
			String uri=firstLineOfRequest.split(" ")[1];
			if (new File(DOC_PATH+uri).isDirectory()) {
				if(!uri.endsWith("/")) uri +="/index";
				else uri+="index";
				if(new File(DOC_PATH+uri+".html").exists()) uri+=".html";
				//else if(new File(DOC_PATH+uri+".php").exists()) uri+=".php";
				else {
					System.out.println("["+s.getInetAddress()+":"+s.getPort()+"] requests: "+DOC_PATH+uri+" Fail: not support");
					writer.println("HTTP/1.1 404 Not Found");
					writer.println("Content-type:text/plain");
					writer.println("Content-Length:19");
					writer.println();
					writer.print("PHP/JSP Not Support");
					writer.flush();
					return;
				}
			}

			if(!new File(DOC_PATH+uri).exists()) {
				returnNotFound(writer);
				return;
			}
			//根据客户端请求的文件的后缀名发送响应类型
			if(uri.endsWith(".html")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:text/html");
				writer.flush();
			}
			else if(uri.endsWith(".jpg")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:image/jpg");
				writer.flush();
			}
			else if(uri.endsWith(".jpeg")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:image/jpeg");
				writer.flush();
			}
			else if(uri.endsWith(".bmp")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:image/bmp");
				writer.flush();
			}
			else if(uri.endsWith(".gif")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:image/gif");
				writer.flush();
			}
			else if(uri.endsWith(".txt")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:text/css");
				writer.flush();
			}
			else if(uri.endsWith(".css")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:text/css");
				writer.flush();
			}
			else if(uri.endsWith(".scss")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:text/css");
				writer.flush();
			}
			else if(uri.endsWith(".png")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:image/png");
				writer.flush();
			}
			else if(uri.endsWith(".mp4")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:video/mp4");
				writer.flush();
			}
			else if(uri.endsWith(".mp3")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:audio/mpeg");
				writer.flush();
			}
			else if(uri.endsWith(".js")){
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:application/javascript");
				writer.flush();
			}
			else if(uri.endsWith(".php")||uri.endsWith(".php")){
				System.out.println("["+s.getInetAddress()+":"+s.getPort()+"] requests: "+DOC_PATH+uri+" Fail: not support");
				writer.println("HTTP/1.1  404 Not Found");
				writer.println("Content-type:text/plain");
				writer.println("Content-Length:19");
				writer.println();
				writer.print("PHP/JSP Not Support");
				writer.flush();
				return;
			}
			else{//直接下载
				writer.println("HTTP/1.1 200 ok");
				writer.flush();
				writer.println("Content-type:application/octet-stream");
				writer.flush();
			}
			
			FileInputStream in=new FileInputStream(DOC_PATH+uri);
			System.out.println("["+s.getInetAddress()+":"+s.getPort()+"] requests: "+DOC_PATH+uri);
			//发送响应头
			writer.println("Content-Length:"+ in.available());
			writer.println();
			writer.flush();
			
			//Success
			OutputStream os=s.getOutputStream();        
			byte[] b=new byte[1024];
			int len=0;
			len=in.read(b);
			while(len!=-1){
				os.write(b,0,len);
				len=in.read(b);
			}
			
			os.flush();
			s.close();
		} catch (IOException e) {
			e.printStackTrace();
		}	
	}
}