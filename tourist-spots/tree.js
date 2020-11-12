var TreeNode = require('./tree-node.js');

class Tree {
	constructor(root) {
		this.root = root;
		this.size = 0;
		
		this.preOrderArray = [];
	}
	
	preOrder() {
		this.preOrderArray = [];
		this._preOrder(this.root);
		return this.preOrderArray;
	}
	
	_preOrder(node) {
		this.visit(node);
		for(var i=0;i<node.degree();i++) {
			this._preOrder(node.children[i]);
		}
	}
	
	visit(node) {
		if(node!=null || node!=undefined ) {
			//console.log(node.id);
			this.preOrderArray.push(node.id);
		} else {
			console.log("node is undefined");
			return ;
		}
	}
}

module.exports = Tree;

