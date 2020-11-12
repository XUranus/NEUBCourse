class TreeNode {
	constructor(id) {
		 this.id = id;
		 this.children = new Array();//array<TreeNode>
	}
		
	degree() {
		return this.children.length;
	}
	
	child(index) {
		return this.children[index];
	}
	
	add_child(id) {
		var node = new TreeNode(id);
		this.children.push(node);
	}

}

module.exports = TreeNode;