import java.util.*;
import java.io.*;

//3.2.1.4

public class Institution {
	private String name;
	private String id;
	private String kind;
	private String address;
	private String postalCode;
	private String telephone;
	ArrayList<Person> personList;
	public Institution(String name,String id){
		this.name = name;
		this.id = id;
		this.kind = "";
		this.address = "";
		this.postalCode = "";
		this.telephone = "";
	}
	
	public Institution(String str) {
		this.name = "";
		this.id = "";
		this.kind = "";
		this.address = "";
		this.postalCode = "";
		this.telephone = "";
		StringTokenizer st = new StringTokenizer(str, " ");
		if(st.hasMoreTokens()) name = st.nextToken();
		if(st.hasMoreTokens()) id = st.nextToken();
		if(st.hasMoreTokens()) kind = st.nextToken();
		if(st.hasMoreTokens())	address = st.nextToken();
		if(st.hasMoreTokens()) postalCode = st.nextToken();
		if(st.hasMoreTokens()) telephone = st.nextToken();
	}
	
	public Institution(String name,String id,String kind,String address,String postalCode,String telephone) {
		this.name = name;
		this.id = id;
		this.kind = kind;
		this.address = address;
		this.postalCode = postalCode;
		this.telephone = telephone;
	}
	
	public void WriteToFile() {
		try{
			File f = new File("Institutioninfo/"+name+"_"+id+".txt");
			BufferedWriter out = new BufferedWriter(new FileWriter(f));
			String str = name + " " + id + " " + kind + " " + address + " " + postalCode +" " + telephone;
			System.out.println(str);
			out.write(str);
			out.close();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void addPerson(Person a) {
		personList.add(a);
	}
	
	public String getName() {
		return name;
	}
	
	public String getId() {
		return id;
	}
	
	public String getKind() {
		return kind;
	}
	
	public String getAddress() {
		return address;
	}
	
	public String getPostalCode() {
		return postalCode;
	}
	
	public String getTelephone() {
		return telephone;
	}
}


class Hospital extends Institution{
	private int level;
	private LegalRepresentative legalRepresentative ;
	private String remarks;
	private String mobile;
	
	
	public Hospital(String name,String id,String kind,String address,String postalCode,String telephone,int level,String remarks,String mobile) { //constructor
		super(name,id,kind,address,postalCode,telephone);
		this.level = level;
		this.remarks = remarks;
		this.mobile = mobile;
	}
	
	public String getName() {
		return super.getName();
	}
	
	public String getId() {
		return super.getId();
	}
	
	public int getLevel() {
		return level;
	}
	
	public void WriteToFile() {
		try{
			File f = new File("HospitalInfo/"+super.getName()+"_"+super.getId()+".txt");
			BufferedWriter out = new BufferedWriter(new FileWriter(f));
			String str = super.getName() + " " + super.getId() + " " + super.getKind() + " " + super.getAddress() + " " + super.getPostalCode() +" " + super.getTelephone() +" "+level + " "+ remarks+" "+mobile;
			System.out.println(str);
			out.write(str);
			out.close();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public boolean medicineAvailable(Medcine m) { //to show whether this kind of medcine is available in this hospital
		if(m.getLevel()>=level) return true;
		else return false;
	}
	
	public boolean medicalProjectAvailable(MedicalProject m) { //to show whether this kind of medcal project is available in this hospital
		if(m.getChargeProjectLevel()>=level) return true;
		else return false;
	}
	
	public double reimbursementValue(Medcine m) {
		double price=0;
		if(!medicineAvailable(m)) return 0;
		if(m.getStandardPrice()<m.getPrice()) 
			price=m.getStandardPrice();
		else price=m.getPrice();
		if(m.getKind()=="A") return price;
		else if(m.getKind()=="B") return price*0.5;
		return 0; 
	}
	
	public double reimbursementValue(MedicalProject m) {
		if(!medicalProjectAvailable(m)) return 0;
		if(m.getChargeKind()=="A") return m.getPrice();
		else if(m.getChargeKind()=="B") return m.getPrice()*0.5;
		return 0;
	}
	
	public double reimbursementValue(MedicalFacility m) {
		return m.getPrice();
	}
	
}

