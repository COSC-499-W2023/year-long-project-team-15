from selenium.webdriver.common.by import By
from auth.master import AdminPortalMaster
from library.decorate import tryExcept

class AdminPortalLoginSuite(AdminPortalMaster):

    def __init__(self, chromeDriverPath):
        super().__init__(chromeDriverPath)

    def setupMethod(self, method):
        super().setupMethod("")

    def teardownMethod(self, method):
        super().teardownMethod("")

    @tryExcept
    def emptyLoginForm(self):
        self.driver.find_element(By.CSS_SELECTOR, ".btn").click()
        print("Attempted login with empty forms: ")
        if self.driver.find_element(By.ID, "amplify-id-:r7:").is_displayed():
            print('Did not login. Test PASSED')
        else:
            print('Problem. Either logged in with no info or page changed. Test FAILED')

    @tryExcept
    def invalidLogin(self):
        self.driver.get("https://stage.rewardly.ca/portal/login")
        self.driver.set_window_size(1356, 824)
        self.driver.find_element(By.ID, "amplify-id-:r4:").click()
        self.driver.find_element(By.ID, "amplify-id-:r4:").send_keys("qwertyuiopasdfgh@jklzx")
        self.driver.find_element(By.ID, "amplify-id-:r7:").click()
        self.driver.find_element(By.ID, "amplify-id-:r7:").send_keys("qwertyuiopasdfghjkl")
        self.driver.find_element(By.CSS_SELECTOR, ".btn").click()
        error = self.driver.find_element(By.CSS_SELECTOR, "#portalLoginFormContainer > div > div:nth-child(2) > form > "
                                                          "center:nth-child(4) > div").text
        print("Attempted login with invalid information: ")
        if error == "Invalid email or password":
            print('Did not login. Proper error message displayed. Test PASSED')
        else:
            print('Problem. Either logged in with wrong info or error message is wrong. Test FAILED')

    @tryExcept
    def clearForms(self):
        self.driver.find_element(By.ID, "amplify-id-:r4:").clear()
        self.driver.find_element(By.ID, "amplify-id-:r7:").clear()

    @tryExcept
    def runSuite(self):
        self.setupMethod("")
        self.emptyLoginForm()
        print()
        self.invalidLogin()
        print()
        self.teardownMethod("")
