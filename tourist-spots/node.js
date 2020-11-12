class Node {
	  //景点名称，景点简介，景点欢迎度，有无休息区，有无公厕。
	  constructor(name,intro,popularity,has_rest_area,has_toilet) {
	  	this.name = name;
	  	this.intro = intro;
	  	this.popularity = popularity;
	  	this.has_rest_area = has_rest_area;
	  	this.has_toilet = has_toilet;
	  }
}

module.exports = Node;