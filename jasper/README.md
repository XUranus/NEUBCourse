# jasper
一个轻量级的jsp到servlet类的编译器，自制Tomcat的组件之一，完整项目见[ServletContainer](https://github.com/EugeneYilia/ServletContainer)  

### Dependency
需要`lib`中的`jalopy.jar`和`log4j.jar`包来格式化生成的java代码，对HttpServlet的编译需要`javax.servlet.jar`  
需要手动配置docRoot和`java -cp ...servlet.jar`中的依赖包的路径

### Usage
```
ServletParser s = new ServletParser(new File("C:\\Users\\IdeaProjects\\AtomCat\\index.jsp"));//jsp文件路径
try {
	s.parse();//在docRoot下生成index_jsp.java和index_jsp.class
}
catch (Exception e){
    e.printStackTrace();
}
```