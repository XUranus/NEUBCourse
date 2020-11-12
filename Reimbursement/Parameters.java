import java.util.*;
import java.io.*;

//3.2.1.6
class MaxReimbursement {
	private String patientKind;
	private double maxValue;
	
	public MaxReimbursement(String patientKind,double maxValue) {
		this.patientKind = patientKind;
		this.maxValue = maxValue;
	}
}

class PayStandard {
	private String treatMentKind;
	private String patientKind;
	private String hospitalLevel;
	private double payStandard;
	
	public PayStandard(String treatMentKind,String patientKind,String hospitalLevel,double payStandard) {
		this.treatMentKind = treatMentKind;
		this.patientKind = patientKind;
		this.hospitalLevel = hospitalLevel;
		this.payStandard = payStandard;
	}
}

class IndivalSubsectionPayRate {
	private String treatMentKind;
	private String patientKind;
	private String hospitalLevel;
	private double reimbursementRate;
	private double maxMoney;
	private double minMoney;
	
	public IndivalSubsectionPayRate(String treatMentKind,String patientKind,String hospitalLevel,double reimbursementRate,double maxMoney,double minMoney) {
		this.treatMentKind = treatMentKind;
		this.patientKind = patientKind;
		this.hospitalLevel = hospitalLevel;
		this.reimbursementRate = reimbursementRate;
		this.maxMoney = maxMoney;
		this.minMoney = minMoney;
	}
	
}

public class Parameters {
	ArrayList<MaxReimbursement> maxReimbursement;
	ArrayList<PayStandard> payStandard;
	ArrayList<IndivalSubsectionPayRate> indivalSubsectionPayRate;
	
	public void Parameters() {
		maxReimbursement = new ArrayList<MaxReimbursement>();
		payStandard = new ArrayList<PayStandard>();
		indivalSubsectionPayRate = new ArrayList<IndivalSubsectionPayRate>();

		try{
			String filepath = "Parameters/";
			BufferedReader read = new BufferedReader(new FileReader(new File(filepath+"MaxReimbursement.txt")));
			String str = "";
			while ((str = read.readLine())!=null) {
				StringTokenizer st = new StringTokenizer(str," ");
				String kind = st.nextToken();
				String val = st.nextToken();
				maxReimbursement.add(new MaxReimbursement(kind, Double.parseDouble(val)));
			}
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		
		try{
			String filepath = "Parameters/";
			BufferedReader read = new BufferedReader(new FileReader(new File(filepath+"PayStandard.txt")));
			String str = "";
			while ((str = read.readLine())!=null) {
				StringTokenizer st = new StringTokenizer(str," ");
				String v1,v2,v3,v4;
				v1 = st.nextToken();
				v2 = st.nextToken();
				v3 = st.nextToken();
				v4 = st.nextToken();
				payStandard.add(new PayStandard(st.nextToken(),st.nextToken(),st.nextToken(),Double.parseDouble(v4)));
			}
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		
		try{
			String filepath = "IndivalSubsectionPayRate/";
			BufferedReader read = new BufferedReader(new FileReader(new File(filepath+"IndivalSubsectionPayRate.txt")));
			String str = "";
			while ((str = read.readLine())!=null) {
				StringTokenizer st = new StringTokenizer(str," ");
				String v1,v2,v3,v4,v5,v6;
				v1 = st.nextToken();
				v2 = st.nextToken();
				v3 = st.nextToken();
				v4 = st.nextToken();
				v5 = st.nextToken();
				v6 = st.nextToken();
				indivalSubsectionPayRate.add(new IndivalSubsectionPayRate(v1,v2,v3,Double.parseDouble(v4),Double.parseDouble(v5),Double.parseDouble(v6)));
			}
		}
		catch (IOException e) {
			e.printStackTrace();
		}

		

	}
	/*
	public double getMaxReimbursement(Patient p){
		
		
	}
	
	public double getPayStandard() {
		
		
	}
	
	public double getIndivalSubsectionPayRate() {
		
	}*/
}