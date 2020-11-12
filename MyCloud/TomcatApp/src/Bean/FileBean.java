package Bean;

public class FileBean {
	private String fileName;
	private String token;
	private String fileLink;//¡¥Ω”
	private int uploader_id;
	
	private String format;
	
	public FileBean(String fileName,String fileLink,int uploader_id) {
		this.fileLink = fileLink;
		this.fileName = fileName;
		this.uploader_id = uploader_id;
	}
	
	public FileBean(String fileName,String fileLink,int uploader_id,String format) {
		this.fileLink = fileLink;
		this.fileName = fileName;
		this.uploader_id = uploader_id;
		this.format = format;
	}
	
	public String getFileName() {
		return  fileName;
	}
	
	public String getFormat() {
		return format;
	}
	
	public String getToken() {
		return token;
	}
	

	public void setUploader_id(int uploader_id) {
		this.uploader_id = uploader_id;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public void setFileLink(String fileLink) {
		this.fileLink = fileLink;
	}

	public String getFileLink() {//œ¬‘ÿ¡¥Ω”
		return fileLink;
	}
	
	public int getUploaderId() {
		return uploader_id;
	}
}
