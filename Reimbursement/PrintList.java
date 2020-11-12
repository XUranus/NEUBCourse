import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.text.*;
import java.util.*;
import javax.xml.soap.*;
import java.io.*;



public class PrintList {
	public static void main(String[] args) {
		ListGUI(new SeeADoctorInfo());
	}
	
	public static void ListGUI(SeeADoctorInfo data) {
		PrintData printData = new PrintData();
		JFrame frame = new JFrame();
		frame.setTitle("结算清单");
		frame.setLayout(new BorderLayout());
		
		JPanel panel1 = new JPanel(new GridLayout(0,1));
		JLabel titleLabel1 = new JLabel("市基本医疗保险报销",JLabel.CENTER);
		JLabel titleLabel2 = new JLabel("医疗费用结算清单",JLabel.CENTER);
		titleLabel1.setFont(new Font("宋体",Font.PLAIN,18));
		titleLabel2.setFont(new Font("宋体",Font.PLAIN,18));
		panel1.setPreferredSize(new Dimension(100,65));
		panel1.add(titleLabel1);
		panel1.add(titleLabel2);
		
		JPanel panel2 = new JPanel(new GridLayout());
		SimpleDateFormat tt = new SimpleDateFormat("yyyy-MM-dd");
		String currentTime = tt.format(new java.util.Date());
		StringTokenizer st = new StringTokenizer(currentTime,"-");
		String year = st.nextToken();
		String month = st.nextToken();
		String day = st.nextToken();
		printData.year=year;
		printData.month=month;
		printData.day=day;
		//System.out.print(year+" "+month+" "+day);
		JLabel dateLabel = new JLabel("结算日期 "+year+" 年 "+month+" 月 "+day+" 日      ",JLabel.RIGHT);
		dateLabel.setFont(new Font("宋体",Font.PLAIN,15));
		panel1.add(dateLabel);
		
		JPanel tablePanel= new JPanel(new GridLayout(0,1));
		
		JPanel tablePanel_1= new JPanel(new GridLayout(0,1));
		JPanel line1 = new JPanel(new GridBagLayout());
		line1.add(new JLabel("单位名称  ",JLabel.RIGHT));
		JTextField institutionName = new JTextField(20);
		line1.add(institutionName);
		JTextField institutionId = new JTextField(15);
		line1.add(new JLabel("  单位编号  "));
		line1.add(institutionId);
		tablePanel_1.add(line1);
		
		JPanel line2 = new JPanel(new GridBagLayout());
		line2.add(new JLabel("      姓名  ",JLabel.RIGHT));
		JTextField name = new JTextField(10);
		line2.add(name);
		line2.add(new JLabel("个人编号  ",JLabel.RIGHT));
		JTextField id= new JTextField(10);
		line2.add(id);
		line2.add(new JLabel("人员类别  ",JLabel.RIGHT));
		JTextField kind = new JTextField(10);
		line2.add(kind);
		tablePanel_1.add(line2);
	
		JPanel line3 = new JPanel(new GridBagLayout());
		line3.add(new JLabel("申报原因  ",JLabel.RIGHT));
		JTextField reason = new JTextField(10);
		line3.add(reason);
		line3.add(new JLabel("报销类型  ",JLabel.RIGHT));
		JTextField kind2 = new JTextField(10);
		line3.add(kind2);
		line3.add(new JLabel("住院次数  ",JLabel.RIGHT));
		JTextField times = new JTextField(10);
		line3.add(times);
		tablePanel_1.add(line3);
		
		JPanel line4 = new JPanel(new GridBagLayout());
		line4.add(new JLabel("就诊医院  ",JLabel.RIGHT));
		JTextField hospital = new JTextField(20);
		line4.add(hospital);
		line4.add(new JLabel("  就诊时段  "));
		JTextField timeRange = new JTextField(15);
		line4.add(timeRange);
		tablePanel_1.add(line4);
		
		GridLayout gld= new GridLayout(0,1);
		gld.setVgap(4);
		gld.setHgap(4);
		JPanel tablePanel_2 = new JPanel(gld);
		JPanel l1 = new JPanel(new FlowLayout());
		JPanel l2 = new JPanel(new FlowLayout());
		JTextArea area1 = new JTextArea("结算明细", 50, 45);
		area1.setMargin(new Insets(5,5,5,5));
		l1.add(new JLabel(" "));
		l1.add(area1);
		l1.add(new JLabel(" "));
		JTextArea area2 = new JTextArea("个人自费。。。",50,45);
		area2.setMargin(new Insets(5,5,5,5));
		l2.add(new JLabel(" "));
		l2.add(area2);
		l2.add(new JLabel(" "));
		tablePanel_2.add(l1);
		tablePanel_2.add(l2);
		
		JPanel tablePanel_3= new JPanel(new GridBagLayout());
		JPanel tablePanel_3n= new JPanel(new GridLayout(0,1));
		tablePanel_3.add(new JLabel("     拨付金额     "));
		JPanel tablePanel_3r= new JPanel(gld);
		JTextField daxie= new JTextField(38);
		JTextField xiaoxie= new JTextField(38);
		tablePanel_3r.add(daxie);
		tablePanel_3r.add(xiaoxie);
		tablePanel_3.add(tablePanel_3r);
		tablePanel_3n.add(tablePanel_3);
		tablePanel_3n.add("Center",new JLabel("    本表一式三联，财务科、结算科、参保人各一联。",JLabel.LEFT));
		
		tablePanel.add(tablePanel_1);
		tablePanel.add(tablePanel_2);
		tablePanel.add(tablePanel_3n);
		
		JPanel buttonPanel = new JPanel(new FlowLayout());
		JButton button1 = new JButton("打印");
		button1.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				printData.institutionName=institutionName.getText();
				printData.institutionId=institutionId.getText();
				printData.name = name.getText();
				printData.id = id.getText();
				printData.kind = kind.getText();
				printData.reason = reason.getText();
				printData.kind2 = kind2.getText();
				printData.times = times.getText();
				printData.hospital = hospital.getText();
				printData.timeRange = timeRange.getText();
				printData.text1 = "";
				printData.text2 = "";
				printData.text3 = "";
				printData.text4 = "";
				printData.text5 = "";
				printData.text6 = "";
				printData.text7 = daxie.getText() ;
				printData.text8 = xiaoxie.getText();
				ConvertToDoc con = new ConvertToDoc(printData);
				con.createWord();
				JOptionPane.showMessageDialog(null, "打印完成", "打印", JOptionPane.ERROR_MESSAGE);
			}
		});
		buttonPanel.add(button1);
		
		institutionName.setText(data.text2);//窗体参数赋值开始
		institutionId.setText(data.text2);
		name.setText(data.name);
		id.setText(data.id);
		kind.setText("病人");
		reason.setText(data.textarea);
		kind2.setText("全额报销");
		hospital.setText(data.text2);
		timeRange.setText(data.text6_1+"."+data.text6_2+"."+data.text6_3+"--"+data.text7_1+"."+data.text7_1+"."+data.text7_2+"."+data.text7_3);
		try {
			BufferedReader read = new BufferedReader(new FileReader(new File("PatientsInfo/"+data.name+"_"+data.id+".txt")));
			times.setText(read.readLine());
		}
		catch (IOException ee) {
			ee.printStackTrace();
		}
		
		String str1 = "起付标准：\n     "+"1000.00"+"\n自费项目：\n"+"\n特检特治：\n";
		str1 = str1 +"------------------------------------------------------------------------";
		
		String str2 = "个人自费费用：\n"+"中心报销金额：\n";
		area1.setText(str1);
		area2.setText(str2);
		//
		double sum = 20643.34;//测试用例
		xiaoxie.setText("小写："+sum+"  元");
		daxie.setText("大写："+toDaxie(sum));
		//sum = Integer.
		//
		//
		
		
		frame.add("North",panel1);
		frame.add("Center",tablePanel);
		frame.add("South",buttonPanel);		
		
		frame.setResizable(true);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		frame.setSize(new Dimension(616,706));
		
		
		frame.addComponentListener(new ComponentAdapter(){
		 	public void componentResized(ComponentEvent e){
				System.out.println(frame.getSize());
		}});

	}
	
	private static String toDaxie(double t) {
		int sum = (int)(t*100);
		System.out.println(sum);
		int fen = sum % 10; sum = sum/10;
		int jiao = sum % 10; sum = sum/10;
		int yuan = sum % 10; sum = sum/10;
		int shi = sum % 10; sum = sum/10;
		int bai = sum % 10; sum = sum/10;
		int qian = sum % 10; sum = sum/10;
		int wan = sum % 10; sum = sum/10;
		String[] str = new String[7]; 
		String[] m = {"零","壹,","贰","叁","肆","伍","陆","柒","捌","玖","拾"};
		int i=0;
		
		if(wan==0) str[i] = "" ; else str[i] = m[wan]+" "+" 万 "; i++;
		if(qian==0) str[i] = "" ; else str[i] = m[qian]+" "+" 仟 "; i++;
		if(bai==0) str[i] = "" ; else str[i] = m[bai]+" "+" 佰 "; i++;
		if(shi==0) str[i] = "" ; else str[i] = m[shi]+" "+" 拾 "; i++;
		if(yuan==0) str[i] = "" ; else str[i] = m[yuan]+" "+" 圆 "; i++;
		if(jiao==0) str[i] = "" ; else str[i] = m[jiao]+" "+" 角 "; i++;
		if(fen==0) str[i] = "" ; else str[i] = m[fen]+" "+" 分 "; i++;
		String ans = "";
		for(int j=0;j<7;j++) ans = ans+str[j];
		return ans;
	}
}

