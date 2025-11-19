#!/bin/bash

# Exhibition API Test Script
# This script demonstrates how to test the exhibition APIs

BASE_URL="http://localhost:4000"

echo "================================================"
echo "Exhibition API Test Suite"
echo "================================================"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/health" | jq '.'
echo ""
echo ""

# Test 2: Create Exhibition (requires actual files)
echo "2. Create Exhibition Example:"
echo "   You need to provide actual image/video files"
echo ""
echo "   Example command:"
echo "   curl -X POST $BASE_URL/api/exhibitions \\"
echo "     -F \"poster=@/path/to/poster.jpg\" \\"
echo "     -F \"productImages=@/path/to/product1.jpg\" \\"
echo "     -F \"productImages=@/path/to/product2.jpg\" \\"
echo "     -F \"productVideo=@/path/to/video.mp4\" \\"
echo "     -F \"companyName=Tech Innovations Ltd\" \\"
echo "     -F \"companyDescription=Leading tech solutions provider\" \\"
echo "     -F \"companyAbout=We specialize in AI and cloud solutions\" \\"
echo "     -F \"productName=Smart Dashboard\" \\"
echo "     -F \"productDescription=Real-time analytics dashboard\" \\"
echo "     -F \"productAbout=Monitor your business metrics in real-time\""
echo ""
echo ""

# Test 3: Get All Exhibitions
echo "3. Testing Get All Exhibitions..."
curl -s "$BASE_URL/api/exhibitions" | jq '.'
echo ""
echo ""

echo "================================================"
echo "Tests Complete!"
echo "================================================"
echo ""
echo "To create an exhibition with actual files, use:"
echo "  bash test-api.sh create /path/to/poster.jpg /path/to/product1.jpg"
echo ""
