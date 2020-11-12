import java.awt.*;
import javax.swing.*;
import javax.swing.JButton;
import javax.swing.event.*;
import java.awt.event.*;
import java.awt.AlphaComposite;  
import java.awt.Color;  
import java.awt.Font;  
import java.awt.GradientPaint;  
import java.awt.Graphics;  
import java.awt.Graphics2D;  
import java.awt.RenderingHints;  
import java.awt.Shape;  
import java.awt.event.MouseAdapter;  
import java.awt.event.MouseEvent;  
import java.awt.geom.RoundRectangle2D;  

class RButton extends JButton {  
	private static final long serialVersionUID = 39082560987930759L;  
	public static final Color BUTTON_COLOR1 = new Color(205, 255, 205);  
	public static final Color BUTTON_COLOR2 = new Color(51, 154, 47);  
	// public static final Color BUTTON_COLOR1 = new Color(125, 161, 237);  
	// public static final Color BUTTON_COLOR2 = new Color(91, 118, 173);  
	public static final Color BUTTON_FOREGROUND_COLOR = Color.WHITE;  
	private boolean hover;  
  
	public RButton(String name) {  
		this.setText(name);  
		setFont(new Font("system", Font.PLAIN, 12));  
		setBorderPainted(false);  
		setForeground(BUTTON_COLOR2);  
		setFocusPainted(false);  
		setContentAreaFilled(false);  
		addMouseListener(new MouseAdapter() {  
			@Override  
			public void mouseEntered(MouseEvent e) {  
				setForeground(BUTTON_FOREGROUND_COLOR);  
				hover = true;  
				repaint();  
			}  
  
			@Override  
			public void mouseExited(MouseEvent e) {  
				setForeground(BUTTON_COLOR2);  
				hover = false;  
				repaint();  
			}  
		});  
	}  
  

	protected void paintComponent(Graphics g) {  
		Graphics2D g2d = (Graphics2D) g.create();  
		int h = getHeight();  
		int w = getWidth();  
		float tran = 1F;  
		if (!hover) {  
			tran = 0.3F;  
		}  
  
		g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING,  
				RenderingHints.VALUE_ANTIALIAS_ON);  
		GradientPaint p1;  
		GradientPaint p2;  
		if (getModel().isPressed()) {  
			p1 = new GradientPaint(0, 0, new Color(0, 0, 0), 0, h - 1,  
					new Color(100, 100, 100));  
			p2 = new GradientPaint(0, 1, new Color(0, 0, 0, 50), 0, h - 3,  
					new Color(255, 255, 255, 100));  
		} else {  
			p1 = new GradientPaint(0, 0, new Color(100, 100, 100), 0, h - 1,  
					new Color(0, 0, 0));  
			p2 = new GradientPaint(0, 1, new Color(255, 255, 255, 100), 0,  
					h - 3, new Color(0, 0, 0, 50));  
		}  
		g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER,  
				tran));  
		RoundRectangle2D.Float r2d = new RoundRectangle2D.Float(0, 0, w - 1,  
				h - 1, 20, 20);  
		Shape clip = g2d.getClip();  
		g2d.clip(r2d);  
		GradientPaint gp = new GradientPaint(0.0F, 0.0F, BUTTON_COLOR1, 0.0F,  
				h, BUTTON_COLOR2, true);  
		g2d.setPaint(gp);  
		g2d.fillRect(0, 0, w, h);  
		g2d.setClip(clip);  
		g2d.setPaint(p1);  
		g2d.drawRoundRect(0, 0, w - 1, h - 1, 20, 20);  
		g2d.setPaint(p2);  
		g2d.drawRoundRect(1, 1, w - 3, h - 3, 18, 18);  
		g2d.dispose();  
		super.paintComponent(g);  
	}  
}  

public class Menu {
	public static void main(String[] args) {
		Menu.MenuGUI("User");
	}
	
	public static void MenuGUI(String name) {
		JFrame frame = new JFrame();
		frame.setTitle("医疗保险系统");
		frame.setLayout(new GridLayout(0,1));
		RButton button1 = new RButton("公共业务");
		button1.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				PublicService t = new PublicService();
			}
		});
		RButton button2 = new RButton("医疗基本信息维护");
		button2.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
				MedicalFundementalInfoMaintain t= new MedicalFundementalInfoMaintain()	;		
			}
		});
		RButton button3 = new RButton("医疗待遇审批");
		button3.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
			 	JOptionPane.showMessageDialog(null, "该功能尚未开通", "提示", JOptionPane.ERROR_MESSAGE);
			}
		});
		RButton button4 = new RButton("医保中心报销");
		button4.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
			 	ReimbursementEntranceGUI login = new ReimbursementEntranceGUI();
				login.LoginGUI();
			}
		});
		RButton button5 = new RButton("信息查询");
		button5.addActionListener(new ActionListener(){
			public void actionPerformed(ActionEvent e) {
			 	GeneralInfoSearch t = new GeneralInfoSearch();
			}
		});
		
		JLabel title = new JLabel("主界面",JLabel.CENTER);
		title.setFont(new Font("宋体",Font.PLAIN,25));
		//title.setForeground(Color.green);
		JPanel titlePanel = new JPanel(new GridLayout(0,1));
		titlePanel.add(title);
		titlePanel.add(new JLabel("当前用户："+name,JLabel.RIGHT));
		frame.add(titlePanel);
		frame.add(button1);
		frame.add(button2);
		frame.add(button3);
		frame.add(button4);
		frame.add(button5);
		
		
		frame.setResizable(true);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		frame.setSize(new Dimension(454,331));
		frame.addComponentListener(new ComponentAdapter(){
			 	public void componentResized(ComponentEvent e){
					System.out.println(frame.getSize());
			}});

	}
}