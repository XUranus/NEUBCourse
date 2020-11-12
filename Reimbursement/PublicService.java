import java.awt.*;  
import java.awt.event.*;  
import javax.swing.*;
import java.io.*;
import java.util.*;


public class PublicService extends JFrame{
	private JTabbedPane tabbedPane;  
	private JPanel panel1,panel2;

	public static void main(String[] args) {
		PublicService p =new PublicService();
	}
	
	public PublicService() {
		super("公共业务"); setSize(800,500);  
		Container c = getContentPane();  
		tabbedPane=new JTabbedPane();   //创建标签
					
		panel1=JPanel1(); //finish 
		panel2=JPanel2();  
				
		//将标签面板加入到选项卡面板对象上  
		tabbedPane.addTab("个人信息维护",null,panel1,"First panel");  
		tabbedPane.addTab("机构信息维护",null,panel2,"Second panel");  
						  
		c.add(tabbedPane);  
		c.setBackground(Color.white);  
		  
		setVisible(true);  
		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);  
	}
	
	private JPanel JPanel1() {
		JLabel inform = new JLabel(" ",JLabel.CENTER);
		JPanel inputPanel = new JPanel(new GridLayout(0,1));
		JPanel[] linePanel = new JPanel[7];
		JTextField[] lineText = new JTextField[7];
		for(int i=0;i<7;i++) {
			linePanel[i] = new JPanel(new FlowLayout());
			lineText[i] = new JTextField(20);
			inputPanel.add(linePanel[i]);
		}
		int i=-1;
		linePanel[++i].add(new JLabel("姓   名")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("身份证号")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("性   别")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("出生日期")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("手 机 号")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("民   族")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("地   址")); linePanel[i].add(lineText[i]);
		JPanel buttonPanel = new JPanel(new FlowLayout());
		JButton searchButton = new JButton("搜索");
		JButton submitButton = new JButton("提交");
		buttonPanel.add(searchButton);
		buttonPanel.add(submitButton);
		inputPanel.add(buttonPanel);
		inputPanel.add(inform);
		searchButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				String name = lineText[0].getText();
				String id = lineText[1].getText();
				File f = new File("PersonInfo/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(!f.exists()) inform.setText("找不到个人记录");
				else {
					inform.setText(" ");
					try{
						BufferedReader in = new BufferedReader(new FileReader(f));
						String content = in.readLine();
						StringTokenizer st =new StringTokenizer(content," ");
						int i=0;
						while(st.hasMoreTokens()) {
							lineText[i++].setText(st.nextToken());
						}
					}
					catch (IOException ee) {
						ee.printStackTrace();
					}

				}
			}
		});
		
		submitButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				inform.setText(" ");
				File f = new File("Disease/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(f.exists()) inform.setText("该病种已经被登记");
				else {
					String name = lineText[0].getText();
					String id = lineText[1].getText();
				 	String gender = lineText[2].getText();
					String birthday = lineText[3].getText();
					String mobile = lineText[4].getText();
					String region = lineText[5].getText();
					String address = lineText[6].getText();
					Person d = new Person(name,id,gender,birthday,mobile,region,address);
					System.out.println(name+"_"+id);
					d.WriteToFile();
					inform.setText("修改成功");
				}
			}
		});
		return inputPanel;
	}
	
	private JPanel JPanel2() {
		JLabel inform = new JLabel(" ",JLabel.CENTER);
		JPanel inputPanel = new JPanel(new GridLayout(0,1));
		JPanel[] linePanel = new JPanel[6];
		JTextField[] lineText = new JTextField[6];
		for(int i=0;i<6;i++) {
			linePanel[i] = new JPanel(new FlowLayout());
			lineText[i] = new JTextField(20);
			inputPanel.add(linePanel[i]);
		}
		int i=-1;
		linePanel[++i].add(new JLabel("机构名称")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("编   码")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("种   类")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("地   址")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("邮   编")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("电   话")); linePanel[i].add(lineText[i]);
		JPanel buttonPanel = new JPanel(new FlowLayout());
		JButton searchButton = new JButton("搜索");
		JButton submitButton = new JButton("提交");
		buttonPanel.add(searchButton);
		buttonPanel.add(submitButton);
		inputPanel.add(buttonPanel);
		inputPanel.add(inform);
		searchButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				String name = lineText[0].getText();
				String id = lineText[1].getText();
				File f = new File("InstitutionInfo/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(!f.exists()) inform.setText("找不到机构记录");
				else {
					inform.setText(" ");
					try{
						BufferedReader in = new BufferedReader(new FileReader(f));
						String content = in.readLine();
						StringTokenizer st =new StringTokenizer(content," ");
						int i=0;
						while(st.hasMoreTokens()) {
							lineText[i++].setText(st.nextToken());
						}
					}
					catch (IOException ee) {
						ee.printStackTrace();
					}

				}
			}
		});
		submitButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				inform.setText(" ");
				File f = new File("Institution/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(f.exists()) inform.setText("该机构已经被登记");
				else {
					String name = lineText[0].getText();
					String id = lineText[1].getText();
				 	String kind = lineText[2].getText();
					String address = lineText[3].getText();
					String postalCode = lineText[4].getText();
					String telephone = lineText[5].getText();
					Institution d = new Institution(name,id,kind,address,postalCode,telephone);
					System.out.println(name+"_"+id);
					d.WriteToFile();
					inform.setText("修改成功");
				}
			}
		});
		return inputPanel;
	}

}
