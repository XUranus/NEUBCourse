package com.xuranus.main.Controller;

import com.xuranus.main.GeneralConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/main")
    public String mainPage(Model model, HttpSession session){
        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("title","用户缴费系统");
        return "user-main";
    }

    @GetMapping("/account")
    public String account(Model model, HttpSession session){
        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("title","用户缴费系统");
        int user_id = (int)session.getAttribute("user_id");

        Map user = getUserById(user_id);
        if(user==null) return "error";
        else model.addAttribute("user",user);

        List devices = getUserDevicesById(user_id);
        model.addAttribute("my_devices",devices);

        List bankcards = getBankcardsByUserId(user_id);
        model.addAttribute("bankcards",bankcards);
        return "user-account";
    }

    @GetMapping("/query")
    public String queryThisMonth(Model model, HttpSession session){
        int user_id = (int)session.getAttribute("user_id");
        String sql = "select * from fee_payable where user_id="+user_id;
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("electric_degree",rs.getDouble("electric_degree"));
                row.put("total_fee",rs.getDouble("total_fee"));
                row.put("has_paid",rs.getDouble("has_paid"));
                row.put("should_pay",rs.getDouble("should_pay"));
                row.put("fee1",rs.getDouble("fee1"));
                row.put("fee2",rs.getDouble("fee2"));
                row.put("generate_date",rs.getDate("generate_date"));
                return row;
            }});
        if(result.size()!=1) {
            return "error";
        }
        else {
            Map bill = (Map) result.get(0);
            model.addAttribute("title", "本月账单查询");
            model.addAttribute("username",session.getAttribute("username"));
            model.addAttribute("bill", bill);
            return "user-query";
        }
    }



    @GetMapping("/bills")
    public String bills(Model model, HttpSession session){
        int user_id = (int)session.getAttribute("user_id");
        String sql = "select * from bill where bill_status=0 and user_id = "+user_id;
        List bills = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                //put something here...
                row.put("bill_id",rs.getInt("bill_id"));
                row.put("bill_status",rs.getInt("bill_status"));
                row.put("total_cost",calcuBillPenalty(rs.getInt("bill_id")));
                row.put("principle",rs.getDouble("principle"));
                row.put("user_id",rs.getInt("user_id"));
                row.put("bill_generate_date",rs.getDate("bill_generate_date"));
                row.put("bill_start_date",rs.getDate("bill_start_date"));
                row.put("bill_payed_date",rs.getDate("bill_payed_date"));
                return row;
            }});
        //System.out.println(bills);
        model.addAttribute("title", "用户缴费系统");
        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("bills", bills);
        return "user-bills";
    }



    @GetMapping("/recharge")//在线缴费
    public String recharge(Model model, HttpSession session){
        int user_id = (int)session.getAttribute("user_id");
        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("title","用户缴费系统");

        //获取设备列表;
        List devices = getUserDevicesById(user_id);
        model.addAttribute("my_devices",devices);
        //System.out.println(devices);

        //获取银行卡列表
        String sql = "select * from bankcard where user_id="+user_id;
        List cards = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("bank_id", rs.getInt("bank_id"));
                row.put("bankcard_number",rs.getString("bankcard_number"));
                return row;
            }});
        //System.out.println(cards);
        model.addAttribute("my_cards",cards);
        return "user-recharge";
    }



    @GetMapping("/recharge-record")//历史缴费记录
    public String rechargeRecord(Model model, HttpSession session){
        int user_id = (int)session.getAttribute("user_id");
        String sql = "select * from recharge where user_id="+user_id;
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                    row.put("recharge_id",rs.getInt("recharge_id"));
                    row.put("recharge_date",rs.getDate("recharge_date"));
                    row.put("recharge_remark",rs.getString("recharge_remark"));
                    row.put("recharge_money",rs.getDouble("recharge_money"));
                    row.put("payment_seq_number",rs.getString("payment_seq_number"));
                    row.put("user_id",rs.getInt("user_id"));
                    row.put("device_id",rs.getInt("device_id"));
                return row;
            }});
        //System.out.println("hey : "+result);

        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("title","用户缴费系统");
        model.addAttribute("historyRechargeRecord", result);
        return "user-recharge-record";
    }



    /******************************************** Service  ****************************************************/


    private Map getUserById(int user_id) {
        String sql = "select * from user where user_id= "+user_id;
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("username", rs.getString("username"));
                row.put("balance",rs.getDouble("balance"));
                row.put("telephone",rs.getString("telephone"));
                row.put("register_date",rs.getString("register_date"));
                row.put("user_id",rs.getInt("user_id"));
                return row;
            }});
        if(result.size()!=1) {
            return null;
        }
        else return (Map)result.get(0);
    }

    private List getUserDevicesById(int user_id) {
        String sql = "select * from device where user_id = "+user_id;
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("device_id", rs.getInt("device_id"));
                row.put("device_type",rs.getInt("device_type"));
                row.put("last_reading",rs.getDouble("last_reading"));
                row.put("address",rs.getString("address"));
                row.put("arrears",rs.getDouble("arrears"));
                return row;
            }});
        return result;
    }


    private Map getDeviceById(int device_id) {//根据设备ID获取设备
        String sql = "select * from device where device_id = " + device_id;
        List devices = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("last_reading", rs.getDouble("last_reading"));
                row.put("device_id", rs.getInt("device_id"));
                row.put("address", rs.getString("address"));
                row.put("user_id",rs.getInt("user_id"));
                row.put("arrears",rs.getDouble("arrears"));
                row.put("device_type",rs.getInt("device_type"));
                return row;
            }
        });
        if(devices.size()==0) return null;
        else return (Map)devices.get(0);
    }

    private double calcuBillPenalty(int bill_id) {
        String sql1 = "select bill_start_date from bill where bill_id="+bill_id;
        Date startDate = jdbcTemplate.queryForObject(sql1,Date.class);
        Double cost = 0.0;

        String sql2 = "select * from device_bill where bill_id = "+bill_id;
        List result = jdbcTemplate.query(sql2, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                int device_id = (int)rs.getInt("device_id");
                Map device =getDeviceById(device_id);
                int device_type = (int)device.get("device_type");
                double device_arrears = (Double)device.get("arrears");
                row.put("cost",calcuDevicePernalty(device_type,startDate,device_arrears));
                return row;
            }});
        for(int i=0;i<result.size();i++) {
            cost += (Double)((Map)result.get(i)).get("cost");
        }
        return cost;
    }

    private List getBankcardsByUserId(int user_id) {
        String sql = "select bankcard_number,bank_id from bankcard where user_id = "+user_id;
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("bankcard_number",rs.getString("bankcard_number"));
                row.put("bank_id",rs.getInt("bank_id"));
                return row;
            }});
        return result;
    }

    private double calcuDevicePernalty(int deviceType, Date startDate,double arrears) {
        Calendar cal1 = Calendar.getInstance();
        cal1.setTime(startDate);

        Calendar cal2 = Calendar.getInstance();
        cal2.setTime(new java.util.Date());

        int day1= cal1.get(Calendar.DAY_OF_YEAR);
        int day2 = cal2.get(Calendar.DAY_OF_YEAR);

        int year1 = cal1.get(Calendar.YEAR);
        int year2 = cal2.get(Calendar.YEAR);

        if(year1==year2) {
            int days = day2-day1;
            if(deviceType==1) return GeneralConfig.CIVIL_CURRENT_YEAR_PERNALTY*days*arrears;
            else return GeneralConfig.BUSINESS_CURRENT_YEAR_PERNALTY*days*arrears;
        }
        else {
            int daysCurrentYear = 365-day1;
            int daysCrossYear = 365*(year2-year1-1)+day2;
            if(deviceType==1) return GeneralConfig.CIVIL_CROSS_YEAR_PERNALTY*daysCurrentYear*arrears;
            else return GeneralConfig.BUSINESS_CROSS_YEAR_PERNALTY*daysCrossYear*arrears;
        }
    }
}

