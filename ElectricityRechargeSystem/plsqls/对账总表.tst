PL/SQL Developer Test script 3.0
55
/*�漰���ı� 
�û����ѱ������˱� 
���룺
���д��룬�ܱ������ܽ���������
�����
��
���������� 
ÿ���賿���лᷢ������ǰһ����ܽ��׽��ܽ��ױ����������н��׽�����ϸ��Ϣ������ҵ���˶ԡ����д�������Ϣ���������д��룬�ܱ������ܽ��������ڡ� 
�������д��룬������������ر��в����������㵱ǰ���У����ڵĽɷѼ�¼�����ͽ�ͬ���д����������Ƚϣ�����ܱ������ܽ���ͬ��������Ϊ�˴ζ����˳ɹ���������ö���ϸ��ģ�顣���г������׺ͱ��������׵ı����ͽ��������ڡ�����Ҫ���ظ����ж������Ƿ�ɹ�����Ϣ��
*/
DECLARE
  v_date BANK_PAYMENT.PAYMENT_DATE%TYPE := to_date('2018-10-20','yyyy-mm-dd');--��������
  v_bank_id BANK.BANK_ID%TYPE:=2000;--���д���
  v_total_transaction_number INTEGER:=2;--�ܱ���
  v_sum_of_money BANK_PAYMENT.COST%TYPE:=700;--�ܽ��
  
  /*************************** need config ************************************/
  
  v_recharge_number NUMBER(10,0);
  v_recharge_sum_of_money BANK_PAYMENT.COST%TYPE;
  v_result NUMBER(1):=0;
BEGIN
  dbms_output.put_line('�����տ��ܱ�����'||v_total_transaction_number);
  dbms_output.put_line('�����տ��ܽ�'||v_sum_of_money);
  
  SELECT SUM(RECHARGE_MONEY)
  INTO v_recharge_sum_of_money
  FROM RECHARGE 
  WHERE RECHARGE.BANK_ID = v_bank_id AND RECHARGE.RECHARGE_DATE=v_date AND RECHARGE.RECHARGE_REMARK='�ɷ�';
  
  SELECT COUNT(*)
  INTO v_recharge_number
  FROM RECHARGE 
  WHERE RECHARGE.BANK_ID = v_bank_id AND RECHARGE.RECHARGE_DATE=v_date AND RECHARGE.RECHARGE_REMARK='�ɷ�';
  
  IF v_recharge_number=0 THEN
    v_recharge_sum_of_money:=0;
  END IF;

  dbms_output.put_line('��ҵ�տ��ܱ�����'||v_recharge_number);
  dbms_output.put_line('��ҵ�տ��ܽ�'||v_recharge_sum_of_money);
  
  IF (v_recharge_number=v_total_transaction_number AND v_recharge_sum_of_money=v_recharge_sum_of_money) THEN
     dbms_output.put_line('���˳ɹ�');
     v_result := 1;
  ELSE 
    dbms_output.put_line('����ʧ��');
    v_result := 0;
  END IF;
  
  INSERT INTO CHECK_GENERAL
  (check_date,bank_id,bank_sum_of_money,bank_transaction_count,recharge_sum_of_money,recharge_transaction_count,result)
  VALUES
  (v_date,v_bank_id,v_sum_of_money,v_total_transaction_number,v_recharge_sum_of_money,v_recharge_number,v_result);
END;
0
0
