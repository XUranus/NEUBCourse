PL/SQL Developer Test script 3.0
55
/*涉及到的表： 
用户交费表、对总账表 
输入：
银行代码，总笔数，总金额，对帐日期
输出：
无
交易描述： 
每天凌晨银行会发送所有前一天的总交易金额，总交易笔数，及所有交易金额等明细信息，供企业方核对。银行传来的信息包括：银行代码，总笔数，总金额，对帐日期。 
根据银行代码，对帐日期在相关表中查找所有满足当前银行，日期的缴费记录笔数和金额，同银行传来数据做比较，如果总笔数，总金额都相同，可以认为此次对总账成功，否则调用对明细账模块。其中冲正交易和被冲正交易的笔数和金额不计入在内。不需要返回给银行对总账是否成功的信息。
*/
DECLARE
  v_date BANK_PAYMENT.PAYMENT_DATE%TYPE := to_date('2018-10-20','yyyy-mm-dd');--对账日期
  v_bank_id BANK.BANK_ID%TYPE:=2000;--银行代码
  v_total_transaction_number INTEGER:=2;--总笔数
  v_sum_of_money BANK_PAYMENT.COST%TYPE:=700;--总金额
  
  /*************************** need config ************************************/
  
  v_recharge_number NUMBER(10,0);
  v_recharge_sum_of_money BANK_PAYMENT.COST%TYPE;
  v_result NUMBER(1):=0;
BEGIN
  dbms_output.put_line('银行收款总笔数：'||v_total_transaction_number);
  dbms_output.put_line('银行收款总金额：'||v_sum_of_money);
  
  SELECT SUM(RECHARGE_MONEY)
  INTO v_recharge_sum_of_money
  FROM RECHARGE 
  WHERE RECHARGE.BANK_ID = v_bank_id AND RECHARGE.RECHARGE_DATE=v_date AND RECHARGE.RECHARGE_REMARK='缴费';
  
  SELECT COUNT(*)
  INTO v_recharge_number
  FROM RECHARGE 
  WHERE RECHARGE.BANK_ID = v_bank_id AND RECHARGE.RECHARGE_DATE=v_date AND RECHARGE.RECHARGE_REMARK='缴费';
  
  IF v_recharge_number=0 THEN
    v_recharge_sum_of_money:=0;
  END IF;

  dbms_output.put_line('企业收款总笔数：'||v_recharge_number);
  dbms_output.put_line('企业收款总金额：'||v_recharge_sum_of_money);
  
  IF (v_recharge_number=v_total_transaction_number AND v_recharge_sum_of_money=v_recharge_sum_of_money) THEN
     dbms_output.put_line('对账成功');
     v_result := 1;
  ELSE 
    dbms_output.put_line('对账失败');
    v_result := 0;
  END IF;
  
  INSERT INTO CHECK_GENERAL
  (check_date,bank_id,bank_sum_of_money,bank_transaction_count,recharge_sum_of_money,recharge_transaction_count,result)
  VALUES
  (v_date,v_bank_id,v_sum_of_money,v_total_transaction_number,v_recharge_sum_of_money,v_recharge_number,v_result);
END;
0
0
