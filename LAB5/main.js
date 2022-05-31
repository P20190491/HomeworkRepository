async function fetchProduct() {
    let json = await (await fetch("./product.json")).json();
    
    // check validity

    if(!Array.isArray(json)) throw "Invalid Product JSON : Not Array";

    let properties = ["name", "category", "image", "price"];

    if(!json.every(e => properties.every(p => e.hasOwnProperty(p)))) throw "Invalid Product JSON : Item Property";

    // collect category

    let categories = new Set();

    json.forEach(e => {
        if(!Array.isArray(e["category"])) throw "Invalid Product JSON : Category Not Array";
        e["category"].forEach(c => categories.add(c));
    })

    return {categories:categories, items:json};
    
}

function filterProduct(category, search, items) {
    let categorized = category != null ? items.filter(e => e.category.includes(category)) : items;
    return categorized.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
}

