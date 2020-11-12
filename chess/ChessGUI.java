import javax.swing.*;
import java.awt.event.*;
import javax.swing.event.*;
import java.awt.*;
import java.util.*;

class ChessGUI {
	int maxn = 20;
	boolean mode = true;
	JButton[][] button = new JButton[maxn+1][maxn+1];
	int i,j;
	
	public ChessGUI(int size) {
		maxn = size;
	}
	
	public ChessGUI() {
	}
			
	public void InitButton() {
		for(int i=0;i<=maxn;i++) {
			for(int j=0;j<=maxn;j++) {
				button[i][j] = new JButton(" ");
			}
		}
	}
			
	private void RandAI() {
		Random random = new Random();
		int x,y;
		x = random.nextInt(maxn-1)+1;
		y = random.nextInt(maxn-1)+1;
		while (button[x][y].getText()!=" ") {
			x = random.nextInt(maxn-1)+1;
			y = random.nextInt(maxn-1)+1;
		}
		button[x][y].doClick();
	}
	
	public static void main(String[] args) {
		ChessGUI a = new ChessGUI();
		a.GUI();
	}
	
	boolean Judge(int i,int j,String ch) {
		int x,y,count;
		
		x=i;y=j;count=0;
		while (x>0 && button[x][y].getText().equals(ch)) {
			x--; count++;
		}
		x=i;
		while (x<=maxn && button[x][y].getText().equals(ch)) {
			x++; count++;
		}
		if(count-1==5) return true;
	
		
		x=i;y=j;count=0;
		while (y>0 && button[x][y].getText().equals(ch)) {
			y--; count++;
		}
		y=j;
		while (y<=maxn && button[x][y].getText().equals(ch)) {
			y++; count++;
		}
		if(count-1==5) return true;
		
		
		x=i;y=j;count=0;
		while (y>0 && x>0 && button[x][y].getText().equals(ch)) {
			y--; x--; count++;
		}
		x=i;y=j;
		while (y<=maxn && x<=maxn && button[x][y].getText().equals(ch)) {
			y++; x++; count++;
		}
		if(count-1==5) return true;
		
		
		x=i;y=j;count=0;
		while (y>0 && x>0 && button[x][y].getText().equals(ch)) {
			y--; x++; count++;
		}
		x=i;y=j;
		while (y<=maxn && x<=maxn && button[x][y].getText().equals(ch)) {
			y++; x--; count++;
		}
		if(count-1==5) return true;
		
		
		return false;
	}
	
	public void init() {
		for(i=1;i<=maxn;i++) {
			for(j=1;j<=maxn;j++) {
				button[i][j].setText(" ");
			}
		}
		mode = true;
	}
	
	public void GUI() {
		JFrame frame = new JFrame();
		frame.setTitle("Chess");
		frame.setLayout(new BorderLayout());
		
		
		JPanel chessPanel = new JPanel(new GridLayout(maxn,maxn));
		JPanel informPanel = new JPanel(new FlowLayout());
		JLabel label = new JLabel("◯ Please");
		informPanel.add(label);
		InitButton();
		for(i=1;i<=maxn;i++) {
			for(j=1;j<=maxn;j++) {
				final int x=i,y=j;
				chessPanel.add(button[i][j]);
				button[i][j].addActionListener(new ActionListener() {
					public void actionPerformed(ActionEvent e) {
						if (button[x][y].getText().equals(" ")) {
							if(mode) {
								button[x][y].setText("◯");
								mode = !mode;
								if(Judge(x,y,"◯")) {
									JOptionPane.showMessageDialog(null, "◯ wins!", "inform", JOptionPane.ERROR_MESSAGE);
									init();
								}
							}
							else {
								button[x][y].setText("◉");
								mode = !mode;
								if(Judge(x,y,"◉")) {
									JOptionPane.showMessageDialog(null, "◉ wins!", "inform", JOptionPane.ERROR_MESSAGE);
									init();
								}
							}
							if(mode) label.setText("O Please");
							else {
								label.setText("X Please");
								//RandAI();
							}
						}
					}
				});

				
			}
		}
		
		

		frame.add("Center",chessPanel);
		frame.add("South",informPanel);
		
		frame.setVisible(true);
		frame.setSize(new Dimension(30*maxn,20*maxn+120));
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	} 
}

