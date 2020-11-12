PL/SQL Developer Test script 3.0
85
/*涉及到的表： 
计费设备表、应收费用表、用户交费表 
输入：
客户号，缴费金额
输出：
成功，失败
交易描述： 
判断交费金额是否正确，交费金额应该为基本费用，附加费用1，附加费用2，的和。如果交费金额不正确，返回交费金额错误的提示信息。缴费金额正确，在应收费用表表中修改收费标志。同时用户交费表中增加一条记录，其中操作类型为“存款”。
*/

DECLARE
  v_user_id COMMON_USER.User_Id%TYPE:=200000; --付款用户ID
  v_receivcer_user_id COMMON_USER.User_Id%TYPE:=200000; --收款用户ID
  v_device_id DEVICE.DEVICE_ID%TYPE:=3; --设备号
  v_recharge_cost FEE_PAYABLE.TOTAL_FEE%TYPE:=300; --充值数额
  v_bankcard_number BANK_PAYMENT.Bankcard_Number%TYPE:=1879687245234554; --银行卡号
  v_payment_date BANK_PAYMENT.Payment_Date%TYPE:=to_date('2018-10-20','yyyy-mm-dd');--日期
  /************************** 需要配置 ***********************************/
  v_device_mathches INTEGER:=0;
  v_bank_id BANK_PAYMENT.Bank_Id%TYPE;
  v_balance COMMON_USER.Balance%TYPE;
  wrong_recharge_cost EXCEPTION;
  v_bank_payment_seq_number BANK_PAYMENT.PAYMENT_SEQ_NUMBER%TYPE;
   
BEGIN
  SELECT COUNT(*) --获取符合的设备数目
  INTO v_device_mathches
  FROM DEVICE
  WHERE DEVICE.device_id = v_device_id;
  
  IF (v_recharge_cost<=0) THEN 
    dbms_output.put_line('不正确的缴费数额');
  ELSE IF (v_device_mathches=0) THEN
    dbms_output.put_line('不存在的设备');
  ELSE --操作正确
    
    --生成银行缴费记录
    SELECT bank_id --获取bank id
    INTO v_bank_id
    FROM BANKCARD
    WHERE BANKCARD.bankcard_number=v_bankcard_number;
   
      
    INSERT INTO BANK_PAYMENT
    (user_id,bankcard_number,bank_id,payment_date,cost)
    VALUES
    (v_user_id,v_bankcard_number,v_bank_id,v_payment_date,v_recharge_cost)
    RETURNING BANK_PAYMENT.payment_seq_number INTO v_bank_payment_seq_number;

    --取得的主键 生成企业充值记录
    INSERT INTO RECHARGE
    (recharge_id,bank_id,recharge_date,recharge_remark,payment_seq_number,user_id,device_id,recharge_money) 
    VALUES 
    (RECHARGE_SEQUENCE.NEXTVAL,v_bank_id,v_payment_date,'缴费',v_bank_payment_seq_number,v_user_id,v_device_id,v_recharge_cost); 
    
    SELECT BALANCE --获取余额
    INTO v_balance
    FROM COMMON_USER
    WHERE COMMON_USER.USER_ID=v_user_id;
    dbms_output.put_line('用户余额：'||v_balance);
    dbms_output.put_line('此次缴费：'||v_recharge_cost);
    
    --用余额缴费
    v_balance:=PAY_BY_BALANCE(v_device_id,v_balance,v_user_id,v_payment_date);
    
    IF v_balance=0 THEN
          --用这次冲的钱缴费
      v_recharge_cost:=PAY_BY_CHARGE(v_device_id,v_recharge_cost,v_payment_date);
      IF (v_recharge_cost>0) THEN
        UPDATE COMMON_USER
        SET COMMON_USER.balance = COMMON_USER.BALANCE+v_recharge_cost
        WHERE COMMON_USER.User_Id = v_receivcer_user_id;
        
        INSERT INTO BALANCE_RECORD
        (GENERATE_DATE,SUM,USER_ID,REMARK)
        VALUES 
        (v_payment_date,v_recharge_cost,v_receivcer_user_id,'充值设备结余');
      END IF;
    
    END IF;
    
  END IF;
  END IF;
  dbms_output.put_line('FINISH');
END;  
0
0
