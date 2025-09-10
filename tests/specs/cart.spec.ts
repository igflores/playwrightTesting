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

    test('Agregar un producto aleatorio al carrito', async () => {
        const initialCount = await cartPage.getCartCount(); // Obtener contador inicial

        // Obtener y agregar un producto aleatorio
        const randomProduct = await productListPage.getRandomProduct();
        await productListPage.addProductToCart(randomProduct);

        await cartPage.validateCartCount(initialCount + 1); // Validar que el contador se incrementó en 1
    });

    test('Agregar múltiples productos aleatorios al carrito', async () => {
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

    test('Validar límite de productos en el carrito en una página', async () => {
        // Intentar agregar una gran cantidad de productos
        const productsToAdd = 10; // Puedes ajustar este número según el límite real
        const addedProductTitles = await productListPage.addMultipleProducts(productsToAdd);

        // Obtener el contador final
        const finalCount = await cartPage.getCartCount();

        // Validar que se agregaron los productos correctamente
        expect(addedProductTitles.length).toBeLessThanOrEqual(productsToAdd);
        expect(finalCount).toBe(addedProductTitles.length);
    });

    test('Validar navegación entre páginas manteniendo el carrito', async () => {
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
