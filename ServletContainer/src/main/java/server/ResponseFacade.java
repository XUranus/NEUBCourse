package server;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.Locale;

public class ResponseFacade implements HttpServletResponse {

    Response response = null;

    public ResponseFacade(Response response) {
        this.response = response;
    }

    @Override
    public void addCookie(Cookie cookie) {
        response.addCookie(cookie);
    }

    @Override
    public boolean containsHeader(String name) {
        return response.containsHeader(name);
    }

    @Override
    public String encodeURL(String url) {
        return response.encodeURL(url);
    }

    @Override
    public String encodeRedirectURL(String url) {
        return response.encodeRedirectURL(url);
    }

    @Override
    public String encodeUrl(String url) {
        return response.encodeUrl(url);
    }

    @Override
    public String encodeRedirectUrl(String url) {
        return response.encodeRedirectUrl(url);
    }

    @Override
    public void sendError(int sc, String msg) throws IOException {
        response.sendError(sc, msg);
    }

    @Override
    public void sendError(int sc) throws IOException {
        response.sendError(sc);
    }

    @Override
    public void sendRedirect(String location) throws IOException {
        response.sendRedirect(location);
    }

    @Override
    public void setDateHeader(String name, long date) {
        response.setDateHeader(name, date);
    }

    @Override
    public void addDateHeader(String name, long date) {
        response.addDateHeader(name, date);
    }

    @Override
    public void setHeader(String name, String value) {
        response.setHeader(name, value);
    }

    @Override
    public void addHeader(String name, String value) {
        response.addHeader(name, value);
    }

    @Override
    public void setIntHeader(String name, int value) {
        response.setIntHeader(name, value);
    }

    @Override
    public void addIntHeader(String name, int value) {
        response.addIntHeader(name, value);
    }

    @Override
    public void setStatus(int sc) {
        response.setStatus(sc);
    }

    @Override
    public void setStatus(int sc, String sm) {
        response.setStatus(sc, sm);
    }

    @Override
    public int getStatus() {
        return response.getStatus();
    }

    @Override
    public String getHeader(String name) {
        return response.getHeader(name);
    }

    @Override
    public Collection<String> getHeaders(String name) {
        return response.getHeaders(name);
    }

    @Override
    public Collection<String> getHeaderNames() {
        return response.getHeaderNames();
    }

    @Override
    public String getCharacterEncoding() {
        return response.getCharacterEncoding();
    }

    @Override
    public String getContentType() {
        return response.getContentType();
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return response.getOutputStream();
    }

    @Override
    public PrintWriter getWriter() throws IOException {
        return response.getWriter();
    }

    @Override
    public void setCharacterEncoding(String charset) {
        response.getCharacterEncoding();
    }

    @Override
    public void setContentLength(int len) {
        response.setContentLength(len);
    }

    @Override
    public void setContentType(String type) {
        response.setContentType(type);
    }

    @Override
    public void setBufferSize(int size) {
        response.setBufferSize(size);
    }

    @Override
    public int getBufferSize() {
        return response.getBufferSize();
    }

    @Override
    public void flushBuffer() throws IOException {
        response.flushBuffer();
    }

    @Override
    public void resetBuffer() {
        response.resetBuffer();
    }

    @Override
    public boolean isCommitted() {
        return response.isCommitted();
    }

    @Override
    public void reset() {
        response.reset();
    }

    @Override
    public void setLocale(Locale loc) {
        response.setLocale(loc);
    }

    @Override
    public Locale getLocale() {
        return response.getLocale();
    }
}
