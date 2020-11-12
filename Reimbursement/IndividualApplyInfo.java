
//3.2.2.1

public class IndividualApplyInfo { //the person who dont see local in origin hospital
	private String id;
	private Patient patient;
	private String approvalKind;
	private String beginDate;
	private String endDate;
	private Hospital originHospital;
	private String opinion;
	private String approvalOfficer;
	private String approvalDate;
	private boolean passed;
}

//3.2.2.2
class SpecialTreatmentApplyInfo { //special medcine that need to be approved
	private String id;
	private Patient patient;
	private String approvalKind;
	private String beginDate;
	private String endDate;
	private Medicine medicine;
	private String opinion;
	private String approvalOfficer;
	private String approvalDate;
	private boolean passed;
}