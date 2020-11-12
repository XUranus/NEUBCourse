import java.io.*;

//3.2.1.2
//Treatment Inforamtion maintain 
public class MedicalProject {
	private double price; 
	private String projectId;
	private String projectName;
	private String chargeKind;//range "A"-"C"
	private int chargeProjectLevel;//rang 1-4
	private boolean needApproval;
	//private String unit;
	//private String producer;
	private String remarks;
	//private String limitUseArea;
	public MedicalProject() { //constructor
		
	}
	
	public double getPrice() {
		return price;
	}
	
	public String getChargeKind() {
		return chargeKind;
	}
	
	public int getChargeProjectLevel() {
		return chargeProjectLevel;
	}
	
	public MedicalProject(String name,String id,double price,String chargeKind,int chargeProjectLevel,boolean needApproval,String remarks) {
		projectName = name;
		projectId = id;
		this.price = price;
		this.chargeKind = chargeKind;
		this.chargeProjectLevel = chargeProjectLevel;
		this.needApproval = needApproval;
		this.remarks = remarks;
	}
	
	public void WriteToFile() {
		try{
			File f = new File("MedicalProject/"+projectName+"_"+projectId);
			BufferedWriter out = new BufferedWriter(new FileWriter(f));
			String str = projectName + " "+projectId +" "+price+" "+chargeKind+" "+chargeProjectLevel+" "+needApproval+remarks;
			out.write(str);
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}

}

