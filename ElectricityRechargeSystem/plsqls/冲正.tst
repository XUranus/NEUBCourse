PL/SQL Developer Test script 3.0
75
-- Created on 2018/8/29 by 王星校 
DECLARE
   v_seq_number BANK_PAYMENT.PAYMENT_SEQ_NUMBER%TYPE:=13;--流水号
   v_user_id COMMON_USER.USER_ID%TYPE:=100000;--用户ID
   v_money BANK_PAYMENT.COST%TYPE:=300;--额度
   v_date DATE:=to_date('1998-08-07','yyyy-mm-dd');--当前日期
   
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
  
  
  IF (v_bank_payment_matches=1) THEN --验证通过
    SELECT *
    INTO v_recharge_record
    FROM RECHARGE
    WHERE RECHARGE.USER_ID = v_user_id
    AND RECHARGE.PAYMENT_SEQ_NUMBER=v_seq_number 
    AND RECHARGE.RECHARGE_MONEY = v_money;
  
    IF (v_recharge_record.recharge_date=v_date) THEN --时间符合
      dbms_output.put_line('成功找到该笔付款');
        
      UPDATE COMMON_USER
      SET COMMON_USER.BALANCE = COMMON_USER.BALANCE+v_money;
        
      INSERT INTO BALANCE_RECORD
      (GENERATE_DATE,SUM,USER_ID,REMARK)
      VALUES 
      (v_date,v_money,v_user_id,'冲正退款');
      
      --------------------对于被冲人
      v_device_id := v_recharge_record.device_id;
      SELECT user_id 
      INTO v_receiver_id
      FROM DEVICE
      WHERE DEVICE.DEVICE_ID = v_device_id;
      
      SELECT COUNT(*) 
      INTO v_device_matches
      FROM DEVICE_BILL
      WHERE DEVICE_BILL.DEVICE_ID=v_device_id;
      
      IF (v_device_matches=0) THEN --需要手动创建一个欠费表
        INSERT INTO DEVICE_BILL
        (DEVICE_ID,USER_ID,ARREARS,HAS_PAID,FINE_START_DATE)
        VALUES
        (v_device_id,v_receiver_id,v_money,0,v_date);
      
      ELSE 
        UPDATE DEVICE_BILL
        SET DEVICE_BILL.Has_Paid = DEVICE_BILL.HAS_PAID - v_money
        WHERE ROWNUM<=1;
      END IF;
      
      
        
      dbms_output.put_line('冲正成功');  
    ELSE
      dbms_output.put_line('冲正时间已过，失败');
    END IF;
  ELSE --失败
    dbms_output.put_line('未能找到该笔交易');
  END IF;
END;
0
0
