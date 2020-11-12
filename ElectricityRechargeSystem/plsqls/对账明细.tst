PL/SQL Developer Test script 3.0
40
-- Created on 2018/8/29 by ����У 
/*
��5������ϸ�� 
�漰���ı� 
�û��ɷѱ�������ϸ�������쳣�� 
���룺
���ж�����ϸ��¼����
�����
��
����������
���˲�ƽ��Ҫ��ʺ˶���ϸ�ˡ��ж�����ƽ��ԭ�򣬲���¼�������쳣���У�������Ӧ�ó���������
�������д��������д��룬���н�����ˮ�ţ���������ʱ�䣬�ͻ��ţ����ѽ�����Ϣ�����û��ɷѱ��в�����Ӧ�ļ�¼�����˲�ƽ�Ŀ���������ҵ���޴���ˮ�ŵĽɷ���Ϣ�������޴���ˮ�ŵĽɷ���Ϣ�����ȣ������ж��˲�ƽ����Ϣ��ԭ���¼�������쳣��
*/
DECLARE
  v_date BANK_PAYMENT.PAYMENT_DATE%TYPE := to_date('1998-08-07','yyyy-mm-dd');--��������
  v_bank_id BANK.BANK_ID%TYPE:=1000;--���д���
  
  CURSOR not_in_local_cursor IS
  SELECT * FROM BANK_PAYMENT 
  WHERE BANK_PAYMENT.BANK_ID=v_bank_id AND BANK_PAYMENT.PAYMENT_DATE=v_date AND BANK_PAYMENT.PAYMENT_SEQ_NUMBER NOT IN
  (SELECT payment_seq_number FROM RECHARGE WHERE RECHARGE.BANK_ID=v_bank_id AND RECHARGE.RECHARGE_DATE=v_date);
  
  CURSOR not_in_bank_cursor IS
  SELECT * FROM RECHARGE 
  WHERE RECHARGE.BANK_ID=v_bank_id AND RECHARGE.RECHARGE_DATE=v_date AND RECHARGE.Recharge_Remark='�ɷ�' AND RECHARGE.PAYMENT_SEQ_NUMBER NOT IN
  (SELECT payment_seq_number FROM BANK_PAYMENT WHERE BANK_PAYMENT.BANK_ID=v_bank_id AND BANK_PAYMENT.PAYMENT_DATE=v_date);
  
BEGIN
  dbms_output.put_line('�����ж����ز����ڵĽ��׼�¼��');
  FOR not_in_local_record IN not_in_local_cursor LOOP
    dbms_output.put_line('������ˮ�ţ�'||not_in_local_record.PAYMENT_SEQ_NUMBER);
  END LOOP;

  dbms_output.put_line('------');
  
  dbms_output.put_line('���ش��ڶ����в����ڵĽ��׼�¼��');
  FOR not_in_bank_record IN not_in_bank_cursor LOOP
    dbms_output.put_line('�������׼�¼�ţ�'||not_in_bank_record.recharge_id);
  END LOOP;
END;
0
0
