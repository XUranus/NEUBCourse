#include <iostream>
#include <vector>
#include <cstdlib>
#include <cmath>
#include <string>
#include "Matrix.cpp"
using namespace std;


double scalar_product(vector<double> phi1,vector<double> phi2,vector<double> rho) {//加权内积
	cout << "phi_a: ";
	for(int i=0;i<phi1.size();i++) cout << phi1[i] << " ";
	cout << endl;
	cout << "phi_b: ";
	for(int i=0;i<phi2.size();i++) cout << phi2[i] << " ";
	cout << endl;
	cout << "pho: ";
	for(int i=0;i<rho.size();i++) cout << rho[i] << " ";
	cout << "\n";
	
	double res = 0;
	for(int i=0;i<phi1.size();i++) {
		res += phi1[i]*rho[i]*phi2[i];
	}
	cout << "res = " << res << "\n" << endl;
	return res;
}

double phi_x(double x,int power) {
	//x ^ i
	//cout << "phi_x " << " x= " << x << " power= " << power << " res= " << pow(x,power) << endl; 
	return pow(x,power);
}

void print_vector(string name,vector<double> vec) {
	cout << "vector "<<name <<  ": ";
	for(int i=0;i<vec.size();i++) cout << vec[i] << " ";
	cout << endl;
}

int main(int argc, char *argv[]) {
	//0 5 10 15 20 25 30 35 40 45 50 55
	//0 1.27 2.16 2.86 3.44 3.87 4.15 4.37 4.51 4.58 4.02 4.64
	//12 shuju
	int m=11,n=3;
	Matrix matrix(n+1,n+2);
	vector<double> x;
	for(int i=0;i<=m;i++) {
		x.push_back(5*i);
	}
	vector<double> f;
	f.push_back(0);
	f.push_back(1.27);
	f.push_back(2.16);
	f.push_back(2.86);
	f.push_back(3.44);
	f.push_back(3.87);
	f.push_back(4.15);
	f.push_back(4.37);
	f.push_back(4.51);
	f.push_back(4.58);
	f.push_back(4.02);
	f.push_back(4.64);
	
	vector<double> rho;
	for(int i=0;i<=m;i++) rho.push_back(1);//默认是1
	
	vector<vector<double> > phi;
	for(int i=0;i<=n;i++) {
		vector<double> vec;
		for(int j=0;j<=m;j++) {
			vec.push_back(phi_x(x[j],i+1));
		}
		phi.push_back(vec);
	}
	//
	for(int i=0;i<phi.size();i++) {
		cout << "phi["<< i <<"]: ";
		for(int j=0;j<phi[i].size();j++) cout << phi[i][j] << " ";
		cout << "\n";
	}
	cout << endl;
	//
	for(int i=1;i<=matrix.row();i++){
		for(int j=1;j<=matrix.column()-1;j++) {
			matrix[i][j] = scalar_product(phi[i-1],phi[j-1],rho);
			matrix.print();
		}
	}
	
	for(int i=1;i<=n+1;i++) {
		matrix[i][n+2] = scalar_product(f,phi[i-1],rho);
	}
	matrix.print();
	matrix.Gaussian_Elimination_pro();
	return 0;
}