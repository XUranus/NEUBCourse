package com.xuranus.main.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/reader")
public class ReaderController
{
    @Autowired
    private JdbcTemplate jdbcTemplate;


    @GetMapping("/read")
    public String read(Model model, HttpSession session) {
        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("title","抄表系统");
        return "reader-read";
    }

    @GetMapping("/history")
    public String history(Model model, HttpSession session) {
        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("title","抄表系统");
        String sql = "select * from read_record where meter_reader_id = "+session.getAttribute("meter_reader_id");
        //System.out.println(sql);
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("read_record_id",rs.getInt("read_record_id"));
                row.put("meter_reader_id", rs.getInt("meter_reader_id"));
                row.put("meter_reader_name",rs.getString("meter_reader_name"));
                row.put("reading",rs.getDouble("reading"));
                row.put("record_date",rs.getDate("record_date"));
                row.put("device_id",rs.getInt("device_id"));
                return row;
            }});
        model.addAttribute("records",result);
        //System.out.println(result);
        return "reader-history";
    }



    @GetMapping("/account")
    public String account(Model model, HttpSession session){
        model.addAttribute("username",session.getAttribute("username"));
        model.addAttribute("title","抄表系统");
        String sql = "select * from meter_reader where meter_reader_id = "+session.getAttribute("meter_reader_id");
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("meter_reader_id", rs.getInt("meter_reader_id"));
                row.put("username",rs.getString("username"));
                row.put("meter_reader_name",rs.getString("meter_reader_name"));
                row.put("telephone",rs.getString("telephone"));
                return row;
            }});
        model.addAttribute("account_data",(Map)(result.get(0)));
        if(result.size()==1) return "reader-account";
        else return "error";
    }




}
