PL/SQL Developer Test script 3.0
159
-- Created on 2018/8/29 by ����У 
DECLARE
  v_device_id DEVICE.device_id%TYPE:=3;--�豸��
  v_meter_reader_id METER_READER.METER_READER_ID%TYPE:=1000000;--����Աid
  v_reading READ_RECORD.READING%TYPE:=500;--��ǰ����
  v_record_date READ_RECORD.RECORD_DATE%TYPE:=to_date('2019-2-20','yyyy-mm-dd');--��������
  
  c_cost_per_degree FEE_PAYABLE.FEE1%TYPE:=1;
  /************************** need config **********************************/
  v_fee1 FEE_PAYABLE.FEE1%TYPE;
  v_fee2 FEE_PAYABLE.FEE2%TYPE;
  v_fee_payable_create_num INTEGER;
  
  v_balance COMMON_USER.BALANCE%TYPE;
  v_user_id COMMON_USER.User_Id%TYPE;
  v_arrears DEVICE_BILL.ARREARS%TYPE:=0;
  
  CURSOR meter_reader_cursor IS --��ȡ����Ա��Ϣ���α�
  SELECT * FROM METER_READER 
  WHERE METER_READER.METER_READER_ID=v_meter_reader_id;
  
  meter_reader_record METER_READER%ROWTYPE;
  v_meter_reader_name METER_READER.METER_READER_NAME%TYPE;
  v_read_record_id READ_RECORD.READ_RECORD_ID%TYPE;
  v_device DEVICE%ROWTYPE;
  v_basic_fee FEE_PAYABLE.Basic_Fee%TYPE;
  
  CURSOR device_bill_cursor IS --�豸Ƿ���α�
  SELECT * FROM DEVICE_BILL
  WHERE DEVICE_BILL.DEVICE_ID = v_device_id
  ORDER BY DEVICE_BILL.FINE_START_DATE asc;
    
BEGiN
  
  ------ ��ȡ����Ա��Ϣ------
  OPEN meter_reader_cursor;
  FETCH meter_reader_cursor INTO meter_reader_record;
  IF(meter_reader_cursor%NOTFOUND) THEN
    dbms_output.put_line('����ԱID����ȷ');
  ELSE
    v_meter_reader_name:= meter_reader_record.meter_reader_name;
    dbms_output.put_line('����Ա������'||v_meter_reader_name);
  END IF;
  CLOSE meter_reader_cursor;
  
  --------���ɳ����¼---------
  INSERT INTO READ_RECORD 
  (device_id,meter_reader_id,meter_reader_name,record_date,reading)
  VALUES
  (v_device_id,v_meter_reader_id,v_meter_reader_name,v_record_date,v_reading)
  RETURNING READ_RECORD.READ_RECORD_ID INTO v_read_record_id;
  dbms_output.put_line('���ɵĳ����¼�ţ�'||v_read_record_id);
  
  --------- ����û���� -------------
  SELECT user_id 
  INTO v_user_id 
  FROM DEVICE
  wHERE DEVICE.device_id=v_device_id;
  
  SELECT balance 
  INTO v_balance
  FROM COMMON_USER 
  WHERE COMMON_USER.USER_ID = v_user_id;
  
  -------- ��������豸��ʷǷ�� -----------------
  v_balance := PAY_BY_BALANCE(v_device_id,v_balance,v_user_id,v_record_date);
      
    
  ------���㱾�»��� ���ɱ����˵�------------
  SELECT * 
  INTO v_device
  FROM DEVICE
  WHERE DEVICE.Device_Id=v_device_id;--����豸��Ϣ
  
  v_basic_fee := (v_reading-v_device.last_reading)*c_cost_per_degree;--��������
  v_fee1 := v_basic_fee*0.08;
  IF v_device.Device_Type=1 THEN
    v_fee2 := 0.1*v_basic_fee;
  ELSE 
    v_fee2 := 0.15*v_basic_fee;
  END IF;
  
  dbms_output.put_line('���¶�����'||v_reading);
  dbms_output.put_line('���¶�����'||v_device.last_reading);
  dbms_output.put_line('���¸��豸�õ磺'||(v_reading-v_device.last_reading));
  dbms_output.put_line('ÿ�ȵ���ã�'||c_cost_per_degree);
  dbms_output.put_line('�������ã�'||v_basic_fee);
  dbms_output.put_line('����1��'||v_fee1);
  dbms_output.put_line('����2��'||v_fee2);
  dbms_output.put_line('�ܷ��ã�'||(v_basic_fee+v_fee1+v_fee2));
  
  UPDATE DEVICE --�����豸�ϴζ���
  SET DEVICE.Last_Reading = v_reading
  WHERE DEVICE.Device_Id = v_device_id;
  
  SELECT balance 
  INTO v_balance
  FROM COMMON_USER 
  WHERE COMMON_USER.USER_ID = v_user_id;
  dbms_output.put_line('�˻���'||v_balance);
  
  IF (v_balance>0) THEN
    IF (v_basic_fee+v_fee1+v_fee2 >=v_balance) THEN --��������� �۹���� 
      UPDATE COMMON_USER
      SET COMMON_USER.balance = 0
      WHERE COMMON_USER.USER_ID = v_user_id;
      v_arrears := v_basic_fee+v_fee1+v_fee2-v_balance ;
      
      INSERT INTO BALANCE_RECORD
      (GENERATE_DATE,SUM,USER_ID,REMARK) 
      VALUES
      (v_record_date,-v_balance,v_user_id,'�����Զ��۳����');
    ELSE -- ���� �۸��豸�ܷ���
      UPDATE COMMON_USER
      SET COMMON_USER.Balance = COMMON_USER.BALANCE-(v_basic_fee+v_fee1+v_fee2)
      WHERE COMMON_USER.USER_ID = v_user_id;
      v_arrears := 0;
      
      INSERT INTO BALANCE_RECORD
      (GENERATE_DATE,SUM,USER_ID,REMARK) 
      VALUES
      (v_record_date,-(v_basic_fee+v_fee1+v_fee2),v_user_id,'�����Զ��۳����');
    END IF;
  ELSE 
    v_arrears := v_basic_fee+v_fee1+v_fee2;
  END IF;
  dbms_output.put_line('Ƿ�ѣ�'||v_arrears);
  
  SELECT COUNT(*) --���������Ƿ񴴽��˷��ñ�
  INTO v_fee_payable_create_num
  FROM FEE_PAYABLE
  WHERE FEE_PAYABLE.USER_ID = v_user_id AND FEE_PAYABLE.GENERATE_DATE=v_record_date;
  
  IF (v_fee_payable_create_num=0) THEN --���»�û������򴴽�һ���սɷѱ�
    INSERT INTO FEE_PAYABLE
    (USER_ID,ELECTRIC_DEGREE,TOTAL_FEE,GENERATE_DATE,BASIC_FEE,FEE1,FEE2)
    VALUES
    (v_user_id,0,0,v_record_date,0,0,0);
  END IF;
  
  --update�����µ�����
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
