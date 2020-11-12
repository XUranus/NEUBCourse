import java.io.*;

public class Disease {
	private String id;
	private String name;
	private String kind;//decide wheather this kind of disease can be reimbursed
	private String remarks;
	private String reimbursementSymbol;
	
	public Disease(String name,String id,String kind,String remarks,String reimbursementSymbol) {
		this.id =id;
		this.name=name;
		this.kind=kind;
		this.remarks=remarks;
		this.reimbursementSymbol=reimbursementSymbol;
	}
	
	public void WriteToFile(File f) {
		FileWriter fout;
		try{
			fout =new FileWriter(f);
			String content = id + " " + name+ " " + kind + " " + remarks + " " + reimbursementSymbol;
			System.out.println(content);
			fout.write(content);
			fout.close();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
	}
}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                