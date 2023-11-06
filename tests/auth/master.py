from selenium import webdriver
from selenium.webdriver.common.by import By
from library.decorate import tryExcept


class AdminPortalMaster:

    def __init__(self, path):
        self.driver = webdriver.Chrome(path)

    @tryExcept
    def setupMethod(self, method):
        self.driver.get("https://aws-dev-test-josh.dko5xgw4xb7qo.amplifyapp.com")
        self.driver.set_window_size(1356, 824)

    @tryExcept
    def teardownMethod(self, method):
        self.driver.quit()

    
