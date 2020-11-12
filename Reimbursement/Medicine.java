import javax.lang.model.element.*;
import java.io.*;

//Medicine Information maintain
//3.2.1.1

public class Medicine {
	private String id;
	private String name;
	private String chargekind;
	/*range A-D this is the kind of medicine ; A B C D Reimbursement rate are 100% 50% 0% 0% ; 
	D is the special kind
	need Approval;
	*/
	private String prescription; //prescribed drug symbol//
	private int level;// range 1-4
	private double standardPrice;
	private double price;
	private boolean needApproval;
	//the following varaible are not used in this program
	private String mark;
	private String measurementUnit;
	private String englishName;
	private String kind;
	private int frequency;//unit times;
	private String usage;
	private String unit;
	private String standard;
	private int qualityGuaranteePeriod;
	private String tradeName;
	private String factoryName;
	private String nationalDrugCertificate;
	private String remarks;
	private String nationalContentCode;
	private String limitUseArea;
	private String placeOfOrigin;
	
	public Medicine(String name,String id,String chargekind,String prescription,int level,double standardPrice,double price,boolean needApproval) { //constructor
		this.name = name;
		this.id = id;
		this. chargekind = chargekind;
		this.prescription= prescription;
		this.level = level;
		this.standardPrice = standardPrice;
		this.price = price;
		this.needApproval = needApproval;
	} 
	
	public String getName() {
		return name;
	}
	
	public String getEnglishName() {
		return englishName;
	}
	
	public String getId() {
		return id;
	}
	
	public double getPrice() {
		return price;
	}
	
	public String getKind() {
		return kind;
	}
	
	public double getStandardPrice() {
		return standardPrice;
	}
	
	public int getLevel() {
		return level;
	}
	
	public void WriteToFile() {
		try{
			File f = new File("MedicineInfo/"+name+"_"+id+".txt");
			BufferedWriter out = new BufferedWriter(new FileWriter(f));
			String str = name + " " + id + " " + chargekind + " "+ prescription+ " " +level+" "+ standardPrice + " "+ price+" "+needApproval;
			System.out.println(str);
			out.write(str);
			out.close();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}

}
