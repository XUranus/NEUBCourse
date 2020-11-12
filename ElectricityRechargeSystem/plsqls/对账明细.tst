PL/SQL Developer Test script 3.0
40
-- Created on 2018/8/29 by 王星校 
/*
（5）对明细账 
涉及到的表： 
用户缴费表、对账明细、对账异常表 
输入：
银行对账明细记录集合
输出：
无
交易描述：
总账不平需要逐笔核对明细账。判断账务不平的原因，并记录到对账异常表中，由其他应用程序来处理。
根据银行传来的银行代码，银行交易流水号，交易日期时间，客户号，交费金额等信息，在用户缴费表中查找相应的记录，对账不平的可能性有企业方无此流水号的缴费信息，银行无此流水号的缴费信息，金额不等，把所有对账不平的信息及原因记录到对账异常表。
*/
DECLARE
  v_date BANK_PAYMENT.PAYMENT_DATE%TYPE := to_date('1998-08-07','yyyy-mm-dd');--对账日期
  v_bank_id BANK.BANK_ID%TYPE:=1000;--银行代码
  
  CURSOR not_in_local_cursor IS
  SELECT * FROM BANK_PAYMENT 
  WHERE BANK_PAYMENT.BANK_ID=v_bank_id AND BANK_PAYMENT.PAYMENT_DATE=v_date AND BANK_PAYMENT.PAYMENT_SEQ_NUMBER NOT IN
  (SELECT payment_seq_number FROM RECHARGE WHERE RECHARGE.BANK_ID=v_bank_id AND RECHARGE.RECHARGE_DATE=v_date);
  
  CURSOR not_in_bank_cursor IS
  SELECT * FROM RECHARGE 
  WHERE RECHARGE.BANK_ID=v_bank_id AND RECHARGE.RECHARGE_DATE=v_date AND RECHARGE.Recharge_Remark='缴费' AND RECHARGE.PAYMENT_SEQ_NUMBER NOT IN
  (SELECT payment_seq_number FROM BANK_PAYMENT WHERE BANK_PAYMENT.BANK_ID=v_bank_id AND BANK_PAYMENT.PAYMENT_DATE=v_date);
  
BEGIN
  dbms_output.put_line('银行有而本地不存在的交易记录：');
  FOR not_in_local_record IN not_in_local_cursor LOOP
    dbms_output.put_line('银行流水号：'||not_in_local_record.PAYMENT_SEQ_NUMBER);
  END LOOP;

  dbms_output.put_line('------');
  
  dbms_output.put_line('本地存在而银行不存在的交易记录：');
  FOR not_in_bank_record IN not_in_bank_cursor LOOP
    dbms_output.put_line('本机交易记录号：'||not_in_bank_record.recharge_id);
  END LOOP;
END;
0
0
