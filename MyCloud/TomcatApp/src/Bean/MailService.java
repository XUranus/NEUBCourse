package Bean;
import java.security.GeneralSecurityException;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

import com.sun.mail.util.MailSSLSocketFactory;


public class MailService extends Thread {
    private String from; // 发件人电子邮箱
    private String key;
    private String host; // 指定发送邮件的主机
    
    private String subject;
    private String content;
    private String to;
    
    public MailService(String subject,String content,String to) {
        this.from = Config.getMailSender();
        this.host = Config.getMailHost();
        this.key = Config.getMailKey();
        this.subject = subject;
        this.content = content;
        this.to= to;
    }

    public void sendMail() { //邮件标题   邮件内容  接收者
        if(to==null || from==null || host==null || key==null) {
            System.out.println("Mail Service not initialized... send failed");
            return;
        }
        Properties properties = System.getProperties();// 设置邮件服务器
        properties.setProperty("mail.smtp.host", host);
        properties.put("mail.smtp.auth", "true");
        MailSSLSocketFactory sf = null;
        try {
            sf = new MailSSLSocketFactory();
        } catch (GeneralSecurityException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        sf.setTrustAllHosts(true);
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.smtp.ssl.socketFactory", sf);
        // 获取默认session对象
        Session session = Session.getDefaultInstance(properties,new Authenticator(){
            public PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication(from,key); //发件人邮件用户名、密码
            }
        });

        try{
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject(MimeUtility.encodeText(subject,MimeUtility.mimeCharset("gb2312"), null));
            message.setContent(content,"text/html;charset=utf-8");
            Transport.send(message);
            System.out.println("Sent email to "+to+" successfully....");
        }catch (Exception mex) {
            mex.printStackTrace();
        }
    }

	@Override
	public void run() {
		// TODO Auto-generated method stub
		sendMail();
	}

}
