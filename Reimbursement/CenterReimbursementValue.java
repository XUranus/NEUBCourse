import javax.lang.model.element.*;
import java.util.*;

//3.2.3.1
public class CenterReimbursementValue { //singleton design pattern
	private static CenterReimbursementValue single = null;
	ArrayList<Medicine> medicineList = new ArrayList<Medicine>();
	ArrayList<MedicalProject> medicalProjectList = new ArrayList<MedicalProject>();
	ArrayList<MedicalFacility> medicalFacilityList = new ArrayList<MedicalFacility>();

	public Load() { //to load ,if used to reload , attention: make sure the array is empty
		
	}

	private CenterReimbursementValue() {
		Load();
	}
	

	public static CenterReimbursementValue getInstance() {
		if(single == null) {
			single = new CenterReimbursementValue();
		}
		return single;
	}
	
	public void addChargeItem(ChargeItem item) {
		String name = item.getName();
		for(int i=0;i<medicineList.size();i++) {
			if(medicineList.get(i).getName()==name) {
				q
				return;
			}
		}
		
		for() {
			
		}
		
		for() {
			
		}
	} 
}

