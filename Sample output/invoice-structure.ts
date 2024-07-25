[
    {
        invoiceNumber: undefined,
        date: "2024-06-30T18:30:00.000Z",
        customerName: 'Paresh Patel',
        totalAmount: 1100,
        isError: true,
        items: [
            {
                itemDescription: 'Pencil',
                itemQuantity: 50,
                itemPrice: 10,
                itemTotal: 500,
                errorMessage: '"Invoice Number" is required'
            }
        ]
    },
    {
        invoiceNumber: 1,
        date: "2024-06-30T18:30:00.000Z",
        customerName: 'Paresh Patel',
        totalAmount: 1100,
        isError: true,
        items: [
            {
                itemDescription: undefined,
                itemQuantity: 10,
                itemPrice: 60,
                itemTotal: 600,
                errorMessage: '"Item Description" is required'
            }
        ]
    },
    {
        invoiceNumber: 2,
        date: "2024-07-04T18:30:00.000Z",
        customerName: 'Suresh Patel',
        totalAmount: 1100,
        isError: false,
        items: [
            {
                itemDescription: 'Brush-1',
                itemQuantity: 10,
                itemPrice: 50,
                itemTotal: 500,
                errorMessage: ''
            },
            {
                itemDescription: 'Brush-2',
                itemQuantity: 10,
                itemPrice: 50,
                itemTotal: 500,
                errorMessage: ''
            }
        ]
    },
    {
        invoiceNumber: 2,
        date: "2024-07-04T18:30:00.000Z",
        customerName: 'Bhavna Patel',
        totalAmount: 1000,
        isError: true,
        items: [
            {
                itemDescription: undefined,
                itemQuantity: 20,
                itemPrice: 50,
                itemTotal: 1000,
                errorMessage: 'Duplicate Invoice number.\n"Item Description" is required'
            }
        ]
    },
]