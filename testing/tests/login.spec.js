const { test, expect } = require("@playwright/test");

test("Automated Bot: Login, Attempt Quiz, and Submit", async ({ page }) => {
  // ==========================================
  // STEP 1: AUTHENTICATION
  // ==========================================

  // 1. Navigate to the Auth page
  await page.goto("https://quiz-it-smart.vercel.app/auth");

  // 2. Fill in credentials
  // We use .first() because the Sign Up form also has inputs with the same name attributes
  await page.locator('input[name="email"]').first().fill("bot1@gmail.com");
  await page.locator('input[name="password"]').first().fill("123");

  // 3. Click the Login button
  await page.getByRole("button", { name: "Login" }).click();

  // 4. Verify successful login by waiting for the redirect
  // Based on your React code, a student role is redirected here
  await page.waitForURL("**/student/dashboard");

  // Assert that we have actually landed on the dashboard
  expect(page.url()).toContain("/student/dashboard");

  // ==========================================
  // STEP 2: DASHBOARD - SELECT QUIZ
  // ==========================================

  // 1. Ensure the bot is on the "Invited Quizzes" tab.
  // We use regex /Invited Quizzes/i to make it case-insensitive.
  const invitedTab = page.getByRole("button", { name: /Invited Quizzes/i });
  await invitedTab.click();

  // 2. Locate the specific quiz card by filtering for the text "bot test".
  // We target the main card container class to ensure we scope our next click properly.
  const quizCard = page.locator(".group").filter({ hasText: "bot test" });

  // 3. Click the "Enter Quiz" link inside that specific card.
  // If the button says "Not Open Yet", this will timeout and fail the test (which is expected behavior).
  await quizCard.getByRole("link", { name: /Enter Quiz/i }).click();

  // 4. Wait for the redirect to the active quiz page.
  // Note: Adjust the URL pattern below if your quiz entry URL looks different (e.g., /live-quiz/...)
  await page.waitForURL("**/waiting-room/**");

  // ==========================================
  // STEP 2.5: RE-ENTER FULLSCREEN
  // ==========================================

  // Wait for the button to appear (if it exists)
  const fullscreenButton = page.getByRole("button", {
    name: /Re-Enter Fullscreen/i,
  });

  if (await fullscreenButton.isVisible({ timeout: 10000 }).catch(() => false)) {
    await fullscreenButton.click();
  }

  // ==========================================
  // STEP 3: WAITING ROOM - VERIFICATION
  // ==========================================

  // 1. Wait for the API synchronization to finish and the form to appear.
  // Note: This assumes the test is run within 5 minutes of the quiz start time (or while live).
  // If the "Access Restricted" screen is showing, Playwright will timeout here, which is correct.
  await expect(
    page.getByRole("heading", { name: /Identity Verification/i }),
  ).toBeVisible({ timeout: 15000 });

  // 2. Calculate today's date and format it as YYYY-MM-DD for the date input
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedToday = `${yyyy}-${mm}-${dd}`;

  // 3. Fill the Security Key (Birthdate) date picker
  await page.locator('input[type="date"]').fill(formattedToday);

  // 4. Click the Start Assessment button
  await page.getByRole("button", { name: /Start Assessment/i }).click();

  // 5. Verify successful submission by waiting for the exam session URL
  await page.waitForURL("**/exam/*/session");

  // Assert that we have landed in the actual exam UI
  expect(page.url()).toContain("/session");

  // ==========================================
  // STEP 4: EXAM WAITING ROOM - BEGIN EXAM
  // ==========================================

  // 1. Wait for the candidate profile to load (ensuring data sync is done)
  await expect(
    page.getByRole("heading", { name: /Candidate Profile/i }),
  ).toBeVisible({ timeout: 15000 });

  // 2. Click the "Begin" button to start the exam
  // Playwright will wait if the button is not immediately clickable (e.g., if there's a countdown)
  // However, if the countdown is > 5 minutes, this test will timeout and fail (expected behavior)
  await page.getByRole("button", { name: /Begin/i }).click();

  // 3. Verify successful transition to the active exam room
  await page.waitForURL("**/exam/*/room");

  // Assert that we have landed in the actual exam UI
  expect(page.url()).toContain("/room");

  // ==========================================
  // STEP 5: EXAM ROOM - AUTOMATED ATTEMPT
  // ==========================================

  // 1. Wait for the exam UI to render by looking for the first question header
  await expect(
    page.getByText(/Question 1/i, { exact: true }).first(),
  ).toBeVisible({ timeout: 15000 });

  // 2. Determine the total number of questions dynamically from the sidebar palette
  const paletteGrid = page.locator("aside .grid.grid-cols-4");
  const totalQuestions = await paletteGrid.locator("button").count();

  // 3. Loop through all questions
  for (let i = 0; i < totalQuestions; i++) {
    // Wait for the question header to ensure the UI has successfully advanced
    await expect(
      page.getByText(new RegExp(`Question ${i + 1}`, "i")).first(),
    ).toBeVisible();

    // Target the MCQ option buttons using your specific React classes
    const optionsLocator = page.locator(
      "main button.p-6.rounded-2xl.border-2.text-left",
    );

    // Wait for the options to be visible in the DOM
    await optionsLocator.first().waitFor({ state: "visible" });
    const optionCount = await optionsLocator.count();

    if (optionCount > 0) {
      // Pick a random option index and click it
      const randomIndex = Math.floor(Math.random() * optionCount);
      await optionsLocator.nth(randomIndex).click();
    }

    // Click "Save & Next" to sync with the backend and advance the UI
    await page.getByRole("button", { name: /Save & Next/i }).click();

    // Brief pause to allow the React state and API network request to resolve cleanly
    await page.waitForTimeout(1000);
  }

  // ==========================================
  // STEP 6: EXAM SUBMISSION
  // ==========================================

  // 1. Click the initial "Submit Test" button in the sidebar to open the modal
  await page.getByRole("button", { name: "Submit Test" }).first().click();

  // 2. Handle the SubmitConfirmationModal
  // Since the modal is a div without a 'dialog' role, we look for the exact "Submit" button
  // that appears in the desktop view of the modal.
  // We use .visible() to ensure we click the one inside the active modal.
  const modalSubmitButton = page
    .getByRole("button", { name: "Submit", exact: true })
    .filter({ state: "visible" });
  await modalSubmitButton.click();

  // 3. Verify successful submission by checking for the completion screen
  await expect(
    page.getByRole("heading", { name: /Assessment Complete/i }),
  ).toBeVisible({ timeout: 20000 });
});
