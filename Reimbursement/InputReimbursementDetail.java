import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.security.*;

public class InputReimbursementDetail {
	public static void main(String[] args) { //file name "PatientName.txt"
		InputReimbursementDetailGUI test = new InputReimbursementDetailGUI("","");
	}
}

class InputReimbursementDetailGUI {
	public InputReimbursementDetailGUI(String id,String name) {
		JFrame frame = new JFrame();
		frame.setTitle("医疗保险中心报销系统系统");
		frame.setLayout(new BorderLayout());
		JLabel title = new JLabel("病人就诊资料信息登记",JLabel.CENTER);
		title.setFont(new Font("宋体",Font.PLAIN,25));
		/*
		1-2 医疗机构信息（编码和名称）、
		3 医疗类别、
		4-5 疾病信息（病种编码和病种名称）、
		6 入院日期、
		7 出院日期、
		8 出院原因、
		9 住院号（门诊号）
		*/
		JLabel label1 = new JLabel("医疗机构编码");
		JTextField text1 = new JTextField(13);
		JPanel panel1 = new JPanel();
		panel1.setLayout(new FlowLayout());
		panel1.add(label1);
		panel1.add(text1);
		
		JLabel label2 = new JLabel("机构名称");
		JTextField text2 = new JTextField(15);
		JPanel panel2 = new JPanel();
		panel2.setLayout(new FlowLayout());
		panel2.add(label2);
		panel2.add(text2);
		JPanel panel1_2 = new JPanel();
		panel1_2.setLayout(new FlowLayout());
		panel1_2.add(panel1);
		panel1_2.add(panel2);
		
		JLabel label3 = new JLabel("医疗类别");
		JTextField text3 = new JTextField(15);
		JPanel panel3 = new JPanel();
		panel3.setLayout(new FlowLayout());
		panel3.add(label3);
		panel3.add(text3);
		
		JLabel label4 = new JLabel("病种编码");
		JTextField text4 = new JTextField(15);
		JPanel panel4 = new JPanel();
		panel4.setLayout(new FlowLayout());
		panel4.add(label4);
		panel4.add(text4);
		
		JLabel label5 = new JLabel("病种名称");
		JTextField text5 = new JTextField(15);
		JPanel panel5 = new JPanel();
		panel5.setLayout(new FlowLayout());
		panel5.add(label5);
		panel5.add(text5);
		JPanel panel4_5 = new JPanel();
		panel4_5.setLayout(new FlowLayout());
		panel4_5.add(panel4);
		panel4_5.add(panel5);
		
		JLabel label6 = new JLabel("入院日期");
		JTextField text6_1 = new JTextField(4);
		JTextField text6_2 = new JTextField(3);
		JTextField text6_3 = new JTextField(3);
		JPanel panel6 = new JPanel();
		panel6.setLayout(new FlowLayout());
		panel6.add(label6);
		panel6.add(text6_1);
		panel6.add(new JLabel("-"));
		panel6.add(text6_2);
		panel6.add(new JLabel("-"));
		panel6.add(text6_3);

		JLabel label7 = new JLabel(" 出院日期");
		JTextField text7_1 = new JTextField(4);
		JTextField text7_2 = new JTextField(3);
		JTextField text7_3 = new JTextField(3);
		JPanel panel7 = new JPanel();
		panel7.setLayout(new FlowLayout());
		panel7.add(label7);
		panel7.add(text7_1);
		panel7.add(new JLabel("-"));
		panel7.add(text7_2);
		panel7.add(new JLabel("-"));
		panel7.add(text7_3);
		JPanel panel6_7 = new JPanel();
		panel6_7.setLayout(new FlowLayout());
		panel6_7.add(panel6);
		panel6_7.add(panel7);
		
		JLabel label9 = new JLabel("门 诊 号");
		JTextField text9 = new JTextField(15);
		JPanel panel9= new JPanel();
		panel9.setLayout(new FlowLayout());
		panel9.add(label9);
		panel9.add(text9);
		JPanel panel3_9 = new JPanel();
		panel3_9.setLayout(new FlowLayout());
		panel3_9.add(panel3);
		panel3_9.add(panel9);
		
		JPanel panel1__8 = new JPanel();
		panel1__8.setLayout(new GridLayout(0,1));
		JPanel panelTitle = new JPanel();
		panelTitle.add(title);
		panel1__8.add(title);
		panel1__8.add(panel1_2);
		panel1__8.add(panel3_9);
		panel1__8.add(panel4_5);
		panel1__8.add(panel6_7);
		JTextArea textarea = new JTextArea("输入出院原因...",50,42);
		textarea.setMargin(new Insets(5,5,5,5));
		JPanel tempPanel = new JPanel(new FlowLayout());
		tempPanel.add(new JLabel(" "));
		tempPanel.add(textarea);
		tempPanel.add(new JLabel(" "));
		panel1__8.add(tempPanel);
		JPanel buttonPanel = new JPanel(new FlowLayout());
		buttonPanel.add(new JButton("重填"));
		buttonPanel.add(new JButton("确定"));
		JButton button3 = new JButton("提交");
		button3.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				SeeADoctorInfo data = new SeeADoctorInfo();
				data.text1 = text1.getText();
				data.text2 = text2.getText();
				data.text3 = text3.getText();
				data.text4 = text4.getText();
				data.text5 = text5.getText();
				data.text6_1 = text6_1.getText();
				data.text6_2 = text6_2.getText();
				data.text6_3 = text6_3.getText();
				data.text7_1 = text7_1.getText();
				data.text7_2 = text7_2.getText();
				data.text7_3 = text7_3.getText();
				data.text9 = text9.getText();
				data.textarea = textarea.getText(); 
				data.name = name;
				data.id  = id; 
				PrintList.ListGUI(data);
				frame.dispose();
			}
		});
		buttonPanel.add(button3);
		
		JLabel waring = new JLabel("");
		panel1__8.add(waring);
		

		frame.add("Center",panel1__8);
		frame.add("South",buttonPanel);
		
		frame.setResizable(true);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		frame.setSize(new Dimension(578,528));
		
		frame.addComponentListener(new ComponentAdapter(){
			 	public void componentResized(ComponentEvent e){
					System.out.println(frame.getSize());
			}});
	}
}

class SeeADoctorInfo {
	public String name;
	public String id;
	public String text1;
	public String text2;
	public String text3;
	public String text4;
	public String text5;
	public String text6_1;
	public String text6_2;
	public String text6_3;
	public String text7_1;
	public String text7_2;
	public String text7_3;
	public String text9;
	public String textarea;
}