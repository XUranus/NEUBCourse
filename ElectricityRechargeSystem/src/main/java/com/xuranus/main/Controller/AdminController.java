package com.xuranus.main.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @RequestMapping("/main")
    public String mainPage(Model model, HttpSession session)  {
        model.addAttribute("title",session.getAttribute("管理员系统"));
        model.addAttribute("username",session.getAttribute("username"));
        return "admin-main";
    }

}
