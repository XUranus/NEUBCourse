PL/SQL Developer Test script 3.0
85
/*�漰���ı� 
�Ʒ��豸��Ӧ�շ��ñ��û����ѱ� 
���룺
�ͻ��ţ��ɷѽ��
�����
�ɹ���ʧ��
���������� 
�жϽ��ѽ���Ƿ���ȷ�����ѽ��Ӧ��Ϊ�������ã����ӷ���1�����ӷ���2���ĺ͡�������ѽ���ȷ�����ؽ��ѽ��������ʾ��Ϣ���ɷѽ����ȷ����Ӧ�շ��ñ�����޸��շѱ�־��ͬʱ�û����ѱ�������һ����¼�����в�������Ϊ������
*/

DECLARE
  v_user_id COMMON_USER.User_Id%TYPE:=200000; --�����û�ID
  v_receivcer_user_id COMMON_USER.User_Id%TYPE:=200000; --�տ��û�ID
  v_device_id DEVICE.DEVICE_ID%TYPE:=3; --�豸��
  v_recharge_cost FEE_PAYABLE.TOTAL_FEE%TYPE:=300; --��ֵ����
  v_bankcard_number BANK_PAYMENT.Bankcard_Number%TYPE:=1879687245234554; --���п���
  v_payment_date BANK_PAYMENT.Payment_Date%TYPE:=to_date('2018-10-20','yyyy-mm-dd');--����
  /************************** ��Ҫ���� ***********************************/
  v_device_mathches INTEGER:=0;
  v_bank_id BANK_PAYMENT.Bank_Id%TYPE;
  v_balance COMMON_USER.Balance%TYPE;
  wrong_recharge_cost EXCEPTION;
  v_bank_payment_seq_number BANK_PAYMENT.PAYMENT_SEQ_NUMBER%TYPE;
   
BEGIN
  SELECT COUNT(*) --��ȡ���ϵ��豸��Ŀ
  INTO v_device_mathches
  FROM DEVICE
  WHERE DEVICE.device_id = v_device_id;
  
  IF (v_recharge_cost<=0) THEN 
    dbms_output.put_line('����ȷ�Ľɷ�����');
  ELSE IF (v_device_mathches=0) THEN
    dbms_output.put_line('�����ڵ��豸');
  ELSE --������ȷ
    
    --�������нɷѼ�¼
    SELECT bank_id --��ȡbank id
    INTO v_bank_id
    FROM BANKCARD
    WHERE BANKCARD.bankcard_number=v_bankcard_number;
   
      
    INSERT INTO BANK_PAYMENT
    (user_id,bankcard_number,bank_id,payment_date,cost)
    VALUES
    (v_user_id,v_bankcard_number,v_bank_id,v_payment_date,v_recharge_cost)
    RETURNING BANK_PAYMENT.payment_seq_number INTO v_bank_payment_seq_number;

    --ȡ�õ����� ������ҵ��ֵ��¼
    INSERT INTO RECHARGE
    (recharge_id,bank_id,recharge_date,recharge_remark,payment_seq_number,user_id,device_id,recharge_money) 
    VALUES 
    (RECHARGE_SEQUENCE.NEXTVAL,v_bank_id,v_payment_date,'�ɷ�',v_bank_payment_seq_number,v_user_id,v_device_id,v_recharge_cost); 
    
    SELECT BALANCE --��ȡ���
    INTO v_balance
    FROM COMMON_USER
    WHERE COMMON_USER.USER_ID=v_user_id;
    dbms_output.put_line('�û���'||v_balance);
    dbms_output.put_line('�˴νɷѣ�'||v_recharge_cost);
    
    --�����ɷ�
    v_balance:=PAY_BY_BALANCE(v_device_id,v_balance,v_user_id,v_payment_date);
    
    IF v_balance=0 THEN
          --����γ��Ǯ�ɷ�
      v_recharge_cost:=PAY_BY_CHARGE(v_device_id,v_recharge_cost,v_payment_date);
      IF (v_recharge_cost>0) THEN
        UPDATE COMMON_USER
        SET COMMON_USER.balance = COMMON_USER.BALANCE+v_recharge_cost
        WHERE COMMON_USER.User_Id = v_receivcer_user_id;
        
        INSERT INTO BALANCE_RECORD
        (GENERATE_DATE,SUM,USER_ID,REMARK)
        VALUES 
        (v_payment_date,v_recharge_cost,v_receivcer_user_id,'��ֵ�豸����');
      END IF;
    
    END IF;
    
  END IF;
  END IF;
  dbms_output.put_line('FINISH');
END;  
0
0
