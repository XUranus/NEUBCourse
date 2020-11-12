PL/SQL Developer Test script 3.0
47
/*�漰���ı� 
�ͻ���Ϣ���Ʒ��豸��Ӧ�շ��ñ� 
���룺
�ͻ����
�����
Ӧ�ɷѽ��
���������� 
�жϿͻ����Ƿ���ڣ�Ȼ����ݿͻ���ȡ�ÿͻ���������ַ��Ӧ�շ��� 
����Ӧ�շ��õļ��㣺 
�ҵ����û������мƷ��豸���������мƷ��豸δ���ѵ������·�Ӧ�շ��õĺ͡� 
�豸Ӧ�շ��õļ��㣺 
���ݼƷ��豸��ȡ�û������ã����ӷ���1�����ӷ���2��Ӧ�շ���=��������+���ӷ���1+���ӷ���2�����λ�ȡ�üƷ��豸�շѱ�־Ϊ0�������·�Ӧ�շ��õĺ͡� �޸�Ӧ�շ��ñ��еĸ��ӷ���1�����ӷ���2�����ֶΣ�����ִ�нɷѲ�������ظ����㡣
*/
DECLARE
  v_user_id COMMON_USER.USER_ID%TYPE:=200000; --�û�ID
  
  /*********************************************/
  v_user_count INTEGER;
  v_user_record COMMON_USER%ROWTYPE;
  v_total_owe DEVICE_BILL.HAS_PAID%TYPE:=0;
BEGIN  
  SELECT COUNT(*)
  INTO v_user_count
  FROM COMMON_USER
  WHERE COMMON_USER.USER_ID = v_user_id;

  IF (v_user_count=1) THEN --����û�����
     SELECT *
     INTO v_user_record
     FROM COMMON_USER
     WHERE COMMON_USER.user_id = v_user_id;
  
     DBMS_OUTPUT.PUT_LINE('������'||v_user_record.username);
     
     SELECT SUM(DEVICE_BILL.ARREARS-DEVICE_BILL.HAS_PAID)
     INTO v_total_owe
     FROM DEVICE_BILL
     WHERE DEVICE_BILL.USER_ID = v_user_id;
     
     DBMS_OUTPUT.PUT_LINE('��Ƿ�ѣ�'||v_total_owe);
  ELSE --�û�������
    DBMS_OUTPUT.PUT_LINE('�û�������');
  END IF ;
end;



0
0
