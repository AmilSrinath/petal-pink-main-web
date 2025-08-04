export interface Product {
    product_id: number;
    product_name: string;
    unit_type: string;
    product_price: number;
    quantity: number;
    discount: number;
    status: number;
    visible: number;
    create_date: string;
    edit_date: string;
    image_url: string;
    image_url_2: string;
    user_id: string;
}

let cachedProducts: Product[] = [];

export const fetchProducts = async (): Promise<Product[]> => {
    if (cachedProducts.length > 0) {
        return cachedProducts;
    }

    const serverUrl = process.env.REACT_APP_API_URL;
    
    try {
        const response = await fetch(`${serverUrl}/api/customerOrderSave/getAllData`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        cachedProducts = await response.json();
        return cachedProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; 
    }
};
fetchProducts().catch(console.error);
