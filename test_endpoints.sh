#!/bin/bash

# Base URL of the API
BASE_URL="http://localhost:3000"

# User credentials
USERNAME="testuser"
PASSWORD="testpassword"

# Memo data
MEMO_DATA="This is a test memo"
MEMO_UPDATED_DATA="This is an updated test memo"

# Create a new user
echo "Signing up..."
curl -X PUT -H "Content-Type: application/json" -d "{\"username\":\"$USERNAME\", \"password\":\"$PASSWORD\"}" "$BASE_URL/user/sign-up"
echo -e "\n"

# Sign in and store the cookie
echo "Signing in..."
curl -X POST -H "Content-Type: application/json" -d "{\"username\":\"$USERNAME\", \"password\":\"$PASSWORD\"}" -c cookies.txt "$BASE_URL/user/sign-in"
echo -e "\n"

# Add a new memo
echo "Adding a new memo..."
curl -X PUT -H "Content-Type: application/json" -d "{\"data\":\"$MEMO_DATA\"}" -b cookies.txt "$BASE_URL/note"
echo -e "\n"

# Get all memos
echo "Retrieving all memos..."
curl -X GET -b cookies.txt "$BASE_URL/note"
echo -e "\n"

# Update the first memo
echo "Updating the first memo..."
curl -X PATCH -H "Content-Type: application/json" -d "{\"data\":\"$MEMO_UPDATED_DATA\"}" -b cookies.txt "$BASE_URL/note/0"
echo -e "\n"

# Get the updated memo
echo "Retrieving the updated memo..."
curl -X GET -b cookies.txt "$BASE_URL/note/0"
echo -e "\n"

# Delete the memo
echo "Deleting the memo..."
curl -X DELETE -b cookies.txt "$BASE_URL/note/0"
echo -e "\n"

# Get all memos to confirm deletion
echo "Retrieving all memos to confirm deletion..."
curl -X GET -b cookies.txt "$BASE_URL/note"
echo -e "\n"

# Sign out
echo "Signing out..."
curl -X GET -b cookies.txt "$BASE_URL/user/sign-out"
echo -e "\n"
