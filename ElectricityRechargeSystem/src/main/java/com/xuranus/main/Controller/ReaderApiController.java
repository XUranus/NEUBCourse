package com.xuranus.main.Controller;

import com.xuranus.main.GeneralConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.sql.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/reader/api")
public class ReaderApiController {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    @RequestMapping("/confirm-record")//接受设备号和度数 预处理返回详细信息
    public Map confirmRecord(HttpSession session, HttpServletRequest req, HttpServletResponse res) {
        int device_id = Integer.parseInt(req.getParameter("device_id"));
        double current_reading = Double.parseDouble(req.getParameter("reading"));

        /**
         * 需要判断今日是否为合法的抄表日期
         * 需要判断表是否已经被抄了 需要给表增加一个属性
         */

        String sql = "select * from device where device_id = " + device_id;
        Map device = getDeviceById(device_id);
        if (device==null || current_reading < (double) (device.get("last_reading"))) {
            Map resJson = new HashMap();
            resJson.put("success", false);
            resJson.put("msg", "读数或设备号不正确");
            return resJson;
        } else {
            Map resJson = device;
            resJson.put("reader_name", session.getAttribute("meter_reader_name"));
            resJson.put("success", true);
            resJson.put("current_reading", current_reading);
            return resJson;
        }
    }

    @RequestMapping("/save-record")//存储抄表结果
    public Map saveRecord(HttpSession session, HttpServletRequest req, HttpServletResponse res) {
        int device_id = Integer.parseInt(req.getParameter("device-id"));
        String meter_reader_name = req.getParameter("reader");
        String address = req.getParameter("address");
        double currentReading = Double.parseDouble(req.getParameter("current-reading"));

        //创建抄表记录表
        String sql1 = "insert into read_record (device_id,reading,meter_reader_id,meter_reader_name,record_date) values "
                +"("+device_id+","+currentReading+","+session.getAttribute("meter_reader_id")+",'"+meter_reader_name+"',NOW())";
        //System.out.println("SQL:"+sql);

        Map device = getDeviceById(device_id);
        int user_id = (int)device.get("user_id");
        //判断该设备目前有没有欠费(?抄表自动还欠费)
        // 有欠费：
        //余额够 还掉
        /*String sql2 =
                " select * from device_bill" +
                    " where device_bill.device_id = " + device_id + " and device_bill.arrears>0 and device_bill.bill_id in ("+
                        " select bill_id from bill" +
                            " where bill.user_id = "+ user_id + " and bill.bill_status==0 )";*/

        //判断目前是否欠费（上月是否还清了欠款） 生成bill
        System.out.println("device:"+device);
        if((double)device.get("arrears")>0){
            int bill_id = hasGenerateBill(user_id);
            if(bill_id<0)//还没有生成bill
                generateNewBill(user_id,device_id,(double)device.get("arrears"));
            else
                appendToBill(bill_id,device_id,(double)device.get("arrears"));
        }


        //计算本月电费 更新应缴费表
        Map deviceCost = calculateThisMonthDeviceCost(device_id,currentReading);
        System.out.println("device_cost:"+deviceCost);

        //计算已经交的钱（余额扣）
        double balance = (double)(getUserById(user_id).get("balance"));
        double has_paid,arrears;
        String sql;
        double total_fee = (double)deviceCost.get("total_fee");
        if(total_fee<=balance) {
            has_paid = total_fee;
            updateBalance(user_id,balance-total_fee);
            arrears = 0;
        } else {
            has_paid = balance;
            updateBalance(user_id,0);
            arrears = total_fee-balance;
        }

        if(hasGenerateFeePayable(user_id)) {//如果已经有设备导致这个月的应交表更新
            System.out.println("has generate fee payable");
            sql =
                "update fee_payable set "+
                        " fee1 = fee1+"+(double)deviceCost.get("fee1")+
                        ", fee2 = fee2+"+(double)deviceCost.get("fee2")+
                        ", basic_fee = basic_fee+"+(double)deviceCost.get("basic_fee")+
                        ", should_pay = should_pay+"+(total_fee-has_paid)+
                        ", electric_degree = electric_degree+"+(double)deviceCost.get("electric_degree")+
                        ", total_fee = total_fee+"+total_fee+
                        ", has_paid = has_paid+"+has_paid+
                        " where user_id = "+user_id;
        }
        else {//直接更新 覆盖原值
            sql =
                "update fee_payable set "+
                        " fee1 = "+(double)deviceCost.get("fee1")+
                        ", fee2 = "+(double)deviceCost.get("fee2")+
                        ", basic_fee = "+(double)deviceCost.get("basic_fee")+
                        ", should_pay = "+(total_fee-has_paid)+
                        ", generate_date = NOW()"+
                        ", electric_degree = "+(double)deviceCost.get("electric_degree")+
                        ", total_fee = "+total_fee+
                        ", has_paid = "+has_paid+
                        " where user_id = "+user_id;
        }
        System.out.println("sql="+sql);
        jdbcTemplate.update(sql);

        //刷新设备欠款 读数
        refreshDevice(device_id,(double)deviceCost.get("electric_degree"),arrears);


        Map resJson = new HashMap();
        if(jdbcTemplate.update(sql1)>0) {
            resJson.put("success",true);
        }
        else {
            resJson.put("success", false);
            resJson.put("msg","操作失败");
        }
        return resJson;
    }

    private Map calculateThisMonthDeviceCost(int device_id,Double currentReading) {
        //计算本月电费
        Map device = getDeviceById(device_id);
        double electricityDegree = currentReading-(Double) device.get("last_reading");
        double basicFee = electricityDegree* GeneralConfig.FEE_PER_DEGREE;
        double fee1 = basicFee*0.08;
        int deviceType = (int)device.get("device_type");
        double fee2 = deviceType==1?basicFee*0.1:basicFee*0.15;
        Map feePayable = new HashMap();

        feePayable.put("electric_degree",electricityDegree);
        feePayable.put("total_fee",fee1+fee2+basicFee);
        feePayable.put("basic_fee",basicFee);
        feePayable.put("fee1",fee1);
        feePayable.put("fee2",fee2);
        return feePayable;
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

    private int hasGenerateBill(int user_id) {//判断是否已经生成了该月的欠费表 返回欠费表的id或者-1表示没有
        String sql1 = "select count(*) from bill where user_id = "+user_id+" and bill_generate_date = date_format(now(),'%Y-%m-%d')";
        int count = jdbcTemplate.queryForObject(sql1, Integer.class);
        String sql2 =  "select bill_id from bill where user_id = "+user_id+" and bill_generate_date = date_format(now(),'%Y-%m-%d')";
        if(count==1) {
            int bill_id = jdbcTemplate.queryForObject(sql2,Integer.class);
            return bill_id;
        }
        else return -1;
     }

    private boolean generateNewBill(int user_id,int device_id,double arrears) {//为一个用户创建一个新的欠费表
        final String sql1 =
                "insert into bill "+
                "(principle,user_id,bill_generate_date,bill_start_date,has_paid) "
                +"values ("+arrears+","+user_id+",NOW(),NOW(),0)";
        System.out.println(sql1);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
                PreparedStatement ps = conn.prepareStatement(sql1, Statement.RETURN_GENERATED_KEYS);
                return ps;
            }
        }, keyHolder);
        int bill_id=keyHolder.getKey().intValue();//bill_id

        //插入第一条设备欠款记录
        String sql2 =
                "insert into device_bill "+
                        "(device_id,bill_id,arrears) values "+
                        "("+device_id+","+bill_id+","+arrears+")";
        return jdbcTemplate.update(sql2)>0;
    }

    private boolean appendToBill(int bill_id,int device_id,double arrears) {
        //生成欠费账单
        String sql1 =
                "insert into device_bill "+
                        "(device_id,bill_id,arrears) values "+
                        "("+device_id+","+bill_id+","+arrears+")";
        jdbcTemplate.update(sql1);
        String sql2 =
                "update bill set "+
                "principle = principle + "+arrears;
        return jdbcTemplate.update(sql2)>0;
    }

    private boolean hasGenerateFeePayable(int user_id) {
        String sql = "select count(*) from fee_payable where user_id = "+user_id+" and generate_date = date_format(now(),'%Y-%m-%d')";
        return jdbcTemplate.queryForObject(sql,Integer.class)==1;
    }

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

    private boolean updateBalance(int user_id,double balance) {
        String sql = "update user set balance = "+balance+" where user_id = "+user_id;
        return jdbcTemplate.update(sql)>0;
    }

    private boolean refreshDevice(int device_id,double thisMonthUsed,double arrears) {
        //设备本月欠费重置
        String sql =
                "update device set "
                        +" arrears = "+arrears
                        +", last_reading = last_reading+"+thisMonthUsed
                        +" where device_id="+device_id;
      //  System.out.println("260:"+sql);
        return jdbcTemplate.update(sql)>0;
    }

}
