import { test, expect } from '@playwright/test';

test.describe('Dogfood QA Tests', () => {

  test('Bug 1: Login with wrong password should show error without full reload', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@kampus.ac.id');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // We expect the error text to appear on the screen
    await page.click('button[type="submit"]');
    
    // Wait for the error message to be visible
    // Since the bug causes a full reload, this might timeout if the page reloads before the message is visible,
    // or if it navigates back to /login cleanly. 
    // The bug triggers window.location.href = '/login', which causes a reload.
    // We can check if the page actually reloads by listening to the load event,
    // or just checking if the error message is present.
    await expect(page.getByText('Email atau password salah')).toBeVisible({ timeout: 5000 });
  });

  test('Sidebar navigation logic', async ({ page, isMobile }) => {
    // This is a sanity check for the sidebar
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@kampus.ac.id');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect to /admin
    await page.waitForURL('**/admin');
    await expect(page.getByText('Dashboard Admin')).toBeVisible();

    // The sidebar logic we analyzed earlier: clicking a link collapses the sidebar on mobile, 
    // but should stay open on desktop.
    await page.click('text=Kelola Fasilitas');
    await page.waitForURL('**/admin/facilities');

    if (!isMobile) {
      // In desktop, the sidebar should NOT be collapsed (class sidebar-collapsed should NOT be on app-body)
      const appBody = page.locator('.app-body');
      await expect(appBody).not.toHaveClass(/sidebar-collapsed/);
    }
  });

  test('Bug 2: Reservation date/time logic', async ({ page }) => {
    // Login as a normal user to make a reservation
    await page.goto('/login');
    await page.fill('input[type="email"]', 'user@kampus.ac.id');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/dashboard');

    // Go to new reservation page
    await page.click('text=Ajukan Reservasi');
    await page.waitForURL('**/reservations/new');

    // Fill form with past time today
    await page.selectOption('select', { index: 1 }); // Select first facility

    // Format today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    // Select date as today
    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill(`${yyyy}-${mm}-${dd}`);

    // Select time in the past (e.g. 01:00 AM)
    await page.fill('input[type="time"]', '01:00');
    await page.fill('input[type="time"]', '02:00'); // End time

    await page.fill('textarea', 'Kegiatan mahasiswa tengah malam untuk testing');

    await page.click('button[type="submit"]');

    // If the bug exists, the reservation will be successfully submitted instead of blocked.
    // It will show a success message or redirect to /reservations.
    // We expect it to show an error if it was working correctly.
    // Let's assert it shows an error about operating hours or past time.
    await expect(page.getByText(/jam operasional|waktu sudah lewat/i)).toBeVisible({ timeout: 5000 });
  });

});
