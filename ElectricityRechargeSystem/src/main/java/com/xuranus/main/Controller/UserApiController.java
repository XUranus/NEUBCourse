package com.xuranus.main.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.sql.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/api")
public class UserApiController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @RequestMapping("/handleRechargeRequest")//处理缴费信息
    public Map test(HttpSession session, HttpServletRequest req, HttpServletResponse res) {
        int user_id = (int)session.getAttribute("user_id");
        String device_id = req.getParameter("device_id");
        String bankcard_number = req.getParameter("bankcard_number");//waste
        String bank_id = req.getParameter("bank_id");
        String cost = req.getParameter("cost");

        //向银行付款
        final String sql1 = "insert into bank_payment (user_id,bankcard_number,bank_id,payment_date,cost) values "+
                "("+session.getAttribute("user_id")+",'"+bankcard_number+"',"+bank_id+",NOW(),"+cost+")";
        //System.out.println(sql1);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
                PreparedStatement ps = conn.prepareStatement(sql1, Statement.RETURN_GENERATED_KEYS);
                return ps;
            }
        }, keyHolder);
        int payment_seq_number=keyHolder.getKey().intValue();//生产的流水号
        //System.out.println("Sequence_number: "+payment_seq_number);


        //插入到企业缴费记录
        String sql2 = "insert into recharge (recharge_date,recharge_remark,payment_seq_number,user_id,device_id) values "+
                "(NOW(),'缴费',"+payment_seq_number+","+user_id+","+device_id+")";
        //System.out.println(sql);


        //冲欠费->当月->余额



        Map resJson = new HashMap();
        if(jdbcTemplate.update(sql2)>0) {//成功
            resJson.put("success",true);
        }
        else {
            resJson.put("success",false);
        }
        return resJson;
    }


}
