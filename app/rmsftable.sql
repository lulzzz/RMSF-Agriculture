
create table agricomm (
    devID varchar(255),
    temperature numeric(5,2),
    humidity numeric(5,2),
    moisture numeric(5,2),
    pump boolean,
    arrived_time datetime,
    primary key(arrived_time)
);