import java.util.*;
import javax.tools.*;
import javax.xml.ws.soap.*;
import java.io.*;
import java.nio.*;

class Person {
	/*
	(个人ID),证件类型,(证件编号),(姓名),(性别),(民族),(出生日期),参加工作日期,离退休日期,离退休状态,户口性质,(户口所在地),文化程度,政治面貌,(个人身份),用工形式,专业技术职务,国家职业资格等级（工人技术等级）,婚姻状况,行政职务,备注,单位编码,医疗人员类别,健康状况,劳模标志,干部标志,公务员标志,在编标志,居民类别,灵活就业标志,农民工标志,雇主标志,军转人员标志,社保卡号（系统自动生成），定点医疗机构编码 
	*/
	private String name;
	private String id;
	private String gender;
	private String birthday;
	private String mobile;
	private String region;
	private String address;
	private Institution institution;
	public Person(String name,String id) {
		this.name = name;
		this.id = id;
		this.gender = "";
		this.birthday = "";
		this.mobile = "";
		this.region = "";
		this.address = "";
	}
	public Person(String name,String id,String gender,String birthday,String mobile,String region,String address) {
		this.name = name;
		this.id = id;
		this.gender = gender;
		this.birthday = birthday;
		this.mobile = mobile;
		this.region = region;
		this.address = address;
	}
	
	public Person(String str) {
		StringTokenizer st = new StringTokenizer(str," ");
		while (st.hasMoreTokens()) {
			this.name = st.nextToken();
			this.id = st.nextToken();
			this.gender = st.nextToken();
			this.birthday = st.nextToken();
			this.mobile = st.nextToken();
			this.region = st.nextToken();
			this.address = st.nextToken();
		}
	}
	
	public Person() {
		
	}
	
	public String getName() {
		return name;
	}
	
	public String getId() {
		return id;
	}
	
	public String getGender() {
		return gender;
	}
	
	public String getBirthday() {
		return birthday;
	}
	
	public String getMobile() {
		return mobile;
	}
	
	public String getRegion() {
		return region;
	}
	
	public String getAddress() {
		return address;
	}
	
	public void WriteToFile() {
		try{
			File f = new File("PersonInfo/"+name+"_"+id+".txt");
			BufferedWriter out = new BufferedWriter(new FileWriter(f));
			String str = name + " " + id +" "+ gender +" "+birthday+" "+mobile+" "+region+" "+address;
			System.out.println(str);
			out.write(str);
			out.close();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}

} 

class LegalRepresentative extends Person {
	public LegalRepresentative() {}
}

class Patient extends Person{
	public Patient(String name,String id,int inHospitalTimes){
		super(name,id);
		this.inHospitalTimes = inHospitalTimes;
	}
	private Hospital currentHospital;
	private Hospital usualHospital;
	private ArrayList<Hospital> canGoTo;
	private String patientNumber;
	private String treatmentKind;
	private String diseaseId;
	private String diagnosisDiseaseId;
	private String diagnosisDiseaseName;
	private String outHospitalReason;
	private String patientKind;
	private int inHospitalTimes;
	private String outHospitalTime;
	private String lastDiagnose;
	private double reimbursementStatistic;//
	private double selfPayingStatistic;//
	private double medicalCostStatistic;//
	private ArrayList<Prescription> prescription;
	public Patient(){
		canGoTo= new ArrayList<Hospital>();
	}
	
	public boolean canGo(Hospital h){
		for(int i=0;i<canGoTo.size();i++) {
			if(canGoTo.get(i).getId().equals(usualHospital.getId())) return true;
		}
		return false;
	}
	
	public void addNewHospital(Hospital h) {
		canGoTo.add(h);
	} 
	
	/*public void WriteToFile(){
		String filename = "PatientsInfo/"+super.getName()+"_"+super.getId()+".txt";
		try{
			File f = new File(filename);
			BufferedWriter out = new BufferedWriter(new FileWriter(f,false));
			
			
		}
	}*/
	
}




