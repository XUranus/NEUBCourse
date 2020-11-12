#include <iostream>
#include <cstdio>
#include <vector>
#include <cmath>
#include <cstdlib>
#include "Matrix.cpp"
using namespace std;

int main(int argc, char *argv[]) 
{
	int n = 10;
	Matrix matrix(n,n+1);
	for(int i=1;i<=matrix.row();i++) {
		for(int j=1;j<=matrix.column();j++) matrix[i][j] = 0;
	}
	matrix[1][n+1] = 7;
	for(int i=2;i<=n-1;i++) 
		matrix[i][n+1] = 15;
	matrix[n][n+1] = 14;
	
	for(int i=1;i<=n;i++) {
		matrix[i][i] = 6;	
	}
	for(int i=1;i<=n-1;i++) {
		matrix[i][i+1] = 1;	
	}
	for(int i=2;i<=n;i++) {
		matrix[i][i-1] = 8;	
	}	
	//初始化
	
	matrix.print();
	cout << "Cond_1 (A) = " << matrix.cond(1) << endl;
	cout << "Cond_∞ (A) = " << matrix.cond(3) << endl;
	cout << endl;
	
	Matrix matrix2(matrix);
	Matrix matrix3(matrix);
	
	cout << "Gaussian_Elimination" << endl;
	matrix.Gaussian_Elimination();
	
	cout << "Gaussian_Elimination_pro" << endl;
	matrix2.Gaussian_Elimination_pro();
	
	cout << "Gaussian_Elimination_self_define" << endl;
	matrix3.Gaussian_Elimination_self_define();

	return 0;
}