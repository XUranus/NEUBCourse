INSERT INTO admin (admin_id,username,pass) values (1,'admin','12345');

INSERT INTO common_user (user_id,balance,username,pass,telephone,register_date) VALUES (100000,0,'XUranus','12345',12123214234,to_date('2014-07-24','YYYY-MM-DD'));
INSERT INTO common_user (user_id,balance,username,pass,telephone,register_date) VALUES (200000,200,'user01','12345',82123212342,to_date('2015-06-14','yyyy-mm-dd'));
INSERT INTO common_user (user_id,balance,username,pass,telephone,register_date) VALUES (300000,200,'user02','12345',92123212342,to_date('2016-05-04','yyyy-mm-dd'));
INSERT INTO common_user (user_id,balance,username,pass,telephone,register_date) VALUES (400000,300,'user03','12345',72123214622,to_date('2017-05-10','yyyy-mm-dd'));
INSERT INTO common_user (user_id,balance,username,pass,telephone,register_date) VALUES (500000,400,'user04','12345',52123214622,to_date('2018-04-18','yyyy-mm-dd'));
INSERT INTO common_user (user_id,balance,username,pass,telephone,register_date) VALUES (600000,500,'user05','12345',42123344622,to_date('2018-03-14','yyyy-mm-dd'));

INSERT INTO fee_payable (user_id,total_fee,electric_degree,generate_date,should_pay,has_paid,basic_fee,fee1,fee2) VALUES (100000,0,0,to_date('2018-07-26','YYYY-MM-DD'),0,0,0,0,0);
INSERT INTO fee_payable (user_id,total_fee,electric_degree,generate_date,should_pay,has_paid,basic_fee,fee1,fee2) VALUES (200000,0,0,to_date('2018-07-26','yyyy-mm-dd'),0,0,0,0,0);
INSERT INTO fee_payable (user_id,total_fee,electric_degree,generate_date,should_pay,has_paid,basic_fee,fee1,fee2) VALUES (300000,0,0,to_date('2018-07-26','yyyy-mm-dd'),0,0,0,0,0);
INSERT INTO fee_payable (user_id,total_fee,electric_degree,generate_date,should_pay,has_paid,basic_fee,fee1,fee2) VALUES (400000,0,0,to_date('2018-07-26','yyyy-mm-dd'),0,0,0,0,0);
INSERT INTO fee_payable (user_id,total_fee,electric_degree,generate_date,should_pay,has_paid,basic_fee,fee1,fee2) VALUES (500000,0,0,to_date('2018-07-26','yyyy-mm-dd'),0,0,0,0,0);

INSERT INTO bank (bank_id,bank_name) VALUES (1000,'中国农业银行');
INSERT INTO bank (bank_id,bank_name) VALUES (2000,'中国工商银行');
INSERT INTO bank (bank_id,bank_name) VALUES (3000,'中国建设银行');

INSERT INTO bankcard (bank_id,bankcard_number,user_id) VALUES (1000,1645186514285641,100000);
INSERT INTO bankcard (bank_id,bankcard_number,user_id) VALUES (2000,1879687245234554,100000);
INSERT INTO bankcard (bank_id,bankcard_number,user_id) VALUES (3000,8214832714347123,200000);
INSERT INTO bankcard (bank_id,bankcard_number,user_id) VALUES (1000,2136412971234129,300000);
INSERT INTO bankcard (bank_id,bankcard_number,user_id) VALUES (2000,2473823954853287,400000);
INSERT INTO bankcard (bank_id,bankcard_number,user_id) VALUES (2000,4738234954853287,500000);


INSERT INTO meter_reader (meter_reader_id,meter_reader_name,username,pass,telephone) VALUES (1000000,'宋兵甲','Reader001',12345,64174174233);
INSERT INTO meter_reader (meter_reader_id,meter_reader_name,username,pass,telephone) VALUES (2000000,'炮灰乙','Reader002',12345,84174174233);
INSERT INTO meter_reader (meter_reader_id,meter_reader_name,username,pass,telephone) VALUES (3000000,'流氓丙','Reader003',12345,34174174233);
insert INTO meter_reader (meter_reader_id,meter_reader_name,username,pass,telephone) VALUES (4000000,'土匪丁','Reader004',12345,94174174233);


INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1001,100000,1,'东北大学1舍',100,60);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1002,100000,2,'东北大学2舍',100,40);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1003,100000,1,'东北大学3舍',0,0);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1004,200000,1,'东北大学4舍',0,0);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1005,200000,2,'东北大学5舍',0,0);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1006,300000,2,'东北大学文管',0,0);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1007,400000,1,'东北大学生科',0,0);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1008,400000,2,'东北大学信息',0,0);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1009,500000,2,'东北大学建筑',0,0);
INSERT INTO device (device_id,user_id,device_type,address,last_reading,arrears) VALUES (1010,500000,1,'东北大学食堂',0,0);
