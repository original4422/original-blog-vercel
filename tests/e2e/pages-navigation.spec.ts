import { expect, type Page, test } from '@playwright/test';

const labels = ['Blog', 'Tags', 'Projects', 'About'];

function collectPageErrors(page: Page) {
	const errors: string[] = [];
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(`console: ${message.text()}`);
	});
	page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
	page.on('response', (response) => {
		const type = response.request().resourceType();
		if (
			response.status() === 404 &&
			['document', 'script', 'stylesheet'].includes(type)
		) {
			errors.push(`404 ${type}: ${response.url()}`);
		}
	});
	return errors;
}

test('@mobile @desktop production base path loads CSS and JavaScript', async ({
	page,
}) => {
	const errors = collectPageErrors(page);
	const response = await page.goto('./');
	expect(response?.status()).toBe(200);
	await expect(page.locator('.top-nav')).toHaveCSS('position', 'fixed');
	await expect(page.locator('link[rel="stylesheet"]')).not.toHaveCount(0);
	expect(errors).toEqual([]);
});

for (const viewport of [
	{ width: 320, height: 568 },
	{ width: 390, height: 844 },
]) {
	test(`@mobile ${viewport.width}x${viewport.height} menu stays usable`, async ({
		page,
	}) => {
		await page.setViewportSize(viewport);
		const errors = collectPageErrors(page);
		await page.goto('./');

		const menuButton = page.getByRole('button', { name: '打开菜单' });
		await expect(menuButton).toBeVisible();
		const buttonBox = await menuButton.boundingBox();
		expect(buttonBox).not.toBeNull();
		expect(buttonBox?.x).toBeGreaterThanOrEqual(0);
		expect((buttonBox?.x ?? 0) + (buttonBox?.width ?? 0)).toBeLessThanOrEqual(
			viewport.width,
		);

		await menuButton.click();
		await expect(page.locator('html')).toHaveClass(/mobile-menu-open/);
		await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');
		const navigation = page.locator('#primary-navigation');
		await expect(
			navigation.getByRole('link', { name: labels[0], exact: true }),
		).toBeFocused();

		for (const label of labels) {
			const link = navigation.getByRole('link', { name: label, exact: true });
			await expect(link).toBeVisible();
			const box = await link.boundingBox();
			expect(box).not.toBeNull();
			expect(box?.x).toBeGreaterThanOrEqual(0);
			expect(box?.y).toBeGreaterThanOrEqual(0);
			expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(
				viewport.width,
			);
			expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(
				viewport.height,
			);
		}

		await page.keyboard.press('Escape');
		await expect(page.locator('html')).not.toHaveClass(/mobile-menu-open/);
		await expect(menuButton).toBeFocused();

		await menuButton.click();
		await navigation.getByRole('link', { name: 'Blog', exact: true }).click();
		await expect(page).toHaveURL(/\/blog\/$/);
		await expect(page.locator('html')).not.toHaveClass(/mobile-menu-open/);

		await page.getByRole('button', { name: '打开菜单' }).click();
		await page.setViewportSize({ width: 1280, height: 800 });
		await expect(page.locator('html')).not.toHaveClass(/mobile-menu-open/);
		await expect(page.getByRole('button', { name: '打开菜单' })).toBeHidden();
		expect(errors).toEqual([]);
	});
}

test('@desktop desktop navigation is visible without a menu button', async ({
	page,
}) => {
	const errors = collectPageErrors(page);
	await page.goto('./');
	await expect(page.getByRole('button', { name: '打开菜单' })).toBeHidden();
	const navigation = page.locator('#primary-navigation');
	for (const label of labels) {
		await expect(
			navigation.getByRole('link', { name: label, exact: true }),
		).toBeVisible();
	}
	expect(errors).toEqual([]);
});

test('@mobile article code blocks do not widen the page', async ({ page }) => {
	for (const viewport of [
		{ width: 320, height: 568 },
		{ width: 390, height: 844 },
	]) {
		await page.setViewportSize(viewport);
		await page.goto('./blog/vercel-pages-monorepo-guide/');

		const dimensions = await page.locator('html').evaluate((element) => ({
			clientWidth: element.clientWidth,
			scrollWidth: element.scrollWidth,
		}));
		expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);

		const codeBlock = page.locator('.prose pre').first();
		await expect(codeBlock).toBeVisible();
		await expect(codeBlock).toHaveCSS('overflow-x', 'auto');
	}
});
