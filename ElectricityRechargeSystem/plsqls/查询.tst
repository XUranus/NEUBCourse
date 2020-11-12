PL/SQL Developer Test script 3.0
47
/*涉及到的表： 
客户信息表、计费设备表、应收费用表 
输入：
客户编号
输出：
应缴费金额
交易描述： 
判断客户号是否存在，然后根据客户号取得客户姓名，地址，应收费用 
其中应收费用的计算： 
找到该用户下所有计费设备，计算所有计费设备未交费的所有月份应收费用的和。 
设备应收费用的计算： 
根据计费设备号取得基本费用，附加费用1，附加费用2。应收费用=基本费用+附加费用1+附加费用2，依次获取该计费设备收费标志为0的所有月份应收费用的和。 修改应收费用表中的附加费用1，附加费用2几个字段，避免执行缴费操作后的重复计算。
*/
DECLARE
  v_user_id COMMON_USER.USER_ID%TYPE:=200000; --用户ID
  
  /*********************************************/
  v_user_count INTEGER;
  v_user_record COMMON_USER%ROWTYPE;
  v_total_owe DEVICE_BILL.HAS_PAID%TYPE:=0;
BEGIN  
  SELECT COUNT(*)
  INTO v_user_count
  FROM COMMON_USER
  WHERE COMMON_USER.USER_ID = v_user_id;

  IF (v_user_count=1) THEN --如果用户存在
     SELECT *
     INTO v_user_record
     FROM COMMON_USER
     WHERE COMMON_USER.user_id = v_user_id;
  
     DBMS_OUTPUT.PUT_LINE('姓名：'||v_user_record.username);
     
     SELECT SUM(DEVICE_BILL.ARREARS-DEVICE_BILL.HAS_PAID)
     INTO v_total_owe
     FROM DEVICE_BILL
     WHERE DEVICE_BILL.USER_ID = v_user_id;
     
     DBMS_OUTPUT.PUT_LINE('总欠费：'||v_total_owe);
  ELSE --用户不存在
    DBMS_OUTPUT.PUT_LINE('用户不存在');
  END IF ;
end;



0
0
