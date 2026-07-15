const { test, expect } = require("@playwright/test");

test.setTimeout(5 * 60 * 1000);

const bots = Array.from({ length: 10 }, (_, i) => ({
  email: `bot${i + 1}@gmail.com`,
  password: "123",
  name: `Bot${i + 1}`,
}));

for (const bot of bots) {
  test(`Register ${bot.email}`, async ({ page }) => {
    // Stagger bot start
    await page.waitForTimeout(Math.random() * 5000);

    // ===========================
    // LOGIN
    // ===========================

    await page.goto("https://quiz-it-smart.vercel.app/auth");

    await page.locator('input[name="email"]').first().fill(bot.email);
    await page.locator('input[name="password"]').first().fill(bot.password);

    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForURL("**/student/dashboard");

    // ===========================
    // DASHBOARD
    // ===========================

    await page
      .getByRole("button", { name: /Invited Quizzes/i })
      .click();

    const quizCard = page
      .locator(".group")
      .filter({ hasText: "bot test" });

    await quizCard
      .getByRole("link", { name: /Register/i })
      .click();

    // ===========================
    // REGISTRATION PAGE
    // ===========================

    await expect(
      page.getByRole("heading", {
        name: /Candidate Profile/i,
      }),
    ).toBeVisible();

    const today = new Date();
    const formattedToday =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const textInputs = page.locator('input[type="text"]');

    await textInputs.nth(0).fill(bot.name); // First Name
    await textInputs.nth(1).fill(bot.name); // Last Name

    await page
      .locator('input[type="date"]')
      .fill(formattedToday);

    await textInputs.nth(2).fill("id"); // Student ID

    await page
      .getByRole("button", { name: /^Register$/i })
      .click();

    // Optional success verification
    // Replace this with whatever your app shows after successful registration.
    await page.waitForLoadState("networkidle");

    console.log(`${bot.email} registered successfully.`);
  });
}