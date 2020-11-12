#include <iostream>
#include <cstdio>
#include <string>
#include <vector>
#include <iomanip>
#include <cmath>
#include <cstdlib>
#include <algorithm>

#define eps 1e-6
using namespace std;

class Matrix
{
	private:
		int _column,_row;
		vector<vector<double> > a;
	
	public:
		Matrix(int row,int column) 
		{
			_column = column;
			_row = row;
			vector<vector<double> > temp(_row+1,vector<double>(_column+1));  
			a = temp;
		}
		
		Matrix(Matrix &mtr) {
			_column = mtr.column();
			_row = mtr.row();
			vector<vector<double> > temp(_row+1,vector<double>(_column+1));  
			a = temp;
			for(int i=1;i<=_row;i++) 
			for(int j=1;j<=_column;j++)
			a[i][j] = mtr[i][j];
		}
		
		vector<double>& operator[](int i)
		{
			if( i > _column || i<1 )
			{
				cout << "matrix class array out bound error! abort" << endl;
				exit(0);
			}
			return a[i];
		}
		
		void swap(int line1,int line2) {
			vector<double> temp(a[line1]);
			a[line1] = a[line2];
			a[line2] = temp;
		}
		
		int column() {
			return _column;
		}
		
		int row() {
			return _row;
		}
		
		bool is_square() {
			return this->column()==this->row();
		}
		
		void print() {
			cout << "Matrix now is:" << endl;
			for(int i=1;i<=this->row();i++) {
				for(int j=1;j<=this->column();j++) {
					//printf("%.2lf\t  ",a[i][j]);
					cout << a[i][j] << "\t" ;
				}
				cout << endl;
			}
			cout << endl;
		}
		
		void trim_pivot_element(int x) { //a[x][x]下选取主元,并交换行
			int index = x;
			for(int i=x;i<=this->row();i++) {
				if(abs(a[i][1])>abs(a[index][1]))
					index = i;
			}
			swap(index,x);
		}
		
		void solution_print() {
			cout << "solution is: " << endl;
			int n = this->row();
			vector<double> x(n+1);
			x[n] = a[n][n+1]/a[n][n];
			for(int i=n;i>=1;i--) {
				double sum = 0;
				for(int j=i+1;j<=n;j++) {
					sum += a[i][j]*x[j];
				}
				x[i] = (a[i][n+1]-sum)/a[i][i];
			}
			
			for(int i=1;i<=n;i++) {
				cout << "x[" << i << "] = " << x[i]<< endl;
			}
			cout << endl;
		}
		
		double norm(int type) {
			//矩阵范数
			double ans = 0;
			switch (type) {
				case 1:
					ans = 0;
					for(int j=1;j<=this->column();j++){
						double sum = 0;
						for(int i=1;i<=this->row();i++) {
							sum += abs(a[i][j]);
						}
						if(sum > ans) 
							ans = sum;
					}
					return ans;
					break;
				case 2:
					cout << "norm type not support. Abort." << endl;
					break;		
				case 3:
					ans = 0;
					for(int i=1;i<=this->row();i++){
						double sum = 0;
						for(int j=1;j<=this->column();j++) {
							sum += abs(a[i][j]);
						}
						if(sum > ans) 
							ans = sum;
					}
					return ans;
					break;
				default:
					cout << "norm type not support. Abort." << endl;
					return -1;
					break;		
			}
			return -1;
		}
		
		double cond(int type) {
			//条件数
			if(this->is_square()){
				return this->norm(type)*this->inv_matrix().norm(type);
			}
			else {
				int n = min(this->row(),this->column());
				Matrix square_matrix(n,n);
				for(int i=1;i<=square_matrix.row();i++) {
					for(int j=1;j<=square_matrix.column();j++) {
						square_matrix[i][j] = a[i][j];
					}
				}
				return square_matrix.cond(type);
			}
		}
		
		Matrix inv_matrix() {
			if(this->column()!=this->row()) {
				cout << "matrix row not equals column. Abort" << endl;
				return *this;
			}
			Matrix matrix(this->row(),2*this->row());
			for(int i=1;i<=this->row();i++) {
				for(int j=1;j<=this->column();j++) 
					matrix[i][j] = a[i][j];
			}
			for(int i=1;i<=this->row();i++) {
				for(int j=this->column()+1;j<=matrix.column();j++) {
					if(j-i==this->column()) matrix[i][j]=1;
					else matrix[i][j]=0;
				}
			}
			//构造右单位矩阵完毕
			
			for(int x=1;x<matrix.row();x++) {
				matrix.trim_pivot_element(x);
				
				for(int i=x+1;i<=matrix.row();i++) {
					if(matrix[x][x]==0) {
						cout << "divisor zero error! abort." << endl;
						return matrix;
					}
					double l = matrix[i][x]/matrix[x][x];
					for(int j=x;j<=matrix.column();j++) {
						matrix[i][j] -= l*matrix[x][j];
					}
					//matrix.print();
				}
			}
			
			for(int i=matrix.row();i>=1;i--){
				for(int j=i-1;j>=1;j--) {
					if(matrix[i][i]==0) {
						cout << "divisor zero error! abort." << endl;
						return matrix;
					}
					double l = matrix[j][i]/matrix[i][i];
					for(int k=1;k<=matrix.column();k++) {
						matrix[j][k] -= matrix[i][k]*l;
					}
					//matrix.print();
				}
			}
			//消成上三角
			for(int i=1;i<=matrix.row();i++){
				double divisor = matrix[i][i];
				//cout << "matrix [i][i]=" << matrix[i][i] << "\n"<<  endl;
				for(int j=1;j<=matrix.column();j++) {
					//cout << matrix[i][j] << " / " << divisor << " = " << matrix[i][j]/divisor << endl;
					matrix[i][j] =matrix[i][j]/divisor;
				}
			}
			//消成单位阵列
			for(int i=1;i<matrix.row();i++) {
				for(int j=1;j<matrix.column();j++) {
					if(abs(matrix[i][j])<eps) matrix[i][j]=0;
				}
			}
			//matrix.print();
			//处理精度
			Matrix ans(matrix.row(),matrix.row());
			for(int i=1;i<=matrix.row();i++) {
				for(int j=1;j<=matrix.row();j++) {
					ans[i][j] = matrix[i][j+matrix.row()];
				}
			}
			//提取右侧逆矩阵
			return ans;
		}
		
		void Gaussian_Elimination() {
			//Gauss消去法
			for(int i=1;i<=this->row();i++) {
				Gaussian_Elimination(*this,i);
			}
		}

		void Gaussian_Elimination_pro() {
			//Gauss列主元消去法
			for(int i=1;i<=this->row();i++) {
				//int kk = i;
				this->trim_pivot_element(i);
				Gaussian_Elimination(*this,i);
			}
		}

		void Gaussian_Elimination_self_define() {
			//Gauss自定义主元消去法
			for(int i=1;i<=this->row();i++) {
				cout << "pivot element: ";
				cout << "select index: ";
				for(int j=i;j<=this->row();j++) {
					cout << "(" << j << ") " << a[j][i] << " ";
				}
				cout << endl;
				int index;
				cin >> index;
				if(index>this->row() || index<i) {
					cout << "privot choose error! abort." << endl;
					return;
				}
				this->swap(i,index);
				this->print();
				Gaussian_Elimination(*this,i);
			}
		}
		
		void Gaussian_Elimination(Matrix &matrix,int x) {
			//Gauss顺序消去法
			if(x>=matrix.row()) {
				cout << "Gaussian Elimination Finished" << endl;
				matrix.print();
				matrix.solution_print();
				return;
			}
			int y = x;
			for(int i=x+1;i<=matrix.row();i++) {
				if(matrix[x][y]==0) {
					cout << "divisor zero error! abort." << endl;
					return;
				}
				double l = matrix[i][y]/matrix[x][y];
				for(int j=y;j<=matrix.column();j++) {
					matrix[i][j] -= l*matrix[x][j];
				}
				//matrix.print();
			}
		}
				
};