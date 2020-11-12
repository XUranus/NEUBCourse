package com.xuranus.main.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    @GetMapping("/user")
    public String userLoginPage(Model model){
        model.addAttribute("msg","");
        model.addAttribute("title","电表缴费系统-用户登录");
        model.addAttribute("logged",false);
        return "user-login";
    }


    @PostMapping("/user")
    public String userLoginHandle(Model model, HttpSession session, HttpServletRequest req, HttpServletResponse res){
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String sql = "select * from user where username = '"+username+"' and password='"+password+"'";
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("user_id", rs.getInt("user_id"));
                row.put("username",rs.getString("username"));
                return row;
            }});
        if(result.size()!=1) {
            model.addAttribute("logged",false);
            model.addAttribute("msg","用户名密码不正确");
            model.addAttribute("title","电表缴费系统-用户登录");
            return "user-login";
        }
        else {
            Map line = (Map) result.get(0);
            username = (String)line.get("username");
            int user_id = (int)line.get("user_id");
            session.setAttribute("user_id",user_id);
            session.setAttribute("user_type","common-user");
            session.setAttribute("username",username);
            return "redirect:/user/main";
        }
    }


    @GetMapping("/reader")
    public String readerLoginPage(Model model){
        model.addAttribute("msg","");
        model.addAttribute("title","电表缴费系统-抄表员登录");
        model.addAttribute("logged",false);
        return "reader-login";
    }

    @PostMapping("/reader")
    public String readerLoginHandle(Model model, HttpSession session, HttpServletRequest req, HttpServletResponse res){
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String sql = "select * from meter_reader where username = '"+username+"' and password='"+password+"'";
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("meter_reader_id", rs.getInt("meter_reader_id"));
                row.put("username",rs.getString("username"));
                row.put("meter_reader_name",rs.getString("meter_reader_name"));
                return row;
            }});
        if(result.size()!=1) {
            model.addAttribute("logged", false);
            model.addAttribute("msg", "用户名密码不正确");
            model.addAttribute("title", "电表缴费系统-抄表员登录");
            return "reader-login";
        }
        else {
            Map line = (Map) result.get(0);
            session.setAttribute("meter_reader_id",line.get("meter_reader_id"));
            session.setAttribute("user_type","meter_reader");
            session.setAttribute("username",line.get("username"));
            session.setAttribute("meter_reader_name",line.get("meter_reader_name"));
            return "redirect:/reader/read";
        }
    }

    @GetMapping("/admin")
    public String adminLoginPage(Model model){
        model.addAttribute("msg","");
        model.addAttribute("title","电表缴费系统-企业管理员登录");
        model.addAttribute("logged",false);
        return "admin-login";
    }

    @PostMapping("/admin")
    public String adminLoginHandle(Model model, HttpSession session, HttpServletRequest req, HttpServletResponse res){
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String sql = "select * from admin where username = '"+username+"' and password='"+password+"'";
        List result = jdbcTemplate.query(sql, new RowMapper<Map>() {
            @Override
            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put("admin_id", rs.getInt("admin_id"));
                row.put("username",rs.getString("username"));
                return row;
            }});
        if(result.size()!=1) {
            model.addAttribute("logged", false);
            model.addAttribute("msg", "管理员密码或者用户名不正确");
            model.addAttribute("title", "电表缴费系统-企业管理员登录");
            return "reader-login";
        }
        else {
            Map line = (Map) result.get(0);
            session.setAttribute("admin_id",line.get("admin_id"));
            session.setAttribute("user_type","admin");
            session.setAttribute("username",line.get("username"));
            return "redirect:/admin/main";
        }
    }


}
