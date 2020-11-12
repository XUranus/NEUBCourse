import javax.swing.*;
import java.awt.*;
import javax.swing.event.*;
import java.awt.event.*;
import javax.security.auth.callback.*;
import java.io.*;
import javax.imageio.spi.*;
import java.net.*;
import java.rmi.registry.*;
import java.util.*;

public class ReimbursementEntrance {
	public static void main(String[] args) {
		ReimbursementEntranceGUI login = new ReimbursementEntranceGUI();
		login.LoginGUI();
	}
}

class ReimbursementEntranceGUI {
	IdCatalog idList;
	private ArrayList<Person> personList = new ArrayList<Person>();
	Person p = new Person();//used as a dynamic parameter
	
	public ReimbursementEntranceGUI() {
		Load();
		idList = new IdCatalog();
	}
		
	public void Load() {
		BufferedReader in=null;
		personList.clear();
		try{
			in= new BufferedReader(new FileReader("PersonInfo/personCatalog.txt"));
			}
		catch (Exception e1) {
			JOptionPane.showMessageDialog(null, "Data Read Error", "Error", JOptionPane.ERROR_MESSAGE); 
		}
		String string="";
		try{
			while ((string=in.readLine())!=null){
				StringTokenizer st=new StringTokenizer(string," ");
				while(st.hasMoreElements()){
					personList.add(new Person(st.nextToken(),st.nextToken()));
				}
			}
		}
		catch (Exception e2) {
			JOptionPane.showMessageDialog(null, "Array Load Error", "Error", JOptionPane.ERROR_MESSAGE);
		}
		
	}
	
	public IdCatalog SearchName(String name) {
		IdCatalog ans= new IdCatalog();
		for(int i=0;i<personList.size();i++) {
			if(personList.get(i).getName().equals(name)) ans.add(personList.get(i));
			else System.out.println(personList.get(i).getName()+" != "+name);//
		}
		return ans;
	}
	
	public IdCatalog SearchId(String id) {
		IdCatalog ans= new IdCatalog();
		for(int i=0;i<personList.size();i++) {
			if(personList.get(i).getId().equals(id)) ans.add(personList.get(i));
		}
		return ans;
	}

	public void LoginGUI() {
			JFrame frame = new JFrame();
			frame.setTitle("医疗保险中心报销系统系统");
			frame.setLayout(new GridLayout(2,1));
			JScrollPane scrollPane = new JScrollPane();
			
			JTextArea summaryText = new JTextArea();
			summaryText.setMargin(new Insets(5,5,5,5));
			JPanel jpanel7 = new JPanel();
			jpanel7.setLayout(new GridLayout(1,1));
			jpanel7.add(summaryText);
			jpanel7.setPreferredSize(new Dimension(400,100));
			
			
			JPanel jpanel1 = new JPanel();//panel 1
			JLabel label1 = new JLabel("姓   名");
			JTextField nameText = new JTextField(20);
			jpanel1.add(label1);  
			jpanel1.add(nameText);
			
			JPanel jpanel2 = new JPanel();//panel2
			JLabel label2 = new JLabel("身份证");
			JTextField idText = new JTextField(20);
			jpanel2.add(label2);  
			jpanel2.add(idText);
			
			final JList jlist = new JList(idList);
			DefaultListModel dlm = new DefaultListModel();
			jlist.setModel(dlm);
			jlist.addListSelectionListener(new ListSelectionListener() {
				public void valueChanged(ListSelectionEvent e) {
					if(!(jlist.getValueIsAdjusting())) {
						idText.setText(jlist.getSelectedValue().toString());
						System.out.println(jlist.getSelectedValue());
						String id = jlist.getSelectedValue().toString();
						for(int i=0;i<personList.size();i++) {
							if(personList.get(i).getId().equals(id)) {
								p= personList.get(i);
								String info = "姓名："+p.getName()+"\n";
								info = info + "性别：男"+"\n";
								info = info + "身份证号："+p.getId()+"\n"; 
								summaryText.setText(info);
							}
						}
						//
						//
						//@ implement姓名、公民身份号码、性别、出生日期、医疗人员类别、单位编号、单位名称、本年住院次数、上次出院时间、上次出院诊断、本年中心报销累计、本年个人自费累计、本年医疗费用累计
						//
						//
						//
					}
				} 
			});
		
			
			JButton button1 = new JButton("搜索");
			class SearchAction implements ActionListener {
				public void actionPerformed(ActionEvent searchAct){
					String name = nameText.getText();
					String id = idText.getText();
					//
					System.out.println(personList.size());
					System.out.println("输入 "+name+" "+id);
					for(int i=0;i<personList.size();i++) {
						System.out.println(personList.get(i).getName()+" "+personList.get(i).getId());
					}
				 	idList=SearchName(name);
					if(idList.getSize()==0) idList=SearchId(id);
					if(idList.getSize()==0) JOptionPane.showMessageDialog(null, "找不到匹配的人", "来自格佬的嘲讽", JOptionPane.ERROR_MESSAGE);
					dlm.clear();
					for(int i=0;i<idList.getSize();i++) {
						System.out.println(idList.getElementAt(i));
						dlm.addElement(idList.getElementAt(i));
					}
					jlist.setModel(dlm);	
					scrollPane.setViewportView(jlist);				
				}
			}
			button1.addActionListener(new SearchAction());
			
			JButton button2 = new JButton("确定");
			class EnterAction implements ActionListener {
				public void actionPerformed(ActionEvent enterAct){
					InputReimbursementDetailGUI test = new InputReimbursementDetailGUI(idText.getText(),nameText.getText());
				}
			}
			button2.addActionListener(new EnterAction());
			
			
			JPanel jpanel3 = new JPanel();
			jpanel3.setLayout(new FlowLayout());
			jpanel3.add(button1);
			jpanel3.add(button2);
			
			JPanel jpanel4 = new JPanel();
			jpanel4.setLayout(new GridLayout(3,1));
			jpanel4.add(jpanel1);
			jpanel4.add(jpanel2);
			jpanel4.add(jpanel3);
			
			scrollPane.setPreferredSize(new Dimension(200,150));
			scrollPane.setViewportView(jlist);
			JPanel jpanel5 = new JPanel();
			jpanel5.add(scrollPane);
			
			JPanel jpanel6 = new JPanel();
			jpanel6.setLayout(new FlowLayout());
			jpanel6.add(jpanel4);
			jpanel6.add(jpanel5);
						
			frame.add(jpanel6);
			frame.add(jpanel7);
			
			frame.setResizable(false);
			frame.setVisible(true);
			frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
			frame.setSize(new Dimension(600,400));
		}
}

class IdCatalog extends AbstractListModel {  
		ArrayList<Person> personList;
		
		public IdCatalog() {
			personList = new ArrayList<Person>();
		}

		public String getElementAt(int index) {  
			return personList.get(index).getId();  
		}  
		   
		public int getSize() {  
			return personList.size();
		}  
		
		public void add(Person person) {
			personList.add(person);
		}
}  
