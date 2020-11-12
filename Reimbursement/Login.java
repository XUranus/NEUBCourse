import javax.swing.*;
import java.awt.*;
import javax.swing.event.*;
import java.awt.event.*;
import javax.security.auth.callback.*;
import java.io.*;
import javax.imageio.spi.*;
import java.net.*;
import java.rmi.registry.*;

public class Login {
	public Login() {}//empty constructor to create a new window
	public static void main(String[] args) {
		LoginGUI();
	}
	public static void LoginGUI() {
		Image i = Toolkit.getDefaultToolkit().getImage("icon.jpg");
		new JFrame().setIconImage(i);
		JFrame frame = new JFrame();
		frame.setTitle("医疗基本信息维护系统");
		frame.setLayout(new GridLayout());
		
		JPanel jpanel1 = new JPanel();
		JLabel label1 = new JLabel("用户名: ");
		JTextField jusername = new JTextField(15);
		jpanel1.add(label1);  
		jpanel1.add(jusername);
		
		JPanel jpanel2 = new JPanel();
		JPasswordField jpassword = new JPasswordField(15);
		JLabel label2 = new JLabel("密   码: ");
		jpanel2.add(label2);
		jpanel2.add(jpassword);  
	
		JPanel jpanel3 = new JPanel();
		JButton jbutton1 = new JButton("登陆");  
		class LoginAction implements ActionListener {
			public void actionPerformed(ActionEvent e) {
				//if(true) excute Login 
				AccountLogin user= new AccountLogin(jusername.getText(),jpassword.getText());
				try{
					if(!user.Accessed()) JOptionPane.showMessageDialog(null, "密码错误或用户名不存在！", "登录失败", JOptionPane.ERROR_MESSAGE); 
					else {
						JOptionPane.showMessageDialog(null, "登陆成功", "登陆", JOptionPane.ERROR_MESSAGE);
						Menu.MenuGUI(jusername.getText());
						frame.dispose();
						}
						
				}
				catch (Exception Login_error) {
					JOptionPane.showMessageDialog(null, "A serious error occured", "登陆", JOptionPane.ERROR_MESSAGE); 
				}

			}
		}
		jbutton1.addActionListener(new LoginAction());
		
		JButton jbutton2 = new JButton("注册");
		class RegisterAction implements ActionListener {
			public void actionPerformed(ActionEvent e){
				AccountLogin user= new AccountLogin(jusername.getText(),jpassword.getText());
				try{
					user.Regist();
				}
				catch (Exception registException) {
					JOptionPane.showMessageDialog(null, "注册失败", "注册", JOptionPane.ERROR_MESSAGE);
				}
			}
		} 
		jbutton2.addActionListener(new RegisterAction());

		
		jpanel3.add(jbutton1);
		jpanel3.add(jbutton2);
		
		ImageIcon icon = new ImageIcon("icon.jpg");//path为图片路径
		JLabel bgimg = new JLabel(icon);
		
		JPanel rpanel = new JPanel();
		
		JLabel tit = new JLabel("医疗基本信息维护系统");
		tit.setFont(new Font("Times New Roman",Font.BOLD, 16));
		
		rpanel.add(tit);
		rpanel.add(jpanel1);
		rpanel.add(jpanel2);
		rpanel.add(jpanel3);
		
		frame.add(bgimg);
		frame.add(rpanel);
		frame.setResizable(false);
		
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.setSize(new Dimension(600,200));
	}
}

class AccountLogin { 
	private String username = "";
	private String password = "";
	public AccountLogin(String username,String password){
		this.username = username;
		this.password = password;
	}
	public void Regist() throws IOException{
		File f =new File("AdministratorInfo/"+username+".txt");
		if (f.exists()) {
			JOptionPane.showMessageDialog(null, "Alert", "Username used!", JOptionPane.ERROR_MESSAGE); 
			return ;
		}
		else {
			try{
				f.createNewFile();
				BufferedWriter out= new BufferedWriter(new FileWriter("AdministratorInfo/"+username+".txt"));
				out.write(password);
				out.close();
				JOptionPane.showMessageDialog(null, "注册成功", "提示", JOptionPane.ERROR_MESSAGE); 
			}
			catch (IOException e) {
				JOptionPane.showMessageDialog(null, "Alert", "A Serious Error Occured!", JOptionPane.ERROR_MESSAGE); 
			}
		}
	}
	public Boolean Accessed() throws IOException{
		File f =new File("AdministratorInfo/"+username+".txt");
		if (!f.exists()) {
			JOptionPane.showMessageDialog(null, "Alert", "Username not found!", JOptionPane.ERROR_MESSAGE); 
			return false;
		}
		else {
			try{
				BufferedReader in = new BufferedReader(new FileReader("AdministratorInfo/"+username+".txt"));
				String psv;
				if ((psv=in.readLine())==null )
				{
					JOptionPane.showMessageDialog(null, "File read error", "A Serious Error Occured!", JOptionPane.ERROR_MESSAGE); 
					return false;
				}
				if (psv.equals(password)) {
					return true;
				}
				in.close();
			}
			catch (IOException e) {
				JOptionPane.showMessageDialog(null, "error ", "A Serious Error Occured!", JOptionPane.ERROR_MESSAGE); 
			}
		}
		return false;	
	}
}
