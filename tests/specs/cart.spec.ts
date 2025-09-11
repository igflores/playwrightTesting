import { test, expect } from '@playwright/test';
import { ProductListPage } from '../pages/ProductListPage';
import { CartPage } from '../pages/CartPage';
import { HeaderPage } from '../pages/HeaderPage';
import { AuthUtils } from '../helper/auth/AuthUtils';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carrito de Compras', () => {
    let authUtils: AuthUtils;
    let productListPage: ProductListPage;
    let cartPage: CartPage;
    let headerPage: HeaderPage;

    test.beforeEach(async ({ page }) => {
        authUtils = new AuthUtils(page);
        productListPage = new ProductListPage(page);
        cartPage = new CartPage(page);
        headerPage = new HeaderPage(page);

        // Login antes de cada prueba usando AuthUtils
        await authUtils.login();
    });

    test('Should add a single random product to the cart', async () => {
        const initialCount = await cartPage.getCartCount(); // Obtener contador inicial

        // Obtener y agregar un producto aleatorio
        const randomProduct = await productListPage.getRandomProduct();
        await productListPage.addProductToCart(randomProduct);

        await cartPage.validateCartCount(initialCount + 1); // Validar que el contador se incrementó en 1
    });

    test('Should add multiple random products to the cart', async () => {
        // Obtener contador inicial
        const initialCount = await cartPage.getCartCount();
        
        // Obtener el número total de productos disponibles y calcular cuántos agregar
        const availableProducts = await productListPage.getAvailableProductsCount();
        const minProductsToAdd = 2;
        const productsToAdd = Math.floor(Math.random() * (availableProducts - minProductsToAdd + 1)) + minProductsToAdd;

        // Agregar productos aleatorios
        const addedProductTitles = await productListPage.addMultipleProducts(productsToAdd);

        // Validar que el contador se incrementó correctamente
        await cartPage.validateCartCount(initialCount + productsToAdd);
        
        // Validar que tenemos los títulos de los productos agregados
        expect(addedProductTitles.length).toBe(productsToAdd);
    });

    test('Should add all products from a single page to the cart', async () => {
        // Intentar agregar una gran cantidad de productos
        const productsToAdd = 10; // Puedes ajustar este número según el límite real
        const addedProductTitles = await productListPage.addMultipleProducts(productsToAdd);

        // Obtener el contador final
        const finalCount = await cartPage.getCartCount();

        // Validar que se agregaron los productos correctamente
        expect(addedProductTitles.length).toBeLessThanOrEqual(productsToAdd);
        expect(finalCount).toBe(addedProductTitles.length);
    });

    test('Should add and remove a product from the Product List Page', async () => {
        // Obtener contador inicial del carrito
        const initialCount = await cartPage.getCartCount();
        
        // 1. Obtener información del producto antes de agregarlo
        const product = await productListPage.getRandomProduct();
        const productInfoBefore = await productListPage.getProductInfo(product);

        // 2. Agregar el producto al carrito
        await productListPage.addProductToCart(product);
        
        // 3. Obtener información del producto después de agregarlo
        const productInfoAfter = await productListPage.getProductInfo(product);
        
        // 4. Validar que la información del producto no cambió
        expect(productInfoAfter.title).toBe(productInfoBefore.title);
        expect(productInfoAfter.price).toBe(productInfoBefore.price);
        
        // 5. Validar que el contador se incrementó en 1
        await cartPage.validateCartCount(initialCount + 1);
        
        // 6. Eliminar el producto del carrito
        await productListPage.removeProductFromCart(product);
        
        // 7. Validar que el contador volvió al valor inicial
        await cartPage.validateCartCount(initialCount);
        
        // 8. Validar que el botón "Add to Cart" está visible nuevamente
        await expect(product.locator(productListPage['selectors'].addToCartButton))
            .toBeVisible({ timeout: 5000 });
    });

    test('Should add all products from all pages to cart', async () => {
        // 1. Obtener el contador inicial del carrito
        const initialCount = await cartPage.getCartCount();
        
        // 2. Obtener el número total de páginas
        const totalPages = await productListPage.getNumberOfPages();
        
        let totalProductsAdded = 0;
        
        // 3. Iterar por cada página
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            // 3.1 Ir a la página actual
            if (currentPage > 1) {
                await productListPage.goToPage(currentPage);
            }
            
            // 3.2 Obtener todos los productos de la página actual
            const products = await productListPage.getAllProducts();
            
            // 3.3 Agregar cada producto al carrito
            for (const product of products) {
                const productInfo = await productListPage.getProductInfo(product);
                await productListPage.addProductToCart(product);
                totalProductsAdded++;
            }
        }
        
        // 4. Validar que el contador del carrito refleja todos los productos agregados
        
        // Obtener el contador actual del carrito
        const finalCartCount = await cartPage.getCartCount();
        
        // Aserción explícita para validar que el contador coincide con el total de productos agregados
        expect(finalCartCount, 'El contador del carrito debe coincidir con el total de productos agregados').toBe(initialCount + totalProductsAdded);
    });
    
    test('Should not persist cart contents after a session ends', async () => {
        // 1. Obtener el número total de productos disponibles y calcular cuántos agregar
        const availableProducts = await productListPage.getAvailableProductsCount();
        const minProductsToAdd = 2;
        const productsToAdd = Math.floor(Math.random() * (availableProducts - minProductsToAdd + 1)) + minProductsToAdd;

        // 2. Agregar productos aleatorios
        const addedProductTitles = await productListPage.addMultipleProducts(productsToAdd);

        // 3. Validar que tenemos los títulos de los productos agregados
        expect(addedProductTitles.length).toBe(productsToAdd);

        // 4. Realizar logout
        await headerPage.logout();

        // 5. Volver a hacer login
        await authUtils.login();

        // 6. Validar que el carrito está vacío después de volver a iniciar sesión
        const cartCount = await cartPage.getCartCount();
        expect(cartCount, 'El carrito debe estar vacío después de cerrar y abrir sesión').toBe(0);
    });
});
