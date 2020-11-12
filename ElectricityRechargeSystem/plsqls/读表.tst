PL/SQL Developer Test script 3.0
159
-- Created on 2018/8/29 by 王星校 
DECLARE
  v_device_id DEVICE.device_id%TYPE:=3;--设备号
  v_meter_reader_id METER_READER.METER_READER_ID%TYPE:=1000000;--抄表员id
  v_reading READ_RECORD.READING%TYPE:=500;--当前读数
  v_record_date READ_RECORD.RECORD_DATE%TYPE:=to_date('2019-2-20','yyyy-mm-dd');--抄表日期
  
  c_cost_per_degree FEE_PAYABLE.FEE1%TYPE:=1;
  /************************** need config **********************************/
  v_fee1 FEE_PAYABLE.FEE1%TYPE;
  v_fee2 FEE_PAYABLE.FEE2%TYPE;
  v_fee_payable_create_num INTEGER;
  
  v_balance COMMON_USER.BALANCE%TYPE;
  v_user_id COMMON_USER.User_Id%TYPE;
  v_arrears DEVICE_BILL.ARREARS%TYPE:=0;
  
  CURSOR meter_reader_cursor IS --获取抄表员信息的游标
  SELECT * FROM METER_READER 
  WHERE METER_READER.METER_READER_ID=v_meter_reader_id;
  
  meter_reader_record METER_READER%ROWTYPE;
  v_meter_reader_name METER_READER.METER_READER_NAME%TYPE;
  v_read_record_id READ_RECORD.READ_RECORD_ID%TYPE;
  v_device DEVICE%ROWTYPE;
  v_basic_fee FEE_PAYABLE.Basic_Fee%TYPE;
  
  CURSOR device_bill_cursor IS --设备欠费游标
  SELECT * FROM DEVICE_BILL
  WHERE DEVICE_BILL.DEVICE_ID = v_device_id
  ORDER BY DEVICE_BILL.FINE_START_DATE asc;
    
BEGiN
  
  ------ 获取抄表员信息------
  OPEN meter_reader_cursor;
  FETCH meter_reader_cursor INTO meter_reader_record;
  IF(meter_reader_cursor%NOTFOUND) THEN
    dbms_output.put_line('抄表员ID不正确');
  ELSE
    v_meter_reader_name:= meter_reader_record.meter_reader_name;
    dbms_output.put_line('抄表员姓名：'||v_meter_reader_name);
  END IF;
  CLOSE meter_reader_cursor;
  
  --------生成抄表记录---------
  INSERT INTO READ_RECORD 
  (device_id,meter_reader_id,meter_reader_name,record_date,reading)
  VALUES
  (v_device_id,v_meter_reader_id,v_meter_reader_name,v_record_date,v_reading)
  RETURNING READ_RECORD.READ_RECORD_ID INTO v_read_record_id;
  dbms_output.put_line('生成的抄表记录号：'||v_read_record_id);
  
  --------- 获得用户余额 -------------
  SELECT user_id 
  INTO v_user_id 
  FROM DEVICE
  wHERE DEVICE.device_id=v_device_id;
  
  SELECT balance 
  INTO v_balance
  FROM COMMON_USER 
  WHERE COMMON_USER.USER_ID = v_user_id;
  
  -------- 用余额交这个设备历史欠费 -----------------
  v_balance := PAY_BY_BALANCE(v_device_id,v_balance,v_user_id,v_record_date);
      
    
  ------计算本月花费 生成本月账单------------
  SELECT * 
  INTO v_device
  FROM DEVICE
  WHERE DEVICE.Device_Id=v_device_id;--获得设备信息
  
  v_basic_fee := (v_reading-v_device.last_reading)*c_cost_per_degree;--基本费用
  v_fee1 := v_basic_fee*0.08;
  IF v_device.Device_Type=1 THEN
    v_fee2 := 0.1*v_basic_fee;
  ELSE 
    v_fee2 := 0.15*v_basic_fee;
  END IF;
  
  dbms_output.put_line('本月读数：'||v_reading);
  dbms_output.put_line('上月读数：'||v_device.last_reading);
  dbms_output.put_line('本月该设备用电：'||(v_reading-v_device.last_reading));
  dbms_output.put_line('每度电费用：'||c_cost_per_degree);
  dbms_output.put_line('基础费用：'||v_basic_fee);
  dbms_output.put_line('费用1：'||v_fee1);
  dbms_output.put_line('费用2：'||v_fee2);
  dbms_output.put_line('总费用：'||(v_basic_fee+v_fee1+v_fee2));
  
  UPDATE DEVICE --更新设备上次读数
  SET DEVICE.Last_Reading = v_reading
  WHERE DEVICE.Device_Id = v_device_id;
  
  SELECT balance 
  INTO v_balance
  FROM COMMON_USER 
  WHERE COMMON_USER.USER_ID = v_user_id;
  dbms_output.put_line('账户余额：'||v_balance);
  
  IF (v_balance>0) THEN
    IF (v_basic_fee+v_fee1+v_fee2 >=v_balance) THEN --如果余额不够交 扣光余额 
      UPDATE COMMON_USER
      SET COMMON_USER.balance = 0
      WHERE COMMON_USER.USER_ID = v_user_id;
      v_arrears := v_basic_fee+v_fee1+v_fee2-v_balance ;
      
      INSERT INTO BALANCE_RECORD
      (GENERATE_DATE,SUM,USER_ID,REMARK) 
      VALUES
      (v_record_date,-v_balance,v_user_id,'抄表自动扣除余额');
    ELSE -- 够交 扣该设备总费用
      UPDATE COMMON_USER
      SET COMMON_USER.Balance = COMMON_USER.BALANCE-(v_basic_fee+v_fee1+v_fee2)
      WHERE COMMON_USER.USER_ID = v_user_id;
      v_arrears := 0;
      
      INSERT INTO BALANCE_RECORD
      (GENERATE_DATE,SUM,USER_ID,REMARK) 
      VALUES
      (v_record_date,-(v_basic_fee+v_fee1+v_fee2),v_user_id,'抄表自动扣除余额');
    END IF;
  ELSE 
    v_arrears := v_basic_fee+v_fee1+v_fee2;
  END IF;
  dbms_output.put_line('欠费：'||v_arrears);
  
  SELECT COUNT(*) --检索本月是否创建了费用表
  INTO v_fee_payable_create_num
  FROM FEE_PAYABLE
  WHERE FEE_PAYABLE.USER_ID = v_user_id AND FEE_PAYABLE.GENERATE_DATE=v_record_date;
  
  IF (v_fee_payable_create_num=0) THEN --本月还没查过，则创建一个空缴费表
    INSERT INTO FEE_PAYABLE
    (USER_ID,ELECTRIC_DEGREE,TOTAL_FEE,GENERATE_DATE,BASIC_FEE,FEE1,FEE2)
    VALUES
    (v_user_id,0,0,v_record_date,0,0,0);
  END IF;
  
  --update插入新的用量
  UPDATE FEE_PAYABLE SET
  FEE_PAYABLE.Electric_Degree = FEE_PAYABLE.Electric_Degree+(v_reading-v_device.last_reading),
  FEE_PAYABLE.TOTAL_FEE = FEE_PAYABLE.TOTAL_FEE+(v_basic_fee+v_fee1+v_fee2),
  FEE_PAYABLE.BASIC_FEE = FEE_PAYABLE.BASIC_FEE+v_basic_fee,
  FEE_PAYABLE.FEE1 = FEE_PAYABLE.FEE1+v_fee1,
  FEE_PAYABLE.FEE2 = FEE_PAYABLE.FEE2+v_fee2
  WHERE FEE_PAYABLE.USER_ID = v_user_id AND FEE_PAYABLE.GENERATE_DATE=v_record_date;
  
  --insert into bill_device
  IF (v_arrears>0) THEN 
    INSERT INTO DEVICE_BILL
    (DEVICE_ID,USER_ID,ARREARS,HAS_PAID,FINE_START_DATE)
    VALUES
    (v_device_id,v_user_id,v_arrears,0,add_months(v_record_date,1));
  END IF;
    
  dbms_output.put_line('FINISH');
END;
1
1001
0
-5
0
