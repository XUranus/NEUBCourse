package lib;

import de.hunsicker.jalopy.Jalopy;
import java.io.*;

public class CodePretty {

    public static void pretty(File input,File output) {
        try {
            Jalopy j = new Jalopy();
            j.setEncoding("GBK");
            j.setInput(input);
            j.setOutput(output);
            j.format();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

}