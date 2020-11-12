import java.awt.*;  
import java.awt.event.*;  
import javax.swing.*;
import java.io.*;
import java.util.*;

 
class MedicalFundementalInfoMaintain extends JFrame  
{  
	private JTabbedPane tabbedPane;  
	private JLabel label1,label2,label3,label4,label5,label6;    
	private JPanel panel1,panel2,panel3,panel4,panel5,panel6;
	
	private JPanel JPanel1() {
		JLabel inform = new JLabel(" ",JLabel.CENTER);
		JPanel inputPanel = new JPanel(new GridLayout(0,1));
		JPanel[] linePanel = new JPanel[5];
		JTextField[] lineText = new JTextField[5];
		for(int i=0;i<5;i++) {
			linePanel[i] = new JPanel(new FlowLayout());
			lineText[i] = new JTextField(20);
			inputPanel.add(linePanel[i]);
		}
		int i=-1;
		linePanel[++i].add(new JLabel("名   称")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("编   码")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("种   类")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("备   注")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("报销标志")); linePanel[i].add(lineText[i]);
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
				File f = new File("Disease/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(!f.exists()) inform.setText("找不到疾病记录");
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
				 	String kind = lineText[2].getText();
					String remarks = lineText[3].getText();
					String reimbursementSymbol = lineText[4].getText();
					Disease d = new Disease(name,id,kind,remarks,reimbursementSymbol);
					System.out.println(name+"_"+id);
					d.WriteToFile(f);
					inform.setText("修改成功");
				}
			}
		});
		return inputPanel;
	}
	
	private JPanel JPanel2() {
		JPanel ansPanel = new JPanel();
		ansPanel.add(new JLabel("此功能尚未开发",JLabel.CENTER));
		return ansPanel;
	}

	private JPanel JPanel3() {
		JLabel inform = new JLabel(" ",JLabel.CENTER);
				JPanel inputPanel = new JPanel(new GridLayout(0,1));
				JPanel[] linePanel = new JPanel[9];
				JTextField[] lineText = new JTextField[9];
				for(int i=0;i<9;i++) {
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
				linePanel[++i].add(new JLabel("固定电话")); linePanel[i].add(lineText[i]);			
				linePanel[++i].add(new JLabel("医院等级")); linePanel[i].add(lineText[i]);
				linePanel[++i].add(new JLabel("备   注")); linePanel[i].add(lineText[i]);
				linePanel[++i].add(new JLabel("手   机")); linePanel[i].add(lineText[i]);

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
						File f = new File("HospitalInfo/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
						if(!f.exists()) inform.setText("找不到医疗机构记录");
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
						File f = new File("Hospital/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
						if(f.exists()) inform.setText("该医疗机构已经被登记");
						else {
							String name = lineText[0].getText();
							String id = lineText[1].getText();
						 	String kind = lineText[2].getText();
							String address = lineText[3].getText();
							String postalCode = lineText[4].getText();
							String telephone = lineText[5].getText();
						 	int level =Integer.parseInt(lineText[6].getText());
							String remarks = lineText[7].getText();
							String mobile = lineText[8].getText();
							Hospital d = new Hospital(name,id,kind,address,postalCode,telephone,level,remarks,mobile);
							System.out.println(name+"_"+id);
							d.WriteToFile();
							inform.setText("修改成功");
						}
					}
				});
				return inputPanel;
		
	}

	private JPanel JPanel4() {
		JLabel inform = new JLabel(" ",JLabel.CENTER);
		JPanel inputPanel = new JPanel(new GridLayout(0,1));
		JPanel[] linePanel = new JPanel[8];
		JTextField[] lineText = new JTextField[8];
		for(int i=0;i<8;i++) {
			linePanel[i] = new JPanel(new FlowLayout());
			lineText[i] = new JTextField(20);
			inputPanel.add(linePanel[i]);
		}
		int i=-1;
		linePanel[++i].add(new JLabel("名   称")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("编   码")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("收费种类")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("处 方 药")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("药品等级")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("最高限价")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("实际售价")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("需要审批")); linePanel[i].add(lineText[i]);
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
				File f = new File("Medicine/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(!f.exists()) inform.setText("找不到药品记录");
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
		submitButton.addActionListener(new ActionListener() {//name,id,chargekind,prescription,level,standardPrice,price,needApproval
			public void actionPerformed(ActionEvent e) {
				inform.setText(" ");
				File f = new File("Medicine/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(f.exists()) inform.setText("该药品已经被登记");
				else {
					String name = lineText[0].getText();
					String id = lineText[1].getText();
				 	String chargekind = lineText[2].getText();
					String prescription = lineText[3].getText();
					int level = Integer.parseInt(lineText[4].getText());
					double standardPrice = Double.parseDouble(lineText[5].getText());
					double price = Double.parseDouble(lineText[6].getText());
					boolean needApproval =Boolean.parseBoolean(lineText[7].getText());
					Medicine d  = new Medicine(name,id,chargekind,prescription,level,standardPrice,price,needApproval);
					System.out.println(name+"_"+id);
					d.WriteToFile();
					inform.setText("修改成功");
				}
			}
		});
		return inputPanel;
	}
	
	private JPanel JPanel5() {
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
		linePanel[++i].add(new JLabel("名   称")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("编   码")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("收费种类")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("备   注")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("限制区域")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("价   格")); linePanel[i].add(lineText[i]);
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
				File f = new File("MedicalFacility/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(!f.exists()) inform.setText("找不到医疗设施记录");
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
				File f = new File("MedicalFacility/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(f.exists()) inform.setText("该医疗设施已经被登记");
				else {
					String name = lineText[0].getText();
					String id = lineText[1].getText();
				 	String chargeKind = lineText[2].getText();
					String remark = lineText[3].getText();
					String limitUseArea = lineText[4].getText();
					double price = Double.parseDouble(lineText[5].getText()); 
					MedicalFacility d = new MedicalFacility(name,id,chargeKind,remark,limitUseArea,price);
					System.out.println(name+"_"+id);
					d.WriteToFile();
					inform.setText("修改成功");
				}
			}
		});
		return inputPanel;
	}

	private JPanel JPanel6() {
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
		linePanel[++i].add(new JLabel("名   称")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("编   码")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("价   格")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("收费种类")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("收费等级")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("需要审批")); linePanel[i].add(lineText[i]);
		linePanel[++i].add(new JLabel("备   注")); linePanel[i].add(lineText[i]);
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
				File f = new File("MedicalProject/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(!f.exists()) inform.setText("找不到诊疗项目记录");
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
				File f = new File("MedicalProject/"+lineText[0].getText()+"_"+lineText[1].getText()+".txt");
				if(f.exists()) inform.setText("该病种已经被登记");
				else {
					String name = lineText[0].getText();
					String id = lineText[1].getText();
				 	double price = Double.parseDouble(lineText[2].getText());
					String chargeKind = lineText[3].getText();
					int chargeProjectLevel = Integer.parseInt(lineText[4].getText());
					boolean needApproval = Boolean.parseBoolean(lineText[5].getText());
					String remarks = lineText[6].getText();
				 	MedicalProject d = new MedicalProject(name,id,price,chargeKind,chargeProjectLevel,needApproval,remarks);
					System.out.println(name+"_"+id);
					d.WriteToFile();
					inform.setText("修改成功");
				}
			}
		});
		return inputPanel;
	}

	
	public static void main(String args[])  
	{  
		MedicalFundementalInfoMaintain d = new MedicalFundementalInfoMaintain();  
	}    
  
	public MedicalFundementalInfoMaintain()  
	{  
		super("选项卡窗口"); setSize(800,500);  
  
		Container c = getContentPane();  
		tabbedPane=new JTabbedPane();   //创建选项卡面板对象  

		//创建面板  
		panel1=JPanel1(); //finish 
		panel2=JPanel2();  
		panel3=JPanel3();  
		panel4=JPanel4();  
		panel5=JPanel5();  
		panel6=JPanel6(); 
  
		//将标签面板加入到选项卡面板对象上  
		tabbedPane.addTab("病种信息维护",null,panel1,"First panel");  
		tabbedPane.addTab("医疗待遇计算参数维护",null,panel2,"Second panel");  
		tabbedPane.addTab("定点医疗机构信息维护",null,panel3,"Third panel");
		tabbedPane.addTab("药品信息维护",null,panel4,"Forth panel");  
		tabbedPane.addTab("服务设施项目维护",null,panel5,"Fifth panel");  
		tabbedPane.addTab("诊疗项目信息维护",null,panel6,"Sixth panel");  
  
		c.add(tabbedPane);  
		c.setBackground(Color.white);  
  
		setVisible(true);  
		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);  
	}  
	
}