# Product

### Get All Product

GET [domain]/api/product

**Response**

```json
{
		"status": "success"
    "data": [
	    {
			    "id": 1,
			    "name": "batman charm",
			    "stock": 5,
			    "price": 5000,
			},
			{
					"id": 2,
			    "name": "spiderman charm",
			    "stock": 2,
			    "price": 5000,
			}
    ]
}
```

### Add Product

POST [domain]/api/product

**Request**

```json
{
    "name": "batman charm",
    "stock": 5,
    "price": 5000,
}
```

**Response**

```json
{
		"status": "success"
    "message": "success add product",
}
```

### Edit Product

PUT [domain]/api/product/[id]

**Request**

```json
{
    "name": "batman charm",
    "stock": 5,
    "price": 5000,
}
```

**Response**

```json
{
		"status": "success"
    "message": "success edit product",
}
```

### DELETE Product

DELETE [domain]/api/product/[id]

**Response**

```json
{
    "status": "success",
    "message": "success delete product"
}
```

# Discount

### Get All Discount

GET [domain]/api/discount

**Response**

```json
{
		"status": "success"
    "data": [
	    {
			    "disc_code": "BATMAN",
			    "percentage": 50
			},
			{
			    "disc_code": "SPIDER",
			    "percentage": 25
			}
    ]
}
```

### Add Discount

POST [domain]/api/discount

**Request**

```json
{
    "disc_code": "MALIK",
    "percentage": 35
}
```

**Response**

```json
{
		"status": "success"
    "message": "success add discount",
}
```

### Edit Discount

POST [domain]/api/discount/[disc_code]

**Request**

```json
{
    "disc_code": "MALIK",
    "percentage": 35
}
```

**Response**

```json
{
		"status": "success"
    "message": "success edit discount",
}
```

### DELETE Product

DELETE [domain]/api/discount/[disc_code]

**Response**

```json
{
    "status": "success",
    "message": "success delete discount"
}
```

# Checkout

### Add Checkout

POST [domain]/api/checkout

**Request**

```json
{
  "name": "alghaza",
  "phone": "627282828",
  "disc_code": "AYAM",
  "payment_method": "cash",
  "upload_recipt": "image.png",
  "product_checkout": [
    {
      "quantity": 2,
      "product_id": 9,
    },
    {
      "quantity": 90,
      "product_id": 2
    }
  ]
}
```

**Response**

```json
{
		"status": "success"
    "message": "success add checkout",
}
```

### Get All Checkout

GET [domain]/api/checkout

**Response**

```json
[
	{
		"id": 1,
		"order_id": "SWV-0912012812"
	  "name": "alghaza",
	  "phone": "627282828",
	  "total_price": 10000,
	  "total_product": 2,
    "status_checkout": false,
    "created_at": "2025-05-14T10:30:00+07:00"
	},
	{
		"id": 2,
		"order_id": "SWV-0912112812"
	  "name": "algaza",
	  "phone": "62722828",
	  "total_price": 10000,
	  "total_product": 2,
    "status_checkout": false,
    "created_at": "2025-05-14T10:30:00+07:00"
	},
]
```

### Get Checkout Detail

GET [domain]/api/checkout/[order_id]

**Response**

```json
{
	"id": 1,
	"order_id": "SWV-0912012812"
  "name": "alghaza",
  "phone": "627282828",
  "disc_code": "AYAM",
  "payment_method": "cash",
  "upload_recipt": "image.png",
  "total_price": 10000,
  "total_product": 2,
  "status_checkout": false,
  "product_checkout": [
    {
      "quantity": 2,
      "product_id": 9,
    },
    {
      "quantity": 90,
      "product_id": 2
    }
  ],
   "created_at": "2025-05-14T10:30:00+07:00"
}
```

### UPDATE Status Checkout

PUT [domain]/api/checkout/[order_id]

**Request**

```json
{
    "status_checkout": true
}
```

**Response**

```json
{
    "status": "success",
    "message": "success update status checkout"
}
```

### DELETE Checkout

DELETE [domain]/api/checkout/[order_id]

**Response**

```json
{
    "status": "success",
    "message": "success delete checkoutt"
}
``` 