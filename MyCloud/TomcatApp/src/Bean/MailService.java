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
    private String from; // �����˵�������
    private String key;
    private String host; // ָ�������ʼ�������
    
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

    public void sendMail() { //�ʼ�����   �ʼ�����  ������
        if(to==null || from==null || host==null || key==null) {
            System.out.println("Mail Service not initialized... send failed");
            return;
        }
        Properties properties = System.getProperties();// �����ʼ�������
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
        // ��ȡĬ��session����
        Session session = Session.getDefaultInstance(properties,new Authenticator(){
            public PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication(from,key); //�������ʼ��û���������
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
