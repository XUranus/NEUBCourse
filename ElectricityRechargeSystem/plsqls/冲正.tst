PL/SQL Developer Test script 3.0
75
-- Created on 2018/8/29 by ����У 
DECLARE
   v_seq_number BANK_PAYMENT.PAYMENT_SEQ_NUMBER%TYPE:=13;--��ˮ��
   v_user_id COMMON_USER.USER_ID%TYPE:=100000;--�û�ID
   v_money BANK_PAYMENT.COST%TYPE:=300;--���
   v_date DATE:=to_date('1998-08-07','yyyy-mm-dd');--��ǰ����
   
   /********** need config *******/
   v_bank_payment_matches INTEGER:=0;
   v_device_matches INTEGER:=0;
   v_recharge_record RECHARGE%ROWTYPE;
   v_device_id DEVICE.DEVICE_ID%TYPE;
   v_receiver_id COMMON_USER.USER_ID%TYPE;
BEGIN
  SELECT COUNT(*)
  INTO v_bank_payment_matches
  FROM RECHARGE
  WHERE RECHARGE.USER_ID = v_user_id
  AND RECHARGE.PAYMENT_SEQ_NUMBER=v_seq_number 
  AND RECHARGE.RECHARGE_MONEY = v_money;
  
  
  IF (v_bank_payment_matches=1) THEN --��֤ͨ��
    SELECT *
    INTO v_recharge_record
    FROM RECHARGE
    WHERE RECHARGE.USER_ID = v_user_id
    AND RECHARGE.PAYMENT_SEQ_NUMBER=v_seq_number 
    AND RECHARGE.RECHARGE_MONEY = v_money;
  
    IF (v_recharge_record.recharge_date=v_date) THEN --ʱ�����
      dbms_output.put_line('�ɹ��ҵ��ñʸ���');
        
      UPDATE COMMON_USER
      SET COMMON_USER.BALANCE = COMMON_USER.BALANCE+v_money;
        
      INSERT INTO BALANCE_RECORD
      (GENERATE_DATE,SUM,USER_ID,REMARK)
      VALUES 
      (v_date,v_money,v_user_id,'�����˿�');
      
      --------------------���ڱ�����
      v_device_id := v_recharge_record.device_id;
      SELECT user_id 
      INTO v_receiver_id
      FROM DEVICE
      WHERE DEVICE.DEVICE_ID = v_device_id;
      
      SELECT COUNT(*) 
      INTO v_device_matches
      FROM DEVICE_BILL
      WHERE DEVICE_BILL.DEVICE_ID=v_device_id;
      
      IF (v_device_matches=0) THEN --��Ҫ�ֶ�����һ��Ƿ�ѱ�
        INSERT INTO DEVICE_BILL
        (DEVICE_ID,USER_ID,ARREARS,HAS_PAID,FINE_START_DATE)
        VALUES
        (v_device_id,v_receiver_id,v_money,0,v_date);
      
      ELSE 
        UPDATE DEVICE_BILL
        SET DEVICE_BILL.Has_Paid = DEVICE_BILL.HAS_PAID - v_money
        WHERE ROWNUM<=1;
      END IF;
      
      
        
      dbms_output.put_line('�����ɹ�');  
    ELSE
      dbms_output.put_line('����ʱ���ѹ���ʧ��');
    END IF;
  ELSE --ʧ��
    dbms_output.put_line('δ���ҵ��ñʽ���');
  END IF;
END;
0
0
