package com.xuranus.main;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        HttpSession session = request.getSession();
        //判断session是否过期

        if (request.getRequestURI().startsWith("/user") && session.getAttribute("user_id") == null) {
            response.sendRedirect(request.getContextPath()+"/login/user");
            return false;
        }else if(request.getRequestURI().startsWith("/reader")  && session.getAttribute("meter_reader_id") == null)  {
            response.sendRedirect(request.getContextPath()+"/login/reader");
            return false;
        }else if(request.getRequestURI().startsWith("/admin")  && session.getAttribute("admin_id") == null)  {
            response.sendRedirect(request.getContextPath()+"/login/admin");
            return false;
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
