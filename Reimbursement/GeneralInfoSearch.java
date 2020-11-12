import javax.swing.*;
import javax.swing.event.*;
import java.awt.*;
import java.awt.event.*;
import java.io.*;

public class GeneralInfoSearch {
	public static void main(String[] args) {
		GeneralInfoSearch t = new GeneralInfoSearch();
	}
	
	public GeneralInfoSearch(){
		JFrame frame = new JFrame();
		final Object visitor = super.getClass();
		frame.setTitle("综合信息查询系统");
		frame.setLayout(new BorderLayout());
		
		JPanel panel1 = new JPanel(new GridLayout(3,1));
		JPanel line1 = new JPanel(new FlowLayout());
		JTextField nameText = new JTextField(20);
		line1.add(new JLabel("姓    名 "));
		line1.add(nameText);
		JPanel line2 = new JPanel(new FlowLayout());
		JTextField idText = new JTextField(20);
		line2.add(new JLabel("身 份 证 "));
		line2.add(idText);
		panel1.add(line1);
		panel1.add(line2);
		JLabel title = new JLabel("综合信息查询系统",JLabel.CENTER);
		frame.add("North",title);
		title.setFont(new Font("宋体",Font.PLAIN,25));
		JButton button = new JButton("搜索");
		JPanel buttonPanel = new JPanel(new FlowLayout());
		buttonPanel.add(button);
		panel1.add(buttonPanel);
		JPanel southPanel = new JPanel(new FlowLayout());
		southPanel.add(new JLabel(" "));
		JTextArea content = new JTextArea(15, 50);
		content.setText("处方信息");
		southPanel.add(content);
		southPanel.add(new JLabel(" "));
		
		frame.add("Center",panel1);
	
		frame.setVisible(true);
		frame.setResizable(true);
		frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		frame.setSize(new Dimension(630,185));
		
		
		button.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				frame.setSize(new Dimension(630,440));
				frame.add("South",southPanel);
				String name = nameText.getText();
				String id = idText.getText();
				String path = "Prescription/"+name +"_"+id+".txt";
				try{
					File f = new File(path);
					BufferedReader in = new BufferedReader(new FileReader(f));
					String str="";
					int i=0;
					while (i++<=3) {
						str= str+in.readLine();
						str = str +"\n";
					}
					content.setText(str);
				}
				catch (IOException d) {
					d.printStackTrace();
				}
			}
		});
		frame.addComponentListener(new ComponentAdapter(){
			public void componentResized(ComponentEvent e){
				System.out.println(frame.getSize());
		}});
	}
}