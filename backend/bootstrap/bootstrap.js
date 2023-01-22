const database = require('../config/database');

/**
 * Method inserts dummy data into the database
 */
exports.run = () => {
    const allItems = [
        {
            name: "HP Spectre x360 14",
            type: "Laptop",
            price: "900$",
            details: [
                {
                    name: "Storage",
                    value: "512gb"
                },
                {
                    name: "Processor",
                    value: "i7-1165G7"
                }
            ]
        },
        {
            name: "Dell XPS 15",
            type: "Laptop",
            price: "1400$",
            details: [
                {
                    name: "Graphics",
                    value: "RTX 3050 Ti"
                },
                {
                    name: "Processor",
                    value: "i7-12700H "
                },
                {
                    name: "Operating system",
                    value: "Windows 98"
                }
            ]
        },
        {
            name: "Google Pixel 7",
            price: "700$",
            details: []
        },
        {
            name: "Logitech PRO X Superlight",
            type: "Mouse",
            price: "200$",
            details: [
                {
                    name: "Weight",
                    value: "45g"
                },
                {
                    name: "Battery life",
                    value: "16h"
                }
            ]
        },
        {
            name: "No name psu",
            price: "30$",
            details: [
                {
                    name: "Efficiency",
                    value: "80+ platinum"
                },
                {
                    name: "Wattage",
                    value: "1200W"
                }
            ]
        }
    ]
    allItems.map(async (item) => await createItemAndDetails(item));
}

async function createItemAndDetails(item) {
    console.log(`Creating item by name ${item.name}`)
    const docItem = await database.addItem({
        name: item.name,
        type: item.type,
        price: item.price,
        createdAt: Date.now()
    });
    item.details.map(async (detail) => await database.addItemDetail(docItem._id, detail));
}