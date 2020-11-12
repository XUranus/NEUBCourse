import javax.lang.model.element.*;
import java.io.*;

//3.2.1.5

public class MedicalFacility { //this kind can be fully reimbursed
	private String name;
	private String id;
	private String chargeKind;
	private String remark;
	private String limitUseArea;
	private double price;
	public double getPrice() {
		return price;
	}
	
	public MedicalFacility(String name,String id,String chargeKind,String remark,String limitUseArea,double price) {
		this.name = name;
		this.id =id;
		this.chargeKind = chargeKind;
		this.remark = remark;
		this.limitUseArea = limitUseArea;
		this.price = price;
	}
	
	public void WriteToFile() {
		try{
			File f = new File("MedicalFacility/"+name+"_"+id);
			BufferedWriter out = new BufferedWriter(new FileWriter(f));
			String str = name + " "+id +" "+chargeKind+" "+remark+" "+limitUseArea+" "+price;
			out.write(str);
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}
	
}