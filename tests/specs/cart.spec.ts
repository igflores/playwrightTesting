import { test, expect } from '@playwright/test';
import { ProductListPage } from '../pages/ProductListPage';
import { CartPage } from '../pages/CartPage';
import { AuthUtils } from '../helper/auth/AuthUtils';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carrito de Compras', () => {
    let authUtils: AuthUtils;
    let productListPage: ProductListPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        authUtils = new AuthUtils(page);
        productListPage = new ProductListPage(page);
        cartPage = new CartPage(page);

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
        console.log(`Agregando ${productsToAdd} productos de ${availableProducts} disponibles`);

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
        console.log(`Producto seleccionado: "${productInfoBefore.title}" - Precio: ${productInfoBefore.price}`);
        
        // 2. Agregar el producto al carrito
        await productListPage.addProductToCart(product);
        
        // 3. Obtener información del producto después de agregarlo
        const productInfoAfter = await productListPage.getProductInfo(product);
        console.log(`Producto en carrito: "${productInfoAfter.title}" - Precio: ${productInfoAfter.price}`);
        
        // 4. Validar que la información del producto no cambió
        expect(productInfoAfter.title).toBe(productInfoBefore.title);
        expect(productInfoAfter.price).toBe(productInfoBefore.price);
        
        // 5. Validar que el contador se incrementó en 1
        await cartPage.validateCartCount(initialCount + 1);
        
        // 6. Eliminar el producto del carrito
        await productListPage.removeProductFromCart(product);
        console.log(`Producto removido del carrito: "${productInfoBefore.title}"`);
        
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
        console.log(`Total de páginas encontradas: ${totalPages}`);
        
        let totalProductsAdded = 0;
        
        // 3. Iterar por cada página
        for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
            // 3.1 Ir a la página actual
            if (currentPage > 1) {
                await productListPage.goToPage(currentPage);
            }
            console.log(`\nProcesando página ${currentPage} de ${totalPages}`);
            
            // 3.2 Obtener todos los productos de la página actual
            const products = await productListPage.getAllProducts();
            console.log(`Encontrados ${products.length} productos en la página ${currentPage}`);
            
            // 3.3 Agregar cada producto al carrito
            for (const product of products) {
                const productInfo = await productListPage.getProductInfo(product);
                await productListPage.addProductToCart(product);
                totalProductsAdded++;
                console.log(`Agregado al carrito: "${productInfo.title}" - Precio: ${productInfo.price}`);
            }
        }
        
        // 4. Validar que el contador del carrito refleja todos los productos agregados
        console.log(`\nTotal de productos agregados: ${totalProductsAdded}`);
        
        // Obtener el contador actual del carrito
        const finalCartCount = await cartPage.getCartCount();
        console.log(`Contador del carrito: ${finalCartCount}`);
        console.log(`Contador esperado: ${initialCount + totalProductsAdded}`);
        
        // Aserción explícita para validar que el contador coincide con el total de productos agregados
        expect(finalCartCount, 'El contador del carrito debe coincidir con el total de productos agregados').toBe(initialCount + totalProductsAdded);
    });
    
    test('Should maintain cart contents when navigating between pages', async () => {
        // 1. Agregar productos de la primera página
        const availableProductsOnPage1 = await productListPage.getAvailableProductsCount();
        const productsAddedOnFirstPage = Math.floor(Math.random() * availableProductsOnPage1) + 1;
        
        await productListPage.addMultipleProducts(productsAddedOnFirstPage);
        console.log(`Número de productos añadidos en la página 1: ${productsAddedOnFirstPage}`);
    
        const countAfterFirstPage = await cartPage.getCartCount();

        // 2. Obtener el número total de páginas y elegir una página aleatoria
        const totalPages = await productListPage.getNumberOfPages();
        
        // Si hay menos de 2 páginas, el test de navegación no aplica.
        if (totalPages < 2) {
            console.log('Solo hay una página, la prueba de navegación no puede continuar.');
        return; // Sale del test.
        }

        const randomPage = Math.floor(Math.random() * (totalPages - 1)) + 2;
        console.log(`Navegando aleatoriamente a la página ${randomPage} de un total de ${totalPages}`);


        // 3. Navegar a la página aleatoria y validar que el contador se mantiene
        await productListPage.goToPage(randomPage);
        const countAfterNavigation = await cartPage.getCartCount();
        expect(countAfterNavigation).toEqual(countAfterFirstPage);

        // 4. Agregar productos en la página aleatoria
        const availableProductsOnRandomPage = await productListPage.getAvailableProductsCount();
        const productsAddedOnRandomPage = Math.floor(Math.random() * availableProductsOnRandomPage) + 1;
        
        await productListPage.addMultipleProducts(productsAddedOnRandomPage);
        console.log(`Número de productos añadidos en la página ${randomPage}: ${productsAddedOnRandomPage}`);

        // Obtener el contador final
        const finalCount = await cartPage.getCartCount();

        // 5. Validar que el contador se incrementó correctamente
        expect(finalCount).toEqual(countAfterFirstPage + productsAddedOnRandomPage);
    });
});
