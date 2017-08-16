#!/bin/bash
read -p "Create a category"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"name":"Clothing"}'\
    http://localhost:3000/category
echo ""

read -p "Create a subcategory"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"name":"Shirts", "parent_category":"Clothing"}'\
    http://localhost:3000/category
echo ""



read -p "Create a user"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"email":"newuser@hotmail.com", "password": "123"}'\
    http://localhost:3000/user
echo ""

read -p "Test to get the user with userid=0"
curl -H "Content-Type: application/json"   \
    -X GET http://localhost:3000/user?id=0
echo ""

read -p "Test to change the user password with userid=0"
curl -H "Content-Type: application/json"   \
    -X PUT -d '{"password": "123456"}'  \
     http://localhost:3000/user?uid=0 --cookie user1.cookie
echo ""

read -p "Test: Login with the new user just created"
curl -H "Content-Type: application/json"   \
    -X POST -d '{"email":"newuser@hotmail.com", "password": "123456"}'   \
    http://localhost:3000/login   --cookie-jar user1.cookie
echo ""

## Make a second user
read -p "Create a user"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"email":"newuser2@hotmail.com", "password": "123"}'\
    http://localhost:3000/user
echo ""


#login 2nd user
read -p "Test: Login with the 2nd user just created"
curl -H "Content-Type: application/json"   \
    -X POST -d '{"email":"newuser2@hotmail.com", "password": "123"}'   \
    http://localhost:3000/login   --cookie-jar user2.cookie
echo ""



read -p "Create a few products as first user"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"apple", "price": 5, "category":"Shirts", "description":"Great tasting!"}'\
    http://localhost:3000/user/0/products --cookie user1.cookie
echo ""


curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"banana", "price": 8, "category":"Clothing", "description":"nice and yellow"}'\
    http://localhost:3000/user/0/products  --cookie user1.cookie
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Best shirt", "price": 20, "category":"Shirts", "description":"Its comfy!"}'\
    http://localhost:3000/user/0/products  --cookie user1.cookie
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Pants", "price": 15, "category":"Clothing", "description":"YUGE"}'\
    http://localhost:3000/user/0/products  --cookie user1.cookie
echo ""


read -p "Create a few products as second user"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"apple", "price": 5, "category":"Shirts", "description":"Great tasting!"}'\
    http://localhost:3000/user/11/products --cookie user2.cookie
echo ""


curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"banana", "price": 8, "category":"Clothing", "description":"nice and yellow"}'\
    http://localhost:3000/user/11/products  --cookie user2.cookie
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Best shirt", "price": 20, "category":"Shirts", "description":"Its comfy!"}'\
    http://localhost:3000/user/11/products  --cookie user2.cookie
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Pants", "price": 15, "category":"Clothing", "description":"YUGE"}'\
    http://localhost:3000/user/11/products  --cookie user2.cookie
echo ""



read -p "Create a product as user2 to user1 address"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Pants", "price": 15, "category":"Clothing", "description":"YUGE"}'\
    http://localhost:3000/user/0/products  --cookie user2.cookie
echo ""

read -p "Create a product as user1 to user2 address"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"productname":"Pants", "price": 15, "category":"Clothing", "description":"YUGE"}'\
    http://localhost:3000/user/1/products  --cookie user1.cookie
echo ""


## Search for a few products
read -p "Search few products"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"price": 15}'\
    http://localhost:3000/products
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"price": 8, "category":"Clothing"}'\
    http://localhost:3000/products
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"category":"Clothing"}'\
    http://localhost:3000/products
echo ""

curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"category":"Shirts", "price": 8}'\
    http://localhost:3000/products
echo""


read -p "Test to get the user products with userid=0"
curl -H "Content-Type: application/json"   \
    -X GET http://localhost:3000/user/0/products
echo ""

read -p "Test to delete one user products with userid=0"
curl -H "Content-Type: application/json"   \
    -X DELETE http://localhost:3000/user/0/products
echo ""



##Update a product
read -p "Test to update one products with pid=0"
curl -v   -H "Content-Type: application/json" \
    -X PUT -d '{"productname":"NEW NAME"}'\
    http://localhost:3000/products/0 --cookie user1.cookie
echo ""

##Delete a product
read -p "Test to delete one products with pid=0"
curl -v   -H "Content-Type: application/json" \
    -X DELETE -d ''\
    http://localhost:3000/products/0
echo ""


# This time we should fail to find the user's product since the product has been deleted.
read -p "Test to get the user products with userid=0, (Should fail since it has just been deleted)"
curl -H "Content-Type: application/json"   \
    -X GET http://localhost:3000/user/0/products
echo ""


read -p "Create a comment"
curl -v   -H "Content-Type: application/json" \
    -X POST -d '{"title":"hello world", "message": "testing comment", "product": 1}'\
    http://localhost:3000/comment
echo ""

# Get all comment for product 1
read -p "Get all comments for product=1"
curl -H "Content-Type: application/json" \
	-X GET http://localhost:3000/comment?productid=1
echo ""

