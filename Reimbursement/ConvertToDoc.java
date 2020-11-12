import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

class PrintData {
	public String year;
	public String month;
	public String day;
	public String institutionName;
	public String institutionId;
	public String name;
	public String id;
	public String kind;
	public String reason;
	public String kind2;
	public String times;
	public String hospital;
	public String timeRange;
	public String text1;
	public String text2;
	public String text3;
	public String text4;
	public String text5;
	public String text6;
	public String text7;
	public String text8;	
}

public class ConvertToDoc {
	
	private PrintData printData;
	private Configuration configuration = null;
	
	public ConvertToDoc(PrintData printData){
		configuration = new Configuration();
		configuration.setDefaultEncoding("UTF-8");
		this.printData=printData;
	}
	
	public ConvertToDoc() {}
	
	public static void main(String[] args) {
		ConvertToDoc test = new ConvertToDoc();
		test.createWord();
	}
	
	public void createWord(){
		Map<String,Object> dataMap=new HashMap<String,Object>();
		getData(dataMap);
		configuration.setClassForTemplateLoading(this.getClass(), "Source/");  //FTL文件所存在的位置
		Template t=null;
		try {
			t = configuration.getTemplate("ListModel.ftl"); //文件名
			if(t==null) System.out.println("Model file open failed");
		} catch (IOException e) {
			e.printStackTrace();
			System.out.println("Model file open failed1");
		}
		File outFile = new File(printData.name+"结算清单"+".doc");
		Writer out = null;
		try {
			out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFile)));
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
		 
        try {
			t.process(dataMap, out);
		} catch (TemplateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private void getData(Map<String, Object> dataMap) {
		dataMap.put("year", printData.year);
		dataMap.put("month", printData.month);
		dataMap.put("day", printData.day);
		dataMap.put("institutionName", printData.institutionName);
		dataMap.put("institutionId", printData.institutionId);
		dataMap.put("name", printData.name);
		dataMap.put("id", printData.id);
		dataMap.put("kind", printData.kind);
		dataMap.put("reason", printData.reason);
		dataMap.put("kind2", printData.kind2);
		dataMap.put("times", printData.times);
		dataMap.put("hospital", printData.hospital);
		dataMap.put("timeRange", printData.timeRange);
		dataMap.put("text1", printData.text1);
		dataMap.put("text2", printData.text2);
		dataMap.put("text3", printData.text3);
		dataMap.put("text4", printData.text4);
		dataMap.put("text5", printData.text5);
		dataMap.put("text6", printData.text6);
		dataMap.put("text7", printData.text7);
		dataMap.put("text8", printData.text8);
		
	}
}