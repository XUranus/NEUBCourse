CREATE TABLE common_user (
  user_id NUMBER(10,0) not null,
  balance BINARY_DOUBLE NOT NULL,
  username VARCHAR2(30)  NOT NULL,
  pass VARCHAR2(50)  NOT NULL,
  telephone VARCHAR2(20) DEFAULT NULL ,
  register_date DATE NOT NULL,
  PRIMARY KEY (user_id),
  UNIQUE (username),
  UNIQUE (telephone)
);

CREATE TABLE bank (
  bank_id NUMBER(10,0) NOT NULL,
  bank_name VARCHAR2(20),
  PRIMARY KEY (bank_id),
  UNIQUE(bank_name)
);

CREATE TABLE device (
  device_id  NUMBER(10,0) NOT NULL ,
  device_type varchar(10) NOT NULL ,
  last_reading BINARY_DOUBLE NOT NULL ,
  address VARCHAR(50) NOT NULL ,
  arrears BINARY_DOUBLE NOT NULL ,
  user_id NUMBER(10,0) NOT NULL ,
  FOREIGN KEY (user_id) REFERENCES common_user(user_id),
  PRIMARY KEY (device_id)
);

CREATE TABLE bankcard (
  bankcard_number VARCHAR2(50) NOT NULL ,
  bank_id NUMBER(10,0) NOT NULL ,
  user_id NUMBER(10,0) NOT NULL ,
  FOREIGN KEY (bank_id) REFERENCES bank(bank_id),
  FOREIGN KEY (user_id) REFERENCES common_user(user_id),
  PRIMARY KEY (bankcard_number)
);

CREATE TABLE meter_reader(
  meter_reader_id NUMBER(10,0) NOT NULL ,
  meter_reader_name VARCHAR2(30) NOT NULL ,
  username VARCHAR2(30) NOT NULL ,
  pass VARCHAR2(50) NOT NULL ,
  telephone VARCHAR2(20) DEFAULT NULL ,
  PRIMARY KEY (meter_reader_id),
  UNIQUE (username),
  UNIQUE (telephone)
);

CREATE TABLE read_record (
  read_record_id NUMBER(10,0) NOT NULL,
  device_id NUMBER(10,0) NOT NULL ,
  meter_reader_id NUMBER(10,0) NOT NULL ,
  meter_reader_name VARCHAR2(30) NOT NULL ,
  record_date DATE NOT NULL ,
  reading BINARY_DOUBLE NOT NULL ,
  PRIMARY KEY (read_record_id),
  FOREIGN KEY (device_id) REFERENCES device(device_id),
  FOREIGN KEY (meter_reader_id) REFERENCES meter_reader(meter_reader_id)
);

/*
CREATE TABLE bill (
  bill_id NUMBER(10,0) NOT NULL ,
  bill_status NUMBER(2,0) NOT NULL,
  principle BINARY_DOUBLE NOT NULL ,
  user_id NUMBER(10,0) NOT NULL ,
  bill_generate_date DATE NOT NULL ,
  bill_start_date DATE NOT NULL ,
  bill_payed_date DATE DEFAULT NULL ,
  PRIMARY KEY (bill_id),
  FOREIGN KEY (user_id) REFERENCES common_user(user_id)
);

CREATE TABLE device_bill (
    device_id NUMBER(10,0) NOT NULL ,
    bill_id NUMBER(10,0) NOT NULL ,
    arrears BINARY_DOUBLE NOT NULL ,
    has_paid BINARY_DOUBLE DEFAULT 0,
    FOREIGN KEY (bill_id) REFERENCES bill(bill_id),
    FOREIGN KEY (device_id) REFERENCES device(device_id)
);*/

CREATE TABLE device_bill (
    device_id NUMBER(10,0) NOT NULL ,
    user_id number(10,0) NOT NULL ,
    arrears BINARY_DOUBLE NOT NULL ,
    has_paid BINARY_DOUBLE DEFAULT 0,
    fine_start_date DATE NOT NULL,
    FOREIGN KEY (device_id) REFERENCES device(device_id)
);

CREATE TABLE recharge (
  recharge_id NUMBER(10,0) NOT NULL ,
  recharge_date DATE NOT NULL ,
  recharge_remark VARCHAR2(20) NOT NULL ,
  bank_id NUMBER(10,0) NOT NULL,
  payment_seq_number int not null,
  user_id NUMBER(10,0) NOT NULL ,
  device_id NUMBER(10,0) NOT NULL ,
  recharge_money BINARY_DOUBLE NOT NULL ,
  PRIMARY KEY (recharge_id),
  FOREIGN KEY (device_id) REFERENCES device(device_id),
  FOREIGN KEY (user_id) REFERENCES common_user(user_id),
  FOREIGN KEY (bank_id) REFERENCES bank(bank_id),
  UNIQUE(payment_seq_number)
);

CREATE TABLE fee_payable (
  user_id NUMBER(10,0) NOT NULL ,
  electric_degree BINARY_DOUBLE NOT NULL ,
  total_fee BINARY_DOUBLE NOT NULL ,
  generate_date DATE NOT NULL ,
  basic_fee BINARY_DOUBLE NOT NULL ,
  fee1 BINARY_DOUBLE NOT NULL ,
  fee2 BINARY_DOUBLE NOT NULL ,
  PRIMARY KEY (user_id)
);


CREATE TABLE bank_payment (
  payment_seq_number NUMBER(10,0) NOT NULL ,
  user_id NUMBER(10,0) NOT NULL ,
  bankcard_number VARCHAR2(50) NOT NULL ,
  bank_id NUMBER(10,0) NOT NULL ,
  payment_date DATE NOT NULL ,
  cost BINARY_DOUBLE NOT NULL ,
  PRIMARY KEY (payment_seq_number),
  FOREIGN KEY (user_id) REFERENCES common_user(user_id),
  FOREIGN KEY (bankcard_number) REFERENCES bankcard(bankcard_number)
);

CREATE TABLE admin (
    admin_id NUMBER(10,0) NOT NULL ,
    username VARCHAR2(20) NOT NULL ,
    pass VARCHAR2(20) not null,
    PRIMARY KEY (admin_id),
    UNIQUE (username)
);

CREATE TABLE CHECK_GENERAL (
  check_date DATE not null,
  bank_id NUMBER(10,0) not null ,
  bank_sum_of_money BINARY_DOUBLE not null ,
  bank_transaction_count NUMBER(10,0),
  recharge_sum_of_money BINARY_DOUBLE not null ,
  recharge_transaction_count NUMBER(10,0),
  result NUMBER(1)
)

CREATE TABLE BALANCE_RECORD (
  generate_date DATE NOT NULL,
  sum BINARY_DOUBLE NOT NULL,
  user_id NUMBER(10,0) NOT NULL,
  remark VARCHAR2(100) NOT NULL ,
  FOREIGN KEY (user_id) REFERENCES COMMON_USER(user_id)
)



create sequence RECHARGE_SEQUENCE
minvalue 1
maxvalue 999999
start with 1
increment by 1
nocache;


create sequence BANK_PAYMENT_SEQUENCE
minvalue 1
maxvalue 999999
start with 1
increment by 1
nocache;

create sequence READ_RECORD_SEQUENCE
minvalue 1
maxvalue 999999
start with 1
increment by 1
nocache;

CREATE OR REPLACE TRIGGER CREATE_BANK_PAYMENT_TRI
  BEFORE INSERT ON BANK_PAYMENT
  FOR EACH ROW
DECLARE
  nextid NUMBER;
BEGIN
  IF :new.BANKMENT_SEQ_NUMBER IS NULL OR :new.BANKMENT_SEQ_NUMBER=0 THEN
    SELECT BANK_PAYMENT_SEQUENCE.nextval
    into nextid
    from sys.dual;
    :new.BANKMENT_SEQ_NUMBER:=nextid;
  END IF;
END CREATE_BANK_PAYMENT_TRI;

CREATE OR REPLACE TRIGGER CREATE_RECHARGE_TRI
  BEFORE INSERT ON RECHARGE
  FOR EACH ROW
DECLARE
  nextid NUMBER;
BEGIN
  IF :new.RECHARGE_ID IS NULL OR :new.RECHARGE_ID=0 THEN
    SELECT RECHARGE_SEQUENCE.nextval
    into nextid
    from sys.dual;
    :new.RECHARGE_ID:=nextid;
  END IF;
END CREATE_RECHARGE_TRI;


CREATE OR REPLACE TRIGGER CREATE_READ_RECORD_TRI
  BEFORE INSERT ON READ_RECORD
  FOR EACH ROW
DECLARE
  nextid NUMBER;
BEGIN
  IF :new.READ_RECORD_ID IS NULL OR :new.READ_RECORD_ID=0 THEN
    SELECT READ_RECORD_SEQUENCE.nextval
    into nextid
    from sys.dual;
    :new.READ_RECORD_ID:=nextid;
  END IF;
END CREATE_READ_RECORD_TRI;