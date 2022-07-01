Version 1:
- Seperate UI/pages for Admin, Vendor and User
- Login of each of the above.
- Single Admin supported.
- Vendor-
	Vendor can Add products. And can how many orders have been placed.
- Admin
	- With each order 10% of the total price goes to Admin(Its fixed, Can be improved to make it generic. Admin/Vendor can decide on common ground)
	- Admin can see anything going on in the application e.g. Total Orders placed, Total Users using our app.
- User 
	- User can order and see the ordered products.

Products can be of 2 types 
1. Raw
2. Stitched.











I manually added auto increament for product table


ALTER TABLE `finalproject`.`vendor` 
CHANGE COLUMN `v_status` `v_status` BIT(1) NULL DEFAULT 0 ;

ALTER TABLE `finalproject`.`myorder` 
CHANGE COLUMN `o_id` `o_id` INT NOT NULL AUTO_INCREMENT ;

ALTER TABLE `finalproject`.`myorder` 
DROP COLUMN `qty`;



ngrok http -host-header=rewrite 3000

